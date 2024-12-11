import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import prof_icon from "../Assets/owner.jpeg";

export default function ViewProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [formData, setFormData] = useState({});

  const email = sessionStorage.getItem("email");
  // Fetch profile data from the backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8090/owner_details/${email}`);
        setOriginalData(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, []);

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file change for the photo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const photoURL = URL.createObjectURL(file);
      setFormData({ ...formData, photo: photoURL });
    }
  };

  // Save changes and exit edit mode
  const saveChanges = async () => {
    try {
      await axios.put("http://localhost:5000/api/profile", formData);
      setOriginalData({ ...formData }); // Update original data
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile data:", error);
    }
  };

  // Cancel edit and revert to original data
  const cancelEdit = () => {
    setFormData({ ...originalData }); // Revert changes
    setIsEditing(false);
  };

  return (
    <>
      <div className="container p-4">
        <h1 className="email mb-5" style={{ color: "rgb(57 171 148)" }}>
          {isEditing ? "Edit Details" : "Account Details"}
        </h1>

        {/* Profile Picture */}
        <div className="d-flex flex-column justify-content-center align-items-center mb-3">
          <div>
            <img
              src={formData.picture || prof_icon}
              alt="User"
              className="mb-3"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="form-control"
            />
          )}
        </div>

        {/* Profile Fields */}
        {[
          "name",
          "phone_no",
          "email",
        ].map((field) => (
          <div className="mb-3" key={field}>
            <h5 className="label">
              <b>{field.charAt(0).toUpperCase() + field.slice(1)}:</b>
            </h5>
            {isEditing ? (
              <input
                type={field === "password" ? "password" : "text"}
                name={field}
                value={formData[field] || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            ) : (
              <span className="view-profile-span">
                {originalData[field] || ""}
              </span>
            )}
          </div>
        ))}

        {/* Action Buttons */}
        <div className="d-flex flex-row justify-content-center align-items-center p-3">
          {isEditing ? (
            <>
              <button className="btn btn-success me-2" onClick={saveChanges}>
                Save
              </button>
              <button className="btn btn-danger" onClick={cancelEdit}>
                Cancel
              </button>
            </>
          ) : (
            <button className="edit-ground" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit
            </button>
          )}
        </div>
      </div>
    </>
  );
}
