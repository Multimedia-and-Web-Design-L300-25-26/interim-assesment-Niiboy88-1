const Crypto = require("../models/Crypto");

// @desc    Get all tradable cryptocurrencies
// @route   GET /crypto
// @access  Public
const getAllCryptos = async (req, res) => {
  try {
    const cryptos = await Crypto.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Cryptocurrencies fetched successfully.",
      count: cryptos.length,
      data: cryptos,
    });
  } catch (error) {
    console.error("Get all cryptos error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Failed to fetch cryptocurrencies.",
    });
  }
};

// @desc    Get top gainers (highest 24h % change)
// @route   GET /crypto/gainers
// @access  Public
const getTopGainers = async (req, res) => {
  try {
    // Only return cryptos with positive change, sorted highest to lowest
    const gainers = await Crypto.find({ change24h: { $gt: 0 } })
      .sort({ change24h: -1 });

    res.status(200).json({
      success: true,
      message: "Top gainers fetched successfully.",
      count: gainers.length,
      data: gainers,
    });
  } catch (error) {
    console.error("Get top gainers error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Failed to fetch top gainers.",
    });
  }
};

// @desc    Get new listings (most recently added)
// @route   GET /crypto/new
// @access  Public
const getNewListings = async (req, res) => {
  try {
    // Sort by creation date, newest first
    const newListings = await Crypto.find().sort({ createdAt: -1 }).limit(20);

    res.status(200).json({
      success: true,
      message: "New listings fetched successfully.",
      count: newListings.length,
      data: newListings,
    });
  } catch (error) {
    console.error("Get new listings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Failed to fetch new listings.",
    });
  }
};

// @desc    Add a new cryptocurrency
// @route   POST /crypto
// @access  Public (or Private if you want to protect it)
const addCrypto = async (req, res) => {
  try {
    const { name, symbol, price, image, change24h } = req.body;

    // Validate required fields
    if (!name || !symbol || price === undefined || !image || change24h === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: name, symbol, price, image, and change24h.",
      });
    }

    // Check for duplicate symbol
    const existingCrypto = await Crypto.findOne({
      symbol: symbol.toUpperCase(),
    });
    if (existingCrypto) {
      return res.status(409).json({
        success: false,
        message: `A cryptocurrency with symbol "${symbol.toUpperCase()}" already exists.`,
      });
    }

    // Create new crypto
    const crypto = await Crypto.create({
      name,
      symbol,
      price,
      image,
      change24h,
    });

    res.status(201).json({
      success: true,
      message: `${crypto.name} (${crypto.symbol}) has been successfully added.`,
      data: crypto,
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(". "),
      });
    }

    console.error("Add crypto error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Failed to add cryptocurrency.",
    });
  }
};

module.exports = { getAllCryptos, getTopGainers, getNewListings, addCrypto };
