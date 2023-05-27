import React, { useState } from 'react';

function DiabetesPrediction() {
  const [formData, setFormData] = useState({
    pregnancies: 0,
    glucose: 0,
    bloodpressure: 0,
    skinthickness: 0,
    insulin: 0,
    bmi: 0,
    dpf: '',
    age: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/diabetes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data); 
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Diabetes Prediction</h1>
      <h5 style={{ textAlign: 'center' }}>Please enter the patient details</h5>
      <form onSubmit={handleSubmit} className="form-inline">
        <fieldset>
          <div className="tabcontent" id="new">
            <div className="form-group">
              <label htmlFor="pregnancies">Number of Pregnancies</label>
              <input
                className="form-control"
                type="number"
                name="pregnancies"
                placeholder="eg. 0 for male"
                value={formData.pregnancies}
                onChange={handleChange}
                required
              />
            </div>
           
            <button type="submit" className="btn btn-primary btn-lg">
              Predict
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default DiabetesPrediction;
