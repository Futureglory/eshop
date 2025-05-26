const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

  const Order = sequelize.define('Order', {
    email: DataTypes.STRING,
    status: DataTypes.STRING,
    total: DataTypes.FLOAT,
    shippingAddress: DataTypes.STRING,
    estimatedDelivery: DataTypes.DATE,
    actualDelivery: DataTypes.DATE,
    trackingNumber: DataTypes.STRING,
    cancelReason: DataTypes.STRING,
  date: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  });

  Order.associate = models => {
    Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
  };

  return Order;

module.exports = Order;

