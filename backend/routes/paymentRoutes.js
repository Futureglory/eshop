const express = require("express");
const router = express.Router();
const { 
    processPayment,
verifyPayment
} = require("../controllers/paymentController");

router.post("/pay", processPayment);
router.post("/verify", verifyPayment);
router.post("/pay", initiatePayment);

module.exports = router;