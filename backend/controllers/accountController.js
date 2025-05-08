const AccountOption = require("../models/AccountOptions");

exports.getAccountOptions = async (req, res) => {
  try {
    const accountOptions = await AccountOption.findAll();
    res.json(accountOptions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching account options.", error });
  }
};