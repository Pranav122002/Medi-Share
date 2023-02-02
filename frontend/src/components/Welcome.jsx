import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/signup");
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
          console.log("...setusername...");
          console.log(result.user.userName);
          setUserName(result.user.userName);
        });
    }
  }, []);

  return (
    <Container>
      <div>
        <div>
          <svg
            aria-label="Direct"
            class="_ab6-"
            color="#262626"
            fill="#262626"
            height="96"
            role="img"
            viewBox="0 0 96 96"
            width="96"
          >
            <circle
              cx="48"
              cy="48"
              fill="none"
              r="47"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></circle>
            <line
              fill="none"
              stroke="currentColor"
              stroke-linejoin="round"
              stroke-width="2"
              x1="69.286"
              x2="41.447"
              y1="33.21"
              y2="48.804"
            ></line>
            <polygon
              fill="none"
              points="47.254 73.123 71.376 31.998 24.546 32.002 41.448 48.805 47.254 73.123"
              stroke="currentColor"
              stroke-linejoin="round"
              stroke-width="2"
            ></polygon>
          </svg>
        </div>
        <p id="your">Your Messages</p >
        <p id="text">Send private photos and messages to a friend or group.</p>
        <button>Send message</button>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  flex-direction: column;

#your{
  font-size: larger
 
}
#text{
  padding-left: 5px;
  padding-right: 5px;
}
  button {
    color: white;
    background-color: rgb(0, 149, 256);
    border: none;
    border-radius: 9px;
    height: 25px;
  }
`;
