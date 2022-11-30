import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <div className="navbar">
      <NavLink className="navbar-item" to='/'>
        Home
      </NavLink>
      <NavLink className="navbar-item" to='/saved'>
        Routes Saved
      </NavLink>
      <NavLink className="navbar-item" to='/login'>
        Login
      </NavLink>
    </div>
  );
}
