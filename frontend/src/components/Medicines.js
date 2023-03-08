import React, { useState, useEffect } from 'react';
// import "../css/Request.css";
import Navbar from "./Navbar";

export default function Request() {

    const [medicines, setMedicines] = useState([]);

    useEffect(() => {
      fetchMedicines();
    }, []);
  
    function fetchMedicines() {
      fetch('http://localhost:5000/allmedicines')
        .then(response => response.json())
        .then(data => setMedicines(data));
    }

    return (
      <div>
         <Navbar />
        <ul>
          {medicines.map(medicines => (
            <li key={medicines.medicine_name}> 
            <li>{medicines.medicine_name}</li>
            {medicines.description}</li>
          ))}
        </ul>
      </div>

      );
}
