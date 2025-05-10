const sendEmail = require("../config/emailService");

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