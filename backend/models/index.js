// models/index.js
const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Order = require("./Order");
const OrderItem = require("./OrderItem");

const db = {};
db.Seqbuelize = Sequelize;
db.sequelize = sequelize;
db.User = User;

const models = { Order, OrderItem };

    Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
    OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });


db.User = require("./User")(sequelize, Sequelize.DataTypes); // ✅ initializes the model

module.exports = db;
