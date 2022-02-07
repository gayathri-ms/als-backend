const express = require("express");
const {
  isAuthenticated,
  isSignedIn,
  getUserById,
} = require("../controllers/auth");
const router = express.Router();

const Insurance = require("../models/insurance");
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
    var dateObj = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

    const month = dateObj.getMonth() + 1;
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();
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
    Insurance.find().exec((err, user) => {
      if (err) {
        return res.status(400).json({ error: "No user Found" });
      }
      user.map((u) => (maxi = maxi < u.invoice ? u.invoice : maxi));

      const insurance = new Insurance({
        invoice: maxi + 1,
        date: date,
        dateformat: output,
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
