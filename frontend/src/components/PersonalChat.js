import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";

const socket = io("http://localhost:5000");

const PersonalChat = () => {

  const [userid, setUserId] = useState("");
  const [username, setUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

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
        setUserId(result._id);
        setUserName(result.name);
      });
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetch(
        `http://localhost:5000/all-personal-messages/${
          JSON.parse(localStorage.getItem("user"))._id
        }/${selectedUser._id}`
      )
        .then((response) => response.json())
        .then((data) => {
          setMessages(data);
          console.log("data = ", data);
        })
        .catch((error) => {
          console.error("Error fetching personal messages:", error);
        });

      socket.on("personal-message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      socket.off("personal-message");
    };
  }, [selectedUser]);

  useEffect(() => {
    if (userid) {
      // socket = io("http://localhost:5000");
      socket.emit("add-user", userid);
    }
  }, [userid]);

  useEffect(() => {
    fetch(
      `http://localhost:5000/all-personal-users/${
        JSON.parse(localStorage.getItem("user"))._id
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching personal users:", error);
      });
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleUserSelection = (user) => {
    setSelectedUser(user);
  };

  const sendPersonalMessage = () => {
    if (selectedUser) {
      const senderId = JSON.parse(localStorage.getItem("user"))._id;

      socket.emit("personal-message", {
        message: inputValue,
        sender_name: username,
        receiver_name: selectedUser.name,
        sender_id: senderId,
        receiver_id: selectedUser._id,
        createdAt: new Date().toISOString(),
      });

      fetch("http://localhost:5000/save-personal-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          sender_name: username,
          receiver_name: selectedUser.name,
          sender_id: senderId,
          receiver_id: selectedUser._id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Personal message saved:", data);
        })
        .catch((error) => {
          console.error("Error saving personal message:", error);
        });

      setInputValue("");
    }
  };

  return (
    <div>
      <Hnavbar />
      <div>
        <div className="bodyy">
          <Navbar />

          <div>
            <div>
              <h2>User List:</h2>
              {users.map((user) => (
                <p key={user._id} onClick={() => handleUserSelection(user)}>
                  {user.name}
                </p>
              ))}
            </div>
            <div>
              <h2>Selected User:</h2>
              {selectedUser && <p>{selectedUser.name}</p>}
            </div>
            <div>
              <h2>Personal Messages:</h2>
              {messages.map((message, index) => (
                <p key={index}>
                  Message: {message.message} | Sender: {message.sender_name} |
                  Receiver: {message.receiver_name} | timestamp : {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </p>
              ))}
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
            />
            <button onClick={sendPersonalMessage} disabled={!selectedUser}>
              Send Personal Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalChat;
