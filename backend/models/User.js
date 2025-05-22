const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const crypto = require("crypto");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }, // Ensures email format
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    otp: { type: DataTypes.INTEGER, allowNull: true },
    otpExpiresAt: { type: DataTypes.DATE },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastLoginIp: { type: DataTypes.STRING },
    lastLoginDevice: { type: DataTypes.STRING },
    trustedDevices: { type: DataTypes.JSON }, // ✅ Stores trusted devices
    loginVerificationToken: { type: DataTypes.STRING },
    loginVerificationTokenExpiresAt: { type: DataTypes.DATE },

  }, {
    timestamps: true,
  });
  return User;
};