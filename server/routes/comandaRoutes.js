const express = require('express');
const router = express.Router();
const comandaController = require('../controllers/comandaController');


router.post('/create', comandaController.createOrder);
router.post('/add-books', comandaController.addBooksToOrder);
router.put('/place-order', comandaController.placeOrder);
router.put('/update-status', comandaController.updateOrderStatus);
router.get('/', comandaController.getAllComenzi);
router.get('/:id', comandaController.getComandaById);
router.put('/:id', comandaController.updateComanda);
router.delete('/:id', comandaController.deleteComanda);

module.exports = router;
