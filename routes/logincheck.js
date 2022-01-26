const express = require("express");
const { check } = require("express-validator");
const { signin, signup, signout, getUserById } = require("../controllers/auth");
const router = express.Router();

router.param("Id", getUserById);
router.post("/login", signin);
router.post(
  "/signup",
  [
    check("username", "name should be min 3 char").isLength({ min: 3 }),
    check("email", "email should be a valid one").isEmail(),
    check("password", "password should be min 3 char").isLength({ min: 3 }),
  ],
  signup
);
router.delete("/signout", signout);

module.exports = router;
