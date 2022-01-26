const express = require("express");
const {
  isAuthenticated,
  isSignedIn,
  getUserById,
} = require("../controllers/auth");
const router = express.Router();

const Loads = require("../models/loads");
router.param("userId", getUserById);

router.post("/addload/:userId", isSignedIn, isAuthenticated, (req, res) => {
  const { vehicle_no, rate, company, no_loads, delivery, extras, gst, gstamt } =
    req.body;

  const date = new Date();
  var dateObj = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  const month = dateObj.getMonth() + 1;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();
  const output = day + "-" + month + "-" + year;

  var date2 = new Date();
  date2.setDate(date.getDate() + 20);
  var duelocal = new Date(date2.getTime() - date2.getTimezoneOffset() * 60000);

  var total = rate * no_loads;

  if (delivery === "out") total = total + Number(extras);
  else if (delivery === "in") total = total - Number(extras);
  var grandtotal = total;
  if (gst === "yes")
    grandtotal = grandtotal + Number(total * Number(gstamt) * 0.01);

  var maxi = 0;
  Loads.find().exec((err, user) => {
    if (err) {
      return res.status(400).json({ error: "No user Found" });
    }
    user.map((u) => (maxi = maxi < u.invoice ? u.invoice : maxi));

    const loads = new Loads({
      invoice: maxi + 1,
      date: dateObj,
      vehicle_no: vehicle_no,
      company: company,
      due_date: duelocal,
      dateformat: output,
      rate: rate,
      no_loads: no_loads,
      delivery: delivery,
      extras: extras,
      gst: gst,
      gstamt: gstamt,
      grandtotal: grandtotal,
      total: total,
    });

    loads.save((err, l) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      res.json(l);
    });
  });
});

module.exports = router;
