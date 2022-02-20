const mongoose = require("mongoose");

const load_schema = new mongoose.Schema({
  invoice: {
    type: Number,
    unique: true,
    required: true,
  },
  date: Date,
  vehicle_no: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone_no: {
    type: String,
    required: true,
  },
  due_date: Date,
  dateformat: String,
  rate: {
    type: Number,
    required: true,
  },
  no_loads_in: {
    type: Number,
    required: true,
  },
  no_loads_out: {
    type: Number,
    required: true,
  },
  total_rate_in: {
    type: Number,
    required: true,
  },
  total_rate_out: {
    type: Number,
    required: true,
  },
  extras: Number,
  total: {
    type: Number,
    default: 0,
  },
  gst: String,
  gstamt: {
    type: Number,
    default: 0,
  },
  totalGst: Number,
  grandtotal: {
    type: Number,
    default: 0,
  },
  amt_received: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },
  acc_holder: {
    type: String,
    default: "",
  },
  date_received: String,
});

module.exports = mongoose.model("Load1", load_schema);
