import React, { useState } from 'react';

import { Link, useLocation } from "react-router-dom";

import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import "../css/Dis.css";
function DiseasePredictions() {

  return (
    <div >
      <Hnavbar />

      <Navbar />
      <div className="chatfunc">
        <div className="chatcont">
          <h1>Disease Predictions</h1>
          <p>
            Do a disease predicition now. We use Machine learning technology to extract the features from images to predict the chances of disease occurance.

          </p>
        </div>
        <img src="diseases.png" alt="" />
      </div>
      <div className='dis'>
        <h2>Available disease prediction </h2>
        <div className='dise'>
          <Link to="/diabetes">
            <li className="Cnavli" >Diabetes</li>
            <img src="./daibetes.png" alt="" />
          </Link>
          <Link to="/Pneumonia">
            <li className="Cnavli" >Pnuemonia</li>
            <img src="./lungs.png" alt="" />
          </Link>
          <Link to="/heartDisease">
            <li className="Cnavli" >Heart Disease</li>
            <img src="./heart.png" alt="" />
          </Link>
          <Link to="/brainTumor">
            <li className="Cnavli" >Brain Tumor</li>
            <img src="./brain.png" alt="" />
          </Link>
        </div>
      </div>

    </div>
  );
}




export default DiseasePredictions;
