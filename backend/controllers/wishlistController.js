const Cart = require("../models/Cart");
const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const sendEmail = require("../config/emailService");

exports.notifyWishlistDiscounts = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await User.findByPk(userId);
    const product = await Product.findByPk(productId);

   if (product.discounted) {
      sendEmail(user.email, "Wishlist Discount Alert", `Your saved item ${product.name} is now on sale!`);
    }


    res.json({ message: "Wishlist discount notification set!" });
  } catch (error) {
    res.status(500).json({ message: "Error subscribing for wishlist notification.", error });
  }
};
exports.moveToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!req.user) return res.status(401).json({ message: "Please log in." });

    await Cart.create({ userId: req.user.id, productId });
    await Wishlist.destroy({ where: { userId: req.user.id, productId } });

    res.json({ message: "Item moved to cart!" });
  } catch (error) {
    res.status(500).json({ message: "Error moving item.", error });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Please log in." });

    const wishlist = await Wishlist.findAll({ where: { userId: req.user.id } });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist.", error });
  }
};


exports.generateWishlistLink = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Please log in." });

    const wishlistItems = await Wishlist.findAll({ where: { userId: req.user.id } });

    const shareableLink = `https://eshop.com/wishlist/${req.user.id}`;
    res.json({ message: "Wishlist shared successfully!", link: shareableLink, items: wishlistItems });
  } catch (error) {
    res.status(500).json({ message: "Error generating wishlist link.", error });
  }
};