import React, { useEffect, useState, useContext } from "react";
import "../css/Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandHoldingMedical,
  faHandshakeAngle,
} from "@fortawesome/free-solid-svg-icons";
import { faCapsules } from "@fortawesome/free-solid-svg-icons";
import { faBriefcaseMedical } from "@fortawesome/free-solid-svg-icons";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { API_BASE_URL } from "../config";
import { UserContext } from "./UserContext";

export default function Navbar(props) {
  const navigate = useNavigate();
  const location = useLocation();

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const [showVNavbar, setShowVNavbar] = useState(false);
  // const [user, setUser] = useState({});

  var { user } = useContext(UserContext);

  // const fetchUser = () => {
  //   fetch(
  //     `${API_BASE_URL}/user/${JSON.parse(localStorage.getItem("user"))._id}`,
  //     {
  //       headers: {
  //         Authorization: "Bearer " + localStorage.getItem("jwt"),
  //       },
  //     }
  //   )
  //     .then((res) => res.json())
  //     .then((res) => {
  //       if (res) {

  //         setUser(res);
  //         console.log("user is fetched");
  //       }
  //     });
  // };

  // useEffect(() => {
  //   const storedUser = JSON.parse(localStorage.getItem("user"));
  //   if (storedUser) {
  //     setUser(storedUser);
  //   } else {
  //     fetchUser();
  //   }
  // }, [user]);

  const handleShowVNavbar = () => {
    setShowVNavbar(!showVNavbar);
    console.log(showVNavbar);
  };

  const loginStatus = () => {

    if (!user) {

      const storedUser = JSON.parse(localStorage.getItem("user"));

      user = storedUser;
    }

    if (user?.role === "admin") {
      return (
        <>
          <Link className="borderrad" to="/analytics">
            <div className="navimgspace"><img className="navimg" src="./analytics.png" alt="" /></div>
            <li style={{ color: "black" }} className="navli">
              Analytics
            </li>

          </Link>

          <Link className="borderrad" to="/users">
            <div className="navimgspace">  <img className="navimg" src="./peoples.png" alt="" /></div>
            <li style={{ color: "black" }} className="navli">
              Search Users
            </li>

          </Link>

          <Link className="borderrad" to="/orders">
            <div className="navimgspace">   <img className="navimg" src="./check-list.png" alt="" /></div>
            <li style={{ color: "black" }} className="navli">
              Orders
            </li>

          </Link>

          <Link className="borderrad" to="/tasks">
            <div className="navimgspace">    <img className="navimg" src="./chlist2.png" alt="" /></div>
            <li style={{ color: "black" }} className="navli">
              Tasks
            </li>

          </Link>

          <Link
            className="borderrad"
            to="/signin"
            onClick={() => {
              localStorage.clear();
              notifyB("Logout successfull.");
            }}
          >
            <div className="navimgspace">   <img className="navimg" src="./logout3.png" alt="" /></div>
            <li style={{ color: "red" }} className="navli">
              Log-Out
            </li>

          </Link>
        </>
      );
    } else if (user?.role === "volunteer") {
      return (
        <>
          <Link className="borderrad" to="/orders">
            <div className="navimgspace">   <img className="navimg" src="./check-list.png" alt="" /></div>
            <li style={{ color: "black" }} className="navli">
              Orders
            </li>

          </Link>
          <Link className="borderrad" to="/volunteer">
            <div className="navimgspace">   <FontAwesomeIcon
              className="navimg"
              icon={faHandshakeAngle}
              style={{ color: "#48B0DF", filter: "none" }}
            /></div>
            <li style={{ color: "black" }} className="navli">
              Volunteer
            </li>

          </Link>

          <Link className="borderrad" to="/users">
            <div className="navimgspace">   <img className="navimg" src="./peoples.png" alt="" /></div>
            <li style={{ color: "black" }} className="navli">
              Search Users
            </li>

          </Link>

          <Link className="borderrad" to="/tasks">
            <div className="navimgspace">  <img className="navimg" src="./chlist2.png" alt="" /></div>
            <li style={{ color: "black" }} className="navli">
              Tasks
            </li>

          </Link>

          <Link className="borderrad" to="/chats">
            <div className="navimgspace">   <img
              className="navimg"
              id="adce"
              src="./chat5.png"
              alt=""
              style={{ color: "none" }}
            /></div>
            <li style={{ color: "black" }} className="navli">
              Chats
            </li>

          </Link>

          <Link
            className="borderrad"
            to="/signin"
            onClick={() => {
              localStorage.clear();
              notifyB("Logout successfull.");
            }}
          >
            <div className="navimgspace">    <img className="navimg" src="./logout3.png" alt="" /></div>
            <li style={{ color: "red" }} className="navli">
              Log-Out
            </li>

          </Link>
        </>
      );
    } else if (user?.role === "doctor" || user?.role === "user") {
      return (
        <>
          <Link className="borderrad" to="/donate-medicines">
            <div className="navimgspace">   <FontAwesomeIcon
              className="navimg"
              icon={faHandHoldingMedical}
              style={{ color: "#48B0DF", filter: "none" }}
            /></div>
            <li style={{ color: "black" }} className="navli">
              Donate
            </li>

          </Link>

          <Link className="borderrad" to="/request-medicines">
            <div className="navimgspace">  <FontAwesomeIcon
              className="navimg"
              icon={faCapsules}
              style={{ color: "#48B0DF", filter: "none" }}
            /></div>
            <li style={{ color: "black" }} className="navli">
              Request
            </li>

          </Link>

          <Link className="borderrad" to="/orders">
            <div className="navimgspace">  <img className="navimg" src="./check-list.png" alt="" /></div>
            <li style={{ color: "black" }} className="navli">
              Orders
            </li>

          </Link>

          <Link className="borderrad" to="/users">
            <div className="navimgspace">  <img className="navimg" src="./peoples.png" alt="" /></div>
            <li style={{ color: "black" }} className="navli">
              Search Users
            </li>

          </Link>

          <Link className="borderrad" to="/search-medicines">
            <div className="navimgspace">   <img
              className="navimg"
              id="seperate"
              src="./searchpill.png"
              alt=""

            /></div>
            <li style={{ color: "black" }} className="navli">
              Search Medicines
            </li>

          </Link>

          <Link className="borderrad" to="/annoucements">
            <div className="navimgspace">  <img
              className="navimg"
              id="mega"
              src="./announcement2.png"
              alt=""

            /></div>
            <li style={{ color: "black" }} className="navli">
              Annoucements
            </li>

          </Link>

          <Link className="borderrad" to="/appointments">
            <div className="navimgspace">   <img className="navimg" id="mega" src="./doctor4.png" alt="" /></div>
            <li style={{ color: "black" }} className="navli">
              Appointments
            </li>

          </Link>

          {user?.subscription ? (
            <div>
              <Link className="borderrad" to="/chats">
                <div className="navimgspace">
                  <img
                    className="navimg"
                    id="adce"
                    src="./chat5.png"
                    alt=""
                    style={{ color: "none" }}
                  /></div>
                <li style={{ color: "black" }} className="navli">
                  Chats
                </li>

              </Link>

              <Link className="borderrad" to="/disease-predictions">
                <div className="navimgspace">   <img
                  className="navimg"
                  id="adcd"
                  src="./virus.png"
                  alt=""
                  style={{ color: "none" }}
                /></div>
                <li style={{ color: "black" }} className="navli">
                  Disease Predictions
                </li>

              </Link>
            </div>
          ) : (
            <div>
              <Link className="borderrad" to="/subscribe">
                <div className="navimgspace">   <img
                  className="navimg"
                  id="adce"
                  src="./chat5.png"
                  alt=""
                  style={{ color: "none" }}
                />
                </div>
                <li style={{ color: "black" }} className="navli">
                  Chats
                </li>

              </Link>

              <Link className="borderrad" to="/subscribe">
                <div className="navimgspace">   <img
                  className="navimg"
                  id="adcd"
                  src="./virus.png"
                  alt=""
                  style={{ color: "none" }}
                />
                </div>
                <li style={{ color: "black" }} className="navli">
                  Disease Predictions
                </li>

              </Link>
            </div>
          )}

          <Link className="borderrad" to="/nearby-hospitals">
            <div className="navimgspace">   <img className="navimg" src="./hospital3.png" alt="" /></div>
            <li style={{ color: "black" }} className="navli">
              Nearby Hospitals
            </li>

          </Link>

          <Link
            className="borderrad"
            to="/signin"
            onClick={() => {
              localStorage.clear();
              notifyB("Logout successfull.");
            }}
          >
            <div className="navimgspace">   <img className="navimg" src="./logout3.png" alt="" /></div>
            <li style={{ color: "red" }} className="navli">
              Log-Out
            </li>

          </Link>
        </>
      );
    }
  };

  return (
    <div>
      {!["/signup", "/signin", "/", "/about-us"].includes(useLocation().pathname) && (
        <div className={`mainnavss ${props.showvNavbar && "active"} `}>
        <div
          
          className={`navbar ${showVNavbar && "active"}`}
        >
          <div className="one" onClick={handleShowVNavbar}>
            <FontAwesomeIcon
              id="servicesicon"
              size="xl"
              style={{ color: "#48B0DF", filter: "none" }}
              icon={faBriefcaseMedical}
              beat
            />
            <h1>Services</h1>


            {/* <FontAwesomeIcon id="arrow"  size="xl" style={{ color: "black", filter: "none" }} icon={faAnglesRight}  /> */}
          </div>
          <div className="two" onClick={props.handleShowvNavbar}>
            <ul className="nav-menu">{loginStatus()}</ul>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
