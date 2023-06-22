import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Navbar from "./Navbar";
import UserProfile from "./UserProfile";
import { Hnavbar } from "./Hnavbar";
import { API_BASE_URL } from "../config";
import "../css/UserProfile.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  function fetchUsers() {
    fetch(`${API_BASE_URL}/all-volunteers-and-doctors`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setUsers(res);
      });
  }

  function handleClick(userId) {
    if (selectedUserId !== userId) {
      setSelectedUserId(userId);
    }
  }

  return (
    <div className="mainuserprofile">
      <div className="bodyy">
        <h1>All Available Volunteers and Doctors</h1>
        <div className="userproflex">
          <ul className="userprofback">
            <h2>User list</h2>

            <li className="userprof">
              <div className="proflidis">Name</div>
              <div className="proflidis">Role</div>
              <div className="proflidis">View</div>
            </li>
            <hr id="mas" />
            <div className="scrolll">
              {users.map((user) => (<>
                <li className="userprof" key={user._id}>
                  <div className="proflidiv">{user.name}</div>
                  <div className="proflidiv">{user.role}</div>
                  <div className="proflidiv"><button onClick={() => handleClick(user._id)}>View</button></div>
                </li>
                <hr id="masa" />
              </>
              ))}
            </div>
          </ul>
          <hr id="userprofmid"/>
          {selectedUserId ? (
            <>
              <UserProfile id={selectedUserId} />
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
} 