import React, { useEffect, useState, useRef } from "react";
import "./Chat.css";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("./signup");
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
          console.log(result.user);
          setCurrentUser(result.user);
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
    )
      .then((res) => res.json())
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

