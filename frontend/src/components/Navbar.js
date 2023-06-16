import React, { useEffect, useState, useContext } from "react";
import "../css/Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from './UserContext';

export default function Navbar() {
  const navigate = useNavigate();

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);


  const [showVNavbar, setShowVNavbar] = useState(!false)

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
    setShowVNavbar(!showVNavbar)
    console.log(showVNavbar)
  }

  

  

 
 
  const loginStatus = () => {
    return [
      <>
      {isAdmin ? (<Link className="borderrad" to="/analytics">
          <li style={{color: "black"}} className="navli">Analytics</li>
          <img className="navimg" src="./analytics.png" alt="" />
        </Link>) : ( <div></div> ) }
        

        
        <Link className="borderrad" to="/donate-medicines">
          <li style={{color: "black"}} className="navli">Donate</li>
          <img className="navimg" src="./medicinedonate.png" alt="" />
        </Link>
        <Link className="borderrad" to="/request-medicines">
          <li style={{color: "black"}} className="navli">Request</li>
          <img className="navimg" src="./medicinerequest.png" alt="" />
        </Link>
        <Link className="borderrad" to="/orders">
          <li style={{color: "black"}} className="navli">Orders</li>
          <img className="navimg" src="./orderss.png" alt="" />
        </Link>
        <Link className="borderrad" to="/volunteer">
          <li style={{color: "black"}} className="navli">Volunteer</li>
          <img className="navimg" src="./volunteerr.png " alt="" />
        </Link>
        <Link className="borderrad" to="/users">
          <li style={{color: "black"}} className="navli">Search Users</li>
          <img className="navimg" src="./medicinesearch.png" alt="" />
        </Link>
         <Link className="borderrad" to="/tasks">
          <li style={{color: "black"}} className="navli">Tasks</li>
          <img className="navimg" src="./task.png" alt="" />
        </Link>
        {/* <Link className="borderrad" to="/medicines">
          <li style={{color: "black"}} className="navli">Medicines</li>
        </Link> */}
        <Link className="borderrad" to="/search-medicines">
          <li style={{color: "black"}} className="navli">Search Medicines</li>
          <img className="navimg" src="./medicinesearch.png" alt="" />
        </Link>
        
        <Link className="borderrad" to="/annoucements">
          <li style={{color: "black"}} className="navli">Annoucements</li>
          <img className="navimg" id="mega" src="./loudspeaker.png" alt="" />
        </Link>
        <Link className="borderrad" to="/doctors">
          <li style={{color: "black"}} className="navli">Doctors</li>
          <img className="navimg" id="mega" src="./doctoricon.png" alt="" />
        </Link>
       
  


{isSubscribed ? ( <div>


  <Link className="borderrad" to="/chats">
          <li style={{color: "black"}} className="navli">Chats</li>
          <img className="navimg" src="./chat2.png" alt="" />
        </Link>
        <Link className="borderrad" to="/disease-predictions">
          <li style={{color: "black"}} className="navli">Disease Predictions</li>
          <img className="navimg" src="./diseasep.png" alt="" />
        </Link>


</div> ) : (

<div>


<Link className="borderrad" to="/subscribe">
          <li style={{color: "black"}} className="navli">Chats</li>
          <img className="navimg" src="./chat2.png" alt="" />
        </Link>
        <Link className="borderrad" to="/subscribe">
          <li style={{color: "black"}} className="navli">Disease Predictions</li>
          <img className="navimg" src="./diseasep.png" alt="" />
        </Link>





</div>


)}





        





        <Link className="borderrad" to="/nearby-hospitals">
          <li style={{color: "black"}} className="navli">Nearby Hospitals</li>
          <img className="navimg" src="./hospitali.png" alt="" />
        </Link>
        <Link className="borderrad" to="/signin"
          onClick={() => {
            localStorage.clear();
            notifyB("Logout successfull...");
          }}
        >
          <li style={{ color: "red" }} className="navli">Log-Out</li>
          <img className="navimg" src="./logout2.png" alt="" />
        </Link>
      </>,
    ];
  };

  return [
    <>
     
      <div  onClick={handleShowVNavbar}  className={`navbar ${showVNavbar && 'active'}`}>
        <div className="one">

          <img src="./pills.png" alt="" />
          <h1>SERVICES</h1>
          <img id="arrow" src="./expand.png" alt="" />
        </div>
        <div className="two"  >
          <ul className="nav-menu">{loginStatus()}</ul>
        </div>
      </div>
    </>,
  ];
}
