const mongoose = require("mongoose");

const attendance_schema = new mongoose.Schema({
  date: String,
  invoice: Number,
  labour: {
    type: String,
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

module.exports = mongoose.model("attendance1", attendance_schema);
