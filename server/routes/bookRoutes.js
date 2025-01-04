const express = require('express');
const router = express.Router();
const multer = require('multer');
const bookController = require('../controllers/bookController');
const path = require('path');
// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'uploads'), 
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage }); 

// Define routes
router.post('/', upload.single('image'), bookController.addBook);
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.put('/:id', upload.single('image'), bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;
