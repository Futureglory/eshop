const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  try {
    // ✅ Use synchronous jwt.verify (no callback)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Ensure expiration check is applied
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      res.clearCookie("jwt");
      return res.status(401).json({ message: "Session expired, please log in again." });
    }

    if (!decoded.email) {
      return res.status(400).json({ message: "Invalid token structure." });
    }

    // ✅ Look up the user in the database
    const user = await User.findOne({ 
      where: { email: decoded.email }, 
      attributes: ["id", "username", "email"] 
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    req.user = user; // ✅ Attach verified user to request object
    next();
  } catch (error) {
    // Handle JWT verification errors and any database errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token, please log in again." });
    } else if (error.name === 'TokenExpiredError') {
      res.clearCookie("jwt");
      return res.status(401).json({ message: "Session expired, please log in again." });
    } else {
      // Database or other errors
      console.error('Auth middleware error:', error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
};

module.exports = authMiddleware;