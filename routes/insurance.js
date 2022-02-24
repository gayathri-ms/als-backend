const express = require("express");
const {
  isAuthenticated,
  isSignedIn,
  getUserById,
} = require("../controllers/auth");
const router = express.Router();

const Insurance = require("../models/insurance");
const MonthlyIncome = require("../models/monthlyIncome");
router.param("userId", getUserById);

const datevalue = (val) => {
  const date = new Date(val);
  var dateObj = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  const month = dateObj.getMonth() + 1;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();
  const output = day + "-" + month + "-" + year;
  return output;
};

router.post(
  "/addinsurance/:userId",
  isSignedIn,
  isAuthenticated,
  (req, res) => {
    const date = new Date();
    // var dateObj = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

    const month = date.getMonth() + 1;
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const output = day + "-" + month + "-" + year;

    const {
      vehicle_no,
      amount,
      company_name,
      tax_amt,
      permit_date,
      expired_date,
      pollution_cer,
      pollution_expire,
    } = req.body;

    let permit = datevalue(permit_date);
    let expire = datevalue(expired_date);
    let pol_expire = datevalue(pollution_expire);

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
              insurance: data[0].insurance + Number(amount),
              total: data[0].total - Number(amount),
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
            insurance: amount,
            total: amount,
          });

          monthlyIncome.save((err, d) => console.log(d));
        });
      }
    });

    Insurance.find().exec((err, user) => {
      if (err) {
        return res.status(400).json({ error: "No user Found" });
      }
      user.map((u) => (maxi = maxi < u.invoice ? u.invoice : maxi));

      const insurance = new Insurance({
        invoice: maxi + 1,
        date: date,
        dateformat: output,
        month: month,
        vehicle_no: vehicle_no,
        amount: amount,
        company_name: company_name,
        tax_amt: tax_amt,
        permit_date: permit,
        expired_date: expire,
        pollution_cer: pollution_cer,
        pollution_expire: pol_expire,
      });
      insurance.save((err, com) => {
        if (err) {
          return res.status(400).json({ err: "cannot save the data" });
        }
        res.json(com);
      });
    });
  }
);
router.get("/getall/:userId", isSignedIn, isAuthenticated, (req, res) => {
  Insurance.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({ err: "No Data Found" });
    }
    res.json(data);
  });
});

module.exports = router;
