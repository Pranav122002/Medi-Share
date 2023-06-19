import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Navbar from "./Navbar";
import UserProfile from "./UserProfile";
import { Hnavbar } from "./Hnavbar";
import { API_BASE_URL } from "../config";

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
    <div>
      <div className="bodyy">
        <h1>All Available Volunteers and Doctors</h1>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <h3 onClick={() => handleClick(user._id)}>{user.name}</h3>
              <p>{user.role}</p>
            </li>
          ))}
        </ul>
        {selectedUserId ? (
          <>
            <UserProfile id={selectedUserId} />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
