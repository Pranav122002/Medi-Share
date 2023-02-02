import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";

import { v4 as uuidv4 } from "uuid";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);


  
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
        fetch("http://localhost:5000/getmsg", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: result.user._id,
            to: currentChat._id,
          }),
        })
          .then((dat) => dat.json())
          .then((data) => {
            console.log("setmessages");
            console.log(data);
            setMessages(data);
          });
      });
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = () => {
      if (currentChat) {
        JSON.parse(
          localStorage.getItem(
            `http://localhost:5000/user/${
              JSON.parse(localStorage.getItem("user"))._id
            }`
          )
        );
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = (msg) => {
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
        socket.current.emit("send-msg", {
          to: currentChat._id,
          from: result.user._id,
          msg,
        });

        fetch("http://localhost:5000/addmsg", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: result.user._id,
            to: currentChat._id,
            message: msg,
          }),
        })
          .then((dat) => dat.json())
          .then((data) => {
            console.log(data);
          });

        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs);
      });
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="username">
            <p>{currentChat.userName}</p>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  <p className="msgp">{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}


const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  
  overflow: hidden;
 
  .chat-header {
   
    align-items: center;
    padding: 0 1rem;


    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
     
      .username {
        p {
          color: black;
          font-size: large;
          font-weight: 600;
        }
      }
    }


  }



  .chat-messages {
    padding: 0.5rem 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    overflow: auto;


    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: black;
        width: 0.1rem;
        border-radius: 2rem;
      }
    }


    .message {
      display: flex;
      align-items: center;


      .content {
        max-width: 40%;
        height: 20px
        overflow-wrap: break-word;
        padding: 0.1rem;
        font-size: medium;
        border-radius: 0.5rem;
        color: #d1d1d1;

        
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }

        .msgp{
          margin: 0;
        }
      }



    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #F8F4FF;
        color: black;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #D3D3D3;
        color: black;
      }
    }
  }


`;
