import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";


export default function Contacts({ contacts, changeChat }) {

  const navigate = useNavigate()

  const [currentUserName, setCurrentUserName] = useState(undefined);

  const [currentSelected, setCurrentSelected] = useState(undefined);


  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("./signup");
    } else {
    
      fetch(`http://localhost:5000/user/${JSON.parse(localStorage.getItem("user"))._id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
   
          setCurrentUserName(result.user.userName);
        });
    }

   
  }, []);


  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };


  return (
    <>
      {  (
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
                    <h3>{contact.userName}</h3>
                  </div>
                </div>
              );
            })}
          </div>

         
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 90% ;
  overflow: hidden;
  background-color: #white;
  gap: 0.8rem;
  
  border-right: 1px solid rgb(129, 121, 121);
  

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
      
      height: 7%;
      cursor: pointer;
      width: 100%;
     
      
      display: flex;
      
      align-items: center;
      transition: 0.5s ease-in-out;
     
      .username {
        h3 {
          color: black;
          font-size: large;
          font-weight: 600;
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
  
   
      p {
        color:black;
        font-size: x-large;

        font-weight: 600;
      }
        
      
    }
  
  }
`;

// const Container = styled.div`
//   display: grid;
//   grid-template-rows: 10% 75% 15%;
//   overflow: hidden;
//   background-color: #080420;
  
//   .brand {
//     display: flex;
//     align-items: center;
//     gap: 1rem;
//     justify-content: center;
//     img {
//       height: 2rem;
//     }
//     h3 {
//       color: white;
//       text-transform: uppercase;
//     }
//   }
//   .contacts {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     overflow: auto;
//     gap: 0.8rem;
//     &::-webkit-scrollbar {
//       width: 0.2rem;
//       &-thumb {
//         background-color: #ffffff39;
//         width: 0.1rem;
//         border-radius: 1rem;
//       }
//     }
//     .contact {
//       background-color: #ffffff34;
//       min-height: 5rem;
//       cursor: pointer;
//       width: 90%;
//       border-radius: 0.2rem;
//       padding: 0.4rem;
//       display: flex;
//       gap: 1rem;
//       align-items: center;
//       transition: 0.5s ease-in-out;
//       .avatar {
//         img {
//           height: 3rem;
//         }
//       }
//       .username {
//         h3 {
//           color: white;
//         }
//       }
//     }
//     .selected {
//       background-color: #9a86f3;
//     }
//   }

//   .current-user {
//     background-color: #0d0d30;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     gap: 2rem;
//     .avatar {
//       img {
//         height: 4rem;
//         max-inline-size: 100%;
//       }
//     }
//     .username {
//       h2 {
//         color: white;
//       }
//     }
//     @media screen and (min-width: 720px) and (max-width: 1080px) {
//       gap: 0.5rem;
//       .username {
//         h2 {
//           font-size: 1rem;
//         }
//       }
//     }
//   }
// `;
