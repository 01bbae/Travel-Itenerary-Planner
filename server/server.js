import dotenv from "dotenv";
dotenv.config();
import YelpData from "./response.json" assert { type: "json" };
import mysql from "mysql2";
import express from "express";
import bodyParser from "body-parser";
import e from "express";
// import RegisterException from "./exceptions/RegisterException.mjs";
// const data_exporter = require('json2csv').Parser;

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
    alias VARCHAR(100) NOT NULL,
    address VARCHAR(100) NOT NULL
  )`);
  con.query(`CREATE TABLE IF NOT EXISTS map(
    map_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
  )`);
  con.query(`CREATE TABLE IF NOT EXISTS route(
    route_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    origin INT NOT NULL,
    destination INT NOT NULL,
    type VARCHAR(20) NOT NULL,
    map_id INT NOT NULL,
    FOREIGN KEY (origin) REFERENCES location(location_id),
    FOREIGN KEY (destination) REFERENCES location(location_id),
    FOREIGN KEY (map_id) REFERENCES map(map_id)
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

createTables();


// PROCEDURE CREATED IN DATAGRIP
// const createUserAndMapProcedure = () => {
//   con.query(`
//   delimiter $$
//   CREATE Procedure addUserAndMap(IN username VARCHAR(20), IN password VARCHAR(20))
//   BEGIN
//     INSERT INTO user (username, password)
//     VALUES (username, password);
//     SELECT @lastID := LAST_INSERT_ID();
//     INSERT INTO map (user_id)
//     VALUES (@lastID);
//   END$$
//   delimiter ;
//   `);
// };

// createUserAndMapProcedure();

function insertBusinessInDatabase(){
  YelpData.businesses.forEach((element, index) => {
    let locationName = element.name;
    let locationAlias = element.alias;
    let locationAddress = element.location["full_address"];

    con.query(`
      INSERT INTO location (name, alias, address)
      VALUES (?)`, [[locationName, locationAlias, locationAddress]]);

  });

  console.log("Inserted locations into database");
}
// ONLY RUN ONCE TO INSERT LOCATIONS
// insertBusinessInDatabase();

/* -------------------------API INTEGRATION----------------------------------------------- */

// Creating a route for user_id
app.post("/route/", jsonParser, async (req, res) => {
  try {
    const origin = req.body.origin;
    const destination = req.body.destination;
    const type = req.body.type;
    const map_id = req.body.map_id;
    
    if (map_id == null){
      throw "MapID is null in /route/";
    }

    console.log("Origin: ", origin);
    console.log("Destination: ", destination);
    console.log("Type: ", type);
    console.log("map_id: ", map_id);

    con.beginTransaction(function(err) {
      if (err) { throw err; }
        con.query(
          `
          INSERT INTO route (origin, destination, type, map_id)
          VALUES (?)`,
          [[origin, destination, type, map_id]]
        );
    });

    console.log("Added route to the queue. Either click the commit/undo button to add/remove it from the queue.");
    res.status(200).json("Success");
  } catch (err) {
    res.status(500).json(err);
    console.log("ERROR");
  }
});

app.get("/rollback", jsonParser, async (req, res) => {
  try {
    con.rollback();
    console.log("Successfully rollbacked");
    res.status(200).json("Success");
  } catch (err) {
    res.status(500).json(err);
    console.log("Error with getting the route");
  }
});

app.get("/commit", jsonParser, async (req, res) => {
  try {
    con.commit();
    res.status(200).json("Successfully committed");
    console.log("Succesfully committed");
  } catch (err) {
    res.status(500).json(err);
    console.log("Error with getting the route");
  }
});

// Getting a route given userID
app.get("/route/user_id=:user_id", jsonParser, async (req, res) => {
  try {
    if (req.params.user_id != null) {
      console.log("GETTING Route given USERID ")
      con.query(
        `SELECT route_id, l1.location_id AS origin_id, l1.name AS origin_name,l2.location_id AS destination_id, l2.name AS destination_name
        FROM (((user INNER JOIN map ON user.user_id = map.user_id)
            INNER JOIN route ON map.map_id = route.map_id)
            INNER JOIN location AS l1 ON l1.location_id = route.origin)
            INNER JOIN location AS l2 ON l2.location_id = route.destination
        WHERE user.user_id = ?;`,
        req.params.user_id,
        function (err, results) {
          if (err) throw err;
          console.log(results);
          return res.status(200).json(results);
        }
      );
    }else{
      throw "NULL user_id"
    }
  } catch (err) {
    console.log("Error with getting the route");
    console.log(err);
    return res.status(500).json(err);
  }
});

app.delete("/route/map_id=:map_id/route_id=:route_id", jsonParser, async (req, res) => {
  try{
    console.log("Deleting Route from User")
      con.query(
        `DELETE FROM route
        WHERE map_id = ? AND route_id = ?;`,
        [req.params.map_id, req.params.route_id],
        function (err, results) {
          if (err) throw err;
          console.log(results);
          return res.status(200).json(results);
        }
      );

  }catch(err){
    console.log(err);

  }
})

// Getting a map givenn userid
app.get("/get-user-mapID/user_id=:user_id", jsonParser, async (req, res) => {
  try {
    if (req.params.user_id != null) {
      console.log("Getting MAP ID OF USER");
      con.query(
        `SELECT map_id
        FROM map
        WHERE user_id = ?;`,
        req.params.user_id,
        function (err, results) {
          if (err) throw err;
          console.log(results);
          return res.status(200).json(results[0]);
        }
      );
    }else{
      throw "NULL user_id"
    }
  } catch (err) {
    console.log("Error with getting the route");
    console.log(err);
    return res.status(500).json(err);
  }
});

app.get("/get-location-id/:locationAlias", jsonParser, async (req, res) => {
  try {
    console.log(req.params.locationAlias);
    con.query(
      `SELECT location_id FROM location
                WHERE alias = ?;`,
      req.params.locationAlias,
      function (err, results) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        res.status(200).send({
          location_id: results,
        });
      }
    );

    // res.status(200).json("Success");
  } catch (err) {
    res.status(500).json(err);
    console.log("Error with getting the route");
  }
});

