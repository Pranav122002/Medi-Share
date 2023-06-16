import React, { useEffect, useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import { API_BASE_URL } from "../config";

export default function UserProfile({ id }) {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [editing, setEditing] = useState(false);
  const [isMine, setIsMine] = useState(false);
  // const [updatedDoctorDetails, setUpdatedDoctorDetails] = useState({
  //   fees: "",
  //   qualification: "",
  //   specialization: "",
  //   experience: "",
  //   availability: "",
  //   hospital_name: "",
  // });
  
  useEffect(() => {
    fetchUser();

    if (id ===  JSON.parse(localStorage.getItem('user'))._id ) {
    setIsMine(true);
  }

  }, [id]);

  const fetchUser = () => {
    fetch(`${API_BASE_URL}/user/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setUser(res);

        // if (res.role === "doctor") {
        //   setUpdatedDoctorDetails({
        //     fees: res.doctor_details.fees,
        //     qualification: res.doctor_details.qualification,
        //     specialization: res.doctor_details.specialization,
        //     experience: res.doctor_details.experience,
        //     availability: res.doctor_details.availability,
        //     hospital_name: res.doctor_details.hospital_name,
        //   });
        // }
      
      });
  };

  const editDoctorDetails = () => {
    fetch(`${API_BASE_URL}/edit-doctor-details/${JSON.parse(localStorage.getItem('user'))._id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("edit = ", res);
        
      });
  };

  // const handleEdit = () => {
  //   setEditing(true);
  // };

  // const handleInputChange = (e) => {
  //   setUpdatedDoctorDetails({
  //     ...updatedDoctorDetails,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  // const handleSubmit = () => {
  //   const updatedUser = { ...user };
  //   updatedUser.doctor_details = { ...updatedDoctorDetails };

  //   fetch(`${API_BASE_URL}/update-doctor-details/${id}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + localStorage.getItem("jwt"),
  //     },
  //     body: JSON.stringify(updatedUser),
  //   })
  //     .then((res) => res.json())
  //     .then((res) => {
       
        
  //       setEditing(false);
  //       setUser(res);

  //     });
  // };

  return (
    <div>

      {user.role === "doctor" ? (

        <>

          {isMine ? (

            <>
              {editing ? (

                <>
                  <h3>Edit Doctor Details</h3>
                  <label>Fees:</label>
                  <input
                    type="text"
                    name="fees"
                    value={updatedDoctorDetails.fees}
                    onChange={handleInputChange}
                  />
                  <label>Qualification:</label>
                  <input
                    type="text"
                    name="qualification"
                    value={updatedDoctorDetails.qualification}
                    onChange={handleInputChange}
                  />
                  <label>Specialization:</label>
                  <input
                    type="text"
                    name="specialization"
                    value={updatedDoctorDetails.specialization}
                    onChange={handleInputChange}
                  />
                  <label>Experience:</label>
                  <input
                    type="text"
                    name="experience"
                    value={updatedDoctorDetails.experience}
                    onChange={handleInputChange}
                  />
                  <label>Availability:</label>
                  <input
                    type="text"
                    name="availability"
                    value={updatedDoctorDetails.availability}
                    onChange={handleInputChange}
                  />
                  <label>Hospital Name:</label>
                  <input
                    type="text"
                    name="hospital_name"
                    value={updatedDoctorDetails.hospital_name}
                    onChange={handleInputChange}
                  />
                  <button onClick={handleSubmit}>Submit</button>
                </>

              ) : (

                <>
                  <button onClick={handleEdit}>Edit</button>
                  <h3>Doctor Details</h3>
                  <p>Name: {user.name}</p>
                  <p>Fees: {user.doctor_details.fees}</p>
                  <p>Qualification: {user.doctor_details.qualification}</p>
                  <p>Specialization: {user.doctor_details.specialization}</p>
                  <p>Experience: {user.doctor_details.experience}</p>
                  <p>Availability: {user.doctor_details.availability}</p>
                  <p>Hospital Name: {user.doctor_details.hospital_name}</p>
                </>

              )}
            </>

          ) : (

            <>
              <h3>Doctor Details</h3>
              <p>Name: {user.name}</p>
              <p>Fees: {user.doctor_details.fees}</p>
              <p>Qualification: {user.doctor_details.qualification}</p>
              <p>Specialization: {user.doctor_details.specialization}</p>
              <p>Experience: {user.doctor_details.experience}</p>
              <p>Availability: {user.doctor_details.availability}</p>
              <p>Hospital Name: {user.doctor_details.hospital_name}</p>
            </>

          )}
        </>

      ) : (

        <>
          <h3>Volunteer Details</h3>
          <p>Volunteer Name = {user.name}</p>
        </>

      )}
    </div>
  );
}
