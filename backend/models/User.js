const {Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const crypto = require("crypto");

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
passwordResetToken: {
  type: DataTypes.STRING,
  allowNull: true,
},
passwordResetExpires: {
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
User.beforeCreate(async (user) => {
  const bcrypt = require("bcrypt");
  user.password = await bcrypt.hash(user.password, 10);

  User.prototype.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  
    this.passwordResetToken = hashedToken;
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    return resetToken;
  };
});
module.exports = User;
