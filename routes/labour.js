const express = require("express");
const {
  isAuthenticated,
  isSignedIn,
  getUserById,
} = require("../controllers/auth");
const router = express.Router();

const Labour = require("../models/labour");
const MonthlyIncome = require("../models/monthlyIncome");
const MonthlySalary = require("../models/monthlySalary");

router.param("userId", getUserById);

const monthName = [
  "January",
  "Febraury",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

router.post("/addlabour/:userId", isSignedIn, isAuthenticated, (req, res) => {
  const date = new Date();
  var dateObj = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  const month = dateObj.getMonth() + 1;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();
  const output = day + "-" + month + "-" + year;

  const {
    labour_name,
    l_id,
    address,
    aadhaar,
    adv_amt,
    advance,
    phone,
    salary,
  } = req.body;

  let maxi = 0;

  Labour.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({ err: "Not Saved in DB" });
    }

    data.map((d) => (maxi = maxi < d.invoice ? d.invoice : maxi));

    const labour = new Labour({
      invoice: maxi + 1,
      l_id: l_id,
      labour_name: labour_name,
      address: address,
      aadhaar: aadhaar,
      adv_amt: adv_amt,
      advance: advance,
      phone: phone,
      salary: salary,
      joined_date: output,
    });
    labour.save((err, com) => {
      if (err) {
        return res
          .status(400)
          .json({ err: "Cannot save the details in Database" });
      }
      res.json(com);
    });
  });
});

router.put("/updatedExtra/:userId", isSignedIn, isAuthenticated, (req, res) => {
  const date = new Date();
  var dateObj = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  const month = dateObj.getMonth() + 1;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();
  const output = day + "-" + month + "-" + year;

  const { l_id, salary, labour_name } = req.body;

  Labour.find().exec((err, data) => {
    let labours = data.filter((d) => d.l_id === l_id)[0];
    console.log("salary_work", labours.salary_work, "salary", salary);
    var sal = Number(labours.salary_work) - Number(salary);
    console.log("sal", sal);
    Labour.findByIdAndUpdate(
      { _id: labours._id },
      {
        $set: {
          salary_work: sal,
        },
      },
      { new: true, useFindAndModify: false },
      (err, item) => {
        if (err) {
          console.log(err);
        }
        console.log("res", item);
      }
    );

    MonthlyIncome.find({ month: month }).exec((err, data) => {
      if (err) {
        console.log("Failed to Update");
      }
      if (data.length) {
        MonthlyIncome.findByIdAndUpdate(
          { _id: data[0]._id },
          {
            $set: {
              labourSalary: data[0].labourSalary + Number(salary),
              total: data[0].total - Number(salary),
            },
          },
          { new: true, useFindAndModify: false },
          (err, data) => {
            console.log(data);
          }
        );
      } else {
        let maxim = 0;
        MonthlyIncome.find().exec((err, data) => {
          if (err) console.log(err);
          else
            data.map((d) => (d.invoice > maxim ? (maxim = d.invoice) : maxim));

          const monthlyIncome = new MonthlyIncome({
            invoice: maxim + 1,
            month: month,
            expenses: Number(salary),
            total: -1 * Number(salary),
          });

          monthlyIncome.save((err, d) => console.log(d));
        });
      }
    });

    let maxi = 0;
    MonthlySalary.find().exec((err, data) => {
      if (data.err) {
        console.log(err);
      }
      data.map((d) => (maxi = maxi < d.invoice ? d.invoice : maxi));

      const monthly_salary = new MonthlySalary({
        invoice: maxi + 1,
        date: date,
        dateformat: output,
        month: monthName[month - 1],
        month_no: month,
        salary: Number(salary),
        l_id: l_id,
        labour_name: labour_name,
      });
      monthly_salary.save((err, mon) => {
        if (err) {
          return res.status(400).json({ err: err });
        }
        res.json(mon);
      });
    });
  });
});

router.put(
  "/updateAdvance/:userId",
  isSignedIn,
  isAuthenticated,
  (req, res) => {
    const { l_id, adv_amt, advance, labour_name } = req.body;

    Labour.find().exec((err, data) => {
      let labours = data.filter((d) => d.l_id === l_id)[0];
      var adv = 0;
      if (advance === "yes") adv = Number(labours.adv_amt) + Number(adv_amt);
      else if (advance === "no")
        adv = Number(labours.adv_amt) - Number(adv_amt);
      Labour.findByIdAndUpdate(
        { _id: labours._id },
        {
          $set: {
            adv_amt: adv,
          },
        },
        { new: true, useFindAndModify: false },
        (err, item) => {
          if (err) {
            return res.status(400).json({ err: "Not updated" });
          }
          res.json(item);
        }
      );
    });
  }
);

router.get("/getallLabour/:userId", isSignedIn, isAuthenticated, (req, res) => {
  Labour.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({ err: "No Details found" });
    }
    res.json(data);
  });
});

router.delete("/deleteAll/:userId", isSignedIn, isAuthenticated, (req, res) => {
  Labour.remove((err, labor) => {
    if (err) {
      res.status(400).json({
        error: "failed to delete the product",
      });
    }
    res.json({
      message: "deletion is succesful",
      labor,
    });
  });
});
module.exports = router;
