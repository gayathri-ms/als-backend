const express = require("express");
const {
  isAuthenticated,
  isSignedIn,
  getUserById,
} = require("../controllers/auth");
const router = express.Router();

const Loads = require("../models/loads");
const Company = require("../models/company");
const MonthlyIncome = require("../models/monthlyIncome");

router.param("userId", getUserById);

const datevalue = (val) => {
  const date = new Date(val);
  var dateObj = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  const month = dateObj.getMonth() + 1;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();
  const output = day + "-" + month + "-" + year;
  return output;
};

router.post("/addload/:userId", isSignedIn, isAuthenticated, (req, res) => {
  const {
    vehicle_no,
    load_date,
    rate,
    company,
    address,
    phone_no,
    no_loads_in,
    no_loads_out,
    total_rate_in,
    total_rate_out,
    extras,
    gst,
    gstamt,
    bill,
    amt_received,
    acc_holder,
  } = req.body;

  const date = new Date();
  // var dateObj = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  const month = date.getMonth() + 1;
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  const output = day + "-" + month + "-" + year;

  var date2 = new Date();
  date2.setDate(date.getDate() + 20);
  var duelocal = new Date(date2.getTime() - date2.getTimezoneOffset() * 60000);

  var total = Number(total_rate_in) + Number(total_rate_out) + Number(extras);

  var grandtotal = total;

  if (gst === "yes")
    grandtotal = grandtotal + Number(total * Number(gstamt) * 0.01);

  var maxi = 0;
  var totalGst = Number(grandtotal) - Number(total);

  var balance = Number(grandtotal) - Number(amt_received);

  MonthlyIncome.find({ month: month }).exec((err, data) => {
    if (err) {
      console.log("Failed to Update");
    }
    if (data.length) {
      MonthlyIncome.findByIdAndUpdate(
        { _id: data[0]._id },
        {
          $set: {
            totalIncome: data[0].totalIncome + Number(grandtotal),
            totalGst: data[0].totalGst + Number(totalGst),
            total: data[0].total + Number(grandtotal),
          },
        },
        { new: true, useFindAndModify: false },
        (err, data) => {
          console.log(data);
        }
      );
    } else {
      let maxim = 0;
      let total = 0;
      MonthlyIncome.find().exec((err, data) => {
        if (err) console.log(err);
        else data.map((d) => (d.invoice > maxim ? (maxim = d.invoice) : maxim));
        total = total + Number(grandtotal);
        const monthlyIncome = new MonthlyIncome({
          invoice: maxim + 1,
          month: month,
          totalIncome: grandtotal,
          totalGst: totalGst,
          total: grandtotal,
        });

        monthlyIncome.save((err, d) => console.log(d));
      });
    }
  });

  Company.find({ company_name: company }).exec((err, data) => {
    console.log("data", data);
    if (data.length === 0) {
      const company1 = new Company({
        company_name: company,
        address: address,
        phone: phone_no,
        rate: rate,
        fixed_date: output,
      });
      company1.save();
    }
  });
  var load = datevalue(load_date);
  Loads.find().exec((err, user) => {
    if (err) {
      return res.status(400).json({ error: "No user Found" });
    }
    user.map((u) => (maxi = maxi < u.invoice ? u.invoice : maxi));

    const loads = new Loads({
      invoice: maxi + 1,
      load_date: load,
      date: date,
      vehicle_no: vehicle_no,
      company: company,
      address: address,
      phone_no: phone_no,
      due_date: duelocal,
      dateformat: output,
      month: month,
      rate: rate,
      no_loads_in: no_loads_in,
      no_loads_out: no_loads_out,
      total_rate_in: total_rate_in,
      total_rate_out: total_rate_out,
      extras: extras,
      gst: gst,
      gstamt: gstamt,
      bill: bill,
      totalGst: totalGst,
      grandtotal: grandtotal,
      total: total,
      amt_received: amt_received,
      acc_holder: acc_holder,
      balance: balance,
      date_received: output,
    });

    loads.save((err, l) => {
      if (err) {
        return res.status(400).json({ error: "Error in the Form" });
      }
      res.json(l);
    });
  });
});

router.put("/updateload/:userId", isSignedIn, isAuthenticated, (req, res) => {
  const { invoice, amt, acc_holder } = req.body;

  const date = new Date();
  var dateObj = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  const month = dateObj.getMonth() + 1;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();
  const output = day + "-" + month + "-" + year;

  Loads.find({ invoice: invoice }).exec((err, data) => {
    if (err) {
      return res.status(400).json({ err: "Failed to Updated" });
    }
    console.log("data", data[0]._id);
    let amount = data[0].amt_received;
    amount = Number(amount) + Number(amt);
    let balance = data[0].grandtotal - Number(amount);
    console.log(
      "balance",
      balance,
      " amount",
      amount,
      " output",
      output,
      " acc",
      acc_holder
    );
    Loads.findByIdAndUpdate(
      { _id: data[0]._id },
      {
        $set: {
          amt_received: amount,
          balance: balance,
          acc_holder: acc_holder,
          date_received: output,
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

router.get("/getall/:userId", isSignedIn, isAuthenticated, (req, res) => {
  Loads.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({ err: "No Data Found" });
    }
    res.json(data);
  });
});

router.get("/total/:userId", isSignedIn, isAuthenticated, (req, res) => {
  let sum = 0;
  Loads.find().exec((err, users) => {
    if (err || !users) {
      return res.status(400).json({
        error: "no user was found in DB",
      });
    }
    console.log(users);
    users.map((item, i) => {
      console.log("balance", item.balance);
      if (item.balance) sum = sum + Number(item.balance);
    });
    console.log("total", sum);
    res.json({ total: sum });
  });
});
router.get("/totalGst/:userId", isSignedIn, isAuthenticated, (req, res) => {
  let sum = 0;
  Loads.find().exec((err, users) => {
    if (err || !users) {
      return res.status(400).json({
        error: "no user was found in DB",
      });
    }
    console.log(users);
    users.map((item, i) => {
      // console.log("balance", item.balance);
      if (item.totalGst) sum = sum + Number(item.totalGst);
    });
    console.log("total", sum);
    res.json({ totalGst: sum });
  });
});

router.get("/payment/:userId", isSignedIn, isAuthenticated, (req, res) => {
  Loads.aggregate([
    {
      $group: {
        _id: { company: "$company" },

        balance: { $sum: "$balance" },
      },
    },
  ])
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((err) => {
      console.log("error");
      res.status(400).json({ err: err });
    });
});

router.get("/duedate/:userId", isSignedIn, isAuthenticated, (req, res) => {
  let date = new Date();
  Loads.find().exec((err, data) => {
    if (err || !data) {
      return res.status(400).json({
        error: "no user was found in DB",
      });
    }
    let users = data.filter((d) => d.due_date <= date && d.balance !== 0);
    res.json(users);
  });
});

module.exports = router;
