const mongoose = require("mongoose");

const expenses_schema = new mongoose.Schema({
  date: String,
  invoice: Number,
  reason: {
    type: String,
    required: true,
  },
  Amount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("expenses", expenses_schema);
