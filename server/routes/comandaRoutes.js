const express = require('express');
const router = express.Router();
const comandaController = require('../controllers/comandaController');

// Define routes
router.post('/add', comandaController.addComanda);
router.get('/', comandaController.getAllComenzi);
router.get('/:id', comandaController.getComandaById);
router.put('/:id', comandaController.updateComanda);
router.delete('/:id', comandaController.deleteComanda);

module.exports = router;
