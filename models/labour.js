const mongoose = require("mongoose");

const labour_schema = new mongoose.Schema({
  invoice: Number,
  labour_name: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  advance: String,
  adv_amt: Number,
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  joined_date: String,
});

module.exports = mongoose.model("labour_als", labour_schema);
