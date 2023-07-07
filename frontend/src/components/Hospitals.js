import React from "react";
// import MapContainer from "./GoogleMaps";
import { Hnavbar } from "./Hnavbar";
import Navbar from "./Navbar";
import "../css/Hospitals.css";

export default function Hospitals() {
  return (
    <div className="hospimain">
      <div>
        <div className="hospi">
          <div className="hospicontent">
            <div className="hosp">
              <h2>Nearby Hospitals</h2>
              <p>
                Need quick nearby hospital locations ? Seach for hospitals in
                your vicinity now.
              </p>
            </div>
            <img src="./hospital5.png" alt="" />
          </div>
        </div>

        <div className="mainmap">
          <div className="mapco">
            {/* <MapContainer /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
