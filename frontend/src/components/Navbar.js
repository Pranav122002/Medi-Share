import React, { useEffect, useState, useContext } from "react";
import "../css/Navbar.css";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { useNavigate } from "react-router-dom";


export default function Navbar({ login }) {
  const navigate = useNavigate();
  const { setModalOpen } = useContext(LoginContext);
  const { setVolModalOpen } = useContext(LoginContext);
  const location = useLocation();
  const [onHome, setOnHome] = useState(false);
  const [onRequest, setOnRequest] = useState(false);
  const [isVol, setVol] = useState(false)
  const [onLike, setOnLike] = useState(false);


  useEffect(() => {
    setOnHome(location.pathname === "/");
    
    setOnLike(location.pathname === "/request");
    // setOnChat(location.pathname === "/messenger");
    // setOnCreatePost(location.pathname === "/createPost");
    // setOnExplore(location.pathname === "/followingpost");
    // setOnLike(location.pathname === "/notifications");

  }, [location]);

  const loginStatus = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {
      return [
        <>

          <img
            id="logo-top"
            src={logo}
            alt=""
            onClick={() => {
              navigate("/");
            }}
          />
          <NavLink to="/Donatepage">
            <li>

              Donate
            </li>
          </NavLink>

          <NavLink to="/request">
            <li>
              
            Request
            </li>
          </NavLink>

          <NavLink to="/volunteer">
            <li>
              
            Volunteer
            </li>
          </NavLink>


          
        </>,
      ];
    } else {
      return [<></>];
    }
  };



  const token = localStorage.getItem("jwt");
  if (login || token) {
    return [
      <>
        <div className="navbar">
          <div className="one">

          </div>
          <div className="two">
            <ul className="nav-menu">{loginStatus()}</ul>
          </div>
        </div>

      </>,
    ];
  } else {
    return [<></>];
  }
}
