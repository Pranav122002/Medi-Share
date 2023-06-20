import React from 'react';
// import Webcam from 'react-webcam';
import { useDropzone } from 'react-dropzone';
import {useState} from 'react'

const Drop = () => {
  const [image, setImage] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here...</p>
      ) : (
        <p>Upload Medicine photo
        </p>
      )}
      {/* {image && <img src={image} alt="Dropped"/>} */}
    </div>
  );
};


export default Drop