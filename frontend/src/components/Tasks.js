import React, { useState, useContext, useEffect } from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import "../css/Tasks.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { API_BASE_URL } from "../config";

export default function Tasks() {
  const navigate = useNavigate();

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);
  const [isVolunteer, setIsVolunteer] = useState("");
  const [isAdmin, setIsAdmin] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [task_info, setTaskInfo] = useState("");
  const [volunteer_email, setVolunteerEmail] = useState("");
  const [volunteer_name, setVolunteerName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [myname, setMyName] = useState("");
  const [myTasks, setMyTasks] = useState([]);

  const [sug, showsug] = useState(!false);

  const handleShowsug = () => {
    showsug(false);
    console.log(sug);
  };
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  function fetchUser() {
    fetch(
      `${API_BASE_URL}/user/${
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
        if (res.role === "admin") {
          setIsAdmin(true);
          setIsVolunteer(false);
        } else if (res.role === "volunteer") {
          setIsAdmin(false);
          setIsVolunteer(true);
          setMyName(res.name);
        }
        setIsLoading(false);
      });
  }

  //   function fetchMyTasks() {
  //     console.log("myname is = ", myname);

  //     fetch(`${API_BASE_URL}/my-tasks`, {
  //       headers: {
  //         Authorization: "Bearer " + localStorage.getItem("jwt"),
  //       },
  //       body: JSON.stringify({
  //         name: myname,

  //       }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setMyTasks(data);
  //         console.log("my tasks = ", data);
  //       });
  //   }

  const fetchMyTasks = () => {
    const userName = JSON.parse(localStorage.getItem("user")).name;
    fetch(`${API_BASE_URL}/my-tasks/${userName}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMyTasks(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function fetchTasks() {
    fetch(`${API_BASE_URL}/all-tasks`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        console.log("all tasks = ", data);
      });
  }

  const postTaskData = () => {
    fetch(
      `${API_BASE_URL}/user/${
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
        fetch(`${API_BASE_URL}/assign-task`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            task_info: task_info,
            deadline: deadline,
            volunteer_email: volunteer_email,
            volunteer_name: volunteer_name,
          }),
        })
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

  const renderCard = (card, index) => {
    return (
      <>
        <Card className="Card" key={index}>
          <Card.Body>
            <Card.Title id="title">{card.volunteer_name}</Card.Title>
            <Card.Text id="details">
              <p>
                <div className="content-details">Task Info:-</div>
                {card.task_info}
                <br />
              </p>
              <p>
                <div className="content-details">Deadline:-</div>
                {card.deadline}
                <br />
              </p>
              <p>
                <div className="content-details">Volunteer Email:-</div>
                {card.volunteer_email}
                <br />
              </p>
            </Card.Text>
          </Card.Body>
        </Card>
      </>
    );
  };

  return (
    <div className="task">
      <Hnavbar />

      <div className="bodyy">
        <Navbar />

        {isAdmin ? (
          <div>
            <div className="donate">
              <div data-aos="zoom-in" className="donateForm">
                <div className="logo">
                  <h1>Assign Task</h1>
                </div>
                <div>
                  <input
                    onClick={handleShowsug}
                    type="text"
                    name="task_info"
                    id="task_info"
                    value={task_info}
                    placeholder="Task Info"
                    onChange={(e) => {
                      setTaskInfo(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <input
                    type="date"
                    name="deadline"
                    id="deadline"
                    placeholder="Deadline"
                    value={deadline}
                    onChange={(e) => {
                      setDeadline(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="volunteer_name"
                    id="volunteer_name"
                    placeholder="Volunteer Name"
                    value={volunteer_name}
                    onChange={(e) => {
                      setVolunteerName(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="volunteer_email"
                    id="volunteer_email"
                    placeholder="Volunteer Email"
                    value={volunteer_email}
                    onChange={(e) => {
                      setVolunteerEmail(e.target.value);
                    }}
                  />
                </div>

                <button
                  className="button-53"
                  onClick={() => {
                    postTaskData();
                  }}
                  value="Assign"
                  type="submit"
                  role="button"
                >
                  Assign
                </button>
              </div>
            </div>

            <h1>All Tasks</h1>
            <div className="allCards">
              <div className="OCards">
                <div className="headd">
                  <div className="heading">
                    <p className="headp">Volunteer Name</p>
                    <p className="headp">Task Info</p>
                    <p className="headp">Deadline</p>
                    <p className="headp">Volunteer Email</p>
                  </div>
                </div>
                {tasks.map(renderCard)}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {isVolunteer ? (
              <div>
                <h1>My Tasks</h1>
                <div className="allCards">
                  <div className="OCards">
                    <div className="headd">
                      <div className="heading">
                        <p className="headp">Volunteer Name</p>
                        <p className="headp">Task Info</p>
                        <p className="headp">Deadline</p>
                        <p className="headp">Volunteer Email</p>
                      </div>
                    </div>
                    {myTasks.map(renderCard)}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {" "}
                <h1>Join our community and become a Volunteer</h1>{" "}
                <button className="button-53" onClick={() => { navigate("/volunteer"); }} >Become Volunteer</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
