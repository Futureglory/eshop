
const sendEmail = require("../config/emailService");

exports.notifyWishlistDiscounts = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await User.findByPk(userId);
    const product = await Product.findByPk(productId);

    sendEmail(user.email, "Wishlist Discount Alert", `Your saved item ${product.name} is now on discount!`);

    res.json({ message: "Wishlist discount notification sent!" });
  } catch (error) {
    res.status(500).json({ message: "Error sending wishlist notification.", error });
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