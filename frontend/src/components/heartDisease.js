import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Dis.css";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import { fetchUser, handleSaveReport, fetchReport } from "../Functions/reportFunctions"
import ReportModal from "../Functions/ReportModal";
import Modal from 'react-modal'
import "../css/Heartdis.css"


function HeartDisease() {

  const [userID, setUserID] = useState("");
  const [reports, setReports] = useState([])
  const [reportModal, setReportModal] = useState(false)
  const [moreInfoModal, setMoreInfoModal] = useState(false)
  const report_type = 'heartDisease'
  const [formData, setFormData] = useState({
    age: 0,
    sex: 0,
    cp: 0,
    trestbps: 0,
    chol: 0,
    fbs: 0,
    restecg: 0,
    thalach: 0,
    exang: 0,
    oldpeak: 0,
  });

  const [prediction, setPrediction] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    console.log("formData: ", formData)
    event.preventDefault();
    axios
      .post("http://localhost:8000/predict2", formData)
      .then((response) => {
        setPrediction(response.data.prediction);

      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSet = (report) => {
    // setFormData({
    //   age: report.age,
    //   sex: report.sex,
    //   cp: report.cp,
    //   trestbps: report.trestbps,
    //   chol: report.chol,
    //   fbs: report.fbs,
    //   restecg: report.restecg,
    //   thalach: report.thalach,
    //   exang: report.exang,
    //   oldpeak: report.oldpeak,
    // }) 
  }
  const handleSave = () => {
    setFormData({ ...formData, result: prediction, report_type: report_type, })
    handleSaveReport(formData, userID, setReports, report_type)
  }

  const handleShowReport = () => {
    setReportModal(true)
  }

  const handleCLoseModal = () => {
    setReportModal(false)
  }

  useEffect(() => {
    fetchUser(setUserID)

  }, [])

  useEffect(() => {
    fetchReport(userID, setReports, report_type)
    console.log(userID)
  }, [userID])

  return (
    <>
      <div className="heartdismain">
        <div className="heartdis">
          <h2>Heart Disease Prediction</h2>
          <div className="heartrepo">
            <button id='traarports' onClick={handleShowReport}>Previous Reports</button>
            <Modal
              className="Modal__container"
              isOpen={reportModal}
              onRequestClose={() => { setReportModal(false) }}
              style={{
                overlay: {
                  zIndex: 9999
                },
                content: {
                  zIndex: 9999
                }
              }}
            >
              {reports.map((report, index) =>
                <div key={index}>
                  <p>Report: {report._id.toString().slice(-4)}</p>
                  <p>Result: {report.result}</p>
                  <p>Date: {report.report_creation_date}</p>
                  <button onClick={() => setMoreInfoModal(true)}>Info</button>
                  <button onClick={() => handleSet(report)}>Set</button>
                  <Modal
                    className="Modal__container"
                    isOpen={moreInfoModal}
                    onRequestClose={() => { setMoreInfoModal(false) }}
                    style={{
                      overlay: {
                        zIndex: 9999
                      },
                      content: {
                        zIndex: 9999
                      }
                    }}
                  >
                    <h2>Heart Disease Report</h2>
                    <p>Age: {report.age}</p>
                    <p>Sex: {report.sex}</p>
                    <p>Chest Pain Type: {report.cp}</p>
                    <p>Resting Blood Pressure: {report.trestbps}</p>
                    <p>Serum Cholesterol: {report.chol}</p>
                    <p>Fasting Blood Sugar: {report.fbs}</p>
                    <p>Resting Electrocardiographic Results: {report.restecg}</p>
                    <p>Maximum Heart Rate Achieved: {report.thalach}</p>
                    <p>Exercise Induced Angina: {report.exang}</p>
                    <p>ST Depression Induced by Exercise Relative to Rest: {report.oldpeak}</p>
                    <button onClick={() => { setMoreInfoModal(false) }}>Close</button>
                  </Modal>
                </div>
              )}
              <button onClick={() => { setReportModal(false) }}>Close</button>

            </Modal>
          </div>
          <form onSubmit={handleSubmit}>
            {/* Add input fields for each feature */}
            <div className="heartdisflex">
              <div className="flexxx">
                <div className="heartflexbox">
                  <label>Age:</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flexxx">
                <div className="heartflexbox">
                  <label>Sex :</label>
                  <select type="number" onChange={handleInputChange} value={formData.sex} name="sex" id="">

                    <option value="1">male</option>
                    <option value="0">female</option>
                  </select>
                  {/* <input
              type="number"
              name="sex"
              value={formData.sex}
              onChange={handleInputChange}
            /> */}
                </div>
              </div>
              <div className="flexxx">
                <div className="heartflexbox">
                  <label>
                    Chest pain
                  </label>

                  <select type="number" value={formData.cp} onChange={handleInputChange} name="cp" id="">
                    <option value="0">No pain</option>
                    <option value="1">Less pain</option>
                    <option value="2">Medium pain</option>
                    <option value="3">Sevier pain</option>
                  </select>
                </div>
              </div>
              <div className="flexxx">
                <div className="heartflexbox">
                  <label>Resting Blood Pressure(in mm):</label>
                  <input
                    type="number"
                    name="trestbps"
                    value={formData.trestbps}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flexxx">
                <div className="heartflexbox">
                  <label>serum cholestoral (in mg/dl):</label>
                  <input
                    type="number"
                    name="chol"
                    value={formData.chol}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flexxx">
                <div className="heartflexbox">
                  <label>
                    fasting blood sugar
                  </label>

                  <select value={formData.fbs} onChange={handleInputChange} type="number" name="fbs" id="">
                    <option value="0">less than 120 mg/dl</option>
                    <option value="1">Greater than 120 mg/dl</option>

                  </select>
                </div>
              </div>
              <div className="flexxx">
                <div className="heartflexbox">
                  <label>Resting Electrocardiographic:</label>
                  <input
                    type="number"
                    name="restecg"
                    value={formData.restecg}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flexxx">
                <div className="heartflexbox">
                  <label>Maximum Heart Rate:</label>
                  <input
                    type="number"
                    name="thalach"
                    value={formData.thalach}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flexxx">
                <div className="heartflexbox">
                  <label>Exercise Induced Angina :</label>
                  <select onChange={handleInputChange} value={formData.exang} type="number" name="exang" id="">
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
              </div>
              <div className="flexxx">
                <div className="heartflexbox">
                  <label>
                    ST depression induced by exercise relative to rest (Range 0 - 6.2):
                  </label>
                  <input
                    type="number"
                    name="oldpeak"
                    value={formData.oldpeak}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            {/* Add input fields for other features */}
            <button className="button-53" value="submit" type="submit">
              Predict
            </button>
          </form>
          {prediction !== null && (
            <p id="hesatdiuscno">
              Prediction:{" "}
              {prediction === 1 ? "Heart Disease detected" : "Heart Disease not found"}

            </p>

          )}
            {prediction &&  <button  id='kidimgp' onClick={handleSave}>Save report</button> }
         

        </div>
      </div>
    </>

  );
}

export default HeartDisease;
