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

module.exports = router;
