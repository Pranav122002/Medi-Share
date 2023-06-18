import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { toast } from "react-toastify";

export default function UserProfile({ id }) {
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [isMine, setIsMine] = useState(false);
  const [updatedDoctorDetails, setUpdatedDoctorDetails] = useState({
    fees: "",
    qualification: "",
    specialization: "",
    experience: "",
    availability: "",
    hospital_name: "",
  });
  const [updatedVolunteerDetails, setUpdatedVolunteerDetails] = useState({
    qualification: "",
    available: "",
    NGO_name: "",
    location: { longitude: "", latitude: "" },
  });

  useEffect(() => {
    if (!editing) {
      fetchUser();

      if (id === JSON.parse(localStorage.getItem("user"))._id) {
        setIsMine(true);
      }
    }
  }, [id, editing]);

  const verifyUser = () => {
    console.log("", id);
    

    fetch(`${API_BASE_URL}/verify-user/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
     console.log("verified user = ", res);
     notifyB("User verified successfully.")

        
      });
  };

  const fetchUser = () => {
    setIsMine(false);

    fetch(`${API_BASE_URL}/user/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setUser(res);

        if (res.role === "doctor") {
          setUpdatedDoctorDetails({
            fees: res.doctor_details.fees,
            qualification: res.doctor_details.qualification,
            specialization: res.doctor_details.specialization,
            experience: res.doctor_details.experience,
            availability: res.doctor_details.availability,
            hospital_name: res.doctor_details.hospital_name,
          });
        } else if (res.role === "volunteer") {
          setUpdatedVolunteerDetails({
            qualification: res.volunteer_details.qualification,
            available: res.volunteer_details.available,
            NGO_name: res.volunteer_details.NGO_name,
            location: {
              longitude: res.volunteer_details.location.longitude,
              latitude: res.volunteer_details.location.latitude,
            },
          });
        }
      });
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleInputChange = (e) => {
    if (user.role === "doctor") {
      setUpdatedDoctorDetails({
        ...updatedDoctorDetails,
        [e.target.name]: e.target.value,
      });
    } else if (user.role === "volunteer") {
      if (e.target.name === "longitude" || e.target.name === "latitude") {
        setUpdatedVolunteerDetails((prevDetails) => ({
          ...prevDetails,
          location: {
            ...prevDetails.location,
            [e.target.name]: Number(e.target.value),
          },
        }));
      } else {
        setUpdatedVolunteerDetails({
          ...updatedVolunteerDetails,
          [e.target.name]: e.target.value,
        });
      }
    }
  };

  const handleSubmit = () => {
    const updatedUser = { ...user };
    if (updatedUser.role === "doctor") {
      updatedUser.doctor_details = { ...updatedDoctorDetails };
      fetch(`${API_BASE_URL}/update-doctor-details/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify(updatedUser),
      })
        .then((res) => res.json())
        .then((res) => {
          setEditing(false);
          setUser(res);
        });
    } else if (updatedUser.role === "volunteer") {
      updatedUser.volunteer_details = { ...updatedVolunteerDetails };
      fetch(`${API_BASE_URL}/update-volunteer-details/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify(updatedUser),
      })
        .then((res) => res.json())
        .then((res) => {
          setEditing(false);
          setUser(res);
        });
    }
  };



  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>

      <div>
        <p>Name: {user.name}</p>

        {user.role === "doctor" && (
          <div>
            <p>Fees: {user.doctor_details.fees}</p>
            <p>Qualification: {user.doctor_details.qualification}</p>
            <p>Specialization: {user.doctor_details.specialization}</p>
            <p>Experience: {user.doctor_details.experience}</p>
            <p>Availability: {user.doctor_details.availability}</p>
            <p>Hospital Name: {user.doctor_details.hospital_name}</p>
            <img
              src={user.doctor_details.certificate}
              alt="doctor certificate"
            />
          </div>
        )}
        {user.role === "volunteer" && (
          <div>
            <p>Qualification: {user.volunteer_details.qualification}</p>
            <p>Available: {user.volunteer_details.available}</p>
            <p>NGO Name: {user.volunteer_details.NGO_name}</p>
            <p>
              Location: {user.volunteer_details.location.longitude},{" "}
              {user.volunteer_details.location.latitude}
            </p>
            <img
              src={user.volunteer_details.certificate}
              alt="volunteer certificate"
            />
          </div>
        )}
      </div>

      {isMine && !editing && <button onClick={handleEdit}>Edit Profile</button>}

      {editing && (
        <div>
          <h2>Edit Profile</h2>
          {user.role === "doctor" && (
            <div>
              <label>Fees:</label>
              <input
                type="text"
                name="fees"
                value={updatedDoctorDetails.fees}
                onChange={handleInputChange}
              />
              <br />
              <label>Qualification:</label>
              <input
                type="text"
                name="qualification"
                value={updatedDoctorDetails.qualification}
                onChange={handleInputChange}
              />
              <br />
              <label>Specialization:</label>
              <input
                type="text"
                name="specialization"
                value={updatedDoctorDetails.specialization}
                onChange={handleInputChange}
              />
              <br />
              <label>Experience:</label>
              <input
                type="text"
                name="experience"
                value={updatedDoctorDetails.experience}
                onChange={handleInputChange}
              />
              <br />
              <label>Availability:</label>
              <input
                type="text"
                name="availability"
                value={updatedDoctorDetails.availability}
                onChange={handleInputChange}
              />
              <br />
              <label>Hospital Name:</label>
              <input
                type="text"
                name="hospital_name"
                value={updatedDoctorDetails.hospital_name}
                onChange={handleInputChange}
              />
            </div>
          )}
          {user.role === "volunteer" && (
            <div>
              <label>Qualification:</label>
              <input
                type="text"
                name="qualification"
                value={updatedVolunteerDetails.qualification}
                onChange={handleInputChange}
              />
              <br />
              <label>Available:</label>
              <input
                type="text"
                name="available"
                value={updatedVolunteerDetails.available}
                onChange={handleInputChange}
              />
              <br />
              <label>NGO Name:</label>
              <input
                type="text"
                name="NGO_name"
                value={updatedVolunteerDetails.NGO_name}
                onChange={handleInputChange}
              />
              <br />
              <label>Location (Longitude):</label>
              <input
                type="number"
                name="longitude"
                value={updatedVolunteerDetails.location.longitude || ""}
                onChange={handleInputChange}
              />
              <br />
              <label>Location (Latitude):</label>
              <input
                type="number"
                name="latitude"
                value={updatedVolunteerDetails.location.latitude || ""}
                onChange={handleInputChange}
              />
            </div>
          )}
          <button onClick={handleSubmit}>Save</button>
        </div>
      )}

      {JSON.parse(localStorage.getItem("user")).role === "admin" && (
        <div>
          <button
            onClick={() => {
              verifyUser();
            }}
          >
            Verify
          </button>
        </div>
      )}
    </div>
  );
}
