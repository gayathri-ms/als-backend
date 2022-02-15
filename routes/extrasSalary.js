const express = require("express");
const {
  isAuthenticated,
  isSignedIn,
  getUserById,
} = require("../controllers/auth");
const router = express.Router();

const Extras = require("../models/extras_salary");
const Labour = require("../models/labour");
router.param("userId", getUserById);

router.post("/add/:userId", isSignedIn, isAuthenticated, (req, res) => {
  console.log("  inside add");
  const date = new Date();
  var dateObj = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  const month = dateObj.getMonth() + 1;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();
  const output = day + "-" + month + "-" + year;

  const { vehicle_no, no_loads, no_labour, laboursArray } = req.body;

  let extra = 0;
  let tot_salary = 0;

  if (Number(no_labour) === 2) extra = 50;
  else if (Number(no_labour) === 3) extra = 30;

  tot_salary = Number(no_loads) * Number(extra);

  Labour.find().exec((err, data) => {
    // let labours = [];

    for (let i = 0; i < Number(no_labour); i++) {
      let labours = data.filter(
        (d) => d.labour_name === laboursArray[i].labour_name
      )[0];
      let sal = Number(labours.salary_work) + tot_salary;
      console.log("salary", sal);
      console.log("l_id", labours.l_id);
      var loads = labours.no_loads + Number(no_loads);
      Labour.findByIdAndUpdate(
        { _id: labours._id },
        {
          $set: {
            salary_work: sal,
            no_loads: loads,
          },
        },
        { new: true, useFindAndModify: false },
        (err, item) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
    // console.log("labour", labours);
  });

  let maxi = 0;
  Extras.find().exec((err, user) => {
    if (err) {
      return res.status(400).json({ err: "Not Saved in DB" });
    }

    user.map((d) => (maxi = maxi < d.invoice ? d.invoice : maxi));
    const extras = new Extras({
      invoice: maxi + 1,
      vehicle_no: vehicle_no,
      no_loads: no_loads,
      no_labour: no_labour,
      laboursArray: laboursArray,
      date: output,
    });
    extras.save((err, com) => {
      if (err) {
        return res.status(400).json({ err: "cannot save the data" });
      }
      res.json(com);
    });
  });
});

router.get("/getallextras/:userId", isSignedIn, isAuthenticated, (req, res) => {
  Extras.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({ err: "No Details found" });
    }
    res.json(data);
  });
});

module.exports = router;
