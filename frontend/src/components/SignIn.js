import React, { useState, useContext } from "react";
import "../css/SignIn.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";
import { volLocation } from "./volLocation";
import { UserContext } from "./UserContext";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const { updateUser } = useContext(UserContext);

  const postData = () => {
    //checking email
    if (!emailRegex.test(email)) {
      notifyA("Invalid email");
      return;
    }
    fetch(`${API_BASE_URL}/signin`, {
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
          notifyB("Signed In successfully.");

          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          fetch(`${API_BASE_URL}/user/${data.user._id}`, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
          })
            .then((res) => res.json())
            .then((res) => {
              const subscriptionEndDate = new Date(res.subscription_end_date);
              const currentDate = new Date();

              if (
                res.subscription_end_date &&
                subscriptionEndDate < currentDate
              ) {
                const updatedUser = {
                  ...res,
                  subscription: false,
                  subscription_end_date: undefined,
                };
                updateUser(updatedUser);

                fetch(`${API_BASE_URL}/end-subscription/${res._id}`, {
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
            });

          navigate("/home");
        }
      });
  };
  const [showNavbar, setShowNavbar] = useState(false);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  const navigatee = useNavigate();
  const goHome = () => {
    navigate("/");
  };

  return (
    <>
      <div className="mainsignin">
        <div className="signIn">
          <div className="left">
            <h1>Welcome to "Medi-Share"</h1>
            <img className="bkimg" src="./ui1.png" alt="" />
          </div>
          <div className="middle"></div>
          <div className="loginForm">
            <div className="logo">
              <h1>SIGN IN</h1>
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
                <span style={{ cursor: "pointer" }}> Sign Up</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
