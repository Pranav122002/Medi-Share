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

  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const [user, setUser] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("./signup");
    } else {
      fetch(
        `http://localhost:5000/user/${
          JSON.parse(localStorage.getItem("user"))._id
        }`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
        .then((res) => res.json())
        .then((result) => {
          setUser(result.user);
        });
    }
  }, []);

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
          <NavLink to="/">
            <li>
              {" "}
              <span className="spanicon">
                {!onHome ? homeOutline : homeFill}{" "}
              </span>{" "}
              Home
            </li>
          </NavLink>

          <NavLink to="/search">
            <li>
              {" "}
              <span className="spanicon">
                {!onSearch ? searchIconOutline : searchIconFill}
              </span>{" "}
              Search
            </li>
          </NavLink>
          <NavLink to="/followingpost">
            <li>
              {" "}
              <span className="spanicon">
                {onExplore ? exploreFill : exploreOutline}{" "}
              </span>{" "}
              My Following
            </li>
          </NavLink>
          <NavLink to="/messenger">
            <li>
              {" "}
              <span className="spanicon">
                {" "}
                {onChat ? messageFill : messageOutline}
              </span>{" "}
              Messages
            </li>
          </NavLink>
          <NavLink to="/notifications">
            <li>
              <span className="spanicon">
                {onLike ? likeFillBlack : likeOutline}
              </span>{" "}
              Notifications
            </li>
          </NavLink>

          <NavLink to="/createPost">
            <li>
              <span className="spanicon">
                {onCreatePost ? createPostFill : createPostOutline}{" "}
              </span>
              Create
            </li>
          </NavLink>
          <NavLink to="/profile">
            <li>
              <span className="spanicon">
                <img
                  id="profilepic"
                  style={{ width: "24px", height: "24px" }}
                  src={user.Photo ? user.Photo : picLink}
                  /*src={picLink}*/ alt="profile pic"
                />
              </span>{" "}
              Profile
            </li>
          </NavLink>

          <Link to="/">
            <li onClick={() => setModalOpen(true)}>
              <span class="material-symbols-outlined spanicon">logout</span>
              Log Out
            </li>
          </Link>
        </>,
      ];
    } else {
      return [<></>];
    }
  };

  const loginStatusMobile = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {
      return [
        <>
          <Link to="/">
            <li>
              <span>{!onHome ? homeOutline : homeFill}</span>
            </li>
          </Link>

          <Link to="/profile">
            <li>
              <span>
                <img
                  id="profilepic"
                  style={{ width: "24px", height: "24px" }}
                  src={user.Photo ? user.Photo : picLink}
                  /*src={picLink}*/ alt="profile pic"
                />
              </span>
            </li>
          </Link>
          <Link to="/createPost">
            <li>
              <span>{onCreatePost ? createPostFill : createPostOutline}</span>
            </li>
          </Link>
          <Link style={{ marginLeft: "20px" }} to="/followingpost">
            <li>
              <span>{onExplore ? exploreFill : exploreOutline}</span>
            </li>
          </Link>
          <Link to={""}>
            <li onClick={() => setModalOpen(true)}>
              <span class="material-symbols-outlined">logout</span>
            </li>
          </Link>
        </>,
      ];
    } else {
      return [<></>];
    }
  };

  const loginStatusMobileTop = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {
      return [
        <>
          <div id="mob-top-div">
            <div>
              <img
                id="insta-logo-top"
                src={logo}
                alt=""
                onClick={() => {
                  navigate("/");
                }}
              />
            </div>

            <NavLink to="/messenger">
              <span id="msg-top">{onChat ? messageFill : messageOutline}</span>
            </NavLink>
          </div>
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
            <img
              id="insta-logo"
              src={logo}
              alt=""
              onClick={() => {
                navigate("/");
              }}
            />
          </div>
          <div className="two">
            <ul className="nav-menu">{loginStatus()}</ul>
          </div>
        </div>
        <div>
          <ul className="nav-mobile-top">{loginStatusMobileTop()}</ul>
          <ul className="nav-mobile">{loginStatusMobile()}</ul>
        </div>
      </>,
    ];
  } else {
    return [<></>];
  }
}
