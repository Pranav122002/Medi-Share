import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import "../css/Hnavbar.css"
export const Hnavbar = () => {
    const navigate = useNavigate();
    const goHome = () => {
        navigate('/home')
    }
  return (

    
    <>
    <div className="Hnavbar">
        <img id="Nlogo" onClick={()=>{goHome()}} src="./logo1.png" alt="logo" />
        <h2>Medi Share</h2>
        <Link className="aboutus" to="/AboutUs">
          <span id="About" style={{ cursor: "pointer" }}>About Us</span>
        </Link>
      </div>
    </>
  )
}
