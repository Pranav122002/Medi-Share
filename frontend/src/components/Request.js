import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import "../css/Request.css"
import { API_BASE_URL } from "../config";

export default function Request() {

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const navigate = useNavigate();
  const [order_id, setOrderId] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    fetch(`${API_BASE_URL}/alldonateorders/`)
      .then((response) => response.json())
      .then((data) => setOrders(data));
  }

  const putRequestData = (order_id) => {
    fetch(`${API_BASE_URL}/order/${order_id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const execute_status = result.execute_status;
        const verify_status = result.verify_status;

        fetch(
          `${API_BASE_URL}/user/${JSON.parse(localStorage.getItem("user"))._id
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

            fetch(`${API_BASE_URL}/request/${order_id}`, {
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
                  notifyA("Failed to request order...");
                } else {
                  if (data === "Order is already executed...") {
                    notifyA(data);
                  } else if (
                    data === "Order is not verfied by Volunteer yet..."
                  ) {
                    notifyA(data);
                  } else if (data === "Order Requested successfully...") {
                    navigate("/profile");
                    notifyB(data);
                  } else if (data === "Medicine is expired...") {
                    notifyA(data);
                  }
        
                }
                console.log(data);
              });
          });
      });
  };

  const renderCard = (card, index) => {
    return (
      <Card className="Card" style={{ width: '18rem', height: '19rem' }} key={index}>
        <Card.Body>
          <Card.Title id="title">{card.medicine_name}</Card.Title>
          <Card.Text id="details">
            <p>Expiry Date : {card.expiry_date}<br /></p>
            <p> Quantity : {card.quantity}<br /></p>
            <p> Location : {card.location}<br /></p>
            <p> Donor : {card.donar.name}<br /></p>
            <Button id="req_button" onClick={() => putRequestData(card._id)}>Request</Button>

          </Card.Text>

        </Card.Body>
        {/* <Button id="CardButton" variant="primary">VOTE</Button> */}
      </Card>
    )
  }
  return (
    <div>
      <Hnavbar />
      <div className="bodyy">
      <Navbar />
      <div className="allCards">
        <div className="Cards">
          {orders.map(renderCard)}
        </div>
      </div>
      {/* <ul>
        {orders.map((orders) => (
          <li key={orders.medicine_name}>
            <p>medicine_name : </p> {orders.medicine_name}
            <br /> <p>expiry_date : </p> {orders.expiry_date}
            <br /> <p>quantity : </p> {orders.quantity}
            <br /> <p>location : </p> {orders.location}
            <br /> <p>donar : </p> {orders.donar.name}
            <br />{" "}
            <button onClick={() => putRequestData(orders._id)}>Request</button>
          </li>
        ))}
      </ul> */}
    </div>
    </div>
  );
}
