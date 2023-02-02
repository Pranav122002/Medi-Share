import React, { useEffect, useState, useContext } from "react";
import logo from "../img/logo.png";
import "../css/Navbar.css";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { useNavigate } from "react-router-dom";
import {
  exploreOutline,
  exploreFill,
  homeFill,
  homeOutline,
  likeFillBlack,
  likeFillRed,
  likeOutline,
  messageFill,
  messageOutline,
  createPostOutline,
  createPostFill,
  searchBarIcon,
  searchIconFill,
  searchIconOutline,
} from "./SvgIcons";

export default function Navbar({ login }) {
  const navigate = useNavigate();
  const { setModalOpen } = useContext(LoginContext);
  const location = useLocation();
  const [onHome, setOnHome] = useState(false);
  const [onSearch, setOnSearch] = useState(false);
  const [onChat, setOnChat] = useState(false);
  const [onCreatePost, setOnCreatePost] = useState(false);
  const [onExplore, setOnExplore] = useState(false);
  const [onLike, setOnLike] = useState(false);




  useEffect(() => {
    setOnHome(location.pathname === "/");
    setOnSearch(location.pathname === "/search");
    setOnChat(location.pathname === "/messenger");
    setOnCreatePost(location.pathname === "/createPost");
    setOnExplore(location.pathname === "/followingpost");
    setOnLike(location.pathname === "/notifications");
  }, [location]);

  const loginStatus = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {
      return [
        <>
         

          <NavLink to="/donate">
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
