const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }
  const jwt = require("jsonwebtoken");

  exports.authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token." });
    }
  };
  
};