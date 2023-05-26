import React, { useEffect, useState, useRef } from "react";
import "../css/Chat.css";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import CommunityChatContainer from "./CommunityChatContainer";

import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";

export default function CommunityChat() {
  const navigate = useNavigate();
  const socket = useRef();

  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/signin");
    } else {
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
          console.log(result.name);
          setCurrentUser(result.name);
        });
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io("http://localhost:5000");

      console.log(socket.current);

      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  return (
    <>
      <Hnavbar />
      <Navbar />
      <h1>Community Chat</h1>
      <div className="chacontainer">
        <CommunityChatContainer socket={socket} />
      </div>
    </>
  );
}
