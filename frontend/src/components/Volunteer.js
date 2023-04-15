
import React, { useState, useEffect } from "react";
import "../css/Volunteer.css";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import { Hnavbar } from "./Hnavbar";
export default function Volunteer() {
  const [unverifiedorders, setUnverifiedOrders] = useState([]);
  const [isVolunteer, setIsVolunteer] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
        if (res.role === "volunteer") {
          setIsVolunteer(true);
        } else {
          setIsVolunteer(false);
        }
        setIsLoading(false);
        console.log(isVolunteer);
      });
  }

  function fetchUnverifiedOrders() {
    fetch("http://localhost:5000/unverifiedorders")
      .then((response) => response.json())
      .then((data) => setUnverifiedOrders(data));
  }

  const verifyorder = (order_id) => {
    fetch(`http://localhost:5000/verifyorder/${order_id}`, {
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
      `http://localhost:5000/becomevolunteer/${
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

        {isLoading ? (
          <h1 className="load">Loading...</h1>
        ) : (
          <div className="out_cont"> 
            {isVolunteer ? (
              <div className="volunteer_cunt">
                {unverifiedorders.map((unverifiedorders) => (
                  <div key={unverifiedorders.medicine_name}>
                    <p>medicine_name : </p>{" "}
                    <p className="h3">{unverifiedorders.medicine_name}</p>
                    <p>expiry_date : </p>{" "}
                    <p className="h3">{unverifiedorders.expiry_date}</p>
                    <p>quantity : </p>{" "}
                    <p className="h3">{unverifiedorders.quantity}</p>
                    <p>location : </p>
                    <p className="h3">{unverifiedorders.location}</p>
                    <p>Donar : </p>{" "}
                    <p className="h3">{unverifiedorders.donar.name}</p>
                    <button
                      id="verify-btn"
                      onClick={() => verifyorder(unverifiedorders._id)}
                    >
                      Verify
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="volunteer_btn">
                <h3>You are not a Volunteer !</h3>
                <button className="vlbtn" onClick={() => becomevolunteer()}>
                  Become Volunteer
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
