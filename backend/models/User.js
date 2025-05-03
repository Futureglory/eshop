const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, 
    allowNull: false, 
    unique: true,
    validate: { isEmail: true }, // Ensures email format
   },
  password: { type: DataTypes.STRING,
     allowNull: false 
  },
  otp: { type: DataTypes.INTEGER, allowNull: true },
  otpExpiresAt: { type: DataTypes.DATE },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  timestamps: true,
});
User.beforeCreate(async (user) => {
  const bcrypt = require("bcrypt");
  user.password = await bcrypt.hash(user.password, 10);
});
module.exports = User;
