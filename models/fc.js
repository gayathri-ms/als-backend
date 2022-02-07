const mongoose = require("mongoose");

const FC_schema = new mongoose.Schema({
  date: Date,
  dateformat: String,
  invoice: Number,
  vehicle_no: {
    type: String,
    required: true,
  },
  expenses: {
    type: Number,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  broker_name: {
    type: String,
    required: true,
  },
  expired_date: String,
});

module.exports = mongoose.model("FC", FC_schema);
