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
      <div className='dis'>

     <Link to="/diabetes">
          <li style={{color: "black"}} className="navli">Diabetes</li>
        </Link>
        <Link to="/Pneumonia">
          <li style={{color: "black"}} className="navli">Pnuemonia</li>
        </Link>
        <Link to="/heartDisease">
          <li style={{color: "black"}} className="navli">Heart Disease</li>
        </Link>
        <Link to="/brainTumor">
          <li style={{color: "black"}} className="navli">Brain Tumor</li>
        </Link>
      </div>

    </div>
  );
}




export default DiseasePredictions;
