const express = require("express");
const {
  isAuthenticated,
  isSignedIn,
  getUserById,
} = require("../controllers/auth");

const MonthlyIncome = require("../models/monthlyIncome");
const router = express.Router();

const Spares = require("../models/spares");

router.param("userId", getUserById);

router.post("/addspare/:userId", isSignedIn, isAuthenticated, (req, res) => {
  const { name, rate, reason, vehicle_no, place } = req.body;

  const date = new Date();
  //var dateObj = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  const month = date.getMonth() + 1;
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  const output = day + "-" + month + "-" + year;
  var maxi = 0;

  MonthlyIncome.find({ month: month }).exec((err, data) => {
    if (err) {
      console.log("Failed to Update");
    }
    if (data.length) {
      MonthlyIncome.findByIdAndUpdate(
        { _id: data[0]._id },
        {
          $set: {
            spares: data[0].spares + Number(rate),
            total: data[0].total - Number(rate),
          },
        },
        { new: true, useFindAndModify: false },
        (err, data) => {
          console.log(data);
        }
      );
    } else {
      let maxim = 0;
      let total = 0;
      MonthlyIncome.find().exec((err, data) => {
        if (err) console.log(err);
        else data.map((d) => (d.invoice > maxim ? (maxim = d.invoice) : maxim));

        const monthlyIncome = new MonthlyIncome({
          invoice: maxim + 1,
          month: month,
          spares: rate,
          total: rate,
        });

        monthlyIncome.save((err, d) => console.log(d));
      });
    }
  });

  Spares.find().exec((err, user) => {
    if (err) {
      return res.status(400).json({ error: "No user Found" });
    }
    user.map((u) => (maxi = maxi < u.invoice ? u.invoice : maxi));

    const spares = new Spares({
      invoice: maxi + 1,
      name: name,
      date: date,
      dateFormat: output,
      month: month,
      rate: rate,
      reason: reason,
      vehicle_no: vehicle_no,
      place: place,
    });

    spares.save((err, l) => {
      if (err) {
        return res.status(400).json({ err: "Error in the Spare Form" });
      }
      res.json(l);
    });
  });
});

router.get("/getall/:userId", isSignedIn, isAuthenticated, (req, res) => {
  Spares.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({ err: "No Data Found" });
    }
    res.json(data);
  });
});

module.exports = router;
