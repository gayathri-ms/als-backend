const express = require("express");
const {
  isAuthenticated,
  isSignedIn,
  getUserById,
} = require("../controllers/auth");
const router = express.Router();

const Attendance = require("../models/attendance");
router.param("userId", getUserById);

router.post("/add/:userId", isSignedIn, isAuthenticated, (req, res) => {
  const date = new Date();
  var dateObj = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  const month = dateObj.getMonth() + 1;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();
  const output = day + "-" + month + "-" + year;

  const { labour_name, date, present, shift_time, extras } = req.body;

  let maxi = 0;

  Attendance.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({ err: "Not Saved in DB" });
    }

    data.map((d) => (maxi = maxi < d.invoice ? d.invoice : maxi));

    const attendance = new Attendance({
      invoice: maxi + 1,
      labour_name: labour_name,
      date: output,
      present: present,
      shift_time: shift_time,
      extras: extras,
    });
    attendance.save((err, com) => {
      if (err) {
        return res
          .status(400)
          .json({ err: "Cannot save the details in Database" });
      }
      res.json(com);
    });
  });
});

router.get("/getallLabour/:userId", isSignedIn, isAuthenticated, (req, res) => {
  Attendance.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({ err: "No Details found" });
    }
    res.json(data);
  });
});

module.exports = router;
