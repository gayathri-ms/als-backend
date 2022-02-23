const express = require("express");
const {
  isAuthenticated,
  isSignedIn,
  getUserById,
} = require("../controllers/auth");

const Expenses = require("../models/expenses");
const router = express.Router();

router.param("userId", getUserById);

router.post("/add/:userId", isSignedIn, isAuthenticated, (req, res) => {
  const { reason, amount } = req.body;
  console.log("req", req.body);
  const dateObj = new Date(req.body.date);
  // var dateObj = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  const month = dateObj.getMonth() + 1;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();
  const output = day + "-" + month + "-" + year;

  var maxi = 0;

  Expenses.find().exec((err, data) => {
    if (err) {
      console.log("User Not found");
    }

    data.map((d) => (maxi = maxi < d.invoice ? d.invoice : maxi));

    const expense = new Expenses({
      date: output,
      month: month,
      invoice: maxi + 1,
      reason: reason,
      amount: amount,
    });

    expense.save((err, data) => {
      if (err) {
        return res.status(400).json({ err: "Not saved in Database" });
      }
      res.json(data);
    });
  });
});

router.get("/getAll/:userId", isSignedIn, isAuthenticated, (req, res) => {
  Expenses.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({ err: "Not found in Database" });
    }
    res.json(data);
  });
});

module.exports = router;
