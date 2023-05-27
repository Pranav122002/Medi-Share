import React from 'react'
import { Hnavbar } from "./Hnavbar";
import  Navbar from "./Navbar";
import "../css/Aboutus.css";

export const AboutUs = () => {
  return (
    <div className='abou'>
     <Hnavbar />
     
     <div className='aboutus'>
        <h1>About us</h1>
        <p>We are a passionate and dedicated team that has come together to build an extraordinary project. With a shared vision and diverse expertise, we have collaborated tirelessly to create something truly remarkable. Our team comprises individuals from various backgrounds, including software development, ui ux design, and project hosting , ML enthusiast each bringing unique skills and perspectives to the table.

</p>
        <div className='Aboutimage'>
            <div className='imageee'>
                <img src="pranav.jpeg" alt="img" srcset="" />
                <h2>Pranav Patil</h2>
            </div>
            <div className='imageee'>
                <img src="sam.jpeg" alt="" srcset="" />
                <h2>Samuel Padmadan</h2>
            </div>
            <div className='imageee'>
                <img src="./paul.jpg" alt="img" srcset="" />
                <h2>Paul Crescent Palanisamy</h2>
            </div>
            <div className='imageee'>
                <img src="aditya.jpeg" alt="img" srcset="" />
                <h2>Aditya Patil</h2>
            </div>
        </div>
     </div>
    </div>
    
  
  )
}
