import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <NavLink className="navbar-item" to="/">
        Home
      </NavLink>
      <NavLink className="navbar-item" to="/routes">
        Saved Routes
      </NavLink>
      <NavLink className="navbar-item" to="/login">
        Login
      </NavLink>
    </div>
  );
};

export default Navbar;
