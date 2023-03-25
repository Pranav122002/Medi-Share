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
    <div className="Hnavb">
    <div  className="Hnavbar">
      <div   className="logo" onClick={()=>{goHome()}}>

        <img id="Nlogo" src="./logo1.png" alt="logo" />
        <h2>Medi-Share</h2>
      </div>
        <Link className="aboutus" to="/AboutUs">
          <span id="About" style={{ cursor: "pointer" }}>About Us</span>
        </Link>
      </div>
      </div>
    </>
  )
}
