const jwt = require("jsonwebtoken");
const { User } = require("../models");
const blacklist = new Set(); // Used in logout to invalidate tokens

// Middleware for checking JWT and token blacklist
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  if (blacklist.has(token)) {
    return res.status(401).json({ message: "Token has been blacklisted." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user data
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

// Middleware for protecting routes (with user lookup)
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    if (blacklist.has(token)) {
      return res.status(401).json({ message: "Token has been blacklisted." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed." });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token." });
  }
};

// Export both middlewares and the blacklist (if needed in logout)
module.exports = {
  authMiddleware,
  protect
};
