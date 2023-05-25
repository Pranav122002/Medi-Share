import React, { useEffect } from 'react'
import { Hnavbar } from './Hnavbar'
import { Link, useNavigate } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import "../css/LandingPage.css"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useState } from 'react'


export const LandingPage = () => {

    const [showNavbar, setShowNavbar] = useState(false)

    const handleShowNavbar = () => {
        setShowNavbar(!showNavbar)
        console.log(showNavbar)
    }

    useEffect(() => {
        AOS.init({ duration: 2000 });

    }, [])

    const navigate = useNavigate();
    const goHome = () => {
        navigate('/')
    }

    return (
        <>
            <Hnavbar/>
            <div className='maina'>
                
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
                <div className='Goal' data-aos="fade-up"
                    data-aos-duration="3000">
                    <h1>OUR GOAL</h1>
                    <p>Our ultimate goal is to reduce the wastage and increase the utilization of medicines as much as possible.Along with this we plan to encourage people for donation and volunteer work for the society and build a healthy community.</p>
                </div>
                <div className='segment' data-aos="zoom-in">
                    <img src="./capsule.png" alt="" />
                    <h1>WHAT WE DO ! ! </h1>
                    <img src="./capsule.png" alt="" />
                </div>

                <div className="banner2">
                    <img src="./donatee.jpg" data-aos="fade-down-right" alt="" />
                    <div className='info' data-aos="fade-left">
                        <h1>DONATIONS</h1>
                        <p>Any kind of medicine donation is appreciated. Just choose the medicine you want to donate our volunteers will pick it up and bring it to us.</p>
                    </div>
                </div>
                <div className='banner3_back'>
                    <div className='banner3'>

                        <div className='info' data-aos="fade-right">
                            <h1>MEDICINE TO NEEDY!</h1>
                            <p>On our website anyone can get anytype of medicine if its donated by anyone. The medicines are checked and delivered to your doorsteps by our volunteers.</p>
                        </div>
                        <img src="./medicine.png" data-aos="fade-down-left" alt="" />
                    </div>
                </div>

                <div className='banner4'>
                    <img src="./volunteer.jpg" data-aos="fade-down-right" alt="" />
                    <div className='info' data-aos="fade-left">
                        <h1>VOLUNTEERING!</h1>
                        <p>Volunteers are the core part of our model. Volunteering helps society by providing vital support, addressing social issues, fostering relationships, developing skills, contributing to the economy, and inspiring others to take action. It is a powerful force that uplifts communities and creates a more inclusive and caring society.</p>
                    </div>


                </div>
                <div className='banner3_back'>
                    <div className='banner5'>

                        <div className='info' data-aos="fade-right">
                            <h1>CAMPAINGS</h1>
                            <p>We arrange free medical campaings with collabration of many doctors.</p>
                        </div>
                        <img src="./campaign.png" data-aos="fade-down-left" alt="" />

                    </div>

                </div>

                <div className='banner6'>
                    <img src="./disease.png" data-aos="fade-down-right" alt="" />
                    <div className='info' data-aos="fade-left" >
                        <h1>Disease Prediction</h1>
                        <p>We provide Disease Prediction services using machine learning which involves utilizing algorithms and data analysis techniques to identify patterns and predict the likelihood of an individual developing a particular disease. By leveraging large datasets and variables such as medical history, genetic information, and lifestyle factors, machine learning models can provide valuable insights to aid in early detection and prevention of diseases.</p>
                    </div>
                </div>

                <div className='banner3_back'>
                    <div className='banner7'>

                        <div className='info' data-aos="fade-right" >
                            <h1>DOCTOR APPOINTMENTS</h1>
                            <p>You donate! we got your back covered. Book an appointment with doctor for free with the credits earned through the donations.</p>
                        </div>
                        <img src="./doctor2.png" data-aos="fade-down-left" alt="" />

                    </div>

                </div>
                <div className='fback'>
                    Build by Team
                    <div className='footer'>
                        <div className='fleft'>
                            <a href="https://www.freepik.com/free-vector/solidarity-concept-illustration_14562369.htm#query=volunteer&position=2&from_view=keyword&track=sph">Image by storyset</a> on Freepik
                        </div>
                        <div className='fright'>
                            <a href="https://www.freepik.com/free-vector/solidarity-concept-illustration_14562369.htm#query=volunteer&position=2&from_view=keyword&track=sph">Image by storyset</a> on Freepik
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
