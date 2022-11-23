const dotenv = require("dotenv");
dotenv.config(); 
const mysql = require('mysql2');
const express = require('express')

const app = express()

app.get("/",(req,res) => {
  res.json({/* some json here */})
})



var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASSWORD
  });
  
  con.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
  });
  con.end((err) => {
    if (err) throw err;
    console.log("Disconnected!")
  })
  