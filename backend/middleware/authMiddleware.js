const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Middleware for checking JWT and token blacklist
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

     // ✅ Ensure `decoded.exp` exists before checking expiration
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      res.clearCookie("jwt");
      return res.status(401).json({ message: "Session expired, please log in again." });
    }

      if (!decoded.email) {
      return res.status(400).json({ message: "Invalid token structure." });
    }


       const user = await User.findOne({ where: { email: decoded.email }, attributes: ["id", "username", "email"] });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    req.user = user; // Attach decoded user data
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token, please log in again." });
  }
};

// Middleware for protecting routes (with user lookup)
// const protect = async (req, res, next) => {
//   const token = req.cookies.jwt;

//   if (!token) {
//     return res.status(401).json({ message: "Not authorized, no token." });
//   }

//   if (blacklist.has(token)) {
//     return res.status(401).json({ message: "Token has been blacklisted." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findByPk(decoded.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Not authorized, token failed." });
//   }
// };


// Export both middlewares and the blacklist (if needed in logout)
module.exports =
  authMiddleware;
