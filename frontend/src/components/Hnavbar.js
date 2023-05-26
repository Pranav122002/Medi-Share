import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import {useState } from "react";
import { Navigate } from 'react-router-dom';
import "../css/Hnavbar.css"
export const Hnavbar = () => {
  const [showNavbar, setShowNavbar] = useState(false)

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar)
    console.log(showNavbar)
  }


  const navigate = useNavigate();
  const goHome = () => {
    navigate('/home')
  }
  return ( 
    <>
   <div className='Lnav'>
        <div className='Lnav_contents'>
          <div className="logo" onClick={() => { goHome() }}>

            <img id="Nlogo" src="./logo1.png" alt="logo" />
            <h2>Medi-Share</h2>
          </div>
          <div className='icon' onClick={handleShowNavbar}>
            <div className='line'></div>
            <div className='line'></div>
            <div className='line'></div>
          </div>
          <div className={`links ${showNavbar && 'active'}`}>
            <Link className="aboutu" to="/AboutUs">
              <span id="Aboutt" style={{ cursor: "pointer" }}>About Us</span>
            </Link>
            <Link className="joinus" to="/signin">
              <span id="joinus" style={{ cursor: "pointer" }}>Join Us</span>
            </Link>
          </div>

        </div>
      </div>
      </>
  )
}
