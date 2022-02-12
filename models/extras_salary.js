const mongoose = require("mongoose");

const extras_schema = new mongoose.Schema({
  date: String,
  invoice: Number,

  vehicle_no: {
    type: String,
    required: true,
  },
  no_loads: {
    type: Number,
    required: true,
  },
  no_labour: {
    type: Number,
    required: true,
  },
  laboursArray: {
    type: Array,
  },
});

module.exports = mongoose.model("extras", extras_schema);
