import React, { useState } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";

function Braintumor() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState("");

  const handleDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:8000/predict1",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <h1>Brain-Tumor Prediction</h1>
        <Dropzone onDrop={handleDrop} accept="image/jpeg, image/png">
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              <p>Drag and drop an image here or click to select an image.</p>
            </div>
          )}
        </Dropzone>
        {selectedFile && (
          <div>
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Selected Brain-Tumor"
            />
            <button onClick={handleSubmit}>Predict</button>
          </div>
        )}
        {prediction && <p>Prediction: {prediction}</p>}
      </div>
    </>
  );
}

export default Braintumor;