app.get(
  "/get-location-address/:locationAlias",
  jsonParser,
  async (req, res) => {
    try {
      console.log(req.params.id);
      con.query(
        `SELECT address FROM location
                WHERE alias = ?;`,
        req.params.locationAlias,
        function (err, results) {
          if (err) throw err;
          console.log(results);
          res.status(200).send({
            address: results,
          });
        }
      );
    } catch (err) {
      res.status(500).json(err);
      console.log("Error with getting the route");
    }
  }
);

// // Delete a route given id in parameter
// app.delete("/delete-route/:id", jsonParser, async (req, res) => {
//   try {
//     console.log(req.params.id);
//     con.query(
//       `DELETE FROM route
//                 WHERE route_id = ?;`,
//       req.params.id,
//       function (err, results) {
//         if (err) throw err;
//         console.log(results);
//       }
//     );

//     res.status(500).json("Success");
//   } catch (err) {
//     res.status(500).json(err);
//     console.log("Error with deleting the route");
//   }
// });

// Register new Account
app.post("/register", jsonParser, (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (username == null || password == null) {
      throw "Unsuccessful post from frontend: value(s) null.";
    }

    con.query(
      `
      CALL addUserAndMap(${mysql.escape(username)}, ${mysql.escape(password)})`,
      (err, result, fields) => {
        if (err) {
          if (err.code == "ER_DUP_ENTRY") {
            return res.status(300).json({ success: false, exists: true });
          }
          throw err;
        }
        console.log(result);
        return res.status(200).json({ success: true });
      }
    );
  } catch (err) {
    console.log("ERROR");
    console.log(err);
    return res.status(300).json({ success: false, exists: false });
  }
});

// Login Functionality
app.post("/login", jsonParser, async (req, res) => {
  try {
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    let login = false;

    if (username == null || password == null) {
      throw "Unsuccessful post from frontend: value(s) null.";
    }

    // query for matching username and password and return user_id (if exists) and count of matching users
    con.query(
      `
      SELECT user_id, COUNT(*) AS Count FROM user
      WHERE username = ${mysql.escape(username)} AND password = ${mysql.escape(
        password
      )}`,
      (err, result, fields) => {
        console.log(result);
        if (err) {
          throw err;
        }
        if (result[0].Count > 0) {
          console.log("login successful");
          return res
            .status(200)
            .json({ login: true, userID: result[0].user_id });
        } else {
          console.log("login failed");
          return res.status(400).json({ login: false });
        }
      }
    );
    // console.log(login);
    // if (login) {
    //   return res.status(200).json({ login: true });
    // } else {
    //   return res.status(400).json({ login: false });
    // }
  } catch (err) {
    console.log("ERROR: unable to log in");
    console.log(err);
  }
});

// Export functionality
app.get('/export', function(request, response, next){
  con.query('SELECT * FROM route', function(error, data){

    var mysql_data = JSON.parse(JSON.stringify(data));
    //convert JSON to CSV Data
    var file_header = ['route_id', 'origin', 'destination', 'type'];

    var json_data = new data_exporter({file_header});

    var csv_data = json_data.parse(mysql_data);

    response.setHeader("Content-Type", "text/csv");

    response.setHeader("Content-Disposition", "attachment; filename=routes.csv");

    response.status(200).end(csv_data);

  });

});


/* --------------------------------------------------------------------------------------- */

app.listen(5001, () => {
  console.log("Server started on port 5001");
});

// con.end((err) => {
//   if (err) throw err;
//   console.log("Disconnected!");
// });
