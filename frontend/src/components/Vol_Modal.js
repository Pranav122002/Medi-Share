import React from "react";
import { RiCloseLine } from "react-icons/ri";
import "../css/Modal.css";
import { useNavigate } from "react-router-dom";

export default function Vol_Modal({ setVolModalOpen }) {
  const navigate = useNavigate();
  return (
    <div className="darkBg" onClick={() => setVolModalOpen(false)}>
      <div className="centered">
        <div className="modal">
          {/* modal header */}
          <div className="modalHeader">
            <h5 className="heading">Confirm</h5>
          </div>
          <button className="closeBtn" onClick={() => setVolModalOpen(false)}>
            <RiCloseLine></RiCloseLine>
          </button>
          {/* modal content */}
          <div className="modalContent">Do you want to Volunteer ?</div>
          <div className="modalActions">
            <div className="actionsContainer">
              <button
                className="logOutBtn"
                onClick={() => {
                  setVolModalOpen(false);
                  localStorage.clear();
                  navigate("./signin");
                }}
              >
                Yes !
              </button>

              <button className="cancelBtn" onClick={() => setVolModalOpen(false)}>
                cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
