import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
const socket = io("http://localhost:5000");

const Chat = () => {
  const [username, setUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/all-messages")
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
        setUserName(result.name);
      });
  }, []);

  const sendMessage = () => {
    const senderId = JSON.parse(localStorage.getItem("user"))._id;

    socket.emit("message", {
      message: inputValue,
      sender_name: username,
      sender_id: senderId,
    });

    fetch("http://localhost:5000/save-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: inputValue,
        sender_name: username,
        sender_id: senderId,
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
                  Message: {message.message}| Sender : {message.sender_name}
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
