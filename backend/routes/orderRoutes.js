const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderByEmail,
  reorderItems
} = require('../controllers/orderController');
const orderController = require('../controllers/orderController');

// GET /api/orders
router.get('/', getOrders);

router.post('/place', orderController.placeOrder);

// GET /api/orders/:id
router.get('/:email', getOrderByEmail);

// POST /api/orders/reorder
router.post('/reorder', reorderItems);

module.exports = router;
