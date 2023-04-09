import React, { useState, useEffect } from "react";
import "../css/Volunteer.css";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import { Hnavbar } from "./Hnavbar";
import { API_BASE_URL } from "../config";

export default function Volunteer() {
  
  const [unverifiedorders, setUnverifiedOrders] = useState([]);
  const [isVolunteer, setIsVolunteer] = useState("");

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    fetchUnverifiedOrders();
  }, []);

  useEffect(() => {
    fetchUser();
  });

  function fetchUser() {
    fetch(
      `${API_BASE_URL}/user/${
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
        if (res.role === "volunteer") {
          setIsVolunteer(true);
        } else {
          setIsVolunteer(false);
        }
        console.log(isVolunteer);
      });
  }

  function fetchUnverifiedOrders() {
    fetch(`${API_BASE_URL}/unverifiedorders`)
      .then((response) => response.json())
      .then((data) => setUnverifiedOrders(data));
  }

  const verifyorder = (order_id) => {
    fetch(`${API_BASE_URL}/verifyorder/${order_id}`, {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    }).then((res) => {
      res.json();
      window.location.reload();
      notifyB("Order verified successfully...");
    });
  };

  const becomevolunteer = () => {
    fetch(
      `${API_BASE_URL}/becomevolunteer/${
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
        window.location.reload();
        notifyB("You have became Volunteer now...");
      });
  };

  return (
    <div>
      <Hnavbar />
      <div className="bodyy">
      <Navbar />



      {isVolunteer ? (
        <ul  className="volunteer_cunt">
          {unverifiedorders.map((unverifiedorders) => (
            <li key={unverifiedorders.medicine_name}>
              <p>medicine_name : </p> {unverifiedorders.medicine_name}
              <br /> <p>expiry_date : </p> {unverifiedorders.expiry_date}
              <br /> <p>quantity : </p> {unverifiedorders.quantity}
              <br /> <p>location : </p> {unverifiedorders.location}
              <br /> <p>Donar : </p> {unverifiedorders.donar.name}
              <br />{" "}
              <button
                id="verify-btn"
                onClick={() => verifyorder(unverifiedorders._id)}
              >
                Verify
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div id="voldiv">
          <p className="becm">You are not a Volunteer !</p>
          <h1>
            <button id="volbtn" className="becm" onClick={() => becomevolunteer()}>Become Volunteer</button>
          </h1>
        </div>
      )}
    </div>
    </div>

  );
}
