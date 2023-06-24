import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Dis.css";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import { fetchUser, handleSaveReport, fetchReport } from "../Functions/reportFunctions"
import ReportModal from "../Functions/ReportModal";
import Modal from 'react-modal'

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
      <div className="heartdis">
        <h1>Heart Disease Prediction</h1>
        <form onSubmit={handleSubmit}>
          {/* Add input fields for each feature */}

          <div className="flexxx">
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
            />
          </div>
          <div className="flexxx">
            <label>Sex :</label>
            <select type="number" onChange={handleInputChange}  value={formData.sex} name="sex" id="">

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
          <div className="flexxx">
            <label>
              Cp (chest pain type(0 = no pain; 1 = less pain; 2 = medium pain; 3
              = sevier pain;)):
            </label>
            <input
              type="number"
              name="cp"
              value={formData.cp}
              onChange={handleInputChange}
            />
          </div>

          <div className="flexxx">
            <label>Resting Blood Pressure(in mm):</label>
            <input
              type="number"
              name="trestbps"
              value={formData.trestbps}
              onChange={handleInputChange}
            />
          </div>
          <div className="flexxx">
            <label>serum cholestoral (in mg/dl):</label>
            <input
              type="number"
              name="chol"
              value={formData.chol}
              onChange={handleInputChange}
            />
          </div>
          <div className="flexxx">
            <label>
              fasting blood sugar 120 mg/dl or greater (1 = true; 0 = false):
            </label>
            <input
              type="number"
              name="fbs"
              value={formData.fbs}
              onChange={handleInputChange}
            />
          </div>
          <div className="flexxx">
            <label>Resting Electrocardiographic:</label>
            <input
              type="number"
              name="restecg"
              value={formData.restecg}
              onChange={handleInputChange}
            />
          </div>
          <div className="flexxx">
            <label>Maximum Heart Rate:</label>
            <input
              type="number"
              name="thalach"
              value={formData.thalach}
              onChange={handleInputChange}
            />
          </div>
          <div className="flexxx">
            <label>Exercise Induced Angina (1 = yes; 0 = no):</label>
            <input
              type="number"
              name="exang"
              value={formData.exang}
              onChange={handleInputChange}
            />
          </div>
          <div className="flexxx">
            <label>
              ST depression induced by exercise relative to rest(Range 0 - 6.2):
            </label>
            <input
              type="number"
              name="oldpeak"
              value={formData.oldpeak}
              onChange={handleInputChange}
            />
          </div>

          {/* Add input fields for other features */}
          <button className="button-53" value="submit" type="submit">
            Predict
          </button>
        </form>
        {prediction !== null && (
          <p>
            Prediction:{" "}
            {prediction === 1 ? "Heart Disease" : "No Heart Disease"}
            <button onClick={handleSave}>Save report</button>
          </p>
        )}
        <button onClick={handleShowReport}>Show Reports</button>
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
    </>
  );
}

export default HeartDisease;
