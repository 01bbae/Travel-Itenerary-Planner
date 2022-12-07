const dotenv = require("dotenv");
dotenv.config();
const YelpData = require("./response.json");
const mysql = require("mysql2");
const express = require("express");
var bodyParser = require("body-parser");

const app = express();
var jsonParser = bodyParser.json();

app.get("/query", (req, res) => {
  res.json({
    // test data
    "01": "United States",
    "02": "United Kingdom",
    "03": "Aruba",
    "04": "United Kingdom",
  });
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
    username VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(20) NOT NULL
  )`);
  con.query(`CREATE TABLE IF NOT EXISTS location(
    location_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    address VARCHAR(100) NOT NULL
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

// const insertBusinessInDatabase = () => {
//   YelpData.businesses.forEach((element, index) => {
//     locationName = YelpData.businesses[index].name;
//     locationAddress = YelpData.businesses[index].location.address1;

//     con.query(`
//       INSERT INTO location (name, address)
//       VALUES (?)`, [[locationName, locationAddress]]);

//   });
// }

// insertBusinessInDatabase();

/* -------------------------API INTEGRATION----------------------------------------------- */

// Creating a route
app.post("/create-route", jsonParser, async (req, res) => {
  try {
    const origin = req.body.origin;
    const destination = req.body.destination;
    const type = req.body.type;

    console.log("Origin: ", origin);
    console.log("Destination: ", destination);
    console.log("Type: ", type);

    con.query(
      `
      INSERT INTO route (origin, destination, type)
      VALUES (?)`,
      [[origin, destination, type]]
    );

    res.status(500).json("Success");
  } catch (err) {
    res.status(500).json(err);
    console.log("ERROR");
  }
});

// Getting a route given id in parameter
app.get("/get-route/:id", jsonParser, async (req, res) => {
  try {
    console.log(req.params.id);
    con.query(
      `SELECT * FROM route
                WHERE route_id = ?;`,
      req.params.id,
      function (err, results) {
        if (err) throw err;
        console.log(results);
      }
    );

    res.status(500).json("Success");
  } catch (err) {
    res.status(500).json(err);
    console.log("Error with getting the route");
  }
});

// Delete a route given id in parameter
app.delete("/delete-route/:id", jsonParser, async (req, res) => {
  try {
    console.log(req.params.id);
    con.query(
      `DELETE FROM route
                WHERE route_id = ?;`,
      req.params.id,
      function (err, results) {
        if (err) throw err;
        console.log(results);
      }
    );

    res.status(500).json("Success");
  } catch (err) {
    res.status(500).json(err);
    console.log("Error with deleting the route");
  }
});

// Register new Account
app.post("/register", jsonParser, async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    console.log("username: ", email);
    console.log("password: ", password);

    con.query(
      `
      INSERT INTO route (username, password)
      VALUES (${mysql.escape(email)},${mysql.escape(password)})`,
      [[origin, destination, type]],
      (err, res, fields) => {}
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.log("ERROR");
    console.log(err);
    // return res.status(400).json({ success: false });
  }
});

// Login Functionality
app.post("/login", jsonParser, (req, res) => {
  try {
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    let login = false;

    if (username == null || password == null) {
      throw "Unsuccessful post from frontend: values null.";
    }

    con.query(
      `
      SELECT COUNT(*) AS Count FROM user
      WHERE username = ${mysql.escape(username)} AND password = ${mysql.escape(
        password
      )}`,
      (err, res, fields) => {
        console.log(res);
        if (err) {
          throw err;
        }
        if (res[0].Count > 0) {
          login = true;
          console.log("login successful");
        } else {
          console.log("login failed");
        }
      }
    );
    if (login) {
      return res.status(200).json({ login: true });
    } else {
      return res.status(400).json({ login: false });
    }
  } catch (err) {
    console.log("ERROR: unable to log in");
    console.log(err);
    // return res.status(400).json({ login: false });
  }
});

/* --------------------------------------------------------------------------------------- */

app.listen(5001, () => {
  console.log("Server started on port 5001");
});

// con.end((err) => {
//   if (err) throw err;
//   console.log("Disconnected!");
// });
