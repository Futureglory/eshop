const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Extract Bearer token

  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findByPk(decoded.id);
      next();
    } catch (err) {
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }
};

module.exports = authMiddleware;






