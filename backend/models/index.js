// models/index.js
const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Order = require("./Order");
const OrderItem = require("./OrderItem");

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = User;

db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.Order = require('./Order')(sequelize, Sequelize.DataTypes);
db.OrderItem = require('./OrderItem')(sequelize, Sequelize.DataTypes);


// Associations
db.User.hasMany(db.Order, { foreignKey: 'userId' });
db.Order.belongsTo(db.User, { foreignKey: 'userId' });

db.Order.hasMany(db.OrderItem, { foreignKey: 'orderId', as: 'items' });
db.OrderItem.belongsTo(db.Order, { foreignKey: 'orderId' });

db.User = require("./User")(sequelize, Sequelize.DataTypes); // ✅ initializes the model

module.exports = db;
