import React, { useEffect, useState, useRef } from "react";
import "../css/Chats.css";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";

export default function Chats() {
  return (
    <>
      <div className="chatfunc">
        <div className="chatcont">
          <h1>Interact with the community!</h1>
          <p>
            Take active part in community meetings and gatherings. Interact with
            other people in personal and community chats. Get latest news about
            community services.
          </p>
        </div>
        <img src="chats.png" alt="" />
      </div>
      <div className="linkcont">
        <Link to="/personal-chat">
          <li className="Cnavli">
            <h2>Personal Chats</h2>
            <p>Chat 1 to 1 with other website users </p>
            <p>Interact privately with other website users </p>

            <button className="button-53" value="Donate" role="button">
              Click to start chatting
            </button>
          </li>
        </Link>
        <Link to="/community-chat">
          <li className="Cnavli">
            <h2>Community Chats</h2>
            <p>Chat with other website users in group chat </p>
            <p>Get latest news about community services</p>
            <button className="button-53" value="Donate" role="button">
              Click to start chatting
            </button>
          </li>
        </Link>
      </div>
    </>
  );
}
