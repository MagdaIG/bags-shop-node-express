const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  getOrderById,
  updateOrder,
  deleteOrder
} = require('../controllers/orders.controller');
const {
  validateOrder,
  validateOrderUpdate,
  validateId
} = require('../middleware/validators');

// Rutas para pedidos
router.post('/', validateOrder, createOrder);
router.get('/', getAllOrders);
router.get('/:id', validateId, getOrderById);
router.put('/:id', validateId, validateOrderUpdate, updateOrder);
router.delete('/:id', validateId, deleteOrder);

// Ruta especial para obtener pedidos de un usuario específico
router.get('/usuario/:id', validateId, getOrdersByUser);

module.exports = router;
