import React, { useEffect } from "react";
import AOS from "aos";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hnavbar } from "./Hnavbar";
import Navbar from "./Navbar";
import "../css/Aboutus.css";
import { Link } from "react-router-dom";

export const AboutUs = () => {
  const [showNavbar, setShowNavbar] = useState(false);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
    console.log(showNavbar);
  };

  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="abou">
      <div className="Lnav">
        <div className="Lnav_contents">
          <div
            className="logo"
            onClick={() => {
              goHome();
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
            <Link className="joinus" to="/signIn">
              <span id="joinus" style={{ cursor: "pointer" }}>
                Join Us
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="aboutus">
        <h1>About us</h1>
        <p>
          We are a passionate and dedicated team that has come together to build
          an extraordinary project. With a shared vision and diverse expertise,
          we have collaborated tirelessly to create something truly remarkable.
          Our team comprises individuals from various backgrounds, including
          software development, ui ux design, and project hosting , ML
          enthusiast each bringing unique skills and perspectives to the table.
        </p>
        <div className="Aboutimage">
          <div className="imageee">
            <img src="pranav.jpeg" alt="img" srcset="" />
            <h2>Pranav Patil</h2>
          </div>
          <div className="imageee">
            <img src="sam.jpeg" alt="" srcset="" />
            <h2>Samuel Padmadan</h2>
          </div>
          <div className="imageee">
            <img src="./paul.jpg" alt="img" srcset="" />
            <h2>Paul Crescent Palanisamy</h2>
          </div>
          <div className="imageee">
            <img src="aditya.jpeg" alt="img" srcset="" />
            <h2>Aditya Patil</h2>
          </div>
        </div>
      </div>
    </div>
  );
};
