import React, { useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import auth_bg from "../Assets/Owner_Auth_Bg.png";

export default function AuthPageOwnerSignUp() {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    },
    [formData]
  );

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    }
    if (!formData.password || formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    setMessage("");

    const data = {
      username: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch("http://127.0.0.1:8090/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data),
      });

      const result = await response.json();
      if (response.ok) {
        sessionStorage.setItem("authToken", result.access_token);
        sessionStorage.setItem("refreshToken", result.refresh_token);
        sessionStorage.setItem("email", data.username)      // temp placeholder
        setMessage(data.message); // Success message
        navigate("/groundselection");
      } else {
        alert(result.detail || "Something went wrong");
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  // Paths where the component should NOT be displayed
  const hiddenPaths = [
    "/groundselection",
    "/authpageownersignup",
    "/revenuegrounddetails",
    "/reservations",
    "/viewprofile",
    "/help",
  ];

  // Check if the current path matches any of the hidden paths
  if (hiddenPaths.includes(location.pathname)) {
    return null; // Do not render anything if on a hidden path
  }

  return (
    <div
      className="auth-page"
      style={{
        backgroundImage: `url(${auth_bg})`,
        height: "89vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container">
        <form onSubmit={handleSubmit} className="form-container">
          <h1 className="email" style={{ color: "rgb(113 255 226)" }}>
            Login
          </h1>
          {message && <p className="message-text">{message}</p>}
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
          </div>
          <div className="owner-name-edit" style={{ color: "white" }}>
            Don't have an account?
            <Link
              to="/authpageownersignup"
              className="btn-edit-owner custom-edit-css"
            >
              SignUp!
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
