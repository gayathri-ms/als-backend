const express = require("express");
const {
  isAuthenticated,
  isSignedIn,
  getUserById,
} = require("../controllers/auth");
const router = express.Router();

const Loads = require("../models/loads");
const Spares = require("../models/spares");
const Diesel = require("../models/diesel");
const Petrol = require("../models/petrol");
const Insurance = require("../models/insurance");
const FC = require("../models/fc");
const Expenses = require("../models/expenses");
const MonthlySalary = require("../models/monthlySalary");
const MonthlyIncome = require("../models/monthlyIncome");

router.param("userId", getUserById);

const check = (month) => {
  let totalIncome = 0;
  let totalGst = 0;
  Loads.find({ month: month }).exec((err, data) => {
    if (err) {
      console.log("error :", err);
    }
    data.map((d) => ((totalIncome += d.grandtotal), (totalGst += d.totalGst)));
  });

  let spares = 0;
  Spares.find({ month: month }).exec((err, data) => {
    if (err) {
      console.log("error :", err);
    }
    data.map((d) => (spares += d.rate));
  });

  let diesel = 0;
  Diesel.find({ month: month }).exec((err, data) => {
    if (err) {
      console.log("error :", err);
    }
    data.map((d) => (diesel += d.total_amt));
  });

  let petrol = 0;
  Petrol.find({ month: month }).exec((err, data) => {
    if (err) {
      console.log("error :", err);
    }
    data.map((d) => (petrol += d.total_amt));
  });

  let insurance = 0;
  Insurance.find({ month: month }).exec((err, data) => {
    if (err) {
      console.log("error :", err);
    }
    data.map((d) => (insurance += d.amount));
  });

  let fc = 0;
  FC.find({ month: month }).exec((err, data) => {
    if (err) {
      console.log("error :", err);
    }
    data.map((d) => (fc += d.expenses));
  });

  let expenses = 0;
  Expenses.find({ month: month }).exec((err, data) => {
    if (err) {
      console.log("error :", err);
    }
    data.map((d) => (expenses += d.amount));
  });

  let labourSalary = 0;
  MonthlySalary.find({ month_no: month }).exec((err, data) => {
    if (err) {
      console.log("error :", err);
    }
    data.map((d) => (labourSalary += d.salary));
  });

  let total =
    Number(totalIncome) +
    Number(totalGst) -
    Number(spares) -
    Number(diesel) -
    Number(petrol) -
    Number(labourSalary) -
    Number(insurance) -
    Number(fc) -
    Number(expenses);

  return {
    totalIncome,
    totalGst,
    spares,
    diesel,
    petrol,
    labourSalary,
    insurance,
    fc,
    expenses,
    total,
  };
};

router.post("/add/:userId", isSignedIn, isAuthenticated, (req, res) => {
  const month = req.body.month;
  const {
    totalIncome,
    totalGst,
    spares,
    diesel,
    petrol,
    labourSalary,
    insurance,
    fc,
    expenses,
    total,
  } = check(month);
  let maxi = 0;
  MonthlyIncome.find().exec((err, data) => {
    if (err) console.log("error :", err);

    data.map((d) => (maxi = maxi < d.invoice ? d.invoice : maxi));

    const monthlyIncome = new MonthlyIncome({
      invoive: maxi + 1,
      month: month,
      totalIncome: totalIncome,
      totalGst: totalGst,
      spares: spares,
      diesel: diesel,
      petrol: petrol,
      labourSalary: labourSalary,
      insurance: insurance,
      fc: fc,
      expenses: expenses,
      total: total,
    });

    monthlyIncome.save((err, mon) => {
      if (err) return res.status(400).json({ err: "Not Stored in Database" });
      res.json(mon);
    });
  });
});

router.put("/update/:userId", isSignedIn, isAuthenticated, (req, res) => {
  const month = req.body.month;
  const {
    totalIncome,
    totalGst,
    spares,
    diesel,
    petrol,
    labourSalary,
    insurance,
    fc,
    expenses,
    total,
  } = check(month);

  MonthlyIncome.find({ month: month }).exec((err, data) => {
    if (err) {
      return res.status(400).json({ err: "Failed to Updated" });
    }

    Loads.findByIdAndUpdate(
      { _id: data[0]._id },
      {
        $set: {
          totalIncome: totalIncome,
          totalGst: totalGst,
          spares: spares,
          diesel: diesel,
          petrol: petrol,
          labourSalary: labourSalary,
          insurance: insurance,
          fc: fc,
          expenses: expenses,
          total: total,
        },
      },
      { new: true, useFindAndModify: false },
      (err, item) => {
        if (err) {
          return res.status(400).json({
            error: "Failed to Update the data ",
          });
        }
        res.json(item);
      }
    );
  });

  res.json({});
});

router.get("/get/:userId", isSignedIn, isAuthenticated, (req, res) => {
  MonthlyIncome.find().exec((err, data) => {
    if (err) return res.status(400).json({ err: "No Details Found" });
    res.json(data);
  });
});

module.exports = router;
