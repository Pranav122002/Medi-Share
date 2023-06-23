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

  const [deadline, setDeadline] = useState("");
  const [myname, setMyName] = useState("");
  const [myTasks, setMyTasks] = useState([]);
  const [user, setUser] = useState("");
  const [volunteersList, setVolunteersList] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [chats , viewChats] = useState(false);
  const [sug, showsug] = useState(!false);

  const handleShowsug = () => {
    showsug(false);
  };

  useEffect(() => {
    AOS.init({ duration: 800 });
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

  useEffect(() => {
    fetchVolunteers();
  }, []);

  function acceptTask(task_id) {
    fetch(`${API_BASE_URL}/accept-task/${task_id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        notifyB("Task accepted successfully.");
      })
      .catch((error) => {
        console.log(error);
        notifyA(error);
      });
  }

  function rejectTask(task_id) {
    fetch(`${API_BASE_URL}/reject-task/${task_id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        notifyB("Task rejected successfully.");
      })
      .catch((error) => {
        console.log(error);
        notifyA(error);
      });
  }

  function completeTask(task_id) {
    fetch(`${API_BASE_URL}/complete-task/${task_id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        notifyB("Task marked as completed successfully.");
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
        setUser(res);
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

  const fetchMyTasks = () => {
    fetch(
      `${API_BASE_URL}/my-tasks/${
        JSON.parse(localStorage.getItem("user"))._id
      }`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setMyTasks(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function fetchVolunteers() {
    fetch(`${API_BASE_URL}/all-volunteers`, {
      method: "get",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setVolunteersList(data);
      });
  }

  function fetchTasks() {
    fetch(`${API_BASE_URL}/all-tasks`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      });
  }

  const postTaskData = () => {
    if (!selectedVolunteer) {
      notifyA("Please select Volunteer from list.");
      return;
    }

    fetch(`${API_BASE_URL}/assign-task`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task_info: task_info,
        deadline: deadline,
        volunteer_id: selectedVolunteer._id,
        volunteer_name: selectedVolunteer.name,
      }),
    })
      .then((res) => res.json())

      .then((data) => {
        notifyB("Task assigned successfully.");
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB(data.msg);
        }
      });
  };

  const renderCard = (card, index) => {
    return (
      <>
        <div className="admincard">
          <Card className="Card" key={index}>
            <Card.Body>
              <p>
                <span className="content-detai">Volunteer :</span>{card.volunteer_name}
              </p>

              <p>
                <span id="fjcnuend" className="content-detai">Task Info :</span>
                <span id="ndanisda">{card.task_info}</span>
                <br />
              </p>
              <p>
                <span className="content-detai">Deadline :</span>
                {card.deadline}
                <br />
              </p>
            </Card.Body>
            <hr id="nmsadaca" />
          </Card>
        </div>{" "}
      </>
    );
  };

  return (
    <div className="task">
      <div className="bodyy">
        {isAdmin ? (
          <div>
            <div className="donate">
           
              <div className={`donateForm ${chats && "active"}`}>
              <img onClick={()=> { viewChats(false)}} id="dadcae" src="./back.png" alt="" />
                <div className="logo">
                  <h1>Assign Task</h1>
                </div>
                
                <div>
                  <input
                    type="text"
                    name="volunteer_id"
                    id="volunteer_id"
                    placeholder="Volunteer id"
                    value={selectedVolunteer._id}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="volunteer_name"
                    id="volunteer_name"
                    placeholder="Volunteer Name"
                    value={selectedVolunteer.name}
                  />
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

              <div className="donateForr">
                <div className="logo">
                  <h1>Select Volunteer</h1>
                </div>

                <div className="agasadsa">
                  {volunteersList.map((volunteer) => (
                    <li key={volunteer._id}>
                      <p>{volunteer.name}</p>
                      <button
                        onClick={() => {
                          
                          setSelectedVolunteer(volunteer);
                          viewChats("active");
                        }}
                      >
                        Select
                      </button>
                    </li>
                  ))}
                </div>
              </div>
            </div>

            <div className="allCardss">
              <div className="OCards">
                <h2>Tasks Assigned</h2>
                <div className="headd">
                  <div className="headingad">
                    <p className="headp">Volunteer Name</p>
                    <p className="headp">Task Info</p>
                    <p className="headp">Deadline</p>
                  </div>
                </div>
                <hr id="mainsec" />
                {tasks.map(renderCard)}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <h1>My Tasks</h1>
              <div className="allCards">
                <div className="OCards">
                  <div className="headd">
                    <div className="heading">
                      <p className="headp">Name</p>
                      <p className="headp">Task Info</p>
                      <p className="headp">Deadline</p>
                      <p className="headp">Action</p>
                      <p className="headp">Status</p>
                      <p className="headp">Completion</p>
                    </div>
                  </div>
                  <hr id="mainsec" />

                  {myTasks.map((task) => (
                    <>
                      <li key={task._id}>
                        <p>
                          <span className="tasksapnli">Name :</span>{" "}
                          {task.volunteer_name}
                        </p>
                        <p>
                          <span id="fbuybcsa" className="tasksapnli">Task Info :</span>
                          <span id="adfasda">{task.task_info}</span>{" "}
                        </p>
                        <p>
                          <span className="tasksapnli">Deadline :</span>
                          {task.deadline}
                        </p>
                        {task.status === "pending" ? (
                          <>
                            <p>
                              <span className="tasksapnli">Action :</span>
                              <button
                                onClick={() => {
                                  acceptTask(task._id);
                                }}
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => {
                                  rejectTask(task._id);
                                }}
                              >
                                Reject
                              </button>
                            </p>
                          </>
                        ) : (
                          <>
                            <p>
                              <span className="tasksapnli">Status :</span>
                              {task.status}
                            </p>
                          </>
                        )}
                        {task.completion === false ? (
                          <>
                            <p>
                              {" "}
                              <span className="tasksapnli">Task Status :</span>
                              Not Completed
                            </p>{" "}
                            <p>
                              <span className="tasksapnli">Task :</span>
                              {task.status === "accepted" ? (
                                <button
                                  id="markbut"
                                  onClick={() => {
                                    completeTask(task._id);
                                  }}
                                >
                                  Mark as Completed
                                </button>
                              ) : (
                                <>-</>
                              )}
                            </p>
                          </>
                        ) : (
                          <p>
                            <span className="tasksapnli">Task status :</span>
                            Completed
                          </p>
                        )}
                      </li>
                      <hr id="midsec" />
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
