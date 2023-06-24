import React, { useState, useEffect } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import { uploadImg, fetchUser, handleSaveReport, fetchReport } from "../Functions/reportFunctions"
import ReportModal from "../Functions/ReportModal";

function Braintumor() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState("");

  const report_type = 'brainTumor'
  const [imgUrl, setImgUrl] = useState("");
  const [userID, setUserID] = useState("");
  const [reports, setReports] = useState([])
  const [imageModal, setImageModal] = useState(false)
  const [reportModal, setReportModal] = useState(false)

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

  const handleSave = () => {
    const report_data = {
      user_id: userID,
      report_type: report_type,
      image_url: imgUrl,
      result: prediction
    }
    handleSaveReport(report_data, userID, setReports, report_type)
  }

  const handleShowReport = () => {
    setReportModal(true)
  }


  const handleCLoseModal = () => {
    setReportModal(false)
  }
  const handleCloseImageModal = () => {
    setImageModal(false)
  }


  useEffect(() => {
    fetchUser(setUserID)

  }, [])
  useEffect(() => {
    if (selectedFile !== "") {
      uploadImg(selectedFile, setImgUrl);
    }
  }, [selectedFile]);

  useEffect(() => {
    fetchReport(userID, setReports, report_type)
  }, [userID])

  useEffect(() => {
    // console.log(reports)
  } )
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
        {prediction && <>
          <p>Prediction: {prediction}</p>
          <button onClick={handleSave}>Save report</button>
        </>
        }
        <button onClick={handleShowReport}>Show Reports</button>
        <ReportModal
          reportModal={reportModal}
          handleCLoseModal={handleCLoseModal}
          reports={reports}
          setImageModal={setImageModal}
          handleCloseImageModal={handleCloseImageModal}
          imageModal={imageModal}
          setReportModal={setReportModal}
        />
      </div>
    </>
  );
}

export default Braintumor;
