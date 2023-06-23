import React, { useState } from "react";
import axios from "axios";

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
            .post("http://localhost:8000/predict3", formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((response) => {
                setCondition(response.data.condition);
                setRecommendation(response.data.recommendation);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div>
            <h1>Patient Condition Classification</h1>
            <form onSubmit={handleSubmit}>
                <label>Symptoms:</label>
                <textarea
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleInputChange}
                ></textarea>
                <button type="submit">Predict</button>
            </form>
            {condition && (
                <div>
                    <h2>Patient Condition: {condition}</h2>
                    <h3>Recommended Drugs:</h3>
                    <ul>
                        {recommendation.map((drug) =>{
                            console.log(drug)
                            return(
                            <li key={drug}>{drug}</li>
                        )})}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default GeneralPredict;