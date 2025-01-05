const db = require('../config/db');
const path = require('path');
const uploadsPath = path.join(__dirname, '../../uploads');

// Add a new book
exports.addBook = (req, res) => {
    const { titlu, autor, gen, an_publicare, editura, stoc } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = 'INSERT INTO TabelaCarti (titlu, autor, gen, an_publicare, editura, stoc, descriere, pret, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [titlu, autor, gen, an_publicare, editura, stoc, image_url];

    /*console.log('Current directory:', __dirname);
    console.log('Uploads path:', uploadsPath);
    console.log(`Image URL: /uploads/${req.file.filename}`);
    console.log('Uploaded file:', req.file);
    console.log(req.file.path);*/
    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ message: 'Carte adaugata cu succes!', bookId: result.insertId });
    });
};

// Get all books
exports.getAllBooks = (req, res) => {
    const sql = 'SELECT * FROM TabelaCarti';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
};

// Get a single book by ID
exports.getBookById = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM TabelaCarti WHERE id_carte = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results[0]);
    });
};

// Update a book
exports.updateBook = (req, res) => {
    const { id } = req.params;
    const { titlu, autor, gen, an_publicare, editura, stoc } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = `
        UPDATE TabelaCarti 
        SET titlu = ?, autor = ?, gen = ?, an_publicare = ?, editura = ?, stoc = ?, descriere = ?, pret = ?,  image_url = IFNULL(?, image_url)
        WHERE id_carte = ?
    `;
    const values = [titlu, autor, gen, an_publicare, editura, stoc, descriere, pret, image_url, id];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Carte modificata cu succes!' });
    });
};

// Delete a book
exports.deleteBook = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM TabelaCarti WHERE id_carte = ?';

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Carte stearsa cu succes!' });
    });
};

// Get all unique authors
exports.getAuthors = (req, res) => {
    const sql = 'SELECT DISTINCT autor FROM TabelaCarti';
    db.query(sql, (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0) {
        return res.status(404).send("No authors found.");
      }
      const authors = results.map(row => row.autor);
      res.json(authors);
    });
  };
  
  // Get all unique genres
  exports.getGenres = (req, res) => {
    const sql = 'SELECT DISTINCT gen FROM TabelaCarti';
    db.query(sql, (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0) {
        return res.status(404).send("No genres found.");
      }
      const genres = results.map(row => row.gen);
      res.json(genres);
    });
  };
  
  
  