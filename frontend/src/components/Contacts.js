import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function Contacts({ contacts, changeChat }) {

  const navigate = useNavigate();
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("./signup");
    } else {
      fetch(
        `/user/${
          JSON.parse(localStorage.getItem("user"))._id
        }`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      ).then((res) => res.json())
        .then((result) => {
          setCurrentUserName(result.name);
        });
    }
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {
        <Container>
          <div className="current-user">
            <p>{currentUserName}</p>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="username">
                    <h3>{contact.name}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      }
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 90% ;
  overflow: hidden;
  background-color: #white;
  gap: 0.8rem;
  
  border-right: 1px solid rgb(219, 219, 219);
  

  .contacts {

    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
  


    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: black;
        width: 0.1rem;
        border-radius: 2rem;
      }
    }

    .contact {
      background-color: white;
      margin-left: 20px;
      height: 7%;
      cursor: pointer;
      width: 70%;
     margin-top: 10px;
     margin-bottom: 10px;
      
      display: flex;
      
      align-items: center;
      transition: 0.5s ease-in-out;
     
      .username {
        h3 {
          
          color: rgb(38, 38, 38);
          font-size: large;
          font-weight: 400;
        }
        }
      }
    }
    .selected {
      background-color: pink;
    }
  }


  .current-user {
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    border-bottom: 1px solid rgb(219, 219, 219);

   
      p {
        color:black;
     
        font-size: x-large;

        font-weight: 500;
      }
        
      
    }
  
  }
`;
