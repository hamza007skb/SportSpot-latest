import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function GroundSelection() {
  const [grounds, setGrounds] = useState([]);
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate here
  const [userEmail, setUserEmail] = useState("");

  const parseJwt = (token) => {
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = decodeURIComponent(
        atob(base64Url)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(base64);
    } catch (error) {
      console.error("Error parsing JWT", error);
      return null;
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");

    if (token) {
      const decodedToken = parseJwt(token);
      if (decodedToken && decodedToken.email) {
        setUserEmail(decodedToken.email);
      } else {
        alert("Unable to decode token or email is missing in token");
        navigate("/authpageownerlogin");
      }
    } else {
      alert("No token found. Redirecting to login.");
      navigate("/authpageownerlogin");
    }

    const fetchGrounds = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8090/ground_list/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setGrounds(data);
        } else {
          const error = await response.json();
          alert(error.detail || "Failed to fetch ground list.");
          navigate("/authpageownerlogin");
        }
      } catch (err) {
        console.error("Error fetching ground list:", err);
      }
    };

    fetchGrounds();
  }, [navigate]);

  const hiddenPaths = [
    "/authpageownerlogin",
    "/authpageownersignup",
    "/revenuegrounddetails",
    "/reservations",
    "/viewprofile",
    "/help",
  ];

  // const handleGroundClick = (groundID) => {
  //   navigate("/reservations", { state: { groundID } });
  // };

  const isHiddenPath = hiddenPaths.includes(location.pathname);

  return (
    <>
      {!isHiddenPath && (
        <div className="container my-4">
          <h1 className="email mb-5" style={{ color: "rgb(57 171 148)" }}>
            Select Ground
          </h1>
          <div className="d-flex flex-column justify-content-center align-items-center">
            {grounds.map((ground) => (
              <div
                key={ground.id}
                className="ground-data my-3 px-5 py-3 d-flex flex-row justify-content-center align-items-center"
                // onClick={() => handleGroundClick(ground.id)}
              >
                <img
                  src={ground.photo ? `data:image/png;base64,${ground.photo}` : "placeholder.png"} // Handle missing photos
                  className="image-ground-selection"
                  alt={"Photo"}
                />
                <div className="d-flex flex-column justify-content-center align-items-start px-5">
                  <div className="signup text-center">
                    <Link
                      to={`/reservations`}
                      className="btn-ground"
                      state={{ groundID: ground.id }}
                    >
                      <b>{ground.name}</b>
                    </Link>
                  </div>
                  <div className="loc">
                    <p>{ground.address}</p>
                    <FaMapMarkerAlt className="icon ms-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}