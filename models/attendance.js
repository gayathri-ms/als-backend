const mongoose = require("mongoose");

const attendance_schema = new mongoose.Schema({
  date: String,
  invoice: Number,
  labour_name: {
    type: String,
    unique: true,
    required: true,
  },
  present: {
    type: String,
    required: true,
  },
  shift_time: {
    type: String,
    required: true,
  },
  extras: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("attendance", attendance_schema);
