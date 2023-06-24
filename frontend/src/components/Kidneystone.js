import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import Dropzone from 'react-dropzone';
import { CLOUD_NAME } from "../keys";
import { UPLOAD_PRESET } from "../keys";
import { API_BASE_URL } from '../config';
import { json } from 'react-router-dom';
import Modal from 'react-modal'
import '../css/Modal.css'

function Kidneystone() {

  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);


  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [userID, setUserID] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [reports, setReports] = useState([])
  const [imageModal, setImageModal] = useState(false)
  const [reportModal, setReportModal] = useState(false)
  const [closeReportModal, setCloseReportModal] = useState(false)
  const handleDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };


  const uploadImg = () => {
    const data = new FormData();
    data.append("file", selectedFile);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("cloud_name", CLOUD_NAME);

    console.log("data = ", data);

    fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setImgUrl(data.url);
        console.log("data.url = ", data.url);
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:8000/predict4', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveReport = () => {
    console.log({
      user_id: userID,
      report_type: 'kidneyStone',
      image_url: imgUrl,
      result: prediction
    })
    fetch(`${API_BASE_URL}/reports`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: userID,
        report_type: 'kidneyStone',
        image_url: imgUrl,
        result: prediction
      })
    })
      .then(res => res.json())
      .then(res => {
        notifyB("Report Saved")
        fetchReport()
        console.log(res)
      })
  }
  const handleShowReport = () => {
    setReportModal(true)
  }

  const fetchUser = () => {
    fetch(
      `${API_BASE_URL}/user/${JSON.parse(localStorage.getItem("user"))._id
      }`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    ).then((res) => res.json())
      .then((result) => {

        setUserID(result._id)
      })
  }

  const fetchReport = () => {
    fetch(`${API_BASE_URL}/allreports/${userID}`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          report_type: "kidneyStone"
        })
      }
    )
      .then(res => res.json())
      .then(doc => {
        console.log(doc)
        setReports(doc)
      })
  }

  const handleCLoseModal = () => {
    setReportModal(false)
  }
  const handleCloseImageModal = () => {
    setImageModal(false)
  }

  useEffect(() => {
    fetchUser()
    
  },[])

  useEffect(() => {
    if (selectedFile !== "") {
      uploadImg();
    }
  }, [selectedFile]);

  useEffect(() => {
    fetchReport()
  },[userID])

  useEffect(() => {
    console.log("userID",userID)
    console.log("reports ",reports)
    // console.log
  }, [reports])
  return (
    <div>
      <h1>Chest X-ray Prediction</h1>
      <Dropzone onDrop={handleDrop} accept="image/jpeg, image/png">
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <p>Drag and drop an image here or click to select an image.</p>
          </div>
        )}
      </Dropzone>
      {selectedFile && (
        <div>
          <img src={URL.createObjectURL(selectedFile)} alt="Selected X-ray" />
          <button onClick={handleSubmit}>Predict</button>
          {prediction && 
          <button onClick={handleSaveReport}>Save report</button>
          }
        </div>
      )}
      {prediction && <p>Prediction: {prediction}</p>}
      <div>
        <button onClick={handleShowReport}>Show Reports</button>
        <Modal
          className="Modal__container"
          isOpen={reportModal}
          onRequestClose={handleCLoseModal}
          style={{
            overlay: {
              zIndex: 9999
            },
            content: {
              zIndex: 9999
            }
          }}
        >
          {reports.map((report, index) => {
            return (
              <div key={index}>
                <p>Report: {report._id.toString().slice(-4)}</p>
                <p>Result: {report.result}</p>
                <p>Date: {report.report_creation_date}</p>
                <button onClick={()=>setImageModal(true)}>Image</button>
                <Modal
                 className="Modal__container"
                 isOpen={imageModal}
                 onRequestClose={handleCloseImageModal}
                 style={{
                   overlay: {
                     zIndex: 9999
                   },
                   content: {
                     zIndex: 9999
                   }
                 }}
                > 
                <img
                src={report.image_url}
                alt='Kidney X-ray'
                />
                  <button onClick={()=>setImageModal(false)}>Close</button>
                </Modal>
              </div>
            );
          })}
          <button onClick={()=>setReportModal(false)}>Close</button>
        </Modal>
      </div>
    </div>

  );
}





export default Kidneystone;