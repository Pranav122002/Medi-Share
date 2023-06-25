import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import { BASE_URL, API_BASE_URL } from "../config.js";
import "../css/Communitychat.css";
import "../css/PersonalChat.css";
const socket = io(`${BASE_URL}`);

const Chat = () => {
  const [userid, setUserId] = useState("");
  const [username, setUserName] = useState("");
  const [userrole, setUserRole] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/all-messages`)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
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
      .then((data) => {})
      .catch((error) => {
        console.error("Error saving message:", error);
      });

    setInputValue("");
  };

  return (
    <div className="comsca">
      <div className="comsssc">
        <div className="bodyy">
          <div className="commchat">
            <div className="commmess">
              {messages.map((message, index) => (
                <>
                  {message.sender_id === userid ? (
                    <>
                      <div className="sender-mess">
                        <p className="comssend" key={index}>
                          <p className="wowowow">
                            <p>{message.sender_name} </p>
                            <div id="senderrole"> {message.sender_role} </div>
                          </p>
                          <p className="flexdisp">
                            <p> {message.message} </p>

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
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {" "}
                      <div className="received-msg">
                        <p className="comssend" key={index}>
                          <p className="wowowow">
                            <p> {message.sender_name} </p>
                            <div id="recrole"> {message.sender_role} </div>
                          </p>
                          <p className="flexdisp">
                            <p> {message.message}</p>

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
                        </p>
                      </div>
                    </>
                  )}
                </>
              ))}
            </div>
            <div className="submitmenu">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
              />
              {inputValue === "" ? (
                <></>
              ) : (
                <button id="sendbutton">
                  <img
                    onClick={sendMessage}
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
  );
};

export default Chat;
