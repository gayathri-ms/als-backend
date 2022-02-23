const mongoose = require("mongoose");

const monthly_Salary = new mongoose.Schema({
  invoice: {
    type: Number,
    unique: true,
    required: true,
  },
  date: Date,
  month: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  month_no: Number,
  l_id: {
    type: String,
    required: true,
  },
  labour_name: {
    type: String,
    required: true,
  },
  dateformat: String,
});

module.exports = mongoose.model("Month_Sal", monthly_Salary);
