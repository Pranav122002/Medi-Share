import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      Home
    </div>
  );
}
