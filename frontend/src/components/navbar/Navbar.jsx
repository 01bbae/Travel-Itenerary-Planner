import React from "react";
import "./navbar.css";

export default function Navbar() {
  return (
    <div className="navbar">
      <a href="/" className="navbar-item">
        Home
      </a>
      <a href="/locationSaved" className="navbar-item">
        Locations Saved
      </a>
    </div>
  );
}
