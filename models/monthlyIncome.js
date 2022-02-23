const mongoose = require("mongoose");

const monthlyIncome_schema = new mongoose.Schema({
  invoice: {
    type: Number,
    required: true,
  },
  month: number,
  totalIncome: Number,
  totalGst: Number,
  spares: Number,
  diesel: Number,
  petrol: Number,
  labourSalary: Number,
  insurance: Number,
  fc: Number,
  expenses: Number,
  total: number,
});

module.exports = mongoose.model("monthlyIncome", monthlyIncome_schema);
