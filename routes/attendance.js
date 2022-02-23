const express = require("express");
const {
  isAuthenticated,
  isSignedIn,
  getUserById,
} = require("../controllers/auth");
const router = express.Router();

const Attendance = require("../models/attendance");
const Labour = require("../models/labour");

router.param("userId", getUserById);

router.post("/add/:userId", isSignedIn, isAuthenticated, (req, res) => {
  const dateObj = new Date();
  // var dateObj = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  const month = dateObj.getMonth() + 1;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();
  const output = day + "-" + month + "-" + year;

  const { labour_name, l_id, present, shift_time, extras } = req.body;
  if (present === "present") {
    Labour.find({ l_id: l_id }).exec((err, user) => {
      if (err) {
        return res.status(400).json({ err: "Labour Not Found in DB" });
      }
      console.log("user,salary", user[0].salary);
      let lab_id = user[0]._id;
      let sal = 0;
      if (extras !== 0) {
        sal = Number(user[0].salary) + Number(extras);
      } else sal = Number(user[0].salary);

      if (user[0].salary_work !== undefined) {
        sal = sal + user[0].salary_work;
      }
      var days = user[0].no_days + 1;
      console.log("sal", sal);
      Labour.findByIdAndUpdate(
        { _id: lab_id },
        {
          $set: {
            salary_work: sal,
            no_days: days,
          },
        },
        { new: true, useFindAndModify: false },
        (err, item) => {
          if (err) {
            return res.status(400).json({
              error: "your cant update this Item ",
            });
          }
        }
      );
    });
  }

  let maxi = 0;

  Attendance.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({ err: "Not Saved in DB" });
    }

    data.map((d) => (maxi = maxi < d.invoice ? d.invoice : maxi));

    const attendance = new Attendance({
      invoice: maxi + 1,
      lab_id: l_id,
      labour: labour_name,
      date: output,
      present: present,
      shift_time: shift_time,
      extras: extras,
    });
    attendance.save((err, com) => {
      if (err) {
        return res.status(400).json({ err: err });
      }
      res.json(com);
    });
  });
});

router.get("/getall/:userId", isSignedIn, isAuthenticated, (req, res) => {
  Attendance.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({ err: "No Details found" });
    }
    res.json(data);
  });
});

router.get("/getbydate/:userId", isSignedIn, isAuthenticated, (req, res) => {
  const dateObj = new Date();
  // var dateObj = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  const month = dateObj.getMonth() + 1;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();
  const output = day + "-" + month + "-" + year;

  console.log("tday", output);
  Attendance.find({ date: output }).exec((err, data) => {
    if (err) {
      return res.status(400).json({ err: "No Details found" });
    }
    res.json(data);
  });
});

router.delete("/deleteAll/:userId", isSignedIn, isAuthenticated, (req, res) => {
  Attendance.remove((err, attendance) => {
    if (err) {
      res.status(400).json({
        error: "failed to delete the product",
      });
    }
    res.json({
      message: "deletion is succesful",
      attendance,
    });
  });
});

module.exports = router;
