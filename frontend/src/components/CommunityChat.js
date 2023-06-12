import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import { API_BASE_URL } from "../config";
const socket = io(`${API_BASE_URL}`);

const Chat = () => {
  const [username, setUserName] = useState("");
  const [userrole, setUserRole] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/all-messages`)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
        console.log("data = ", data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
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
        setUserName(result.name);
        setUserRole(result.role);
      });
  }, []);

  const sendMessage = () => {
    const senderId = JSON.parse(localStorage.getItem("user"))._id;

    socket.emit("message", {
      message: inputValue,
      sender_name: username,
      sender_id: senderId,
      sender_role: userrole,
      createdAt: new Date().toISOString(),
    });

    fetch(`${API_BASE_URL}/save-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: inputValue,
        sender_name: username,
        sender_id: senderId,
        sender_role: userrole,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Message saved:", data);
      })
      .catch((error) => {
        console.error("Error saving message:", error);
      });

    setInputValue("");
  };

  return (
    <div>
      <Hnavbar />
      <div>
        <div className="bodyy">
          <Navbar />
          <div>
            <div>
              {messages.map((message, index) => (
                <p key={index}>
                  Message: {message.message} | Sender : {message.sender_name}  | Role : {message.sender_role}  | timestamp : {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </p>
              ))}
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
