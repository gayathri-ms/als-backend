const mongoose = require("mongoose");

const insurance_schema = new mongoose.Schema({
  date: Date,
  dateformat: String,
  invoice: Number,
  vehicle_no: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  company_name: {
    type: String,
    required: true,
  },
  tax_amt: {
    type: Number,
    required: true,
  },
  permit_date: String,
  expired_date: String,
  pollution_cer: String,
  pollution_expire: String,
});

module.exports = mongoose.model("insurance", insurance_schema);
