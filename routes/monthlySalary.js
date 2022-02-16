const express = require("express");
const {
  isAuthenticated,
  isSignedIn,
  getUserById,
} = require("../controllers/auth");
const router = express.Router();

const MonthlySalary = require("../models/monthlySalary");

router.param("userId", getUserById);

router.get("/getAll/:userId", isSignedIn, isAuthenticated, (req, res) => {
  MonthlySalary.find().exec((err, data) => {
    if (err) {
      return res
        .status(400)
        .json({ err: "Error Occured while Finding elements in Database" });
    }
    res.json(data);
  });
});

module.exports = router;
