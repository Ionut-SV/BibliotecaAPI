const db = require('../config/db');


exports.addComanda = (req, res) => {
    const { id_membru, id_bibliotecar, detalii } = req.body; // id_bibliotecar must be provided in the request body

    if (!id_bibliotecar) {
        return res.status(400).send({ error: 'id_bibliotecar is required to create an order.' });
    }

    // Insert into TabelaComenzi
    const sqlComanda = `
        INSERT INTO TabelaComenzi (id_membru, id_bibliotecar, data_comanda, stare_curenta) 
        VALUES (?, ?, NOW(), "In asteptare")
    `;
    db.query(sqlComanda, [id_membru, id_bibliotecar], (err, result) => {
        if (err) return res.status(500).send(err);

        const id_comanda = result.insertId;

        // Insert into TabelaDetaliiComanda
        const sqlDetalii = `
            INSERT INTO TabelaDetaliiComanda (id_comanda, id_carte, cantitate) 
            VALUES ?
        `;
        const detaliiValues = detalii.map(({ id_carte, cantitate }) => [id_comanda, id_carte, cantitate]);

        db.query(sqlDetalii, [detaliiValues], (err) => {
            if (err) return res.status(500).send(err);
            res.status(201).send({ message: 'Comanda creata cu succes!', comandaId: id_comanda });
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