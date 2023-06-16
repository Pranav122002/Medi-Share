import React, { useState, useContext, useEffect } from "react";
import "../css/Doctors.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import { API_BASE_URL } from "../config";

export default function Profile() {
  const navigate = useNavigate();

  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const [userid, setUserId] = useState("");

  const [doctor_id, setDoctorId] = useState("");
  const [doctor_name, setDoctorName] = useState("");
  const [appointment_date, setAppointmentDate] = useState("");
  const [appointment_time, setAppointmentTime] = useState("");

  const [isDoctor, setIsDoctor] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const [linkText, setLinkText] = useState("");

  const [appointments, setAppointments] = useState([]);
  const [patient, setPatient] = useState("");

  useEffect(() => {
    fetchUser();
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (isDoctor) {
      if (userid) {
        fetchAppointments();
      }
    }
  }, [userid]);

  function fetchAppointments() {
    const doctorId = userid;
    console.log("doctorId = ", doctorId);

    fetch(`${API_BASE_URL}/my-appointments/${doctorId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
        setIsLoading(false);
        console.log("appointments = ", data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const postBookData = () => {
    if (!selectedDoctor) {
      notifyA("Please select a doctor from the list.");
      return;
    }

    fetch(`${API_BASE_URL}/book-appointment/${userid}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        doctor: selectedDoctor._id,
        patient: userid,
        appointment_date: appointment_date,
        appointment_time: appointment_time,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB(data.msg);
          navigate("/profile");
        }
        console.log(data);
      });
  };

  function confirmAppointment(appointmentId) {
    fetch(`${API_BASE_URL}/confirm-appointment/${appointmentId}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (
          data ==
          "Patient has insufficient credits. Please reject the appointment..."
        ) {
          notifyA(
            "Patient has insufficient credits. Please reject the appointment..."
          );
        } else {
          notifyB("Appointment confirmed successfully...");
          navigate("/profile");
        }
      })
      .catch((error) => {
        console.log(error);
        notifyA(error);
      });
  }

  function rejectAppointment(appointmentId) {
    fetch(`${API_BASE_URL}/reject-appointment/${appointmentId}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        notifyB("Appointment rejected successfully...");
        navigate("/profile");
      })
      .catch((error) => {
        console.log(error);
        notifyA(error);
      });
  }

  function fetchUser() {
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
        if (res.role === "doctor") {
          setIsDoctor(true);
        } else {
          setIsDoctor(false);
          setPatient(res.name);
        }

        setUserId(res._id);
        setIsLoading(false);
      });
  }

  function fetchDoctors() {
    fetch(`${API_BASE_URL}/all-doctors`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("Doctors list = ", res);

        setDoctors(res);
      })
      .catch((error) => {
        console.log(error);
        notifyA("Error fetching doctors");
      });
  }

  function addLink(appointmentId) {
    console.log("linktext = ", linkText);
    console.log("id = ", appointmentId);
    
    fetch(`${API_BASE_URL}/add-appointment-link/${appointmentId}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        appointment_link: linkText,
      })
    }).then((res) => res.json())
      .then((data) => {
        notifyB("Link added successfully...");
        navigate("/profile");
      })
      .catch((error) => {
        console.log(error);
        notifyA(error);
      });
  }

  
  return (
    <div className="doctor">
      <Hnavbar />

      <div className="bodyy">
        <Navbar />

        <div className="doctordetail">
          <img id="doctorui1" src="./doctor3.png" alt="" />
          <h1>Doctor Appointment </h1>
          <div className="doctorp">
            <p>Book an appointment with our affiliated doctors today.</p>
            <p>
              Appointments can be booked with the credits earned on our website.
            </p>
          </div>
        </div>
        <div className="Doctorui">
          <div className="">
            {isLoading ? (
              <h1>Loading...</h1>
            ) : (
              <>
                {isDoctor ? (
                  <>
                    <h2>Your Appointments</h2>
                    <div className="appointments-container">
                      {/* {appointments.length > 0 ? ( */}

                      <ul>
                        {appointments.map((appointment) => (
                          <li key={appointment._id}>
                            <p>
                              <img src="./doctor2.png" alt="" />
                            </p>
                            <p>Doctor: {appointment.doctor.name}</p>
                            <p>Patient: {appointment.patient.name}</p>
                            <p>Date: {appointment.appointment_date}</p>
                            <p>Time: {appointment.appointment_time}</p>

                            {!appointment.confirm_status &&
                            !appointment.reject_status ? (
                              <>
                                <button
                                  className="button-53"
                                  type="submit"
                                  onClick={() => {
                                    confirmAppointment(appointment._id);
                                  }}
                                >
                                  {" "}
                                  Confirm
                                </button>
                                <button
                                  className="button-53"
                                  type="submit"
                                  onClick={() => {
                                    rejectAppointment(appointment._id);
                                  }}
                                >
                                  {" "}
                                  Reject
                                </button>
                              </>
                            ) : appointment.confirm_status ? (
                              <p className="p2">Status: Confirmed</p>
                            ) : (
                              <p className="p2">Status: Rejected</p>
                            )}
                            <p>
                              Link: {appointment.appointment_link ? (
                                appointment.appointment_link
                              ) : (
                                <>
                                  <input
                                    type="text"
                                    value={linkText}
                                    onChange={(e) =>
                                      setLinkText(e.target.value)
                                    }
                                  />
                                  <button
                                    onClick={() => addLink(appointment._id)}
                                  >
                                    Add Link
                                  </button>
                                </>
                              )}
                            </p>
                          </li>
                        ))}
                      </ul>

                      {/* ) : ( */}

                      {/* <h3 className="noaot">No appointments found.</h3> */}

                      {/* ) */}
                      {/* } */}
                    </div>
                  </>
                ) : (
                  <>
                    <h1>Book an appointment</h1>
                    <div className="doctorcont">
                      <img src="./doctor2.png" alt="" />

                      <div>
                        <div className="book">
                          <div className="bookForm">
                            <div className="logo">
                              <h1>Book Appointment</h1>
                            </div>

                            <div>
                              <input
                                type="text"
                                name="doctor_id"
                                id="doctor_id"
                                value={selectedDoctor._id}
                                placeholder="Doctor's ID"
                                onChange={(e) => {
                                  setDoctorId(e.target.value);
                                }}
                              />
                            </div>

                            <div>
                              <input
                                type="text"
                                name="doctor_name"
                                id="doctor_name"
                                value={selectedDoctor.name}
                                placeholder="Doctor's Name"
                                onChange={(e) => {
                                  setDoctorName(e.target.value);
                                }}
                              />
                            </div>

                            <div>
                              <input
                                type="date"
                                name="appointment_date"
                                id="appointment_date"
                                placeholder="Appointment Date"
                                value={appointment_date}
                                onChange={(e) => {
                                  setAppointmentDate(e.target.value);
                                }}
                              />
                            </div>

                            <div>
                              <input
                                type="time"
                                name="appointment_time"
                                id="appointment_time"
                                placeholder="Appointment Time (24hr format)"
                                value={appointment_time}
                                onChange={(e) => {
                                  setAppointmentTime(e.target.value);
                                }}
                              />
                            </div>

                            <button
                              className="button-53"
                              value="Book "
                              type="submit"
                              onClick={() => {
                                postBookData(patient);
                              }}
                            >
                              {selectedDoctor
                                ? `Book : ${selectedDoctor.doctor_details.fees}`
                                : "Book"}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="doctorslist">
                        <ul>
                          <h2>Doctors list</h2>
                          {doctors.map((doctor) => (
                            <li
                              key={doctor._id}
                              onClick={() => setSelectedDoctor(doctor)}
                            >
                              {doctor.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
