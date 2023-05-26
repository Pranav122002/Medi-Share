import React from 'react';
import MapContainer from './Map';
import { Hnavbar } from './Hnavbar';
import Navbar from './Navbar';
import '../css/Hospitals.css';

export default function Hospitals() {
  return (
    <div>
      <Hnavbar />
      <div>
        <Navbar />
        <h1>Hospitals</h1>
        <MapContainer />
      </div>
    </div>
  );
}
