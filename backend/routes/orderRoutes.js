const express = require('express');
const router = express.Router();
const {
  getOrdersByEmail,
  reorderItems,
  getOrdersByEmailAndStatus,
placeOrder
} = require('../controllers/orderController');
const orderController = require('../controllers/orderController');

// GET /api/orders
router.post('/checkout', orderController.placeOrder);
router.get('/:email', orderController.getOrdersByEmail);
router.get('/:email/:status', orderController.getOrdersByEmailAndStatus);


// POST /api/orders/reorder
router.post('/reorder', reorderItems);

module.exports = router;
