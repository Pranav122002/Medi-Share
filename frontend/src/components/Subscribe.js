import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import "../css/Home.css";
import { useEffect } from "react";
import { toast } from "react-toastify";
export default function Subscribe() {
  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

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
        if (res.subscription === true) {
          setIsSubscribed(true);
        }
  
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
          setIsSubscribed(true);
        } else if (
          res ===
          "Insufficient credits. Please earn or add credits to subscribe to Medi-Share..."
        ) {
          notifyA(res);
          setIsSubscribed(false);
        } else {
          notifyA("Error");
        }
      });
  };

 

  return (
    <>
      <Hnavbar />
      <div>
        <div className="bodyy">
          <Navbar />

          {isLoading ? (
            <h1 className="loada">Loading...</h1>
          ) : (
            <div>
              {isSubscribed ? (
                <h1>Your subscription is on</h1>
              ) : (
                <div>
                  <h1>
                    Please Subscribe to Medi-Share to access features like Chats
                    and disease predictions
                  </h1>
                  <button
                    onClick={() => {
                      subscribe();
                    }}
                  >
                    Subscribe
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
