const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid").v1;

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  encry_password: {
    type: String,
    required: true,
  },
  salt: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: Number,
    default: 0,
  },
});

user
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securedPassword(password);
  })
  .get(function () {
    this._password;
  });
user.methods = {
  authentication: function (plan_password) {
    return this.securedPassword(plan_password) === this.encry_password;
  },

  securedPassword: function (plan_password) {
    if (!plan_password) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plan_password)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", user);
