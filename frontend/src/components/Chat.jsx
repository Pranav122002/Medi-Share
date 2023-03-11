import React, { useEffect, useState, useRef } from "react";
import "../css/Chat.css";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";

export default function Chat() {

  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
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
          console.log("...setcurrentuser...");
          console.log(result.name);
          setCurrentUser(result.name);
        });
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io("http://localhost:5000");

      console.log("...socket.current...");
      console.log(socket.current);

      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    fetch(
      `http://localhost:5000/allusers/${
        JSON.parse(localStorage.getItem("user"))._id
      }`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    ).then((res) => res.json())
      .then((data) => {
        console.log("...setcontacts...");
        console.log(data);
        setContacts(data);
      });
  }, [currentUser]);

  const handleChatChange = (chat) => {
    console.log("...setcurrentchat...");
    console.log(chat);
    setCurrentChat(chat);
  };

  return (
    <>
      <Hnavbar />
      <Navbar />
      <div className="container">
        <Contacts contacts={contacts} changeChat={handleChatChange} />
        {currentChat === undefined ? (
          <Welcome />
        ) : (
          <ChatContainer currentChat={currentChat} socket={socket} />
        )}
      </div>
    </>
  );
}
