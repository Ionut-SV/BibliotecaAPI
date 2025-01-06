const db = require('../config/db');
const reduceStock = (id_carte, cantitate, connection) => {
    return new Promise((resolve, reject) => {
        // First, check the current stock of the book
        const sqlCheckStock = `
            SELECT stoc FROM TabelaCarti WHERE id_carte = ?
        `;
        connection.query(sqlCheckStock, [id_carte], (err, results) => {
            if (err) {
                console.error("Error checking stock:", err);
                return reject(err);  // Reject promise with the error
            }

            if (results.length === 0) {
                const errorMsg = `Cartea cu ID ${id_carte} nu a fost gasita.`;
                console.error(errorMsg);
                return reject(new Error(errorMsg));  // Reject if the book is not found
            }

            const currentStock = results[0].stoc;

            // Check if there's enough stock
            if (currentStock < cantitate) {
                const errorMsg = `Stoc insuficient pentru cartea cu ID: ${id_carte}. Disponibil: ${currentStock}, dar se doreste: ${cantitate}`;
                console.error(errorMsg);
                return reject(new Error(errorMsg));  // Reject with a custom error for insufficient stock
            }

            resolve(currentStock);  // Resolve if there is enough stock
        });
    });
};

exports.addComanda = (req, res) => {
    const { id_membru, id_bibliotecar, detalii } = req.body; // id_bibliotecar must be provided in the request body

    if (!id_bibliotecar) {
        return res.status(400).send({ error: 'id_bibliotecar is required to create an order.' });
    }

    // Get a connection from the pool to start the transaction
    db.getConnection((err, connection) => {
        if (err) {
            console.error("Error getting database connection:", err);
            return res.status(500).send({ error: 'Failed to get a database connection.', details: err });
        }

        // Start a transaction on the connection
        connection.beginTransaction((err) => {
            if (err) {
                console.error("Error starting transaction:", err);
                connection.release();  // Release the connection
                return res.status(500).send({ error: 'Failed to start transaction.', details: err });
            }

            // Check the stock for each book first
            const checkStockPromises = detalii.map(({ id_carte, cantitate }) => {
                return reduceStock(id_carte, cantitate, connection);  // Check stock for each book
            });

            // Wait for all stock checks to finish
            Promise.all(checkStockPromises)
                .then(() => {
                    // If all stocks are sufficient, proceed with creating the order

                    // Insert into TabelaComenzi
                    const sqlComanda = `
                        INSERT INTO TabelaComenzi (id_membru, id_bibliotecar, data_comanda, stare_curenta) 
                        VALUES (?, ?, NOW(), "In asteptare")
                    `;
                    connection.query(sqlComanda, [id_membru, id_bibliotecar], (err, result) => {
                        if (err) {
                            console.error("Error inserting into TabelaComenzi:", err);
                            return connection.rollback(() => {
                                connection.release();
                                res.status(500).send({ error: 'Failed to create order.', details: err });
                            });
                        }

                        const id_comanda = result.insertId;

                        // Insert into TabelaDetaliiComanda
                        const sqlDetalii = `
                            INSERT INTO TabelaDetaliiComanda (id_comanda, id_carte, cantitate) 
                            VALUES ?
                        `;
                        const detaliiValues = detalii.map(({ id_carte, cantitate }) => [id_comanda, id_carte, cantitate]);

                        connection.query(sqlDetalii, [detaliiValues], (err) => {
                            if (err) {
                                console.error("Error inserting into TabelaDetaliiComanda:", err);
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).send({ error: 'Failed to insert order details.', details: err });
                                });
                            }

                            // Now reduce the stock for each book in the order
                            const updateStockPromises = detalii.map(({ id_carte, cantitate }) => {
                                return reduceStock(id_carte, cantitate, connection);  // Reduce stock for each book
                            });

                            // Wait for all stock updates to finish
                            Promise.all(updateStockPromises)
                                .then(() => {
                                    // Update the order status to "Plasata"
                                    const sqlUpdateStatus = `
                                        UPDATE TabelaComenzi
                                        SET stare_curenta = "Plasata"
                                        WHERE id_comanda = ?
                                    `;
                                    connection.query(sqlUpdateStatus, [id_comanda], (err) => {
                                        if (err) {
                                            console.error("Error updating order status:", err);
                                            return connection.rollback(() => {
                                                connection.release();
                                                res.status(500).send({ error: 'Failed to update order status.', details: err });
                                            });
                                        }

                                        // Commit the transaction
                                        connection.commit((err) => {
                                            if (err) {
                                                console.error("Error committing transaction:", err);
                                                return connection.rollback(() => {
                                                    connection.release();
                                                    res.status(500).send({ error: 'Failed to commit transaction.', details: err });
                                                });
                                            }

                                            connection.release();  // Release the connection after commit
                                            res.status(201).send({ message: 'Comanda creata cu succes!', comandaId: id_comanda });
                                        });
                                    });
                                })
                                .catch((error) => {
                                    console.error("Error during stock update:", error);
                                    connection.rollback(() => {
                                        connection.release();
                                        res.status(500).send({ error: 'Eroare la actualizarea stocului', details: error.message || error });
                                    });
                                });
                        });
                    });
                })
                .catch((error) => {
                    console.error("Error during stock check:", error);
                    connection.rollback(() => {
                        connection.release();
                        res.status(500).send({ error: 'Eroare la verificarea stocului', details: error.message || error });
                    });
                });
        });
    });
};

// Get all comenzi
exports.getAllComenzi = (req, res) => {
    const sql = 'SELECT * FROM TabelaComenzi';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
};

// Get a single comanda by ID
exports.getComandaById = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM TabelaComenzi WHERE id_comanda = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send({ message: 'Comanda nu a fost gasita!' });

        const sqlDetalii = 'SELECT * FROM TabelaDetalii_Comanda WHERE id_comanda = ?';
        db.query(sqlDetalii, [id], (err, detaliiResults) => {
            if (err) return res.status(500).send(err);
            res.send({ comanda: results[0], detalii: detaliiResults });
        });
    });
};

// Update a comanda
exports.updateComanda = (req, res) => {
    const { id } = req.params;
    const { stare_curenta } = req.body;

    const sql = 'UPDATE TabelaComenzi SET stare_curenta = ? WHERE id_comanda = ?';
    db.query(sql, [stare_curenta, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Comanda actualizata cu succes!' });
    });
};

// Delete a comanda
exports.deleteComanda = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM TabelaComenzi WHERE id_comanda = ?';
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Comanda stearsa cu succes!' });
    });
};