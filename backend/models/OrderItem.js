const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./Order');

module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    image: DataTypes.STRING
  });

  OrderItem.associate = models => {
    OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
  };

  return OrderItem;
};

