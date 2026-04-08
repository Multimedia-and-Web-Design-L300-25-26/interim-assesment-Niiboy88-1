const express = require("express");
const router = express.Router();
const {
  getAllCryptos,
  getTopGainers,
  getNewListings,
  addCrypto,
} = require("../controllers/cryptoController");

// IMPORTANT: Specific routes must come BEFORE dynamic routes

// GET  /crypto/gainers  – Top gainers sorted by 24h change (highest first)
router.get("/crypto/gainers", getTopGainers);

// GET  /crypto/new  – New listings sorted by date (newest first)
router.get("/crypto/new", getNewListings);

// GET  /crypto  – All tradable cryptocurrencies
router.get("/crypto", getAllCryptos);

// POST /crypto  – Add a new cryptocurrency
router.post("/crypto", addCrypto);

module.exports = router;
