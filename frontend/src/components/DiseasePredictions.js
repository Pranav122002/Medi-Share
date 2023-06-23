import React, { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";
import AOS from "aos";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import "../css/Dis.css";
function DiseasePredictions() {

  useEffect(() => {
    AOS.init({ duration: 600 });
  }, []);

  return (
    <div className="dispredd">
      <div className="chatfunc">
        <div className="chatcontc">
          <h1>Disease Predictions</h1>
          <p>
            Do a disease predicition now. We use Machine learning technology to
            extract the features from images to predict the chances of disease
            occurance.
          </p>
        </div>
        <img src="disssp.jpg" alt="" />
      </div>
      <div className="dis">
        <h2>Available disease prediction </h2>
        <div className="dise">
          <div  className="diseaa">
            <Link to="/generalpredict"  >
              <li className="Cnavli">Medi Doc</li>
              <img src="./brain-tunor.png" alt="" />
            </Link>
          </div>
          <div  className="diseaa">
            <Link to="/kidneystone"  >
              <li className="Cnavli">Kidney Stone</li>
              <img src="./brain-tunor.png" alt="" />
            </Link>
          </div>
          <div  className="diseaa">
            <Link to="/Pneumonia" >
              <li className="Cnavli">Pnuemonia</li>
              <img src="./pneumonia1.png" alt="" />
            </Link>
          </div>
          <div  className="diseaa">
            <Link to="/heartDisease"  >
              <li className="Cnavli">Heart Disease</li>
              <img src="./heart-disease1.png" alt="" />
            </Link>
          </div>
          <div  className="diseaa">
            <Link to="/chatbot"  >
              <li className="Cnavli">Medi Bot</li>
              <img src="./brain-tunor.png" alt="" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiseasePredictions;
