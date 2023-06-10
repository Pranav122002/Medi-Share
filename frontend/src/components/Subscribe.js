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
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);



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
      navigate("/home");
        } else if (
          res ===
          "Insufficient credits. Please earn or add credits to subscribe to Medi-Share..."
        ) {
          notifyA(res);
         
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

          
            <div>
             
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
             
            </div>
          
        </div>
      </div>
    </>
  );

 
}
