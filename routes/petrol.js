const express = require("express");
const {
  isAuthenticated,
  isSignedIn,
  getUserById,
} = require("../controllers/auth");
const router = express.Router();

const Petrol = require("../models/petrol");
router.param("userId", getUserById);

router.post("/add_petrol/:userId", isSignedIn, isAuthenticated, (req, res) => {
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
  Petrol.find().exec((err, user) => {
    if (err) {
      return res.status(400).json({ error: "No user Found" });
    }
    user.map((u) => (maxi = maxi < u.invoice ? u.invoice : maxi));
    const detail = user.filter((u) => u.invoice === maxi);
    console.log("detail", detail);
    if (detail !== [] && detail[0].present_km !== undefined)
      pre_km = (present_km - detail[0].present_km) / no_ltrs;

    const petrol = new Petrol({
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

    petrol.save((err, d) => {
      if (err) {
        return res.status(400).json({ err: err });
      }
      res.json(d);
    });
  });
});

router.get("/getall/:userId", isSignedIn, isAuthenticated, (req, res) => {
  Petrol.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({ err: "No Data Found" });
    }
    res.json(data);
  });
});

module.exports = router;
