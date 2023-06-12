import React, { useState, useContext } from "react";
import "../css/SignIn.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";

export default function SignIn() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const postData = () => {
    //checking email
    if (!emailRegex.test(email)) {
      notifyA("Invalid email");
      return;
    }
    fetch(`${API_BASE_URL}/signin"`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        role: role,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB("Signed In successfully...");
          console.log(data);
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          navigate("/home");
        }
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
    <><div className="mainsignin">
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

      <div className="signIn">

        <div className="left">
          <h1>Welcome to "Medi-Share"</h1>
          <img src="./ui1.png" alt="" />
        </div>
        <div className="middle"></div>
        <div className="loginForm">
          <div className="logo">
            <h1>LOGIN</h1>
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

          <input
            type="submit"
            id="login-btn"
            onClick={() => {
              postData();
            }}
            value="Sign In"
          />
          <div className="form2">
            Don't have an account ?
            <Link to="/signup">
              <span style={{ color: "blue", cursor: "pointer" }}> Sign Up</span>
            </Link>
          </div>
        </div>


      </div>
    </div>
    </>
  );
}
