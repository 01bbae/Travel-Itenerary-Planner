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
  database: travel
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

// const createDB = (callback) => {
//   con.query('CREATE DATABASE travel', (err, res) => {
//     if(err) {
//       console.log(err);
//       callback(err, null);
//     }else{
//       callback(null, res);
//     }
//   });
//   // con.query('USE travel');
//   console.log("Database travel created!")
// }
const createTables = () => {
  // using backticks for template literals
  con.query(`CREATE TABLE IF NOT EXISTS user(
    user_id INT NOT NULL AUTO INCREMENT PRIMARY KEY,
    user_username VARCHAR(20) UNIQUE NOT NULL,
    user_password VARCHAR(20) NOT NULL
  )`);
  con.query(`CREATE TABLE IF NOT EXISTS map(
    map_id INT NOT NULL AUTO INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    route_id INT
  )`);
  con.query(`CREATE TABLE IF NOT EXISTS routes(
    route_id INT NOT NULL AUTO INCREMENNT PRIMARY KEY,
    location_id INT,
    location_position INT
  )`);
}

const addUserAndMap = (username, password) => {
  con.query(`
  delimiter $$ 
  CREATE Procedure addUserAndMap()
  BEGIN
    INSERT INTO user (user_username, user_password)
    VALUES (${username}, ${password});
    SELECT @lastID := LAST_INSERT_ID();
    INSERT INTO map (user_id)
    VALUES (@lastID);
  END$$
  delimiter ;
  `)
}
createTables;

con.end((err) => {
  if (err) throw err;
  console.log("Disconnected!");
});
