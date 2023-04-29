import React, { useEffect, useState, useContext } from "react";
import "../css/Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Navbar({ login }) {
  const navigate = useNavigate();

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const loginStatus = () => {
    return [
      <>
        <Link to="/donate">
          <li style={{color: "black"}} className="navli">Donate</li>
        </Link>
        <Link to="/request">
          <li style={{color: "black"}} className="navli">Request</li>
        </Link>
        <Link to="/volunteer">
          <li style={{color: "black"}} className="navli">Volunteer</li>
        </Link>
        {/* <Link to="/medicines">
          <li style={{color: "black"}} className="navli">Medicines</li>
        </Link> */}
        <Link to="/search-medicines">
          <li style={{color: "black"}} className="navli">Search Medicines</li>
        </Link>
        <Link to="/nearby-hospitals">
          <li style={{color: "black"}} className="navli">Nearby Hospitals</li>
        </Link>
        <Link to="/annoucements">
          <li style={{color: "black"}} className="navli">Annoucements</li>
        </Link>
        <Link to="/profile">
          <li style={{color: "black"}} className="navli">Profile</li>
        </Link>
        <Link to="/chat">
          <li style={{color: "black"}} className="navli">Chat</li>
        </Link>
        <Link to="/disease-predict">
          <li style={{color: "black"}} className="navli">Disease Prediction</li>
        </Link>

        <Link to="/signin"
          onClick={() => {
            localStorage.clear();
            notifyB("Logout successfull...");
          }}
        >
          <li style={{ color: "red" }} className="navli">Log-Out</li>
        </Link>
      </>,
    ];
  };

  return [
    <>
      <div className="navbar">
        <div className="one"></div>
        <div className="two">
          <ul className="nav-menu">{loginStatus()}</ul>
        </div>
      </div>
    </>,
  ];
}
