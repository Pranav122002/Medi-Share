import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import { toast } from "react-toastify";
import "../css/Annoucement.css";
import { API_BASE_URL } from "../config";

export default function Annoucement() {
  const [annoucements, setAnnoucements] = useState([]);
  const date4 = new Date();
  date4.setDate(date4.getDate() + 1);
  const [isDoctor, setIsDoctor] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [sortedData, setSortedData] = useState([...annoucements]);

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);
  console.log(sortedData);
  useEffect(() => {
    fetchAnnoucements();
  }, []);

  useEffect(() => {
    fetchUser();
  });

  useEffect(() => {
    const sorted = [...annoucements].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    setSortedData(sorted);
  }, [annoucements]);

  function isDate(dat) {
    let date2 = new Date(dat);
    var Difference_In_Time = date2.getTime() - date4.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24) + 2;

    if (Difference_In_Days > 0) {
      return true;
    }
  }
  function isDatenow(dat) {
    let date3 = new Date(dat);

    var Difference_In_Time = date3.getTime() - date4.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24) + 2;

    if (Difference_In_Days < 0) {
      return true;
    }
  }

  function fetchAnnoucements() {
    fetch(`${API_BASE_URL}/all-annoucements`)
      .then((response) => response.json())
      .then((data) => setAnnoucements(data));
  }

  function fetchUser() {
    fetch(
      `${API_BASE_URL}/user/${JSON.parse(localStorage.getItem("user"))._id}`,
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
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notifyA(data.error);
        } else {
          window.location.reload();
          notifyB(data.msg);
        }
        console.log(data);
      });
  };

  return (
    <div className="announce">
      <Hnavbar />
      <div className="bodyy">
        <Navbar />

        <div className="anc">
          <div className="ancinfoback">
            <div className="ancinfo">
              <div className="ancflex">
                <h1>Announcements</h1>
                <br />
                <p>
                  All the camps are carried out by volunteer and certified
                  doctors who are collabrated with us.
                </p>
              </div>
              <img src="./request.png" alt="list" />
            </div>
          </div>

          {isDoctor ? (
            <div className="formancc">
              <div className="Formcont">
                <div className="AForm">
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
                      type="date"
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
                  <button
                    className="button-53"
                    value="Add"
                    type="submit"
                    onClick={() => {
                      postAnnouncementData();
                    }}
                  >
                    Add Event
                  </button>
                </div>{" "}
              </div>
            </div>
          ) : (
            <div></div>
          )}

          <div className="anclistss">
            <h1>Latest Announcements</h1>
            <ul>
              <li className="bord">
                <h3 id="pp4" className="p6">
                  {" "}
                  Name
                </h3>
                <h3 id="pp1" className="p1">
                  Date (YY/MM/DD)
                </h3>
                <h3 id="pp3" className="p2">
                  Venue
                </h3>
                <h3 id="pp2" className="p3">
                  Description
                </h3>
              </li>
              <div className="anclistitems">
                {sortedData.map((annoucements) => (
                  <>
                    {isDate(annoucements.date) ? (
                      <>
                        <li className="bord" key={annoucements.title}>
                          <h3 className="p6">{annoucements.title}</h3>
                          <h3 className="p1">{annoucements.date}</h3>
                          <h3 className="p2">{annoucements.venue}</h3>
                          <p className="p3">{annoucements.description} </p>
                        </li>
                        <hr className="anclistitemsbr" />
                      </>
                    ) : (
                      <div id="noneee"></div>
                    )}
                  </>
                ))}
              </div>
            </ul>
          </div>
          <div className="anclistss">
            <h1>Past Announcements</h1>
            <ul>
              <li className="bord">
                <h3 id="pp4" className="p6">
                  {" "}
                  Name
                </h3>
                <h3 id="pp1" className="p1">
                  Date (YY/MM/DD)
                </h3>
                <h3 id="pp3" className="p2">
                  Venue
                </h3>
                <h3 id="pp2" className="p3">
                  Description
                </h3>
              </li>
              <div className="anclistitems">
                {sortedData.map((annoucements) => (
                  <>
                    {isDatenow(annoucements.date) ? (
                      <>
                        <li className="bord" key={annoucements.title}>
                          <h3 className="p6">{annoucements.title}</h3>
                          <h3 className="p1">{annoucements.date}</h3>
                          <h3 className="p2">{annoucements.venue}</h3>
                          <p className="p3">{annoucements.description} </p>
                        </li>
                        <hr className="anclistitemsbr" />
                      </>
                    ) : (
                      <div id="noneee"></div>
                    )}
                  </>
                ))}
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
