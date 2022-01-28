const mongoose = require("mongoose");

const company_schema = new mongoose.Schema({
  company_name: {
    type: String,
    unique: true,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  fixed_date: String,
});

module.exports = mongoose.model("company_als", company_schema);
