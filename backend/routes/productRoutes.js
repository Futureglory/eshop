const express = require("express");
const { searchProducts } = require("../controllers/productController");
const { getRelatedProducts } = require("../controllers/productController");
const { getRecommendedProducts } = require("../controllers/productController");


const router = express.Router();

router.get("/search", searchProducts);
router.get("/related", getRelatedProducts);
router.get("/recommended", getRecommendedProducts);


module.exports = router;