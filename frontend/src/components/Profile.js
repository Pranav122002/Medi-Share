import React, { useState, useContext, useEffect } from "react";
import "../css/SignIn.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [isMine, setIsMine] = useState(true);
  const [editprofile, seteditprofile] = useState(false);
  const [viewprofile, setViewProfile] = useState(false);
  const [viewImage, setViewImage] = useState(false);
  const [updatedDoctorDetails, setUpdatedDoctorDetails] = useState({
    fees: "",
    qualification: "",
    specialization: "",
    experience: "",
    availability: "",
    hospital_name: "",
  });
  const [updatedVolunteerDetails, setUpdatedVolunteerDetails] = useState({
    qualification: "",
    available: "",
    NGO_name: "",
    location: { lng: "", lat: "" },
  });
  const { updateUser } = useContext(UserContext);
  const [appointmentRatingsFeedbacks, setAppointmentRatingsFeedbacks] =
    useState([]);
  console.log(appointmentRatingsFeedbacks);
  useEffect(() => {
    fetchUser();


  }, []);
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

        setUser(res);

        if (res.role === "doctor") {
          setUpdatedDoctorDetails({
            fees: res.doctor_details.fees,
            qualification: res.doctor_details.qualification,
            specialization: res.doctor_details.specialization,
            experience: res.doctor_details.experience,
            availability: res.doctor_details.availability,
            hospital_name: res.doctor_details.hospital_name,
          });

          fetchDoctorRatingsFeedbacks(user._id);
        } else if (res.role === "volunteer") {
          setUpdatedVolunteerDetails({
            qualification: res.volunteer_details.qualification,
            available: res.volunteer_details.available,
            NGO_name: res.volunteer_details.NGO_name,
            location: {
              lng: res.volunteer_details.location.lng,
              lat: res.volunteer_details.location.lat,
            },
          });
        }
        if (res.role === "doctor") {
          setIsDoctor(true);
        }
        setIsLoading(false);
      });
  };
  const fetchDoctorRatingsFeedbacks = () => {
    fetch(`${API_BASE_URL}/doctor-ratings-feedbacks/${user._id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setAppointmentRatingsFeedbacks(res);
      });
  };

  const handleEdit = () => {
    setEditing(true);
  };

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
      `${API_BASE_URL}/mydonatedorders/${JSON.parse(localStorage.getItem("user"))._id
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
      `${API_BASE_URL}/myrequestedorders/${JSON.parse(localStorage.getItem("user"))._id
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
      `${API_BASE_URL}/patient-appointments/${JSON.parse(localStorage.getItem("user"))._id
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
      `${API_BASE_URL}/doctor-appointments/${JSON.parse(localStorage.getItem("user"))._id
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        setDoctorAppointments(data);
        setIsLoading(false);
      });
  }
  const handleInputChange = (e) => {
    if (user.role === "doctor") {
      setUpdatedDoctorDetails({
        ...updatedDoctorDetails,
        [e.target.name]: e.target.value,
      });
    } else if (user.role === "volunteer") {
      if (e.target.name === "lng" || e.target.name === "lat") {
        setUpdatedVolunteerDetails((prevDetails) => ({
          ...prevDetails,
          location: {
            ...prevDetails.location,
            [e.target.name]: Number(e.target.value),
          },
        }));
      } else {
        setUpdatedVolunteerDetails({
          ...updatedVolunteerDetails,
          [e.target.name]: e.target.value,
        });
      }
    }
  };

  const handleSubmit = () => {
    const updatedUser = { ...user };
    if (updatedUser.role === "doctor") {
      updatedUser.doctor_details = { ...updatedDoctorDetails };
      fetch(`${API_BASE_URL}/update-doctor-details/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify(updatedUser),
      })
        .then((res) => res.json())
        .then((res) => {
          setEditing(false);
          setUser(res);
        });
    } else if (updatedUser.role === "volunteer") {
      updatedUser.volunteer_details = { ...updatedVolunteerDetails };
      fetch(`${API_BASE_URL}/update-volunteer-details/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify(updatedUser),
      })
        .then((res) => res.json())
        .then((res) => {
          setEditing(false);
          setUser(res);
        });
    }
  };

  const subscribe = () => {
    fetch(
      `${API_BASE_URL}/subscribe/${JSON.parse(localStorage.getItem("user"))._id
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


        {editprofile ? (<>
          <div className="editparent" >
            <div className="editpromain">
              <img onClick={() => { seteditprofile(false) }} id="clossss" src="./close.png" alt="" />

              <p>Name: {user.name}</p>

              {user.role === "doctor" && (<>
                <div>
                  <p className="pdflex">
                    <div>Verification: {user.doctor_details.verification}</div>

                  </p>
                  <p>Fees: {user.doctor_details.fees}</p>
                  <p>Qualification: {user.doctor_details.qualification}</p>
                  <p>Specialization: {user.doctor_details.specialization}</p>
                  <p>Experience: {user.doctor_details.experience}</p>
                  <p>Availability: {user.doctor_details.availability}</p>
                  <p>Hospital Name: {user.doctor_details.hospital_name}</p>
                  <p><div className="certfed">Certificate uploaded: <button onClick={() => { setViewImage("active") }}>View Certificate</button>
                    <div className={`imgprof ${viewImage && "active"}`}>
                      <img id="asgaadcag"
                        src={user.doctor_details.certificate}
                        alt="doctor certificate"
                      />
                      <div className="gagasda">  <img onClick={() => { setViewImage(false) }} src="./close.png" alt="" srcset="" /></div>

                    </div>

                  </div>
                  </p>
                  
                </div>
              </>)}
              {user.role === "volunteer" && (
                <div>
                  <p className="pdflex">
                    <div>Verification: {user.volunteer_details.verification}</div>
                  </p>
                  <p>Qualification: {user.volunteer_details.qualification}</p>
                  <p>Available: {user.volunteer_details.available}</p>
                  <p>NGO Name: {user.volunteer_details.NGO_name}</p>
                  <p>
                    Location: {user.volunteer_details.location.lng},{" "}
                    {user.volunteer_details.location.lat}
                  </p>
                  <p><div className="certfed">Certificate uploaded: <button onClick={() => { setViewImage("active") }}>View Certificate</button>
                    <div className={`imgprof ${viewImage && "active"}`}>
                      <img
                        src={user.volunteer_details.certificate}
                        alt="volunteer certificate "
                      />
                      <div className="gagasda">  <img onClick={() => { setViewImage(false) }} src="./close.png" alt="" srcset="" /></div>

                    </div>

                  </div>
                  </p>

                </div>
              )}

              {isMine && !editing && <button id="asagws" onClick={handleEdit}>Edit Profile</button>}


              {editing && (
                <div className="editsprofs">
                  <h2>Edit Profile</h2>
                  {user.role === "doctor" && (
                    <div className="editprofdocs">
                      <div className="editsapa">
                        <label>Fees:</label>
                        <input
                          type="text"
                          name="fees"
                          value={updatedDoctorDetails.fees}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="editsapa">
                        <label>Qualification:</label>
                        <input
                          type="text"
                          name="qualification"
                          value={updatedDoctorDetails.qualification}
                          onChange={handleInputChange}
                        />
                      </div>
                  
                      <div className="editsapa">
                        <label>Specialization:</label>
                        <input
                          type="text"
                          name="specialization"
                          value={updatedDoctorDetails.specialization}
                          onChange={handleInputChange}
                        />
                      </div>
                   
                      <div className="editsapa">
                        <label>Experience:</label>
                        <input
                          type="text"
                          name="experience"
                          value={updatedDoctorDetails.experience}
                          onChange={handleInputChange}
                        />
                      </div>
                    
                      <div className="editsapa">
                        <label>Availability:</label>
                        <input
                          type="text"
                          name="availability"
                          value={updatedDoctorDetails.availability}
                          onChange={handleInputChange}
                        />
                      </div>
                 
                      <div className="editsapa">
                        <label>Hospital Name:</label>
                        <input
                          type="text"
                          name="hospital_name"
                          value={updatedDoctorDetails.hospital_name}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}
                  {user.role === "volunteer" && (
                    <div>
                      <div className="editsapa">
                        <label>Qualification:</label>
                        <input
                          type="text"
                          name="qualification"
                          value={updatedVolunteerDetails.qualification}
                          onChange={handleInputChange}
                        />
                      </div>
                   
                      <div className="editsapa">
                        <label>Available:</label>
                        <input
                          type="text"
                          name="available"
                          value={updatedVolunteerDetails.available}
                          onChange={handleInputChange}
                        />
                      </div>
                   
                      <div className="editsapa">
                        <label>NGO Name:</label>
                        <input
                          type="text"
                          name="NGO_name"
                          value={updatedVolunteerDetails.NGO_name}
                          onChange={handleInputChange}
                        />
                      </div>
                   
                      <div className="editsapa">
                        <label>Location (lng):</label>
                        <input
                          type="number"
                          name="lng"
                          value={updatedVolunteerDetails.location.long || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    
                      <div className="editsapa">
                        <label>Location (lat):</label>
                        <input
                          type="number"
                          name="lat"
                          value={updatedVolunteerDetails.location.lat || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}
                  <button id="asagws"  onClick={handleSubmit}>Save</button>
                </div>

              )}
            </div>
          </div>

        </>) : (<></>)}


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
              {user_name} 
              <button id="biewprod" onClick={() => {
                seteditprofile("active")
              }} >Profile Details</button>
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
                        <p className="pm"><span className="profdonspan">Order ID :</span>{donateorders._id.toString().slice(-4)}</p>
                        {/* <p className="p1">{donateorders.expiry_date} </p> */}
                        <p className="p2"><span className="profdonspan">Quantity :</span>{donateorders.no_of_medicines}</p>
                        <p className="p3"> <span className="profdonspan">Location :</span>{donateorders.location.location}</p>
                        {
                          donateorders.acceptance_status === "accepted" && donateorders.verify_status === false ? (
                            <p><span className="profdonspan">Status :</span>Volunter is assigned</p>
                          ) : donateorders.acceptance_status === "pending" ? (
                            <p><span className="profdonspan">Status :</span>Pending</p>
                          ) : (<><p>
                            <div className="asfasfa">
                              {console.log(donateorders.feedback)}
                              <span className="profdonspan" >Status :</span>Medicines collected
                              {
                                !donateorders.feedback.feedback && (
                                  <>
                                    <button className="burst" onClick={() => handleFeedback()}>Feedback</button>
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
                          </p>
                          </>)
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
                      <p className="pm"><span className="profdonspan">Order ID :</span> {requestorders._id.toString().slice(-4)}</p>
                      {/* <p className="p1"> {requestorders.expiry_date}</p> */}
                      <p className="p2"><span className="profdonspan">Quantity :</span> {requestorders.no_of_medicines}</p>
                      <p className="p3"><span className="profdonspan">Location :</span>{requestorders.location.location}</p>
                      {
                        requestorders.acceptance_status === "accepted" && requestorders.verify_status === false ? (
                          <p><span className="profdonspan">Status :</span>Volunter is assigned</p>
                        ) : requestorders.acceptance_status === "pending" ? (
                          <p><span className="profdonspan">Status :</span>Pending</p>
                        ) : (
                          <>
                            <p>

                              <div className="">
                                {console.log(requestorders.feedback)}
                                <span className="profdonspan">Status :</span>Medicines collected
                                {
                                  requestorders.feedback.feedback === null && (
                                    <>
                                      <button className="burst"  onClick={() => handleFeedback()}>Feedback</button>
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
                            </p>
                          </>)
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
                        <p className="p1"><span className="profdonspan">Patient Name :</span>{doctorappointments.patient.name}</p>
                        <p className="p1">
                          
                        <span className="profdonspan">Date :</span>{doctorappointments.appointment_date}
                        </p>
                        <p className="p1">
                         
                        <span className="profdonspan">Time :</span> {doctorappointments.appointment_time}
                        </p>
                        {!doctorappointments.confirm_status &&
                          !doctorappointments.reject_status ? (
                          <p className="p2"><span className="profdonspan">Status :</span>Pending</p>
                        ) : doctorappointments.confirm_status ? (
                          <p className="p2"><span className="profdonspan">Status :</span>Confirmed</p>
                        ) : (
                          <p className="p2"><span className="profdonspan">Status :</span>Rejected</p>
                        )}
                        <p className="p1">
                          
                          <span className="profdonspan">Link :</span><span className="profdonspa">{doctorappointments.appointment_link?(<>{doctorappointments.appointment_link}</>):(<>-</>)}</span>
                        </p>
                        <p className="p1"><span className="profdonspan">Rating :</span> {doctorappointments.rating}</p>
                        <p className="p1"><span className="profdonspan">Feedback :</span><span className="profdonspa">{doctorappointments.feedback}</span> </p>
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
                        <p className="p1"><span className="profdonspan">Doctor Name :</span> {patientappointments.doctor.name}</p>
                        <p className="p2">
                         
                          <span className="profdonspan">Date :</span>  {patientappointments.appointment_date}
                        </p>
                        <p className="p2">
                       
                          <span className="profdonspan">Time :</span> {patientappointments.appointment_time}
                        </p>
                        {!patientappointments.confirm_status &&
                          !patientappointments.reject_status ? (
                          <p className="p2"><span className="profdonspan">Status :</span>Pending</p>
                        ) : patientappointments.confirm_status ? (
                          <p className="p2"><span className="profdonspan">Status :</span>Confirmed</p>
                        ) : (
                          <p className="p2"><span className="profdonspan">Status :</span>Rejected</p>
                        )}
                        <p className="p2">
                        <span className="profdonspan">Link :</span><span className="profdonspa">{patientappointments.appointment_link ?(<>{patientappointments.appointment_link}</>):(<>-</>)}</span>
                        </p>

                        <p className="p2"><span className="profdonspan">Rating :</span> {patientappointments.rating ?(<>{patientappointments.rating}</>):(<>-</>)}</p>

                        <p className="p2"><span className="profdonspan">Feedback :</span ><span className="profdonspa">{patientappointments.feedback ?(<>{patientappointments.feedback}</>):(<>-</>)}</span> </p>
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