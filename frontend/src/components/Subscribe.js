import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import "../css/Home.css";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";

export default function Subscribe() {
  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  const subscribe = () => {
    fetch(
      `${API_BASE_URL}/subscribe/${
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
        if (res === "You have now subscribed to Medi-Share.") {
          notifyB(res);
          navigate("/home");
        } else if (
          res ===
          "Insufficient credits. Please earn or add credits to subscribe to Medi-Share."
        ) {
          notifyA(res);
        } else {
          notifyA("Error");
        }
      });
  };

  return (
    <>
      <div className="subscri">
        <div className="bodyy">
          <div className="subsss">
            <div className="subs">
              <div className="subimg">
                <img src="./subscribe.jpg" alt="" />
              </div>
              <div className="headsub">
                <h2>Subscribe now to avail exclusive services on our site.</h2>
                <h2>
                  Services like chat and disease prediction require subscription
                  worth <br /> <div id="orangec">1000 Medi-Share Credits </div>{" "}
                </h2>
              </div>
              <button
                className="subbut"
                onClick={() => {
                  subscribe();
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
