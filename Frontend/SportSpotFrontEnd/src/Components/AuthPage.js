import React, { useState } from "react";
import user_icon from "../Assets/person.png";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";

export default function AuthPage(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const endpoint = props.authMode === "SignUp" 
      ? "http://127.0.0.1:8080/auth/signup" 
      : "http://127.0.0.1:8000/auth/login";
  
    const data = props.authMode === "SignUp"
      ? { username: name, email, password }
      : { username: email, password };

      sessionStorage.setItem("email", email);
      console.log(sessionStorage.getItem("email"));
  
    try {
      const response = await fetch(endpoint, {
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
        alert(result.message || "Success");
      } else {
        alert(result.detail || "Something went wrong");
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  const ChangeAuthSign = () => {
    props.toggleAuthMode("SignUp");
  };

  const ChangeAuthLog = () => {
    props.toggleAuthMode("LogIn");
  };

  return (
    <>
      <div className="container pt-4">
        <div className="header">
          <div className="text">{props.authMode}</div>
          <div className="underline"></div>
        </div>

        <div className="inputs">
          {props.authMode === "LogIn" ? null : (
            <div className="input">
              <img src={user_icon} alt="User Icon" />
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="input">
            <img src={email_icon} alt="Email Icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input">
            <img src={password_icon} alt="Password Icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {props.authMode === "LogIn" ? (
          <>
            <div className="change-Page">
              Forget Password?
              <span> Click Here!</span>
              <br />
              Don't have an account?
              <span onClick={ChangeAuthSign}> SignUp!</span>
            </div>
          </>
        ) : (
          <div className="change-Page">
            Already have an account?
            <span onClick={ChangeAuthLog}> LogIn!</span>
          </div>
        )}

        <div className="submit-container">
          <button className="submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
}