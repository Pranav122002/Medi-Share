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
    // Sending data to server
    fetch("http://localhost:5000/signin", {
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
          notifyB("Signed In Successfully");
          console.log(data);
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

        

          if (data.user.role == "doctor") {
            navigate("/doctor");
          } else {
            navigate("/");
          }
       
        }
   
      });
  };

  return (
   
    <div className="signIn">
        
      <div>
        <div className="loginForm">
          <div className="logo">
            <h1>Medi-Share</h1>
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
       
        </div>
        <div className="loginForm2">
          Don't have an account ?
          <Link to="/signup">
            <span style={{ color: "blue", cursor: "pointer" }}> Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
