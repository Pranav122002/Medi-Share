import React, { useState } from "react";
import axios from "axios";
import "../css/Generalpred.css";

function GeneralPredict() {
  const [formData, setFormData] = useState({
    symptoms: "",
  });

  const [condition, setCondition] = useState("");
  const [recommendation, setRecommendation] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8000/predict3", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setCondition(response.data.condition);
        setRecommendation(response.data.recommendation);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="generalmain">
        <div className="general">
          <div>
            <h2>Medi-Doc</h2>
            <p>
              AI based disease prediction which predicts medical condition of
              the user and recommends drugs based on symptoms
            </p>
          </div>
          <img src="./medical-robot.png" alt="" />
        </div>
        <div className="inputgeneral">
          <div className="oneflex">
            <form onSubmit={handleSubmit}>
              <h2>Enter your symptoms:</h2>
              <textarea
                className="textgeneralp"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleInputChange}
              ></textarea>
              <button type="submit">Predict</button>
            </form>
          </div>
          {condition ? (
            condition && (
              <>
                <div className="oneflex">
                  <h2>Predicted Medical Condition:</h2>
                  <div id="consasda">{condition}</div>
                </div>
                <div className="oneflex">
                  <h2>Recommended Drugs:</h2>
                  <ul>
                    {recommendation.map((drug) => {
                      return <li key={drug}>{drug}</li>;
                    })}
                  </ul>
                </div>
              </>
            )
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}

export default GeneralPredict;
