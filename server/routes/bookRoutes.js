const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const upload = require('../middleware/upload');

// Define routes
router.post('/add', upload.single('image'), bookController.addBook);
router.put('/:id', upload.single('image'), bookController.updateBook);
router.get('/genres', bookController.getGenres);
router.get('/authors', bookController.getAuthors);
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.delete('/:id', bookController.deleteBook);

module.exports = router;
