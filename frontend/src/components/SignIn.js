import React, { useState, useContext } from "react";
import "../css/SignIn.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
    fetch("/signin", {
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

  return (
    <>
      <div className="banner">
        <img id="logo" src="./logo1.png" alt="logo" />
        <h1>Medi Share</h1>
        <Link className="aboutus" to="/AboutUs">
          <span id="Aboutus" style={{ cursor: "pointer" }}>About Us</span>
        </Link>
      </div>

      <div className="signIn">

        <div className="left">
          <h1>A Medicine Distribution System</h1>
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
              <span style={{  color: "blue", cursor: "pointer" }}> Sign Up</span>
            </Link>
          </div>
        </div>


      </div>
    </>
  );
}
