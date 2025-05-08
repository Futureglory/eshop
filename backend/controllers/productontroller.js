const Product = require("../models/Product");
const Order = require("../models/Order");

exports.searchProducts = async (req, res) => {
  try {
    const query = req.query.q.toLowerCase();

    const products = await Product.findAll({
      where: {
        name: { [Op.like]: `%${query}%` },
      },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Search failed.", error });
  }
};

exports.getRelatedProducts = async (req, res) => {
    try {
      const { category } = req.query;
  
      const relatedProducts = await Product.findAll({
        where: { category },
        limit: 4, // Show only 4 related products
      });
  
      res.json(relatedProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch related products.", error });
    }
  };
  
  exports.getRecommendedProducts = async (req, res) => {
    try {
      const userId = req.query.userId;
  
      // Fetch past purchased products by the user
      const pastOrders = await Order.findAll({
        where: { userId },
        include: [{ model: Product }],
      });
  
      const purchasedCategories = [
        ...new Set(pastOrders.map(order => order.Product.category))
      ];
  
      // Fetch new products from similar categories
      const recommendedProducts = await Product.findAll({
        where: { category: purchasedCategories },
        limit: 4,
      });
  
      res.json(recommendedProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommendations.", error });
    }
  };
  