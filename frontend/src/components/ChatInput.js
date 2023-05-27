import React, { useState } from "react";
import styled from "styled-components";
import "../css/Chats.css"

export default function ChatInput({ handleSendMsg }) {

  const [msg, setMsg] = useState("");

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <Container className="imput">
      <div className="button-container"></div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="Message..."
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button id="send" type="submit">
          {/* <IoMdSend /> */}
          Send
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  
  display: grid;
  margin-left: 10px;
  margin-right: 10px;
  border: 1px solid rgb(219, 219, 219);
  border-radius: 25px;
  margin-bottom: 10px;
  align-items: center;
  grid-template-columns: 10% 90%;
  // background-color: #080420;
  background-color: white;
  padding-left: 10px;
  padding-right: 10px;
  margin-top:-2vh;
  width:40vw;
  margin:auto;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    // gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    width: 10%;
    // gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: black;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }

  .input-container {
    display: grid;
    grid-template-columns: 50% 50%;
    width: 40vw;
    // border-radius: 2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    // gap: 2rem;
    
    background-color: #ffffff34;
    background-color: white;
    input {
      width: 60%;
      height: 60%;
      background-color: white;
      color: black;
      border: none;
      padding-left: 1rem;
      font-size: small;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: white;

      border: none;

      color: rgb(0, 149, 246);
      // width: 20px;
      position: relative;
      right: -30px;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;
