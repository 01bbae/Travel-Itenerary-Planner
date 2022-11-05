
const mysql = require('mysql2');
const secret = require('./secret.json');
const express = require('express')

app.get("/",(req,res) => {
  res.json({/* some json here */})
})



var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: secret.mysql_password
  });
  
  con.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
  });
  con.end((err) => {
    if (err) throw err;
    console.log("Disconnected!")
  })
  