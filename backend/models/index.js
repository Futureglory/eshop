// models/index.js
const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const db = {};
db.Seqbuelize = Sequelize;
db.sequelize = sequelize;
db.User = User;

db.User = require("./User")(sequelize, Sequelize.DataTypes); // ✅ initializes the model

module.exports = db;
