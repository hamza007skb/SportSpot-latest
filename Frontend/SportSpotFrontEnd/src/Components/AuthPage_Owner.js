import React, { useState, useCallback } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import auth_bg from "../Assets/Owner_Auth_Bg.png";
import axios from "axios";

export default function AuthPage_Owner() {
  const location = useLocation();
  const editDetails = location.state?.ownerDetails || null;

  const [formData, setFormData] = useState(
    editDetails
      ? { ...editDetails } // Use all fields, including the photo, from editDetails
      : {
          name: "",
          username: "",
          phoneNumber: "",
          email: "",
          password: "",
          stadiumName: "",
          stadiumAddress: "",
          aim: "",
          photo: null,
        }
  );

  const [errors, setErrors] = useState({});
  const [isChecking, setIsChecking] = useState(false);

  const handleChange = useCallback(
    (e) => {
      const { name, value, files } = e.target;
      if (name === "photo" && files?.[0]) {
        // Replace photo only if a new one is uploaded
        setFormData({ ...formData, photo: files[0] });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    },
    [formData]
  );

  const validate = async () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.username) newErrors.username = "UserName is required";
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Phone Number is required";
    else if (formData.phoneNumber.length !== 11) {
      newErrors.phoneNumber = "Phone Number must be exactly 11 digits";
    }
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password || formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.stadiumName)
      newErrors.stadiumName = "Stadium Name is required";
    if (!formData.stadiumAddress)
      newErrors.stadiumAddress = "Stadium Address is required";
    if (!formData.aim) newErrors.aim = "Owner Aim is required";
    if (!formData.photo) newErrors.photo = "Owner Picture is required";

    try {
      setIsChecking(true);
      const response = await axios.post(
        "http://localhost:5000/api/validate-owner",
        {
          username: formData.username,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
        }
      );

      const { usernameExists, phoneNumberExists, emailExists } = response.data;

      if (usernameExists)
        newErrors.username = "This username is already registered";
      if (phoneNumberExists)
        newErrors.phoneNumber = "This phone number is already registered";
      if (emailExists) newErrors.email = "This email is already registered";
    } catch (error) {
      console.error("Error validating data:", error);
      alert("Failed to validate data. Please try again.");
    } finally {
      setIsChecking(false);
    }

    return newErrors;
  };

  useEffect(() => {
    if (editDetails) {
      // Initialize form data with the edit details, including the current photo
      setFormData({ ...editDetails });
    }
  }, [editDetails]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const formErrors = await validate();
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
      } else {
        try {
          const data = new FormData();

          // Append form data
          for (const key in formData) {
            // If the photo is a file, append it; otherwise, skip
            if (key === "photo" && typeof formData.photo === "object") {
              data.append(key, formData.photo);
            } else if (key !== "photo") {
              data.append(key, formData[key]);
            }
          }

          const apiUrl = editDetails
            ? `http://localhost:5000/api/owners/${editDetails.id}` // Edit API
            : "http://localhost:5000/api/owners"; // Create API

          const response = await axios.post(apiUrl, data, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          alert(
            editDetails
              ? "Profile updated successfully!"
              : "Your request for joining is under observation."
          );

          if (!editDetails) {
            setFormData({
              name: "",
              username: "",
              phoneNumber: "",
              email: "",
              password: "",
              stadiumName: "",
              stadiumAddress: "",
              aim: "",
              photo: null,
            });
          }
          setErrors({});
        } catch (error) {
          console.error("Error submitting form:", error);
          alert("Failed to submit. Please try again.");
        }
      }
    },
    [formData, editDetails]
  );

  return (
    <div className="auth-page" style={{ backgroundImage: `url(${auth_bg})` }}>
      <div className="container mt-0 mb-0 pt-3 pb-3">
        <form onSubmit={handleSubmit} className="form-container">
          <h1 className="email" style={{ color: "white" }}>
            {editDetails ? "Edit Profile" : "SignUp"}
          </h1>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control border-3"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>
          <div className="mb-3">
            <label className="form-label">UserName</label>
            <input
              type="text"
              className="form-control border-3 cus_css"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="error-text">{errors.username}</p>}
          </div>
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="number"
              className="form-control border-3"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              onInput={(e) => {
                if (e.target.value.length > 11) {
                  e.target.value = e.target.value.slice(0, 11);
                }
              }}
            />
            {errors.phoneNumber && (
              <p className="error-text">{errors.phoneNumber}</p>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control border-3"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control border-3"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
            <div className="form-text" style={{ color: "white" }}>
              More than 8 characters
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Stadium Name</label>
            <input
              type="text"
              className="form-control border-3"
              name="stadiumName"
              value={formData.stadiumName}
              onChange={handleChange}
            />
            {errors.stadiumName && (
              <p className="error-text">{errors.stadiumName}</p>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Stadium Address</label>
            <input
              type="text"
              className="form-control border-3"
              name="stadiumAddress"
              value={formData.stadiumAddress}
              onChange={handleChange}
            />
            {errors.stadiumAddress && (
              <p className="error-text">{errors.stadiumAddress}</p>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Aim to join Us!</label>
            <textarea
              className="form-control border-3"
              name="aim"
              value={formData.aim}
              onChange={handleChange}
              rows="5"
            ></textarea>
            {errors.aim && <p className="error-text">{errors.aim}</p>}
          </div>
          <div className="mb-3">
            <label className="form-label">Upload Photo</label>
            <input
              type="file"
              className="form-control border-3"
              name="photo"
              onChange={handleChange}
            />
            {errors.photo && <p className="error-text">{errors.photo}</p>}

            {/* Show existing photo if editing */}
            {editDetails &&
              formData.photo &&
              typeof formData.photo === "string" && (
                <div className="mt-3">
                  <img
                    src={formData.photo}
                    alt="Current"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
          </div>

          <div className="submit-button-container">
            <button
              type="submit"
              className="submit-button"
              disabled={isChecking}
            >
              {isChecking ? "Saving..." : editDetails ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}