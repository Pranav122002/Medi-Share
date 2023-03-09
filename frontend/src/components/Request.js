import React, { useState, useEffect } from "react";

// import "../css/Request.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";

export default function Request() {
  const navigate = useNavigate();

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const [order_id, setOrderId] = useState("");

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);


  function fetchOrders() {
    fetch("http://localhost:5000/alldonateorders/")
      .then((response) => response.json())
      .then((data) => setOrders(data));
  }



 

  const putRequestData = (order_id) => {


  
  
   

    fetch(`http://localhost:5000/order/${order_id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const execute_status = result.execute_status;
        const verify_status = result.verify_status;

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
            const requester_id = result._id;

            // Sending data to server
            fetch(`http://localhost:5000/request/${order_id}`, {
              method: "put",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                execute_status: execute_status,
                verify_status: verify_status,
                requester_id: requester_id,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.error) {
                  notifyA("Failed to request order");
                } else {
                  navigate("/profile");
                  notifyB("Order Requested Successfully");
                }
                console.log(data);
              });
          });
      });
  };

  return (
    <div>
      <Navbar />
      <ul>
        {orders.map((orders) => (
          <li
            key={orders.medicine_name}
           
          >
            <p>medicine_name : </p> {orders.medicine_name}
            <br /> <p>expiry_date : </p> {orders.expiry_date}
            <br /> <p>quantity : </p> {orders.quantity}
            <br /> <p>location : </p> {orders.location}
            <br /> <p>donar : </p> {orders.donar.name}
            <br /> <button  onClick={() => putRequestData(orders._id)} >Request</button>
          </li>
        ))}
      </ul>



    </div>
  );
}
