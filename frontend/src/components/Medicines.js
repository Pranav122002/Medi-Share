import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";

export default function Request() {

  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    fetchMedicines();
  }, []);

  function fetchMedicines() {
    fetch("http://localhost:5000/allmedicines")
      .then((response) => response.json())
      .then((data) => setMedicines(data));
  }

  return (
    <div>
      <Hnavbar />
      <Navbar />
      <ul>
        {medicines.map((medicines) => (
          <li key={medicines.medicine_name}>
            {" "}
            <h3>{medicines.medicine_name}</h3> <br /> <br />{" "}
            {medicines.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
