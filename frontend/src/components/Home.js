import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import "../css/Home.css"


export default function Home() {
  return (
    <div>



      <Hnavbar />
      <Navbar />
      <div className="images">

        <Link to="/donate">
          <div className="image">
            <img src="./donate.png" alt="" />

            <h1>DONATE</h1>
          </div>
        </Link>


        <Link to="/request">
          <div className="image">
            <h2>REQUEST</h2>
            <img src="./receive.png" alt="" />
          </div>
        </Link>


        <Link to="/volunteer">
          <div className="image">
            <img src="./vollunteer.png" alt="" />
            <h1>VOLUNTEER</h1>
          </div>
        </Link>

      </div>
    </div>
  );
}
