const express = require("express");
const {
  isAuthenticated,
  isSignedIn,
  getUserById,
} = require("../controllers/auth");
const router = express.Router();

const Vehicle = require("../models/vehicle");
router.param("userId", getUserById);

router.post("/addvehicle/:userId", isSignedIn, isAuthenticated, (req, res) => {
  const date = new Date();
  var dateObj = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  const month = dateObj.getMonth() + 1;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();
  const output = day + "-" + month + "-" + year;

  const { vehicle_no, place } = req.body;
  const vehicle = new Vehicle({
    vehicle_no: vehicle_no,
    date: output,
    place: place,
  });
  vehicle.save((err, com) => {
    if (err) {
      return res.status(400).json({ err: "cannot save the data" });
    }
    res.json(com);
  });
});

router.get("/getall/:userId", isSignedIn, isAuthenticated, (req, res) => {
  Vehicle.find().exec((err, data) => {
    if (err || !data) {
      return res.status(400).json({
        err: "No details was found in DB",
      });
    }
    res.json(data);
  });
});

module.exports = router;
