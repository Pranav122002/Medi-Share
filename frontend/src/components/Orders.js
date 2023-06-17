import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import "../css/Orders.css"
import { API_BASE_URL } from "../config";

export default function Orders() {

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const navigate = useNavigate();
  const [order_id, setOrderId] = useState("");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);


  function fetchOrders() {
    fetch(`${API_BASE_URL}/all-remaining-orders`)
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
        setIsLoading(false);
      }
      );
  }

  const putDonateData = (order_id) => {
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
            const donar_id = result._id;

            fetch(`${API_BASE_URL}/donate/${order_id}`, {
              method: "put",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                execute_status: execute_status,
                verify_status: verify_status,
                donar_id: donar_id,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.error) {
                  notifyA("Failed to donate order.");
                } else {
                  if (data === "Order Donated successfully and Volunteer will verify now.") {
                    navigate("/profile");
                    notifyB(data);
                  }

                  else {
                    notifyA(data);
                  }
                }
                console.log(data);
              });
          });
      });
  };

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
                  notifyA("Failed to request order.");
                } else {
                  if (data === "Order is already executed.") {
                    notifyA(data);
                  }
                  else if (
                    data === "Medicine is expired."
                  ) {
                    notifyA(data);
                  }
                  else if (
                    data === "Order is not verfied by Volunteer yet."
                  ) {
                    notifyA(data);
                  } else if (data === "Order Requested successfully.") {
                    navigate("/profile");
                    notifyB(data);
                  }
                }
                console.log(data);
              });
          });
      });
  };

  const renderCard = (card, index) => {


    return (
      <>

        {card.order_type == "donate-order" ? (

          <>


            <Card className="Card" key={index}>
              <Card.Body>
                <Card.Title id="title"><img src="pills.png" alt="" />{card.medicine_name}</Card.Title>
                <Card.Text id="details">
                  <p><div className="content-details">Expiry:-</div>{card.expiry_date}<br /></p>
                  <p><div className="content-details">Quntity:-</div>{card.quantity}<br /></p>
                  <p><div className="content-details">Location:-</div>{card.location}<br /></p>
                  <p><div className="content-details">Donor:-</div>{card.donar.name}<br /></p>
                  <Button className="button-53" onClick={() => putRequestData(card._id)}>Request</Button>
                  
                </Card.Text>

              </Card.Body>

            </Card>
          </>
        ) : (
          <div id="OCard">

            <Card key={index}>
              <Card.Body className="Card_body">
                <Card.Title id="title"><img src="pills.png" alt="" />{card.medicine_name}</Card.Title>
                <Card.Text id="details">
                  <p><div className="content-details">Expiry:-</div>{card.expiry_date}<br /></p>
                  <p><div className="content-details">Quntity:-</div>{card.quantity}<br /></p>
                  <p><div className="content-details">Location:-</div>{card.location}<br /></p>
                  <p><div className="content-details">Request By:-</div>{card.requester.name}<br /></p>
                  <Button  className="button-53" onClick={() => putDonateData(card._id)}>Donate</Button>

                </Card.Text>

              </Card.Body>

            </Card>
          </div>)}
      </>

    )
  }
  return (<>
    <Hnavbar />
    <div>

      <div className="bodyy">
        <Navbar />
        {isLoading ? (
          <div className="loadingcont">

            <h1 className="loada">Loading...</h1>
          </div>
        ) : (<>
          <h1>Pending Orders</h1>
          <div className="allCards">


            <div className="OCards">
              <div className="headd">
              <div className="heading">
                <img id="mobpill" src="medicine.png" alt="" />
                <p className="headp"> <img src="medicine.png" alt=""  /> Medicine Name</p>
                <p className="headp">Expiry Date</p>
                <p className="headp">Quantity</p>
                <p className="headp">Location</p>
                <p className="headp">Donor</p>
                <p className="headp" id="action">Action</p>
                </div>
              </div>
              {orders.map(renderCard)}
            </div>
          </div>
        </>
        )}

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

  </>);
}
