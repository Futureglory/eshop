const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize('eshop', 'root', 'Favy@14baby', {
  host: "localhost",
  dialect: "mysql",
  logging: console.log, // Enables query logging for debugging
});

module.exports = sequelize;