import React, { useState } from 'react';




function DiseasePrediction() {
  const [pregnancies, setPregnancies] = useState('');
  const [glucose, setGlucose] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [skinThickness, setSkinThickness] = useState('');
  const [insulin, setInsulin] = useState('');
  const [bmi, setBmi] = useState('');
  const [dpf, setDpf] = useState('');
  const [age, setAge] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  const handlePrediction = () => {
    const inputData = {
      pregnancies: pregnancies,
      glucose: glucose,
      bloodPressure: bloodPressure,
      skinThickness: skinThickness,
      insulin: insulin,
      bmi: bmi,
      dpf: dpf,
      age: age
    };
  
    fetch("/disease-predict", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inputData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.prediction === 1) {
        setDiagnosis('The person is diabetic');
      } else {
        setDiagnosis('The person is not diabetic');
      }
    })
    .catch(error => console.error(error));
  };
  

  return (
    <div>
      <h1>Diabetes Prediction using ML</h1>

      <label>
        Number of Pregnancies:
        <input type="text" value={pregnancies} onChange={e => setPregnancies(e.target.value)} />
      </label>

      <label>
        Glucose Level:
        <input type="text" value={glucose} onChange={e => setGlucose(e.target.value)} />
      </label>

      <label>
        Blood Pressure value:
        <input type="text" value={bloodPressure} onChange={e => setBloodPressure(e.target.value)} />
      </label>

      <label>
        Skin Thickness value:
        <input type="text" value={skinThickness} onChange={e => setSkinThickness(e.target.value)} />
      </label>

      <label>
        Insulin Level:
        <input type="text" value={insulin} onChange={e => setInsulin(e.target.value)} />
      </label>

      <label>
        BMI value:
        <input type="text" value={bmi} onChange={e => setBmi(e.target.value)} />
      </label>

      <label>
        Diabetes Pedigree Function value:
        <input type="text" value={dpf} onChange={e => setDpf(e.target.value)} />
      </label>

      <label>
        Age of the Person:
        <input type="text" value={age} onChange={e => setAge(e.target.value)} />
      </label>

      <button onClick={handlePrediction}>Diabetes Test Result</button>
      <div>{diagnosis}</div>
    </div>
  );
}



// function DiseasePrediction() {
//   const [formData, setFormData] = useState({});
//   const [prediction, setPrediction] = useState('');

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const response = await axios.post('/disease-predict', formData);
//     setPrediction(response.data);
//   };

//   return (
//     <div>
//       <h1>Disease Prediction</h1>
//       <form onSubmit={handleSubmit}>
//         {/* Input fields for symptoms */}
//         <button type="submit">Predict Disease</button>
//       </form>
//       {prediction && <p>Predicted disease: {prediction}</p>}
//     </div>
//   );
// }

export default DiseasePrediction;
