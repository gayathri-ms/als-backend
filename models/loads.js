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
  due_date: Date,
  dateformat: String,
  rate: {
    type: Number,
    required: true,
  },
  no_loads: {
    type: Number,
    required: true,
  },
  delivery: {
    type: String,
    required: true,
  },
  extras: Number,
  total: {
    type: Number,
    default: 0,
  },
  gst: String,
  gstamt: Number,
  grandtotal: Number,
  amt_received: Number,
  balance: Number,
  acc_holder: String,
  date_received: Date,
});

module.exports = mongoose.model("Load1", load_schema);
