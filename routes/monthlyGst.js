const express = require("express");
const {
  isAuthenticated,
  isSignedIn,
  getUserById,
} = require("../controllers/auth");
const router = express.Router();

const Loads = require("../models/loads");
const Company = require("../models/company");

router.param("userId", getUserById);

module.exports = router;
