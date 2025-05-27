const { Transaction } = require("../models");

exports.processPayment = async (req, res) => {
  try {
    const { userId, orderId, paymentMethod, amount } = req.body;

    if (!["Bank Transfer", "Card"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const transaction = await Transaction.create({
      userId,
      orderId,
      paymentMethod,
      amount,
      status: "Processing",
    });

    res.status(201).json({ message: "Payment initiated", transactionId: transaction.id });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ message: "Error processing payment" });
  }
};

const { Transaction } = require("../models");

exports.verifyPayment = async (req, res) => {
  try {
    const { transactionId } = req.body;

    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Simulate verification (in production, call a payment gateway API)
    const isVerified = Math.random() > 0.5; // ✅ Simulate random success

    transaction.verificationStatus = isVerified ? "Verified" : "Failed";
    transaction.status = isVerified ? "Completed" : "Failed";
    await transaction.save();

    res.status(200).json({
      message: isVerified ? "Payment verified successfully" : "Payment verification failed",
      transaction,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Server error while verifying payment." });
  }
};