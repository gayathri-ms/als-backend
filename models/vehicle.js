const mongoose = require("mongoose");

const vehicle_schema = new mongoose.Schema({
  vehicle_no: {
    type: String,
    unique: true,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Vehicle", vehicle_schema);
