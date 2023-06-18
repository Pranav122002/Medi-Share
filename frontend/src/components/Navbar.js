import React, { useEffect, useState, useContext } from "react";
import "../css/Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "./UserContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandHoldingMedical, faHandshakeAngle } from '@fortawesome/free-solid-svg-icons'
import { faCapsules } from '@fortawesome/free-solid-svg-icons'
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons'

export default function Navbar() {
  const navigate = useNavigate();

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const [showVNavbar, setShowVNavbar] = useState(!false);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user && user.subscription) {
      setIsSubscribed(true);
    }
    if (user && user.role === "admin") {
      setIsAdmin(true);
    }
  }, [user]);



  const handleShowVNavbar = () => {
    setShowVNavbar(!showVNavbar);
    console.log(showVNavbar);
  };



  const loginStatus = () => {
    return [
      <>
        {isAdmin ? (<Link className="borderrad" to="/analytics">
          <li style={{ color: "black" }} className="navli">Analytics</li>
          <img className="navimg" src="./analytics.png" alt="" />
        </Link>) : (<div></div>)}



        <Link className="borderrad" to="/donate-medicines">
          <li style={{ color: "black" }} className="navli">Donate</li>
          <FontAwesomeIcon className="navimg" icon={faHandHoldingMedical} style={{ color: "#48B0DF", filter: "none" }} />
        </Link>
        <Link className="borderrad" to="/request-medicines">
          <li style={{ color: "black" }} className="navli">Request</li>
          <FontAwesomeIcon className="navimg" icon={faCapsules} style={{ color: "#48B0DF", filter: "none" }} />
        </Link>
        <Link className="borderrad" to="/orders">
          <li style={{ color: "black" }} className="navli">Orders</li>
          <img className="navimg" src="./check-list.png" alt="" />
        </Link>
        <Link className="borderrad" to="/volunteer">
          <li style={{ color: "black" }} className="navli">Volunteer</li>
          <FontAwesomeIcon className="navimg" icon={faHandshakeAngle} style={{ color: "#48B0DF", filter: "none" }} />
        </Link>
        <Link className="borderrad" to="/users">
          <li style={{ color: "black" }} className="navli">Search Users</li>
          <img className="navimg" src="./peoples.png" alt="" />
        </Link>
        <Link className="borderrad" to="/tasks">
          <li style={{ color: "black" }} className="navli">Tasks</li>
          <img className="navimg" src="./chlist2.png" alt="" />
        </Link>
        {/* <Link className="borderrad" to="/medicines">
          <li style={{color: "black"}} className="navli">Medicines</li>
        </Link> */}
        <Link>

          <li style={{ color: "black" }} className="navli">Search Medicines</li>
          <img className="navimg" src="./searchpill.png" alt="" style={{ height: "2.4rem" }} />
        </Link>

        <Link className="borderrad" to="/annoucements">
          <li style={{ color: "black" }} className="navli">Annoucements</li>
          <img className="navimg" id="mega" src="./announcement2.png" alt="" style={{ height: "2.4rem" }} />
        </Link>
        <Link className="borderrad" to="/doctors">
          <li style={{ color: "black" }} className="navli">Doctors</li>
          <img className="navimg" id="mega" src="./doctor4.png" alt="" />
        </Link>




        {isSubscribed ? (<div>


          <Link className="borderrad" to="/chats">
            <li style={{ color: "black" }} className="navli">Chats</li>
            <img className="navimg"  id="adce"  src="./chat5.png" alt="" style={{ color: 'none' }} />
          </Link>
          <Link className="borderrad" to="/disease-predictions">
            <li style={{ color: "black" }} className="navli">Disease Predictions</li>
            <img className="navimg"   id="adcd" src="./virus.png" alt="" style={{ color: 'none' }} />
          </Link>


        </div>) : (

          <div>


            <Link className="borderrad" to="/subscribe">
              <li style={{ color: "black" }} className="navli">Chats</li>
              <img className="navimg" id="adce" src="./chat5.png" alt="" style={{ color: 'none' }} />
            </Link>
            <Link className="borderrad" to="/subscribe">
              <li style={{ color: "black" }} className="navli">Disease Predictions</li>
              <img className="navimg" id="adcd" src="./virus.png" alt="" style={{ color: 'none' }} />
            </Link>
          </div>
        )}

        <Link className="borderrad" to="/nearby-hospitals">
        <li style={{ color: "black" }} className="navli">Nearby Hospitals</li>
          <img className="navimg" src="./hospital3.png" alt="" />
        </Link>
        <Link
          className="borderrad"
          to="/signin"
          onClick={() => {
            localStorage.clear();
            notifyB("Logout successfull.");
          }}
        >

          <li style={{ color: "red" }} className="navli">Log-Out</li>
          <img className="navimg" src="./logout3.png" alt="" />
        </Link>
      </>,
    ];
  };

  return [
    <>

      <div onClick={handleShowVNavbar} className={`navbar ${showVNavbar && 'active'}`}>
        <div className="one">
          <img src="./pills.png" alt="" />
          <h1>SERVICES</h1>
          <img id="arrow" src="./expand.png" alt="" />
        </div>
        <div className="two">
          <ul className="nav-menu">{loginStatus()}</ul>
        </div>
      </div>
    </>,
  ];
}
