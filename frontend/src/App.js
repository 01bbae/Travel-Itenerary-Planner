import { Route, Routes } from "react-router-dom";
import "./App.css";
import Map from "./components/map/Map";
// import Header from './components/header/Header';
import Navbar from "./components/navbar/Navbar";
import Login from "./components/login/Login";

import React from "react";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
