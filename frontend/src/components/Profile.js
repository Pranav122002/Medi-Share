import React, { useState, useContext, useEffect } from "react";
import "../css/SignIn.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import "../css/Profile.css";
import { UserContext } from "./UserContext";

export default function Profile() {
  const navigate = useNavigate();

  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const [isdoctor, setIsDoctor] = useState("");
  const [donateorders, setDonateOrders] = useState([]);
  const [requestorders, setRequestOrders] = useState([]);
  const [myappointments, setMyAppointments] = useState([]);
  const [doctorappointments, setDoctorAppointments] = useState([]);
  const [user_name, setUserName] = useState("");
  const [credits, setCredits] = useState("");
  const [isSubscribed, setSubscription] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { updateUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUser = () => {
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
        .then((res) => {
          console.log("res = ", res);

          updateUser(res);
          setUserName(res.name);
          setCredits(res.credits);
          setSubscription(res.subscription);

          if (res.role === "doctor") {
            setIsDoctor(true);
          }
          setIsLoading(false);
        });
    };

    fetchUser();
  }, []);

  useEffect(() => {
    fetchDonateOrders();
  }, []);

  useEffect(() => {
    fetchRequestOrders();
  }, []);

  useEffect(() => {
    myAppointments();
  }, []);

  useEffect(() => {
    doctorAppointments();
  }, []);

  function fetchDonateOrders() {
    fetch(
      `http://localhost:5000/mydonatedorders/${
        JSON.parse(localStorage.getItem("user"))._id
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        setDonateOrders(data);
        setIsLoading(false);
      });
  }

  function fetchRequestOrders() {
    fetch(
      `http://localhost:5000/myrequestedorders/${
        JSON.parse(localStorage.getItem("user"))._id
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        setRequestOrders(data);
        setIsLoading(false);
      });
  }

  function myAppointments() {
    fetch(
      `http://localhost:5000/patient-appointments/${
        JSON.parse(localStorage.getItem("user")).name
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        setMyAppointments(data);
        setIsLoading(false);
      });
  }

  function doctorAppointments() {
    fetch(
      `http://localhost:5000/doctor-appointments/${
        JSON.parse(localStorage.getItem("user")).name
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("doctor appinmts = ", data);

        setDoctorAppointments(data);
        setIsLoading(false);
      });
  }

  const subscribe = () => {
    fetch(
      `http://localhost:5000/subscribe/${
        JSON.parse(localStorage.getItem("user"))._id
      }`,
      {
        method: "put",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res === "You have now subscribed to Medi-Share...") {
          notifyB(res);
      navigate("/home");
        } else if (
          res ===
          "Insufficient credits. Please earn or add credits to subscribe to Medi-Share..."
        ) {
          notifyA(res);
         
        } else {
          notifyA("Error");
        }
      });
  };


  return (
    <div className="profilediv">
      <Hnavbar />
      <div className="bodyy">
        <Navbar />
        <h1>PROFILE</h1>
        <div className="contentt">
          <div className="userdet">
            <img src="./profile-pic.png" alt="" />

            <h1>
              {" "}
              {user_name} <br></br>
            </h1>
            <h1>
             {isLoading ? (
                <p >Loading...</p>
              ) : (
                <p>
                  {isSubscribed ? ( <p>Subscription : ON</p> ) : (<button onClick={() => {
                      subscribe();
                    }}>Subscribe</button> )} 
                </p>
              ) }
               
            </h1>
            <span id="credits">
              Credits : {credits} <br />
              <img src="./rupee.png" alt="" />
            </span>
          </div>
          <div className="donatedorders">
            <h2>
              My Donated Orders <img src="./donatemed.png" alt="" />
            </h2>
            <ul className="proul">
              <li className="profli">
                <h3 className="pm">Name</h3>
                <h3 className="p1">Expiry Date</h3>
                <h3 className="p2">Quantity</h3>
                <h3 className="p3">Location</h3>
              </li>
              {isLoading ? (
                <h1 className="loada">Loading...</h1>
              ) : (
                <div className="procont">
                  {donateorders.map((donateorders) => (
                    <li className="proco" key={donateorders.medicine_name}>
                      <p className="pm">{donateorders.medicine_name}</p>
                      <p className="p1">{donateorders.expiry_date} </p>
                      <p className="p2">{donateorders.quantity}</p>
                      <p className="p3"> {donateorders.location}</p>
                    </li>
                  ))}
                </div>
              )}
            </ul>
          </div>

          <div className="requestorders">
            <h2>
              My Requested Orders <img src="./requestmed.png" alt="" />
            </h2>
            <ul className="proul">
              <li className="profli">
                <h3 className="pm">Name</h3>
                <h3 className="p1">Expiry Date</h3>
                <h3 className="p2">Quantity</h3>
                <h3 className="p3">Location</h3>
              </li>
              {isLoading ? (
                <h1 className="loada">Loading...</h1>
              ) : (
                <div className="procont">
                  {requestorders.map((requestorders) => (
                    <li className="proco" key={requestorders.medicine_name}>
                      <p className="pm"> {requestorders.medicine_name}</p>
                      <p className="p1"> {requestorders.expiry_date}</p>
                      <p className="p2"> {requestorders.quantity}</p>
                      <p className="p3">{requestorders.location}</p>
                    </li>
                  ))}
                </div>
              )}
            </ul>
          </div>

          {isdoctor ? (
            <div className="appointm">
              <h2>
                My Appointments <img src="./appointment.png" alt="" />{" "}
              </h2>
              <ul className="proul">
                <li className="profli">
                  <h3 className="pm">Doctor Name</h3>
                  <h3 className="p1">Patient Name</h3>
                  <h3 className="p2">Date</h3>
                </li>
                {isLoading ? (
                  <h1 className="loada">Loading...</h1>
                ) : (
                  <div className="procont">
                    {doctorappointments.map((doctorappointments) => (
                      <li className="proco" key={doctorappointments._id}>
                        <p className="pm"> {doctorappointments.doctor_name}</p>
                        <p className="p1"> {doctorappointments.patient_name}</p>
                        <p className="p2">
                          {" "}
                          {doctorappointments.appointment_date}
                        </p>
                      </li>
                    ))}
                  </div>
                )}
              </ul>
            </div>
          ) : (
            <div className="myappoint">
              <h2>
                My Appointments <img src="./appointment.png" alt="" />
              </h2>
              <ul className="proul">
                <li className="profli">
                  <h3 className="pm">Patient Name</h3>
                  <h3 className="p1">Doctor Name</h3>
                  <h3 className="p2">Date</h3>
                </li>
                {isLoading ? (
                  <h1 className="loada">Loading...</h1>
                ) : (
                  <div className="procont">
                    {myappointments.map((myappointments) => (
                      <li className="proco" key={myappointments._id}>
                        <p className="pm"> {myappointments.patient_name}</p>
                        <p className="p1"> {myappointments.doctor_name}</p>
                        <p className="p2"> {myappointments.appointment_date}</p>
                      </li>
                    ))}
                  </div>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
