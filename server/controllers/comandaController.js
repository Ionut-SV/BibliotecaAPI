const db = require('../config/db');
const {
    executeQuery,
    beginTransaction,
    commitTransaction,
    rollbackTransaction,
} = require('../utils/dbHelper');

// 1. Create a new order
exports.createOrder = async (req, res) => {
    const { id_membru, id_bibliotecar } = req.body;

    if (!id_membru) {
        return res.status(400).send({ error: 'Missing required field: id_membru' });
    }

    try {
        const sql = `
            INSERT INTO TabelaComenzi (id_membru, id_bibliotecar, data_comanda, stare_curenta) 
            VALUES (?, ?, NOW(), 'In asteptare')
        `;
        const result = await executeQuery(sql, [id_membru, id_bibliotecar || null]); // Default to NULL if not provided
        res.status(201).send({ message: 'Order created successfully.', id_comanda: result.insertId });
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).send({ error: 'Failed to create order.', details: err.message });
    }
};

// 2. Add books to an order
exports.addBooksToOrder = async (req, res) => {
    const { id_comanda, detalii } = req.body;

    if (!id_comanda || !detalii || detalii.length === 0) {
        return res.status(400).send({ error: 'Missing required fields: id_comanda or detalii.' });
    }

    let connection;
    try {
        connection = await beginTransaction();

        // Check if the order exists
        const orderCheck = await executeQuery(`SELECT * FROM TabelaComenzi WHERE id_comanda = ?`, [id_comanda]);
        if (orderCheck.length === 0) throw new Error('Order not found.');

        // Check stock for each book
        for (const { id_carte, cantitate } of detalii) {
            const stockResult = await executeQuery(`SELECT stoc FROM TabelaCarti WHERE id_carte = ?`, [id_carte]);
            if (stockResult.length === 0) throw new Error(`Book with ID ${id_carte} not found.`);
            if (stockResult[0].stoc < cantitate) throw new Error(`Not enough stock for book ID: ${id_carte}.`);
        }

        // Insert books into the order
        const bookDetails = detalii.map(({ id_carte, cantitate }) => [id_comanda, id_carte, cantitate]);
        const insertBooksSQL = `INSERT INTO TabelaDetaliiComanda (id_comanda, id_carte, cantitate) VALUES ?`;
        await executeQuery(insertBooksSQL, [bookDetails]);

        await commitTransaction(connection);
        res.status(201).send({ message: 'Books added to order successfully.' });
    } catch (err) {
        if (connection) await rollbackTransaction(connection, err);
        console.error('Error adding books to order:', err);
        res.status(500).send({ error: 'Failed to add books to order.', details: err.message });
    }
};

// 3. Place an order
exports.placeOrder = async (req, res) => {
    const { id_comanda } = req.body;

    try {
        const sql = `
            UPDATE TabelaComenzi
            SET stare_curenta = 'Plasata'
            WHERE id_comanda = ? AND stare_curenta = 'In asteptare'
        `;
        const result = await executeQuery(sql, [id_comanda]);

        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'Order not found or already placed.' });
        }

        res.status(200).send({ message: 'Order placed successfully.' });
    } catch (err) {
        console.error('Error placing order:', err);
        res.status(500).send({ error: 'Failed to place order.', details: err.message });
    }
};

// 4. Finalize or cancel an order
exports.updateOrderStatus = async (req, res) => {
    const { id_comanda, id_bibliotecar, stare_curenta } = req.body;

    if (!['Finalizata', 'Anulata'].includes(stare_curenta)) {
        return res.status(400).send({ error: 'Invalid status. Choose either "Finalizata" or "Anulata".' });
    }

    try {
        const sql = `
            UPDATE TabelaComenzi
            SET stare_curenta = ?, id_bibliotecar = ?
            WHERE id_comanda = ? AND stare_curenta = 'Plasata'
        `;
        const result = await executeQuery(sql, [stare_curenta, id_bibliotecar, id_comanda]);

        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'Order not found or cannot be updated.' });
        }

        res.status(200).send({ message: `Order ${stare_curenta.toLowerCase()} successfully.` });
    } catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).send({ error: 'Failed to update order status.', details: err.message });
    }
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

        const sqlDetalii = 'SELECT * FROM TabelaDetaliiComanda WHERE id_comanda = ?';
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