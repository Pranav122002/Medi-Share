import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import "../css/Home.css"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'
import { UserContext } from './UserContext';
import { Latestanc } from "./Latestanc";
import { API_BASE_URL } from "../config";

export default function Home() {

  const { updateUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUser = () => {
      fetch(
        `${API_BASE_URL}/user/${
          JSON.parse(localStorage.getItem('user'))._id
        }`,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('jwt'),
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          const subscriptionEndDate = new Date(res.subscription_end_date);
          const currentDate = new Date();
  
        
  
          if (res.subscription_end_date && subscriptionEndDate < currentDate) {

            const updatedUser = { ...res, subscription: false, subscription_end_date: undefined };
            updateUser(updatedUser);
  
            
            
            fetch(`${API_BASE_URL}/end-subscription/${res._id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
              },
              
            })
              .then((res) => res.json())
              .then((updatedRes) => {
                console.log('User subscription ended...', updatedRes);
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            
            updateUser(res);
          }
        });
    };
  
    fetchUser();
  }, []);
  

  useEffect(() => {
    AOS.init({ duration: 2000 });

  }, [])

  return (<>
    <Hnavbar />
    <div className="homeeee"> 


      <div className="bodyy">
        <Navbar />
        <div className='Lcontent'>
          <div className='banner1'>
            <div className='intro' data-aos="fade-right"
              data-aos-offset="300"
              data-aos-easing="ease-in-sine" >
              <h1>"Help Expand the chain of donation"</h1>
              <h2>About Medi-Share</h2>
              <p>"Medi-Share" is an online portal for donation of unused medicines for needy ones.The pharmaceutical industry in India suffers a significant loss every year due to the destruction of expired drugs, particularly affecting small and medium drug manufacturers. At the same time, there are many households where medicines remain unused and expire. To address these issues, Medi-Share allows individuals to donate their unused, unexpired medications to a community pharmacy or medicine bank that will distribute them to people in need, free of charge.
              </p>
            </div>
            <div className='img'>
              <div className='curve'>
                <img src="./curve2.png" alt="" />
              </div>
              <div className='curve2'>
                <img src="./curve2.png" alt="" /></div>
              <img src="./chain.png" data-aos="fade-down"
                data-aos-easing="linear"
                data-aos-duration="1500" alt="" />
            </div>
          </div>

        </div>
       
      </div>
   
    </div>

  </>);
}
