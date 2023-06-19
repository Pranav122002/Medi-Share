import React, { useState } from "react";
import axios from "axios";
import "../css/Dis.css";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";

function HeartDisease() {
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
            <label>Sex (1 = male; 0 = female):</label>
            <input
              type="number"
              name="sex"
              value={formData.sex}
              onChange={handleInputChange}
            />
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
          </p>
        )}
      </div>
    </>
  );
}

export default HeartDisease;
