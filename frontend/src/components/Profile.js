import React, { useState, useContext, useEffect } from "react";
import "../css/SignIn.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
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
    `http://localhost:5000/user/${
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
      `http://localhost:5000/mydonatedorders/${
        JSON.parse(localStorage.getItem("user"))._id
      }`
    ).then((response) => response.json())
      .then((data) => setDonateOrders(data));
  }

  function fetchRequestOrders() {
    fetch(
      `http://localhost:5000/myrequestedorders/${
        JSON.parse(localStorage.getItem("user"))._id
      }`
    ).then((response) => response.json())
      .then((data) => setRequestOrders(data));
  }

  return (
    <div>
      <Hnavbar />
      <Navbar />
      <h3>{user_name}</h3>
      <div>
        <button>My Donated Orders</button>
        <ul>
          {donateorders.map((donateorders) => (
            <li key={donateorders.medicine_name}>
              <p>medicine_name : </p> {donateorders.medicine_name}
              <br /> <p>expiry_date : </p> {donateorders.expiry_date}
              <br /> <p>quantity : </p> {donateorders.quantity}
              <br /> <p>location : </p> {donateorders.location}
              <br /> <p>Donar : </p> {donateorders.donar.name}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <button>My Requested Orders</button>
        <ul>
          {requestorders.map((requestorders) => (
            <li key={requestorders.medicine_name}>
              <p>medicine_name : </p> {requestorders.medicine_name}
              <br /> <p>expiry_date : </p> {requestorders.expiry_date}
              <br /> <p>quantity : </p> {requestorders.quantity}
              <br /> <p>location : </p> {requestorders.location}
              <br /> <p>Requester : </p> {requestorders.requester.name}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/signin");
            notifyB("Logout successfull...");
          }}
        >
          Log-Out
        </button>
      </div>
    </div>
  );
}
