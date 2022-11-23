const dotenv = require("dotenv");
dotenv.config();
const YelpData = require("./response.json");
const mysql = require("mysql2");
const express = require("express");

const app = express();

app.get("/query", (req, res) => {
  res.json({
    // test data
    "01": "United States",
    "02": "United Kingdom",
    "03": "Aruba",
    "04": "United Kingdom"
  });
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PASSWORD,
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});
con.end((err) => {
  if (err) throw err;
  console.log("Disconnected!");
});
