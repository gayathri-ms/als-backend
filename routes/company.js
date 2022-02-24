const express = require("express");
const {
  isAuthenticated,
  isSignedIn,
  getUserById,
} = require("../controllers/auth");
const router = express.Router();

const Company = require("../models/company");
router.param("userId", getUserById);

router.post("/addcompany/:userId", isSignedIn, isAuthenticated, (req, res) => {
  console.log("  inside add");
  const date = new Date(req.body.fixed_date);
  var dateObj = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  const month = dateObj.getMonth() + 1;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();
  const output = day + "-" + month + "-" + year;

  const { company_name, address, phone, rate } = req.body;
  const company = new Company({
    company_name: company_name,
    address: address,
    phone: phone,
    rate: rate,
    fixed_date: output,
  });
  company.save((err, com) => {
    if (err) {
      return res.status(400).json({ err: "cannot save the data" });
    }
    res.json(com);
  });
});

router.put("/update/:userId", isSignedIn, isAuthenticated, (req, res) => {
  const { company_name, rate, fixed_date } = req.body;

  Company.find({ company_name: company_name }).exec((err, data) => {
    if (err) {
      return res.status(400).json({ err: "Failed to Updated" });
    }

    Company.findByIdAndUpdate(
      { _id: data[0]._id },
      {
        $set: {
          rate: rate,
          fixed_date: fixed_date,
        },
      },
      { new: true, useFindAndModify: false },
      (err, item) => {
        if (err) {
          return res.status(400).json({
            error: "Failed to Update the data ",
          });
        }
        res.json(item);
      }
    );
  });
});

router.get(
  "/getallcompany/:userId",
  isSignedIn,
  isAuthenticated,
  (req, res) => {
    Company.find().exec((err, data) => {
      if (err) {
        return res.status(400).json({ err: "No Details found" });
      }
      res.json(data);
    });
  }
);

router.get("/getrate/:userId", isSignedIn, isAuthenticated, (req, res) => {
  const company_name = req.body.company_name;
  Company.find({ company_name: company_name }).exec((err, data) => {
    if (err) {
      return res
        .status(400)
        .json({ err: "Company Name not found in Database" });
    }
    console.log("company rate", data.rate);
    res.json(data);
  });
});

module.exports = router;
