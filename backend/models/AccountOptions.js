const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AccountOption = sequelize.define("AccountOption", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  icon: { type: DataTypes.STRING, allowNull: false }, // Icon name
  route: { type: DataTypes.STRING, allowNull: false }, // Link to navigate
});

module.exports = AccountOption;