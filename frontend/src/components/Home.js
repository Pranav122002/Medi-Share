import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";

export default function Home() {
  return (
    <div>
      <Hnavbar />
      <Navbar />
    </div>
  );
}
