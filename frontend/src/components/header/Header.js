import React from "react";
import Navbar from "../navbar/Navbar";
import "./header.css";

export default function Header() {
  return (
    <div className="header">
      <div className="header-top">
        <div className="header-top_logo">
          <a href="/" className="header-logo">
            Travel Itinerary
          </a>
        </div>
        <div className="header-top_navbar">
          <Navbar />
        </div>
      </div>

      <div className="header-bottom">
        {/* <div className="header-location">Location</div> */}
      </div>
    </div>
  );
}
