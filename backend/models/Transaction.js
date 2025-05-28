const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Transaction = sequelize.define("Transaction", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  orderId: { type: DataTypes.INTEGER, allowNull: false },
  paymentMethod: { type: DataTypes.STRING, allowNull: false }, // "Bank Transfer" or "Card"
  amount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "Pending" },
  verificationStatus: { type: DataTypes.STRING, defaultValue: "Unverified" },
});

module.exports = Transaction;