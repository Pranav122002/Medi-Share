import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";


export default function Welcome() {
  
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/signin");
    } else {
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
          console.log("...setusername...");
          console.log(result.name);
          setUserName(result.name);
        });
    }
  }, []);

  return (
    <Container>
      <div>
        <p id="your">Your messages</p>
        <p id="text">Select user and send messages.</p>
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

  #your {
    font-size: larger;
  }
  #text {
    padding-left: 5px;
    padding-right: 5px;
    color: rgb(142, 142, 142);
    font-size: small;
  }
  button {
    color: white;
    background-color: rgb(0, 149, 256);
    border: none;
    border-radius: 9px;
    height: 25px;
  }
`;
