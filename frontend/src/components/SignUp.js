import React, { useEffect, useState } from "react";
import "../css/SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";

export default function SignUp() {

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  const postData = () => {
    if (!emailRegex.test(email)) {
      notifyA("Invalid email...");
      return;
    } else if (!passRegex.test(password)) {
      notifyA(
        "Password must contain at least 8 characters, including at least 1 number and 1 includes both lower and uppercase letters and special characters for example #,?,!"
      );
      return;
    }
    fetch(`${API_BASE_URL}/signup`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        role: role,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notifyA(data.error);
        } else {
          navigate("/signin");
          notifyB(data.message);
        }
        console.log(data);
      });
  };
  const [showNavbar, setShowNavbar] = useState(false)

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar)
    console.log(showNavbar)
  }


  const navigatee = useNavigate();
  const goHome = () => {
    navigate('/')
  }

  return (
    <>
      <div className="mainsignup">
        <div className='Lnav'>
          <div className='Lnav_contents'>
            <div className="logo" onClick={() => { goHome() }}>

              <img id="Nlogo" src="./logo1.png" alt="logo" />
              <h2>Medi-Share</h2>
            </div>
            <div className='icon' onClick={handleShowNavbar}>
              <div className='line'></div>
              <div className='line'></div>
              <div className='line'></div>
            </div>
            <div className={`links ${showNavbar && 'active'}`}>
              <Link className="aboutu" to="/AboutUs">
                <span id="Aboutt" style={{ cursor: "pointer" }}>About Us</span>
              </Link>
              <Link className="joinus" to="/signIn">
                <span id="joinus" style={{ cursor: "pointer" }}>Join Us</span>
              </Link>
            </div>

          </div>
        </div>
        <div className="signUp">
          <div className="left">
            <div className="cover"></div>
            <h1>Be a part of our "COMMUNITY"</h1>
            <img src="./community.png" alt="" />
          </div>
          <div className="middle"></div>
          <div className="form-container">
            <div className="form">
              <h1>REGISTER</h1>
              <div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  placeholder="Email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>

              <div></div>
              <div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <div id="roles">
                Choose your role
                <select
                  name="role"
                  id="role"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                  }}
                >
                  <option value="user">user</option>
                  <option value="volunteer">volunteer</option>
                  <option value="doctor">doctor</option>
                </select>
              </div>
              <input
                type="submit"
                id="submit-btn"
                value="Sign Up"
                onClick={() => {
                  postData();
                }}
              />
            </div>
            <div className="form2">
              Already have a account ?
              <Link to="/signin">
                <span style={{ color: "blue", cursor: "pointer" }}> Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
