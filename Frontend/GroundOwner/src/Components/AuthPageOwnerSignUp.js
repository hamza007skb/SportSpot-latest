import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import auth_bg from "../Assets/Owner_Auth_Bg.png";
import axios from "axios";

export default function AuthPageOwnerSignUp() {
  const [formData, setFormData] = useState({
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
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = useCallback(
    (e) => {
      const { name, value, files } = e.target;
      if (name === "photo") {
        setFormData({ ...formData, photo: files[0] });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    },
    [formData]
  );

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.username) newErrors.username = "UserName is required";
    if (!formData.phoneNumber || formData.phoneNumber.length !== 11)
      newErrors.phoneNumber = "Phone Number must be exactly 11 digits";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password || formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.stadiumName)
      newErrors.stadiumName = "Stadium Name is required";
    if (!formData.stadiumAddress)
      newErrors.stadiumAddress = "Stadium Address is required";
    if (!formData.aim) newErrors.aim = "Owner Aim is required";
    if (!formData.photo) newErrors.photo = "Owner Picture is required";
    return newErrors;
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const formErrors = validate();
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
      } else {
        try {
          // Send data to backend
          const response = await axios.post(
            "http://localhost:3001/api/signup",
            formData
          );
          setMessage(response.data.message);
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
          setErrors({});
        } catch (error) {
          setMessage(error.response?.data?.message || "Server error");
        }
      }
    },
    [formData]
  );

  return (
    <div className="auth-page" style={{ backgroundImage: `url(${auth_bg})` }}>
      <div className="container mt-0 mb-0 pt-3 pb-3">
        <form onSubmit={handleSubmit} className="form-container">
          <h1 className="email" style={{ color: "rgb(113 255 226)" }}>
            SignUp
          </h1>
          {message && <p className="message-text">{message}</p>}
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control border-3 cus_css"
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
          </div>
          <div className="owner-name-edit" style={{ color: "white" }}>
            Already have an account?
            <Link
              to="/authpageownerlogin"
              className="btn-edit-owner custom-edit-css"
            >
              {" "}
              LogIn!
            </Link>
          </div>
          <div className="submit-button-container pt-4">
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
