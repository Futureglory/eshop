const express = require("express");
const { getWishlist, addToWishlist, removeFromWishlist, moveToCart } = require("../controllers/wishlistController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getWishlist); // Fetch wishlist
router.post("/add", authMiddleware, addToWishlist); // Add item
router.delete("/remove/:productId", authMiddleware, removeFromWishlist); // Remove item
router.post("/move-to-cart", authMiddleware, moveToCart);

module.exports = router;