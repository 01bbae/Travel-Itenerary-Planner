import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Map from "./components/map/Map";
// import Header from './components/header/Header';
import Navbar from "./components/navbar/Navbar";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import RouteSaved from "./components/routesaved/RouteSaved";

const App = () => {
  const [userID, setUserID] = useState(null);
  useEffect(() => {
    console.log("From Parent Component " + userID);
    // return () => {
    //   second;
    // };
  }, [userID]);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Map />} />
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
        <Route path="/routes" element={<RouteSaved />} />
      </Routes>
    </div>
  );
};

export default App;
