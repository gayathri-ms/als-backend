const mongoose = require("mongoose");

const monthly_Salary = new mongoose.Schema({
  invoice: {
    type: Number,
    unique: true,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  gst: {
    type: Number,
    required: true,
  },
  dateformat: String,
});

module.exports = mongoose.model("Month_Sal", monthly_Salary);
