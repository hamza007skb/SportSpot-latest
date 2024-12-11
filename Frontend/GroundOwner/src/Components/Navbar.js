import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import logo_icon from "../Assets/logo.png";

export default function Navbar(props) {
  const location = useLocation();


  // State to store user data
  const [userData, setUserData] = useState({
    image_data: null,
    name: null,
  });

  const email = sessionStorage.getItem("email");

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8090/owner_details/${email}`, {
          method: "GET",
          credentials: "include", // If cookies or tokens are used for authentication
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const data = await response.json();

        // Convert the base64 string to a data URL format
        const imageUrl = data.image_data
          ? `data:image/jpeg;base64,${data.image_data}` // Assuming the Base64 is for a JPEG image
          : null;

        setUserData({
          image_data: imageUrl, // URL of the user's image_data
          name: data.name, // User's name
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const allowedRoutes = [
    "/reservations",
    "/revenuegrounddetails",
    "/help",
    "/viewprofile",
  ];

  const handleSignOut = () => {
    sessionStorage.clear();
  }

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <img src={logo_icon} alt="Logo" />
          <h1>{props.title}</h1>
        </div>

        {allowedRoutes.includes(location.pathname) && (
          <div className="pages">
            <Link to="/reservations" state={{ groundID: sessionStorage.getItem("groundID") }}>
              Reservations
            </Link>
            <Link to="/revenuegrounddetails">Ground Management</Link>
            <Link to="/help">Help</Link>
          </div>
        )}
        {allowedRoutes.includes(location.pathname) || location.pathname === "/groundselection" && (
          <div className="button-owner-auth">
            <div className="dropdown owner-image">
              <button
                className="dropdown btn-back"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={userData.image_data || "default-placeholder-url"} // Use placeholder if image_data is null
                  alt="Owner"
                />
              </button>
              <ul className="dropdown-menu dropdown-menu-end mt-2 mx-5">
                <li>
                  <div className="px-5 pt-2 view-profile">
                    <img
                      src={userData.image_data || "default-placeholder-url"} // Use placeholder if image_data is null
                      alt="Owner"
                    />
                    <div className="owner-name-edit">
                      <h6
                        className="owner-name my-4 text-center"
                        style={{ color: "#0d705c" }}
                      >
                        {userData.name || "Owner Name"} {/* Fallback to placeholder */}
                      </h6>
                    </div>
                  </div>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <div className="signup text-center">
                    <Link to="./viewprofile" className="btn-sign">
                      View Profile
                    </Link>
                  </div>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <div className="logIn text-center">
                    <Link to="/" className="btn-log" onClick={()=>handleSignOut()}>
                      SignOut
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}