import React, { useState, useCallback } from "react";
import emailjs from "emailjs-com";
import auth_bg from "../Assets/Owner_Auth_Bg.png";

export default function Help() {
  const [formData, setFormData] = useState({
    purpose: "",
    problem: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    },
    [formData]
  );

  const validate = () => {
    const newErrors = {};
    if (!formData.purpose) newErrors.purpose = "Purpose (Subject) is required";
    if (!formData.problem) newErrors.problem = "Problem (Body) is required";
    return newErrors;
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const formErrors = validate();
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
      } else {
        // Send email using EmailJS
        emailjs
          .send(
            "your_service_id", // Replace with your EmailJS Service ID
            "your_template_id", // Replace with your EmailJS Template ID
            {
              subject: formData.purpose,
              message: formData.problem,
              to_email: "syedahmadali7212@gmail.com", // Replace with the admin's email
            },
            "your_user_id" // Replace with your EmailJS User ID
          )
          .then(
            (response) => {
              console.log(
                "Email sent successfully!",
                response.status,
                response.text
              );
              setSuccessMessage("Email sent successfully!");
              setFormData({
                purpose: "",
                problem: "",
              });
              setErrors({});
            },
            (error) => {
              console.error("Failed to send email.", error);
              setSuccessMessage("Failed to send email. Please try again.");
            }
          );
      }
    },
    [formData]
  );

  return (
    <>
      <div
        className="py-5 auth-page"
        style={{ backgroundImage: `url(${auth_bg})` }}
      >
        <h1 className="email" style={{ color: "white" }}>
          Need Help?
        </h1>
        <h1 className="email pb-3" style={{ color: "White" }}>
          Send an E-Mail to Admin
        </h1>
        <form onSubmit={handleSubmit} style={{ padding: "50px 250px" }}>
          <div className="mb-3">
            <label
              className="form-label"
              style={{ color: "white", fontSize: "25px" }}
            >
              Subject:
            </label>
            <input
              type="text"
              className="form-control border-3 cus_css"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
            />
            {errors.purpose && <p className="error-text">{errors.purpose}</p>}
          </div>
          <div className="mb-3">
            <label
              className="form-label"
              style={{ color: "white", fontSize: "25px" }}
            >
              Problem:
            </label>
            <textarea
              className="form-control border-3"
              name="problem"
              value={formData.problem}
              onChange={handleChange}
              rows="14"
            ></textarea>
            {errors.problem && <p className="error-text">{errors.problem}</p>}
          </div>
          <div className="submit-button-container pt-5">
            <button type="submit" className="submit-button">
              Send
            </button>
          </div>
          {successMessage && <p className="success-text">{successMessage}</p>}
        </form>
      </div>
    </>
  );
}