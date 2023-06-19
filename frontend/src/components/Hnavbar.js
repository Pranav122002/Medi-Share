import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Navigate, useLocation  } from "react-router-dom";
import "../css/Hnavbar.css";

export default function Hnavbar() {
  const [showNavbar, setShowNavbar] = useState(false);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
    console.log(showNavbar);
  };

  const navigate = useNavigate();
  
  return (
    <>
      {!["/signup", "/signin", "/", "/about-us"].includes(useLocation().pathname) ? (
        <>
          {" "}
          <div className="Lnav">
            <div className="Lnav_contents">
              <div
                className="logo"
                onClick={() => {
                  navigate("/home");
                }}
              >
                <img id="Nlogo" src="./logo1.png" alt="logo" />
                <h2>Medi-Share</h2>
              </div>
              <div className="icon" onClick={handleShowNavbar}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
              </div>
              <div className={`links ${showNavbar && "active"}`}>
                <Link className="aboutu" to="/AboutUs">
                  <span id="Aboutt" style={{ cursor: "pointer" }}>
                    About Us
                  </span>
                </Link>
                <Link className="aboutu" to="/profile">
                  <span id="nonev" style={{ cursor: "pointer" }}>
                    Profile
                  </span>
                  <img className="prof" src="./profile-pic.png" alt="" />
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
        <div className="Lnav">
            <div className="Lnav_contents">
              <div
                className="logo"
                onClick={() => {
                  navigate("/");
                }}
              >
                <img id="Nlogo" src="./logo1.png" alt="logo" />
                <h2>Medi-Share</h2>
              </div>
              <div className="icon" onClick={handleShowNavbar}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
              </div>
              <div className={`links ${showNavbar && "active"}`}>
                <Link className="aboutu" to="/about-us">
                  <span id="Aboutt" style={{ cursor: "pointer" }}>
                    About Us
                  </span>
                </Link>
                <Link className="aboutu" to="/signin">
                  <span style={{ cursor: "pointer" }}>
                    Join Us
                  </span>
                </Link>
              
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
