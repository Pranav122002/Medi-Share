import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import { toast } from "react-toastify";
import "../css/Annoucement.css";
import { API_BASE_URL } from "../config";


export default function Annoucement() {
  const [annoucements, setAnnoucements] = useState([]);
  const [isDoctor, setIsDoctor] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");

    // Toast functions
    const notifyA = (msg) => toast.error(msg);
    const notifyB = (msg) => toast.success(msg);
    
  useEffect(() => {
    fetchAnnoucements();
  }, []);

  useEffect(() => {
    fetchUser();
  });

  function fetchAnnoucements() {
    fetch(`${API_BASE_URL}/all-annoucements`)
      .then((response) => response.json())
      .then((data) => setAnnoucements(data));
  }


  function fetchUser() {

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
        .then((res) => {
          if (res.role === "doctor") {
            setIsDoctor(true);
          } else {
            setIsDoctor(false);
          }
         
        });
    
  
     
  }

  const postAnnouncementData = () => {
    fetch(`${API_BASE_URL}/add-annoucement`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,
        date: date,
        venue: venue,
      }),
    }).then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notifyA(data.error);
        } else {
          window.location.reload();
          notifyB(data.msg);
        }
        console.log(data);
      });
  }



  return (
    <div>
      <Hnavbar />
      <div className="bodyy">
      <Navbar />
      <div className="anc">
      <div>
      {isDoctor
        ?   
         <div className="Formcont"><div className="Form">
        <div className="logo">
          <h1>Add Annoucement</h1>
        </div>
        <div>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            placeholder="Title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div>
          <input
            type="text"
            name="date"
            id="date"
            placeholder="Date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
        </div>
        <div>
          <input
            type="text"
            name="venue"
            id="venue"
            placeholder="Venue"
            value={venue}
            onChange={(e) => {
              setVenue(e.target.value);
            }}
          />
        </div>
        <div>
          <input
            type="text"
            name="description"
            id="description"
            placeholder="Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>
        <input
          type="submit"
          id="ancmt-btn"
          onClick={() => {
            postAnnouncementData();
          }}
          value="Add"
        />
      </div> </div>  : <div></div> 
      }
    </div>



      <ul>
      <li style={{backgroundColor:"white" , color:"black"}}>
          <h3>Name</h3>
          <h3 className="p1">Date</h3>
          <h3 className="p2">Venue</h3>
          <h3 className="p3">Description</h3>
        </li> 
        {annoucements.map((annoucements) => (
          <li key={annoucements.title}>
            <h3 style={{color: "black"}} >{annoucements.title}</h3> 
            <h3 style={{color: "blue"}} className="p1">
            {annoucements.date}  
            </h3 >
            <h3 className="p2">
            {annoucements.venue} 
            </h3>
            <p className="p3">{annoucements.description} </p>
          
          </li>
        ))}
      </ul>
    </div>
    </div>
    </div>
  );
}
