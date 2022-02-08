const express = require("express");
const {
  isAuthenticated,
  isSignedIn,
  getUserById,
} = require("../controllers/auth");
const router = express.Router();

const Diesel = require("../models/diesel");
router.param("userId", getUserById);

router.post("/add_diesel/:userId", isSignedIn, isAuthenticated, (req, res) => {
  const { rate, no_ltrs, vehicle_no, present_km } = req.body;
  const date = new Date();
  var dateObj = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  const month = dateObj.getMonth() + 1;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();
  const output = day + "-" + month + "-" + year;

  let total = rate * no_ltrs;
  let pre_km = 0;
  var maxi = 0;

  Diesel.find().exec((err, user) => {
    if (err) {
      return res.status(400).json({ error: "No user Found" });
    }
    console.log("km", pre_km);

    user.map((u) => (maxi = maxi < u.invoice ? u.invoice : maxi));

    if (maxi !== 0) {
      const detail = user.filter((u) => u.vehicle_no === vehicle_no);
      console.log("detail", detail);
      let inv = 0;
      detail.map((d) => (inv = inv < d.invoice ? d.invoice : inv));
      if (inv !== 0) {
        let data = detail.filter((d) => d.invoice === inv);
        if (data !== [] && data[0].present_km !== undefined)
          pre_km = (present_km - data[0].present_km) / no_ltrs;
      }
    }

    const diesel = new Diesel({
      invoice: maxi + 1,
      date: date,
      dateFormat: output,
      rate: rate,
      vehicle_no: vehicle_no,
      no_ltrs: no_ltrs,
      total_amt: total,
      present_km: present_km,
      kmpl: pre_km,
    });

    diesel.save((err, d) => {
      if (err) {
        return res.status(400).json({ err: err });
      }
      res.json(d);
    });
  });
});

router.get("/getall/:userId", isSignedIn, isAuthenticated, (req, res) => {
  Diesel.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({ err: "No Data Found" });
    }
    res.json(data);
  });
});

module.exports = router;
