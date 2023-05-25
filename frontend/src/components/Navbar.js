import React, { useEffect, useState, useContext } from "react";
import "../css/Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Navbar({ login }) {
  const navigate = useNavigate();

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);


  const [showVNavbar, setShowVNavbar] = useState(!false)

  const handleShowVNavbar = () => {
    setShowVNavbar(!showVNavbar)
    console.log(showVNavbar)
  }


 
  const loginStatus = () => {
    return [
      <>
        <Link to="/donate-medicines">
          <li style={{color: "black"}} className="navli">Donate</li>
          <img className="navimg" src="./logo1.png" alt="" />
        </Link>
        <Link to="/request-medicines">
          <li style={{color: "black"}} className="navli">Request</li>
          <img className="navimg" src="./receive.png" alt="" />
        </Link>
        <Link to="/orders">
          <li style={{color: "black"}} className="navli">Orders</li>
          <img className="navimg" src="./box.png" alt="" />
        </Link>
        <Link to="/volunteer">
          <li style={{color: "black"}} className="navli">Volunteer</li>
          <img className="navimg" src="./volunteer.jpg " alt="" />
        </Link>
        {/* <Link to="/medicines">
          <li style={{color: "black"}} className="navli">Medicines</li>
        </Link> */}
        <Link to="/search-medicines">
          <li style={{color: "black"}} className="navli">Search Medicines</li>
          <img className="navimg" src="./medicine.png" alt="" />
        </Link>
        <Link to="/nearby-hospitals">
          <li style={{color: "black"}} className="navli">Nearby Hospitals</li>
          <img className="navimg" src="./hospital.png" alt="" />
        </Link>
        <Link to="/annoucements">
          <li style={{color: "black"}} className="navli">Annoucements</li>
          <img className="navimg" id="mega" src="./megaphone.png" alt="" />
        </Link>
        <Link to="/doctors">
          <li style={{color: "black"}} className="navli">Doctors</li>
        </Link>
        <Link to="/profile">
          <li style={{color: "black"}} className="navli">Profile</li>
          <img className="navimg" src="./profile.png" alt="" />
        </Link>
        <Link to="/chats">
          <li style={{color: "black"}} className="navli">Chats</li>
          <img className="navimg" src="./chat.png" alt="" />
        </Link>
        <Link to="/disease-predictions">
          <li style={{color: "black"}} className="navli">Disease Predictions</li>
          <img className="navimg" src="./campaign.png" alt="" />
        </Link>

        <Link to="/signin"
          onClick={() => {
            localStorage.clear();
            notifyB("Logout successfull...");
          }}
        >
          <li style={{ color: "red" }} className="navli">Log-Out</li>
          <img className="navimg" src="./logout.png" alt="" />
        </Link>
      </>,
    ];
  };

  return [
    <>
     
      <div  onClick={handleShowVNavbar}  className={`navbar ${showVNavbar && 'active'}`}>
        <div className="one">

          <img src="./pill2.png" alt="" />
          <h1>SERVICES</h1>
          <img id="arrow" src="./arrow.png" alt="" />
        </div>
        <div className="two"  >
          <ul className="nav-menu">{loginStatus()}</ul>
        </div>
      </div>
    </>,
  ];
}
