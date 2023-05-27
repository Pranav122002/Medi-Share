import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import { toast } from "react-toastify";
import "../css/Annoucement.css";


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
    fetch("http://localhost:5000/all-annoucements")
      .then((response) => response.json())
      .then((data) => setAnnoucements(data));
  }


  function fetchUser() {

    fetch(
      `http://localhost:5000/user/${JSON.parse(localStorage.getItem("user"))._id
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
    fetch("http://localhost:5000/add-annoucement", {
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
    <div className="announce">
      <Hnavbar />
      <div className="bodyy">
        <Navbar />

        <div className="anc">
          <div className="ancinfo">
            <h1>Announcements</h1>
            <div className="ancflex">

              <p>All the camps are carried out by volunteer and certified doctors who are collabrated with us.</p>
              <img src="./megaphone.png" alt="" />
            </div>
          </div>
          <div>
            {isDoctor
              ?
              <div className="Formcont"><div className="AForm">
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
                <button className="button-53" value="Add" type="submit" onClick={() => { postAnnouncementData(); }}>Add Event</button>
              </div> </div> : <div></div>
            }
          </div>


        
          <ul > 
            <li className="bord" >
              <h3 id="pp4" > Name</h3>
              <h3 id="pp1" className="p1">Date</h3>
              <h3 id="pp3"  className="p2">Venue</h3>
              <h3 id="pp2"  className="p3">Description</h3>
            </li>
            {annoucements.map((annoucements) => (
              <li className="bord" key={annoucements.title}>
                <h3 >{annoucements.title}</h3>
                <h3 className="p1">
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
