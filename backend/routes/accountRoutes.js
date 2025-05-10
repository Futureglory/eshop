const express = require("express");
const { getAccountOptions } = require("../controllers/accountController");

const router = express.Router();

router.get("/options", getAccountOptions);

module.exports = router;