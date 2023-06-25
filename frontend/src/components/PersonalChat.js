import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import { BASE_URL, API_BASE_URL } from "../config.js";
import "../css/PersonalChat.css";

const socket = io(`${BASE_URL}`);

const PersonalChat = () => {
  const [userid, setUserId] = useState("");
  const [username, setUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [chats, viewChats] = useState(false);

  useEffect(() => {
    fetch(
      `${API_BASE_URL}/user/${JSON.parse(localStorage.getItem("user"))._id}`,
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
        `${API_BASE_URL}/all-personal-messages/${
          JSON.parse(localStorage.getItem("user"))._id
        }/${selectedUser._id}`
      )
        .then((response) => response.json())
        .then((data) => {
          setMessages(data);
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
      // socket = io(`${API_BASE_URL}`);
      socket.emit("add-user", userid);
    }
  }, [userid]);

  useEffect(() => {
    fetch(
      `${API_BASE_URL}/all-chat-users/${
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

      fetch(`${API_BASE_URL}/save-personal-message`, {
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
        .then((data) => {})
        .catch((error) => {
          console.error("Error saving personal message:", error);
        });

      setInputValue("");
    }
  };

  return (
    <div className="perschat">
      <div>
        <div className="bodyy">
          <div className="chatcont">
            <div className="cinfo">
              <div className="myinfo">
                <img id="profpicc" src="./profile-pic.png" alt="" srcset="" />
                <h2>{username}</h2>
              </div>
              <div className="userss">
                {users.map((user) => (
                  <>
                    <p
                      key={user._id}
                      onClick={() => {
                        handleUserSelection(user);
                        viewChats("active");
                      }}
                    >
                      {user.name}
                    </p>
                    <hr />
                  </>
                ))}
              </div>
            </div>
            <hr id="midhr" />

            <div className={`selchat ${chats && "active"}`}>
              <div className="seluser">
                {selectedUser && (
                  <div className="userssasd">
                    {" "}
                    <img
                      onClick={() => {
                        viewChats(false);
                      }}
                      id="sdbackpn"
                      src="./back.png"
                      alt=""
                    />
                    <img
                      id="profpicc"
                      src="./profile-pic.png"
                      alt=""
                      srcset=""
                    />
                    <p>{selectedUser.name}</p>
                  </div>
                )}
              </div>
              <div className="messages">
                {messages.map((message, index) => (
                  <>
                    {message.sender_id === userid ? (
                      <>
                        <div className="sender-mess">
                          <p className="flexdisp" key={index}>
                            <p>{message.message}</p>
                            <div className="datemesss">
                              {new Date(message.createdAt).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </div>
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="received-msg">
                          <p className="flexdisp" key={index}>
                            <p>{message.message}</p>

                            <div className="datemess">
                              {new Date(message.createdAt).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </div>
                          </p>
                        </div>
                      </>
                    )}
                  </>
                ))}
              </div>
              <div className="submitmenu">
                <input
                  placeholder="Type your message here.."
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                />
                {inputValue === "" ? (
                  <>                  
                  <button id="sendbutton">
                  <img
                  
                    style={{opacity:"0.5"}}      
                    src="./send.png"
                    id="sendicon"
                    alt="send"
                  />
                </button></>
                ) : (
                  <button id="sendbutton">
                    <img
                    
                      onClick={sendPersonalMessage}
                      disabled={!selectedUser}
                      src="./send.png"
                      id="sendicon"
                      alt="send"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalChat;
