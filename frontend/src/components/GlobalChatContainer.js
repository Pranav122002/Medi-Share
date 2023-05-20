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
    ).then((res) => res.json())
      .then((result) => {
        fetch("http://localhost:5000/getmsgglobal", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: result._id,
          
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
       
          from: result._id,
          msg,
        });

        fetch("http://localhost:5000/addmsgglobal", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: result._id,
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
                  <p className="sendername">{message.sender_name}</p>
                </div>
               
               
              </div>
            </div>
          );
        })}
      </div>
<div className="inpt">

      <ChatInput handleSendMsg={handleSendMsg} />
</div>
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
    border-bottom: 1px solid rgb(219, 219, 219);

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
     
      .username {
        p {
          color: black;
          font-size: large;
          font-weight: 500;
        }
      }
    }


  }

  .inpt{
    position: absolute;
    height: fit-content;
    bottom: 0;
    width: -webkit-fill-available;
  }

  .chat-messages {
    padding: 0.5rem 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    overflow: auto;

    position: absolute;
    height: 100%;
    min-width: -webkit-fill-available;

    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: black;
        width: 0.1rem;
        border-radius: 2rem;
      }
    }

   .sendername{
    color: blue;
    font-size: x-small;
   }

    .message {
      display: flex;
      align-items: center;


      .content {
        max-width: 40%;
        height: 20px
        overflow-wrap: break-word;
        padding: 0.5rem;
        font-size: small;
        border-radius: 1rem;
        color: #d1d1d1;

        
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }

        .msgp{
          margin: 0;
          font-size: large;
        }
      }



    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: rgb(239,239,239);
        color: black;
        
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: white;
        border: 1px solid rgb(239, 239,239);

        color: black;
      }
    }
  }


`;
