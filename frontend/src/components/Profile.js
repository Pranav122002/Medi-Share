import React, { useState, useContext, useEffect } from "react";
import "../css/SignIn.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import "../css/Profile.css"
export default function Profile() {

  const navigate = useNavigate();

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const [donateorders, setDonateOrders] = useState([]);
  const [requestorders, setRequestOrders] = useState([]);
  const [user_name, setUserName] = useState("");

  useEffect(() => {
    fetchDonateOrders();
  }, []);

  useEffect(() => {
    fetchRequestOrders();
  }, []);

  fetch(
    `/user/${
      JSON.parse(localStorage.getItem("user"))._id
    }`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    }
  ).then((res) => res.json())
    .then((res) => {
      setUserName(res.name);
    });

  function fetchDonateOrders() {
    fetch(
      `/mydonatedorders/${
        JSON.parse(localStorage.getItem("user"))._id
      }`
    ).then((response) => response.json())
      .then((data) => setDonateOrders(data));
  }

  function fetchRequestOrders() {
    fetch(
      `/myrequestedorders/${
        JSON.parse(localStorage.getItem("user"))._id
      }`
    ).then((response) => response.json())
      .then((data) => setRequestOrders(data));
  }

  return (
    <div>
      <Hnavbar />
      <div className="bodyy">
      <Navbar />
      <div className="contentt">
      <h1>Welcome {user_name} !!!</h1>
      <div>
        <h2>My Donated Orders</h2>
        <ul>
        <li style={{backgroundColor:"white" , color:"black"}}>
          <h3 className="pm">Name</h3>
          <h3 className="p1">Expiry Date</h3>
          <h3 className="p2">Quantity</h3>
          <h3 className="p3">Location</h3>
        </li> 
          {donateorders.map((donateorders) => (
            <li key={donateorders.medicine_name}>
              <p className="pm">{donateorders.medicine_name}</p> 
              <p className="p1">{donateorders.expiry_date} </p> 
              <p className="p2">{donateorders.quantity}</p> 
              <p className="p3"> {donateorders.location}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <hr id="lin"/>
        <h2>My Requested Orders</h2>
        <ul>
        <li style={{backgroundColor:"white" , color:"black"}}>
          <h3 className="pm" >Name</h3>
          <h3 className="p1">Expiry Date</h3>
          <h3 className="p2">Quantity</h3>
          <h3 className="p3">Location</h3>
        </li> 
          {requestorders.map((requestorders) => (
            <li key={requestorders.medicine_name}>
              <p className="pm"> {requestorders.medicine_name}</p>
              <p className="p1"> {requestorders.expiry_date}</p>
              <p className="p2"> {requestorders.quantity}</p>
              <p className="p3">{requestorders.location}</p> 
            
            </li>
          ))}
        </ul>
      </div>
     
    </div>
    </div>
    </div>
  );
}
