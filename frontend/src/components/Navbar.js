import React, { useEffect, useState, useContext } from "react";
import "../css/Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Navbar({ login }) {
  const navigate = useNavigate();

  const loginStatus = () => {
    return [
      <>
        <Link to="/donate">
          <li>Donate</li>
        </Link>
        <Link to="/request">
          <li>Request</li>
        </Link>
        <Link to="/volunteer">
          <li>Volunteer</li>
        </Link>
        <Link to="/medicines">
          <li>Medicines</li>
        </Link>
        <Link to="/search">
          <li>Search</li>
        </Link>
        <Link to="/campaigns">
          <li>Campaigns</li>
        </Link>
        <Link to="/profile">
          <li>Profile</li>
        </Link>
        <Link to="/chat">
          <li>Chat</li>
        </Link>
        <Link to="/disease_prediction">
          <li>Disease Prediction</li>
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
