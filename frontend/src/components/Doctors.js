import React, { useState, useContext, useEffect } from "react";
import "../css/Doctors.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";

export default function Profile() {
  const navigate = useNavigate();

  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const [doctor_name, setDoctorName] = useState("");
  const [appointment_date, setAppointmentDate] = useState("");

  const [isDoctor, setIsDoctor] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    fetchUser();
    fetchDoctors();
  }, []);

  const [appointments, setAppointments] = useState([]);
  const [patient, setPatient] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  function fetchAppointments() {
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
      .then((userData) => {
        const docName = userData.name;

        fetch(`http://localhost:5000/my-appointments/${docName}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setAppointments(data);
            setIsLoading(false)
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const postBookData = (patient_name) => {
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
      .then((result) => {
        fetch(
          `http://localhost:5000/book-appointment/${
            JSON.parse(localStorage.getItem("user"))._id
          }`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              doctor_name: doctor_name,
              patient_name: patient_name,
              appointment_date: appointment_date,
            }),
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              notifyA(data.error);
            } else {
              notifyB(data.msg);
            }
            console.log(data);
          });
      });
  };

  function confirmAppointment(appointmentId) {
    fetch(`http://localhost:5000/confirm-appointment/${appointmentId}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        notifyB("Appointment confirmed successfully...");
        navigate("/profile");
      })
      .catch((error) => {
        console.log(error);
        notifyA(error);
      });
  }

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
        if (res.role === "doctor") {
          setIsDoctor(true);
        } else {
          setIsDoctor(false);
          setPatient(res.name);
        }
        setIsLoading(false);
        console.log(isDoctor);
      });
  }

  function fetchDoctors() {
    fetch("http://localhost:5000/all-doctors", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setDoctors(res);
      })
      .catch((error) => {
        console.log(error);
        notifyA("Error fetching doctors");
      });
  }

  return (
    <div>
      <Hnavbar />

      <div className="bodyy">
        <Navbar />

        
          <div className="">
            {isDoctor ? (
            
              <div className="appointments-container">
                <h2>Your Appointments</h2>
                {appointments.length > 0 ? (
                  <ul>
                    {appointments.map((appointment) => (
                      <li key={appointment._id}>
                        <p>Doctor: {appointment.doctor_name}</p>
                        <p>Date: {appointment.appointment_date}</p>
                        <button
                          type="submit"
                          onClick={() => {
                            confirmAppointment(appointment._id);
                          }}
                        >
                          Confirm
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <h3 className="noaot">No appointments found.</h3>
                )}
              </div>
            ) : (
              <div className="doctorcont">
                <h3>Book an appointment with this doctors</h3>
                <div>
                  <ul>
                    {doctors.map((doctor) => (
                      <li key={doctor._id}>{doctor.name}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="book">
                    <div className="bookForm">
                      <div className="logo">
                        <h1>Book Appointment</h1>
                      </div>
                      <div>
                        <input
                          type="text"
                          name="doctor_name"
                          id="doctor_name"
                          value={doctor_name}
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

                      <input
                        type="submit"
                        id="book-btn"
                        onClick={() => {
                          postBookData(patient);
                        }}
                        value="Book : 200 Credits"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        




      </div>
    </div>
  );
}
