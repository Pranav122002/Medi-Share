import React, { useState, useContext, useEffect } from "react";
import "../css/SignIn.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import "../css/Profile.css";
import { UserContext } from "./UserContext";
import { API_BASE_URL } from "../config";
import Modal from 'react-modal';
import ReactStars from "react-rating-stars-component";


export default function Profile() {
  const navigate = useNavigate();

  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const [isdoctor, setIsDoctor] = useState("");
  const [donateorders, setDonateOrders] = useState([]);
  const [requestorders, setRequestOrders] = useState([]);
  const [patientappointments, setPatientAppointments] = useState([]);
  const [doctorappointments, setDoctorAppointments] = useState([]);
  const [user_name, setUserName] = useState("");
  const [credits, setCredits] = useState("");
  const [isSubscribed, setSubscription] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { updateUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUser = () => {
      fetch(
        `${API_BASE_URL}/user/${JSON.parse(localStorage.getItem("user"))._id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          console.log("res = ", res);

          updateUser(res);
          setUserName(res.name);
          setCredits(res.credits);
          setSubscription(res.subscription);

          if (res.role === "doctor") {
            setIsDoctor(true);
          }
          setIsLoading(false);
        });
    };

    fetchUser();
  }, []);

  useEffect(() => {
    fetchDonateOrders();
  }, []);

  useEffect(() => {
    fetchRequestOrders();
  }, []);

  useEffect(() => {
    patientAppointments();
  }, []);

  useEffect(() => {
    doctorAppointments();
  }, []);

  function fetchDonateOrders() {
    fetch(
      `${API_BASE_URL}/mydonatedorders/${
        JSON.parse(localStorage.getItem("user"))._id
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        setDonateOrders(data);
        setIsLoading(false);
      });
  }

  function fetchRequestOrders() {
    fetch(
      `${API_BASE_URL}/myrequestedorders/${
        JSON.parse(localStorage.getItem("user"))._id
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        setRequestOrders(data);
        setIsLoading(false);
      });
  }

  function patientAppointments() {
    fetch(
      `${API_BASE_URL}/patient-appointments/${
        JSON.parse(localStorage.getItem("user"))._id
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        setPatientAppointments(data);
        setIsLoading(false);
      });
  }

  function doctorAppointments() {
    fetch(
      `${API_BASE_URL}/doctor-appointments/${
        JSON.parse(localStorage.getItem("user"))._id
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        setDoctorAppointments(data);
        setIsLoading(false);
      });
  }

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

  const [feedback, setFeedback] = useState(null)
  const [starRating, setStarRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState("")
  const [feedbackIsOpen, setFeedbackIsOpen] = useState(false)
  const handleFeedback = () => {
    setFeedbackIsOpen(true)
  }

  const handleStarRating = (newRating) => {
    setStarRating(newRating)
  }
  const handleFeedbackText = (e) => {
    setFeedbackText(e.target.value)
  }

  const sendFeedback = (order_id) => {
    console.log(starRating, feedbackText)
    fetch(`${API_BASE_URL}/feedback/${order_id}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stars: starRating,
        feedback: feedbackText
      })
    }
    ).then(res => res.json())
      .then(doc => {
        setFeedbackIsOpen(false)
        notifyB(doc.success)
        // setDonateOrders((preOrder) => {
        //   return (preOrder.map((item) => item._id === order_id ? {
        //     ...item,
        //     feedback: {
        //       stars: starRating,
        //       feedback: feedbackText
        //     }
        //   } : item))
        // })
        // setRequestOrders((preOrder) => {
        //   return (preOrder.map((item) => item._id === order_id ? {
        //     ...item,
        //     feedback: {
        //       stars: starRating,
        //       feedback: feedbackText
        //     }
        //   } : item))
        // })
      })
      .catch(res => {
        console.error(res)
        notifyA(res.error)
      })
  }
  return (
    <div className="profilediv">
      <div className="bodyy">
        <div>
          {
            <div>
              {isSubscribed ? (
                <></>
              ) : (
                <>
                  <div className="subs">
                    <div className="subimg">
                      <img src="./subscribe.jpg" alt="" />
                    </div>
                    <div className="headsub">
                      <h2>
                        Subscribe now to avail exclusive services on our site.
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
                </>
              )}
            </div>
          }
        </div>

        <h1>PROFILE</h1>
        <div className="contentt">
          <div className="userdet">
            <img src="./profile-pic.png" alt="" />

            <h1>
              {" "}
              {user_name} <br></br>
            </h1>
            <h1>
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <p>
                  {isSubscribed ? (
                    <>
                      <div className="cjec">
                        <p id="sss">Subscription : ACTIVE</p>
                        <img id="subpix" src="./checked.png" alt="" srcset="" />
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </p>
              )}
            </h1>
            <span id="credits">
              <h4>
                Credits : {credits} <br />
              </h4>

              <img src="./rupee.png" alt="" />
            </span>
          </div>
          <div className="donatedorders">
            <h2>
              <img className="titleimg" src="./donatemed.png" alt="" /> My
              Donated Orders
            </h2>
            <ul className="proul">
              <li className="profli">
                <h3 className="pm">Order ID</h3>
                {/* <h3 className="p1">Order Type</h3> */}
                <h3 className="p2">Quantity</h3>
                <h3 className="p3">Location</h3>
                <h3 className="p3">Status</h3>
              </li>
              {isLoading ? (
                <h1 className="loada">Loading...</h1>
              ) : (
                <div className="procont">
                  {donateorders.map((donateorders) => {
                    console.log(donateorders)
                    return (
                      <li className="proco" key={donateorders.medicine_name}>
                        <p className="pm">{donateorders._id.toString().slice(-4)}</p>
                        {/* <p className="p1">{donateorders.expiry_date} </p> */}
                        <p className="p2">{donateorders.no_of_medicines}</p>
                        <p className="p3"> {donateorders.location.location}</p>
                        {
                          donateorders.acceptance_status === "accepted" && donateorders.verify_status === false ? (
                            <p>Volunter is assigned</p>
                          ) : donateorders.acceptance_status === "pending" ? (
                            <p>Pending</p>
                          ) : (
                            <div>
                              {console.log(donateorders.feedback)}
                              <p>Medicines collected</p>
                              {
                                !donateorders.feedback.feedback&& (
                                  <>
                                    <button onClick={() => handleFeedback()}>Feedback</button>
                                    <Modal
                                      className="Modal__container"
                                      onRequestClose={() => setFeedbackIsOpen(false)}
                                      isOpen={feedbackIsOpen}
                                      style={{ overlay: { zIndex: 9999 }, content: { zIndex: 9999 } }}
                                    >
                                      <ReactStars
                                        count={5}
                                        onChange={handleStarRating}
                                        size={24}
                                        activeColor="#ffd700"
                                      />
                                      <textarea
                                        placeholder="Feedback"
                                        onChange={handleFeedbackText}
                                      />
                                      <button onClick={() => sendFeedback(donateorders._id)}>submit</button>
                                      <button onClick={() => setFeedbackIsOpen(false)}>Close</button>
                                    </Modal>
                                  </>
                                )
                              }

                            </div>
                          )
                        }
                      </li>
                    )
                  })}
                </div>
              )}
            </ul>
          </div>

          <div className="requestorders">
            <h2>
              <img className="titleimg" src="./requestmed.png" alt="" /> My
              Requested Orders
            </h2>
            <ul className="proul">
              <li className="profli">
                <h3 className="pm">Order ID</h3>
                {/* <h3 className="p1"></h3> */}
                <h3 className="p2">Quantity</h3>
                <h3 className="p3">Location</h3>
                <h3 className="p4">Status</h3>
              </li>
              {isLoading ? (
                <h1 className="loada">Loading...</h1>
              ) : (
                <div className="procont">
                  {requestorders.map((requestorders) => (
                    <li className="proco" key={requestorders._id}>
                      <p className="pm"> {requestorders._id.toString().slice(-4)}</p>
                      {/* <p className="p1"> {requestorders.expiry_date}</p> */}
                      <p className="p2"> {requestorders.no_of_medicines}</p>
                      <p className="p3">{requestorders.location.location}</p>
                      {
                        requestorders.acceptance_status === "accepted" && requestorders.verify_status === false ? (
                          <p>Volunter is assigned</p>
                        ) : requestorders.acceptance_status === "pending" ? (
                          <p>Pending</p>
                        ) : (
                          <div>
                            {console.log(requestorders.feedback)}
                            <p>Medicines collected</p>
                            {
                              requestorders.feedback.feedback === null && (
                                <>
                                  <button onClick={() => handleFeedback()}>Feedback</button>
                                  <Modal
                                    className="Modal__container"
                                    onRequestClose={() => setFeedbackIsOpen(false)}
                                    isOpen={feedbackIsOpen}
                                    style={{ overlay: { zIndex: 9999 }, content: { zIndex: 9999 } }}
                                  >
                                    <ReactStars
                                      count={5}
                                      onChange={handleStarRating}
                                      size={24}
                                      activeColor="#ffd700"
                                    />
                                    <textarea
                                      placeholder="Feedback"
                                      onChange={handleFeedbackText}
                                    />
                                    <button onClick={() => sendFeedback(requestorders._id)}>submit</button>
                                    <button onClick={() => setFeedbackIsOpen(false)}>Close</button>
                                  </Modal>
                                </>
                              )
                            }

                          </div>
                        )
                      }
                    </li>
                  ))}
                </div>
              )}
            </ul>
          </div>

          {isdoctor ? (
            <div className="appointm">
              <h2>
                <img className="titleimg" src="./appointment.png" alt="" /> My
                Appointments
              </h2>
              <ul className="proul">
                <li className="profli">
                  <h3 className="p1">Patient Name</h3>
                  <h3 className="p2">Date</h3>
                  <h3 className="p2">Time</h3>
                  <h3 className="p2">Status</h3>
                  <h3 className="p2">Link</h3>
                  <h3 className="p2">Rating</h3>
                  <h3 className="p2">Feedback</h3>
                </li>
                {isLoading ? (
                  <h1 className="loada">Loading...</h1>
                ) : (
                  <div className="procont">
                    {doctorappointments.map((doctorappointments) => (
                      <li className="proco" key={doctorappointments._id}>
                        <p className="p1"> {doctorappointments.patient.name}</p>
                        <p className="p1">
                          {" "}
                          {doctorappointments.appointment_date}
                        </p>
                        <p className="p1">
                          {" "}
                          {doctorappointments.appointment_time}
                        </p>
                        {!doctorappointments.confirm_status &&
                        !doctorappointments.reject_status ? (
                          <p className="p2">Pending</p>
                        ) : doctorappointments.confirm_status ? (
                          <p className="p2">Confirmed</p>
                        ) : (
                          <p className="p2">Rejected</p>
                        )}
                        <p className="p1">
                          {" "}
                          {doctorappointments.appointment_link}
                        </p>
                        <p className="p1"> {doctorappointments.rating}</p>
                        <p className="p1"> {doctorappointments.feedback}</p>
                      </li>
                    ))}
                  </div>
                )}
              </ul>
            </div>
          ) : (
            <div className="myappoint">
              <h2>
                <img className="titleimg" src="./appointment.png" alt="" /> My
                Appointments
              </h2>
              <ul className="proul">
                <li className="profli">
                  <h3 className="p1">Doctor Name</h3>
                  <h3 className="p2">Date</h3>
                  <h3 className="p2">Time</h3>
                  <h3 className="p2">Status</h3>
                  <h3 className="p2">Link</h3>
                  <h3 className="p2">Rating</h3>
                  <h3 className="p2">Feedback</h3>
                </li>
                {isLoading ? (
                  <h1 className="loada">Loading...</h1>
                ) : (
                  <div className="procont">
                    {patientappointments.map((patientappointments) => (
                      <li className="proco" key={patientappointments._id}>
                        <p className="p1"> {patientappointments.doctor.name}</p>
                        <p className="p2">
                          {" "}
                          {patientappointments.appointment_date}
                        </p>
                        <p className="p2">
                          {" "}
                          {patientappointments.appointment_time}
                        </p>
                        {!patientappointments.confirm_status &&
                        !patientappointments.reject_status ? (
                          <p className="p2">Pending</p>
                        ) : patientappointments.confirm_status ? (
                          <p className="p2">Confirmed</p>
                        ) : (
                          <p className="p2">Rejected</p>
                        )}
                        <p className="p2">
                          {patientappointments.appointment_link}
                        </p>

                        <p className="p2"> {patientappointments.rating}</p>

                        <p className="p2"> {patientappointments.feedback} </p>
                      </li>
                    ))}
                  </div>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}