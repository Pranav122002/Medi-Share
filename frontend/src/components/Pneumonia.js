import React, { useState, useEffect } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import {
  uploadImg,
  fetchUser,
  handleSaveReport,
  fetchReport,
} from "../Functions/reportFunctions";
import ReportModal from "../Functions/ReportModal";

function Pneumonia() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState("");

  const report_type = "pneumonia";
  const [imgUrl, setImgUrl] = useState("");

  const [userID, setUserID] = useState("");

  const [reports, setReports] = useState([]);

  const [imageModal, setImageModal] = useState(null);
  const [reportModal, setReportModal] = useState(false);

  const handleDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:8000/predict",
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
      result: prediction,
    };
    handleSaveReport(report_data, userID, setReports, report_type);
    setSelectedFile(null);
    setPrediction("");
  };

  const handleShowReport = () => {
    setReportModal(true);
  };

  const handleCLoseModal = () => {
    setReportModal(false);
  };
  const handleCloseImageModal = () => {
    setImageModal(null);
  };

  useEffect(() => {
    fetchUser(setUserID);
  }, []);
  useEffect(() => {
    if (selectedFile !== "") {
      uploadImg(selectedFile, setImgUrl);
    }
  }, [selectedFile]);

  useEffect(() => {
    fetchReport(userID, setReports, report_type);
  }, [userID]);

  return (
    <>
      <div className="generalmain">
        <div className="kidneymain">
          <h2>Pneumonia Prediction</h2>
          <div>
            <button id="traarports" onClick={handleShowReport}>
              Previous Reports{" "}
            </button>
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
          <Dropzone onDrop={handleDrop} accept="image/jpeg, image/png">
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <p id="fhysdnb">
                  Drag and drop an image here or click to select an image.
                </p>
              </div>
            )}
          </Dropzone>
          {selectedFile && (
            <>
              <div className="kidneyimg">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected X-ray"
                />
              </div>
              <div className="kidimgpreddac">
                <button onClick={handleSubmit}>Predict</button>

                {prediction && (
                  <button id="kidimgpred" onClick={handleSave}>
                    Save report
                  </button>
                )}
              </div>
            </>
          )}
          {prediction ? (
            <div className="kidneyresult">
              <h2>{prediction && <p>Prediction Result: {prediction}</p>}</h2>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}

export default Pneumonia;
