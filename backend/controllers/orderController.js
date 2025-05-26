const sendEmail = require("../config/emailService");
const { Order, OrderItem, User } = require('../models');
const { Op } = require('sequelize');

exports.placeOrder = async (req, res) => {
  try {
    const { userId, items, total } = req.body;

    const user = await User.findByPk(userId);
    const order = await Order.create({ userId, items, total });

    // Send order confirmation email
    sendEmail(user.email, "Order Confirmed", `Your order #${order.id} has been placed!`);

    res.json({ message: "Order placed successfully!", order });
  } catch (error) {
    res.status(500).json({ message: "Error placing order.", error });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: OrderItem,
      order: [['date', 'DESC']]
    });

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET order by Email
exports.getOrdersByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const orders = await Order.findAll({
      where: { email },
      include: [{ model: OrderItem }]
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};

// Reorder items
exports.reorderItems = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findOne({
      where: { id: orderId },
      include: OrderItem
    });

    if (!order) return res.status(404).json({ message: 'Original order not found' });

    // Reorder logic (e.g., create new order, or add to cart)
    return res.json({ message: `Added ${order.OrderItems.length} items to cart for reorder` });
  } catch (err) {
    console.error('Reorder failed:', err);
    res.status(500).json({ message: 'Error reordering items' });
  }
};