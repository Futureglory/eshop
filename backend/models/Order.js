const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('processing', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'processing'
    },
    total: { type: DataTypes.FLOAT, allowNull: false },
    shippingAddress: { type: DataTypes.STRING, allowNull: false },
    estimatedDelivery: { type: DataTypes.DATE, allowNull: false },
    actualDelivery: DataTypes.DATE,
    trackingNumber: DataTypes.STRING,
    cancelReason: DataTypes.STRING,
    paymentStatus: { type: DataTypes.STRING, defaultValue: "Unpaid" },
    date: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
  });

  return Order;

};

