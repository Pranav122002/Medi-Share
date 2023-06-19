import React from "react";
import MapContainer from "./Map";
import { Hnavbar } from "./Hnavbar";
import Navbar from "./Navbar";
import "../css/Hospitals.css";

export default function Hospitals() {
  return (
    <div className="hospimain">
      <div>
        <div className="hospi">
          <h1>Hospitals</h1>
          <div className="hospicontent">
            <img src="./hospitals.png" alt="" />
            <div className="hosp">
              <p>Need quick nearby hospital locations ?</p>
              <p>Seach for hospitals in your vicinity now.</p>
            </div>
          </div>
        </div>
        <div className="mainmap">
          <MapContainer />
        </div>
      </div>
    </div>
  );
}
