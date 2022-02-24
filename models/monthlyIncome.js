const mongoose = require("mongoose");

const monthlyIncome_schema = new mongoose.Schema({
  invoice: {
    type: Number,
    required: true,
  },
  month: Number,
  totalIncome: {
    type: Number,
    default: 0,
  },
  totalGst: {
    type: Number,
    default: 0,
  },
  spares: {
    type: Number,
    default: 0,
  },
  diesel: {
    type: Number,
    default: 0,
  },
  petrol: {
    type: Number,
    default: 0,
  },
  labourSalary: {
    type: Number,
    default: 0,
  },
  insurance: {
    type: Number,
    default: 0,
  },
  fc: {
    type: Number,
    default: 0,
  },
  expenses: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("monthlyIncome", monthlyIncome_schema);
