import React, { useEffect, useState, useRef } from "react";
import "../css/Chats.css";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";

export default function Chats() {
    
  return (
    <>
      <Hnavbar />
      <Navbar />
      <div className="linkcont">
        <Link to="/personal-chat">
          <li style={{ color: "black" }} className="navli">
            Personal Chat
          </li>
        </Link>
        <Link to="/community-chat">
          <li style={{ color: "black" }} className="navli">
            Community Chat
          </li>
        </Link>
      </div>
    </>
  );
}
