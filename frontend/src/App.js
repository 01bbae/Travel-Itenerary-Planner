import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Map from "./components/map/Map";
// import Header from './components/header/Header';
import Navbar from "./components/navbar/Navbar";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import RouteSaved from "./components/routesaved/RouteSaved";

import response from "./response.json";


const App = () => {
  const [userID, setUserID] = useState(null);
  useEffect(() => {
    console.log("From Parent Component: User ID is " + userID);
  }, [userID]);


  const createLocationDropdown = () => {
    let locationDropdown = [];
    response.businesses.map((element, index) => {
      locationDropdown.push(
        <option id={index} value={element.alias}>
          {element.name}
        </option>
      );
    });
    return locationDropdown;
  };

  const createModesDropdown = () => {
    let modesDropdown = [];
    var modeArrNames = ["DRIVING", "TRANSIT"]
    modeArrNames.map((element, index) =>
      modesDropdown.push( 
      <option id={index} value={element}>
        {element}
      </option> 
    ));
    return modesDropdown;
  };

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Map createLocationDropdown={createLocationDropdown} createModesDropdown={createModesDropdown} userID={userID}/>} />
        <Route
          path="/login"
          element={
            <Login
              sendUserID={(userID) => {
                setUserID(userID);
              }}
            />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/routes" element={<RouteSaved createLocationDropdown={createLocationDropdown} createModesDropdown={createModesDropdown} userID={userID}/>} />
      </Routes>
    </div>
  );
};

export default App;
