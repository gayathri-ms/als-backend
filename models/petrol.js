const mongoose = require("mongoose");

const petrol_schema = new mongoose.Schema({
  invoice: {
    type: Number,
    unique: true,
  },
  date: {
    type: Date,
  },
  dateFormat: String,
  month: Number,
  rate: {
    type: Number,
    required: true,
  },
  vehicle_no: {
    type: String,
    required: true,
  },
  no_ltrs: {
    type: Number,
    default: 0,
  },
  total_amt: {
    type: Number,
    default: 0,
  },
  present_km: {
    type: Number,
  },
  kmpl: Number,
});

module.exports = mongoose.model("Petrol", petrol_schema);
