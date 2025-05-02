// models/index.js
const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const database = {};
database.Sequelize = Sequelize;
database.sequelize = sequelize;
database.User = User;

module.exports = database;
