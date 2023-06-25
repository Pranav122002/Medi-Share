import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import "../css/Medicine.css";
import { API_BASE_URL } from "../config";

export default function Request() {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    fetchMedicines();
  }, []);

  function fetchMedicines() {
    fetch(`${API_BASE_URL}/allmedicines`)
      .then((response) => response.json())
      .then((data) => setMedicines(data));
  }

  return (
    <div>
      <div className="bodyy">
        <div className="list">
          <ul>
            <li style={{ backgroundColor: "white", color: "black" }}>
              <h3>Medicine</h3>
              <h3 className="p1">Description</h3>
              <h3 className="p2">Disease</h3>
              <h3 className="p2">Action</h3>
            </li>

            {medicines.map((medicines) => (
              <li key={medicines.medicine_name}>
                <h3>{medicines.medicine_name}:</h3>
                <p className="p1">{medicines.description}</p>
                <p className="p2">{medicines.disease}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
