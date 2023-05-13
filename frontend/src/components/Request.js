import React, { useState, useContext } from "react";
import "../css/Request.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";


export default function Request() {


  const [medicine_name, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiry_date, setExpiryDate] = useState("");
  const [location, setLocation] = useState("");

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const postOrderData = () => {
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
      .then((result) => {
        const requester = result._id;
        fetch("http://localhost:5000/request-medicines", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
        
            medicine_name: medicine_name,
            expiry_date: expiry_date,
            quantity: quantity,
            location: location,
            requester: requester,
          }),
        }).then((res) => res.json())
          .then((data) => {
            if (data.error) {
              notifyA(data.error);
            } else {
              notifyB(data.msg);
            }
            console.log(data);
          });
      });
  };

 

  return (
    <div>
      <Hnavbar />
      <div className="bodyy">
      <Navbar />
     
      <div className="request">
        <div>
          <div className="requestForm">
            <div className="logo">
              <h1>Request Medicine</h1>
            </div>
            <div>
              <input
                type="text"
                name="medicine_name"
                id="medicine_name"
                value={medicine_name}
                placeholder="Medicine Name"
                onChange={(e) => {
                  setMedicineName(e.target.value);
                }}
              />
            </div>
            <div>
              <input
                type="date"
                name="expiry_date"
                id="expiry_date"
                placeholder="Expiry Date"
                value={expiry_date}
                onChange={(e) => {
                  setExpiryDate(e.target.value);
                }}
              />
            </div>
            <div>
              <input
                type="text"
                name="quantity"
                id="quantity"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                }}
              />
            </div>
            <div>
              <input
                type="text"
                name="location"
                id="location"
                placeholder="Location"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
              />
            </div>
            <input
              type="submit"
              id="request-btn"
              onClick={() => {
                postOrderData();
              }}
              value="Request"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
