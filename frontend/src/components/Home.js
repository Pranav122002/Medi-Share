import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import "../css/Home.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { Latestanc } from "./Latestanc";
import { UserContext } from "./UserContext";

import volLocation from "./volLocation";

export default function Home() {
  const { updateUser } = useContext(UserContext);
  const [user, setUser] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  
  useEffect(() => {
    const fetchUser = () => {
      fetch(
        `/user/${JSON.parse(localStorage.getItem("user"))._id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          const subscriptionEndDate = new Date(res.subscription_end_date);
          const currentDate = new Date();
          setUser(res)
          if (res.subscription_end_date && subscriptionEndDate < currentDate) {
            const updatedUser = {
              ...res,
              subscription: false,
              subscription_end_date: undefined,
            };
            updateUser(updatedUser);

            fetch(`/end-subscription/${res._id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
              },
            })
              .then((res) => res.json())
              .then((updatedRes) => {})
              .catch((error) => {
                console.error(error);
              });
          } else {
            updateUser(res);
          }

          if (res.role === "volunteer") {
            volLocation().then((coordinates) => {
              fetch(`/volunteer-location/${res._id}`, {
                method: "put",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  lng: coordinates[0],
                  lat: coordinates[1],
                }),
              })
                .then((res) => res.json())

                .catch((err) => console.error(err));
            });
          }
        });
    };

    fetchUser();
  }, []);
  console.log(user)
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  return (
    <>
      <div className="homeeee">
        <div className="bodyy">
          <div className="Lcontent">
            <div className="banner1">
              <div
                className="intro"
                data-aos="fade-right"
                data-aos-offset="300"
                data-aos-easing="ease-in-sine"
              >
                <h1>"Help Expand the chain of donation"</h1>
                <h2>About Medi-Share</h2>
                <p>
                  "Medi-Share" is an online portal for donation of unused
                  medicines for needy ones.The pharmaceutical industry in India
                  suffers a significant loss every year due to the destruction
                  of expired drugs, particularly affecting small and medium drug
                  manufacturers. At the same time, there are many households
                  where medicines remain unused and expire. To address these
                  issues, Medi-Share allows individuals to donate their unused,
                  unexpired medications to a community pharmacy or medicine bank
                  that will distribute them to people in need, free of charge.
                </p>
              </div>
              <div className="img">
                <div className="curve">
                  <img src="./curve2.png" alt="" />
                </div>
                <div className="curve2">
                  <img src="./curve2.png" alt="" />
                </div>
                <div id="wacdase">
                  <img
                    src="./chain.png"
                    data-aos="fade-down"
                    data-aos-easing="linear"
                    data-aos-duration="1500"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
