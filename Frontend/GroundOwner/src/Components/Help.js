import React, { useState, useCallback } from "react";
import auth_bg from "../Assets/Owner_Auth_Bg.png";

export default function Help() {
  const [formData, setFormData] = useState({
    purpose: "",
    problem: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

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
    async (e) => {
      e.preventDefault();
      const formErrors = validate();
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        setSuccessMessage(""); // Clear success message if errors exist
        return;
      }

      setErrors({});
      setIsSubmitting(true);

      try {
        const response = await fetch("https://your-backend-endpoint/api/help", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to send the message. Please try again.");
        }

        const data = await response.json();
        console.log("Response from backend:", data); // Optional: For debugging

        setSuccessMessage("Your message has been sent to the admin!");
        setFormData({
          purpose: "",
          problem: "",
        });
      } catch (error) {
        console.error("Error notifying admin:", error);
        setSuccessMessage("Failed to send your message. Please try again.");
      } finally {
        setIsSubmitting(false);
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
          Send Problem to Admin
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
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </div>
          {successMessage && <p className="success-text">{successMessage}</p>}
        </form>
      </div>
    </>
  );
}
