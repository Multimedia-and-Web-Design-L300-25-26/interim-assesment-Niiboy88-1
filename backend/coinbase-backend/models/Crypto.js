const mongoose = require("mongoose");

const cryptoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Cryptocurrency name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    symbol: {
      type: String,
      required: [true, "Symbol is required"],
      uppercase: true,
      trim: true,
      maxlength: [10, "Symbol cannot exceed 10 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    change24h: {
      type: Number,
      required: [true, "24h change percentage is required"],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for sorting new listings by creation date
cryptoSchema.index({ createdAt: -1 });

// Index for sorting gainers by change24h
cryptoSchema.index({ change24h: -1 });

module.exports = mongoose.model("Crypto", cryptoSchema);
