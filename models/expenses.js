const mongoose = require("mongoose");

const expenses_schema = new mongoose.Schema({
  date: String,
  month: Number,
  invoice: Number,
  reason: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("expenses", expenses_schema);
