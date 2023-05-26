
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../css/Volunteer.css";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import { Hnavbar } from "./Hnavbar";
export default function Volunteer() {
  const [unverifiedorders, setUnverifiedOrders] = useState([]);
  const [isVolunteer, setIsVolunteer] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
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
      `http://localhost:5000/user/${JSON.parse(localStorage.getItem("user"))._id
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

  const verify_donate_order = (order_id) => {
    fetch(`http://localhost:5000/verify-donate-order/${order_id}`, {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    }).then((res) => {
      res.json();
      window.location.reload();

      // setTimeout(function() {
      notifyB("Donate order verified successfully...");
      // }, 2000);

    });
  };

  const verify_request_order = async (order_id) => {

    try {
      const response = await fetch(`http://localhost:5000/req-order/${order_id}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }
      const order_data = await response.json();
      if (order_data.isDonarFieldBlank === false) {
        fetch(`http://localhost:5000/verify-request-order/${order_id}`, {
          method: "put",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }).then((res) => {
          res.json();
          window.location.reload();

          notifyB("Order verified successfully and now will be donated...");
        });

      }
      else if (order_data.isDonarFieldBlank === true) {
        notifyA("Order is not been donated by anyone...");

      }
    } catch (error) {
      console.error(error);
    }


  };

  const becomevolunteer = () => {


    fetch(
      `http://localhost:5000/becomevolunteer/${JSON.parse(localStorage.getItem("user"))._id
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
        <img id="vcurve" src="./curve2.png" alt="" />
        <div className="vcontent">
          <h1>Pending Verifications...</h1>
          {isLoading ? (
            <h1 className="load">Loading...</h1>
          ) : (
            <div className="out_cont">
              {isVolunteer ? (
                <div className="volunteer_cunt">
                   <div className="vpending">
                    
                      <p className="p-head"> order_type  </p>
                     
                      <p className="p-head" >medicine_name  </p>{" "}
                    
                      <p className="p-head" >expiry_date  </p>{" "}
                  
                      <p className="p-head">quantity  </p>{" "}
                      
                      <p className="p-head" >location  </p>

                     
                      <p className="p-head">Donor / Request from</p>

                      <p  className="p-head">Action</p>
                      <img className="vbox" src="volunteer.jpg" alt="" />
                      <h2 className="vbox" >Detials</h2>
                  </div> 



                  {unverifiedorders.map((unverifiedorders) => (


                    <div className="vpending" key={unverifiedorders.medicine_name}>
                      <p className="vpdetails">order_type : </p>
                      <p className="h3">{unverifiedorders.order_type}</p>
                      <p className="vpdetails" >medicine_name : </p>{" "}
                      <p className="h3">{unverifiedorders.medicine_name}</p>
                      <p className="vpdetails" >expiry_date : </p>{" "}
                      <p className="h3">{unverifiedorders.expiry_date}</p>
                      <p className="vpdetails" >quantity : </p>{" "}
                      <p className="h3">{unverifiedorders.quantity}</p>
                      <p className="vpdetails" >location : </p>
                      <p className="h3">{unverifiedorders.location}</p>

                      {unverifiedorders.order_type == "donate-order" ? (
                        <>
                          <p className="vpdetails" >Donar : </p>
                          <p className="h3">{unverifiedorders.donar.name}</p>
                        </>
                      ) : (<>
                        <p className="vpdetails" >Requester : </p>
                        <p className="h3">{unverifiedorders.requester.name}</p>
                      </>
                      )}



                      {unverifiedorders.order_type == "donate-order" ? (<button
                         className="button-53"
                        onClick={() => verify_donate_order(unverifiedorders._id)}
                      >
                        Verify
                      </button>) : (<button
                       className="button-53"
                        onClick={() => verify_request_order(unverifiedorders._id)}
                      >
                        Verify
                      </button>)}

                    </div>


                  ))

                  }
                </div>
              ) : (

                <div className="volunteer_btn">
                  <h1>Join the community Now !</h1>
                  <h3>Become a volunteer today and help us increase the reach of our services to needy</h3>


                  <button className="button-53" onClick={() => becomevolunteer()}>Become Volunteer</button>


                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
