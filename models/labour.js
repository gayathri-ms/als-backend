const mongoose = require("mongoose");

const labour_schema = new mongoose.Schema({
  invoice: Number,
  l_id: {
    type: String,
    required: true,
    unique: true,
  },
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
  aadhaar: String,
  phone: {
    type: String,
    required: true,
  },
  joined_date: String,
  salary_work: {
    type: Number,
    default: 0,
  },
  no_loads: {
    type: Number,
    default: 0,
  },
  no_days: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("labour_als", labour_schema);
