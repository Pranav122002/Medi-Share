import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Dis.css";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import { fetchUser, handleSaveReport, fetchReport } from "../Functions/reportFunctions"
import ReportModal from "../Functions/ReportModal";
import Modal from 'react-modal'
import "../css/Heartdis.css"
import * as Yup from 'yup';
import { toast } from "react-toastify";

function HeartDisease() {

  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);
  const [userID, setUserID] = useState("");
  const [reports, setReports] = useState([])
  const [reportModal, setReportModal] = useState(false)
  const [moreInfoModal, setMoreInfoModal] = useState(null)
  const report_type = 'heartDisease'
  const [formData, setFormData] = useState({
    age: '0',
    sex: '0',
    cp: '0',
    trestbps: '0',
    chol: '0',
    fbs: '0',
    restecg: '0',
    thalach: '0',
    exang: '0',
    oldpeak: '0',
  });

  const [prediction, setPrediction] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const validation = await formValidation.validate({
        age: parseInt(formData.age),
        trestbps: parseInt(formData.trestbps),
        chol: parseInt(formData.chol),
        restecg: parseInt(formData.restecg),
        thalach: parseInt(formData.thalach),
        exang: parseInt(formData.exang),
        oldpeak: parseInt(formData.oldpeak),
      },
        { abortEarly: false }
      )
      console.log("formData: ", formData)
      axios
        .post("http://localhost:8000/predict2", formData)
        .then((response) => {
          setPrediction(response.data.prediction);
          notifyB("Prediction done")
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      error.inner.forEach((validationError) => {
        notifyA(validationError.message)
      });
    }
  };

  const handleSet = (report) => {
    setFormData({
      age: report.age,
      sex: report.sex,
      cp: report.cp,
      trestbps: report.trestbps,
      chol: report.chol,
      fbs: report.fbs,
      restecg: report.restecg,
      thalach: report.thalach,
      exang: report.exang,
      oldpeak: report.oldpeak,
    })
    setReportModal(false)
  }
  const handleSave = () => {
    // setFormData()
    console.log("formdata with result : ", formData)
    handleSaveReport({ ...formData, result: prediction, report_type: report_type, user_id: userID }, userID, setReports, report_type)
    setFormData({
      age: '0',
      sex: '0',
      cp: '0',
      trestbps: '0',
      chol: '0',
      fbs: '0',
      restecg: '0',
      thalach: '0',
      exang: '0',
      oldpeak: '0',
    })
    setPrediction(null)
  }

  const handleShowReport = () => {
    setReportModal(true)
  }

  const handleCLoseModal = () => {
    setReportModal(false)
  }

  const formValidation = Yup.object().shape({
    age: Yup.number()
      .min(18, 'Age must be greater than or equal to 18')
      .required('Age is required'),

    trestbps: Yup.number()
      .min(1, 'Invalid Resting Blood Pressure ')
      .required('Resting Blood Pressure is required'),

    chol: Yup.number()
      .min(1, 'Invalid Serum Cholesterol')
      .required('Serum Cholesterol is required'),

    restecg: Yup.number()
      .min(1, 'Invalid Resting Electrocardiographic')
      .required('Resting Electrocardiographic Results is required'),
    thalach: Yup.number()
      .min(1, 'Invalid Heart Rate')
      .max(300, 'Invalid Heart Rate')
      .required('Maximum Heart Rate Achieved is required'),

    oldpeak: Yup.number()
      .min(0, 'Invalid ST Depression')
      .max(6.2, 'Invalid ST Depression')
      .required('ST Depression Induced by Exercise Relative to Rest is required'),
  });


  useEffect(() => {
    fetchUser(setUserID)

  }, [])

  useEffect(() => {
    fetchReport(userID, setReports, report_type)
    console.log(userID)
    console.log("formdata with result : ", formData)
  }, [formData, userID])

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
              {reports.map((report, index) => (
                <div key={index}>
                  <p><b>Report: {report._id.toString().slice(-4)}</b></p>
                  <p>Result: {report.result === "1" ?
                    "Heart Disease detected" :
                    "Heart Disease not detected"}</p>
                  <p>Date: {report.report_creation_date}</p>
                  <button onClick={() => setMoreInfoModal(index)}>Info</button>
                  <button onClick={() => handleSet(report)}>Set</button>
                  <Modal
                    className="Modal__container"
                    isOpen={moreInfoModal === index}
                    onRequestClose={() => { setMoreInfoModal(null) }}
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
                    <button onClick={() => { setMoreInfoModal(null) }}>Close</button>
                  </Modal>
                </div>
              ))}
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
          {prediction !== null && <button id='kidimgp' onClick={handleSave}>Save report</button>}


        </div>
      </div>
    </>

  );
}

export default HeartDisease;
