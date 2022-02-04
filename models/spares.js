const mongoose = require("mongoose");

const spares_schema = new mongoose.Schema({
  invoice: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: Date,
  dateFormat: String,
  rate: {
    type: Number,
    default: 0,
    required: true,
  },
  reason: String,
  vehicle_no: String,
  place: String,
});

module.exports = mongoose.model("Spares1", spares_schema);
