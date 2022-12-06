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
    "04": "United Kingdom",
  });
});

app.listen(5001, () => {
  console.log("Server started on port 5000");
});

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "travel",
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
    user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_username VARCHAR(20) UNIQUE NOT NULL,
    user_password VARCHAR(20) NOT NULL
  )`);
  con.query(`CREATE TABLE IF NOT EXISTS location(
    location_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    address VARCHAR(40) NOT NULL
  )`);
  con.query(`CREATE TABLE IF NOT EXISTS route(
    route_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    origin INT NOT NULL,
    destination INT NOT NULL,
    type VARCHAR(20) NOT NULL,
    FOREIGN KEY (origin) REFERENCES location(location_id),
    FOREIGN KEY (destination) REFERENCES location(location_id)
  )`);
  con.query(`CREATE TABLE IF NOT EXISTS map(
    map_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    route_id INT,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (route_id) REFERENCES route(route_id)
  )`);
  con.query(`CREATE TABLE IF NOT EXISTS review(
    review_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    location_id INT NOT NULL,
    review VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (location_id) REFERENCES location(location_id)
  )`);
  console.log("Created tables");
};

// const addUserAndMap = (username, password) => {
//   con.query(`
//   delimiter $$
//   CREATE Procedure addUserAndMap()
//   BEGIN
//     INSERT INTO user (user_username, user_password)
//     VALUES (${username}, ${password});
//     SELECT @lastID := LAST_INSERT_ID();
//     INSERT INTO map (user_id)
//     VALUES (@lastID);
//   END$$
//   delimiter ;
//   `);
// };
createTables();

// YelpData.businesses.forEach((element, index) => {
//   con.query(`
//   delimiter $$
//   CREATE Procedure addUserAndMap()
//   BEGIN
//     INSERT INTO user (user_username, user_password)
//     VALUES (${element.name}, ${element.location.address1});
//     SELECT @lastID := LAST_INSERT_ID();
//     INSERT INTO map (user_id)
//     VALUES (@lastID);
//   END$$
//   delimiter ;
//   `);
// });

con.end((err) => {
  if (err) throw err;
  console.log("Disconnected!");
});
