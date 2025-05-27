const sendEmail = require("../config/emailService");
const { Order, OrderItem, User } = require('../models');
const { Op } = require('sequelize');

exports.placeOrder = async (req, res) => {
  try {
    const { email, items, total } = req.body;

    const user = await User.findOne({where: {email}});
        if (!user) return res.status(404).json({ message: "User not found" });

    const order = await Order.create({ 
       userId: user.id,
       email: user.email,
          shippingAddress: user.address,
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
       status: 'processing',
         total,
         paymentStatus:"Paid",
         });

         await Promise.all(
      items.map(item =>
        OrderItem.create({
          orderId: order.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })
      )
    );

    // Send order confirmation email
    sendEmail(user.email, "Order Confirmed", `Your order #${order.id} has been placed successfully!`);

    res.status(201).json({ message: "Order placed successfully!", orderId: order.id });
  } catch (error) {
    res.status(500).json({ message: "Error placing order.", error });
  }
};

exports.getOrdersByEmail = async (req, res) => {
    const { email } = req.params;
  try {
    const orders = await Order.findAll({
       where: { email },
      include: [{model: OrderItem, as: 'OrderItems'}],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// GET order by Email
exports.getOrdersByEmailAndStatus = async (req, res) => {
  const { email, status } = req.params;
  try {
    const orders = await Order.findAll({
      where: { email, status },
   include: [{ model: OrderItem, as: 'OrderItems' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    console.error('status fetch failed:', error);
    res.status(500).json({ message: 'Server error while fetching status' });
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

exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Error updating order status" });
  }
};
exports.cancelOrder = async (req, res) => {
  const { orderId, reason } = req.body;
  try {
    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = 'cancelled';
    order.cancelReason = reason;
    await order.save();

    // Send cancellation email
    sendEmail(order.email, "Order Cancelled", `Your order #${order.id} has been cancelled. Reason: ${reason}`);

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Error cancelling order" });
  }
};
