require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/logincheck");
const bodyParser = require("body-parser");
const companyRouter = require("./routes/company");
const vehicleRouter = require("./routes/vehicle");
const loadRouter = require("./routes/loads");
const spareRouter = require("./routes/spares");
const dieselRouter = require("./routes/diesel");
const petrolRouter = require("./routes/petrol");
const insuranceRouter = require("./routes/insurance");
const fcRouter = require("./routes/fc");
const labourRouter = require("./routes/labour");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/company", companyRouter);
app.use("/vehicle", vehicleRouter);
app.use("/load", loadRouter);
app.use("/spare", spareRouter);
app.use("/diesel", dieselRouter);
app.use("/petrol", petrolRouter);
app.use("/insurance", insuranceRouter);
app.use("/fc", fcRouter);
app.use("/labour", labourRouter);

mongoose
  .connect("mongodb://localhost:27017/test")
  .then(() => {
    console.log("db is connected");
  })
  .catch(() => {
    console.log("db not connected");
  });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// app.use("/users", user);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// app.listen(PORT, () => console.log(`Running in port${PORT}..`));

module.exports = app;
