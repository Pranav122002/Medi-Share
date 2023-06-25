import React, { useEffect, useState } from "react";
import "../css/SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";
import { CLOUD_NAME } from "../keys";
import { UPLOAD_PRESET } from "../keys";

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");
  const [showNavbar, setShowNavbar] = useState(false);

  const [image, setImage] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  useEffect(() => {
    if (image !== "") {
      uploadImg();
    }
  }, [image]);

  const postData = () => {
    if (!emailRegex.test(email)) {
      notifyA("Invalid email.");
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
        phone_no: phoneNumber,
        role: role,
        password: password,
        certificate: imgUrl,
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
      });
  };

  const loadfile = (event) => {
    var output = document.getElementById("output");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src);
    };
  };

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  const uploadImg = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("cloud_name", CLOUD_NAME);

    fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setImgUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="mainsignup">
        <div className="signUp">
          <div className="left">
            <div className="cover"></div>
            <h1>Be a part of our "COMMUNITY"</h1>
            <img src="./community.png" alt="" />
          </div>
          <div className="middle"> </div>
          <div className="form-container">
            <div className="form">
              <h1>SIGN UP</h1>

              <div id="roles">
                <select
                  required
                  placeholder="Choose your role"
                  name="role"
                  id="role"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                  }}
                >
                  <option className="selopt" value="" disabled selected>
                    Chooose your role{" "}
                  </option>
                  <option className="selopt" value="user">
                    user
                  </option>
                  <option className="selopt" value="volunteer">
                    volunteer
                  </option>
                  <option className="selopt" value="doctor">
                    doctor
                  </option>
                </select>
              </div>

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

              <div>
                <input
                  type="text"
                  name="phone_number"
                  id="phone_number"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
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
              <div>
                {role === "doctor" || role === "volunteer" ? (
                  <div className="uploadimage">
                    <div>
                      <img
                        id="output"
                        src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png"
                        height="50"
                        width="50"
                      />
                    </div>
                    <input
                      id="uploadf"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        loadfile(event);
                        setImage(event.target.files[0]);
                      }}
                    />
                  </div>
                ) : (
                  <></>
                )}
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
                <span style={{ cursor: "pointer" }}> Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
