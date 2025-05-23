const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  try {
    // ✅ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(403).json({ message: "Invalid session. Please log in again." });
      }
      return decodedToken;
    });

    // ✅ Ensure expiration check is applied
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      res.clearCookie("jwt");
      return res.status(401).json({ message: "Session expired, please log in again." });
    }

    if (!decoded.email) {
      return res.status(400).json({ message: "Invalid token structure." });
    }

    // ✅ Look up the user in the database
    const user = await User.findOne({ where: { email: decoded.email }, attributes: ["id", "username", "email"] });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    req.user = user; // ✅ Attach verified user to request object
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token, please log in again." });
  }
};

module.exports = authMiddleware;