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
        <Link to="/pnuemonia">
          <li style={{color: "black"}} className="navli">Pnuemonia</li>
        </Link>
        <Link to="/heart-disease">
          <li style={{color: "black"}} className="navli">Heart Disease</li>
        </Link>
        <Link to="/cancer">
          <li style={{color: "black"}} className="navli">Cancer</li>
        </Link>
      </div>

    </div>
  );
}




export default DiseasePredictions;
