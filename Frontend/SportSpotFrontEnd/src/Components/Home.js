import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import stadium_icon from "../Assets/sign_Bg.jpeg";
import Map from "./Map";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [grounds, setGrounds] = useState([]);
  const [groundImages, setGroundImages] = useState({});

  useEffect(() => {
    const fetchGrounds = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/ground_list");
        const data = await response.json();
        setGrounds(data);

        // Fetch images for each ground
        const imagePromises = data.map((ground) =>
          fetch(
            `http://127.0.0.1:8000/ground_list/ground_img_by_id/${ground.id}`
          )
            .then((res) => res.json())
            .then((imgData) => ({ groundId: ground.id, image: imgData.image }))
        );

        const images = await Promise.all(imagePromises);
        const imageMap = {};
        images.forEach((img) => {
          imageMap[img.groundId] = img.image;
        });
        setGroundImages(imageMap);
      } catch (error) {
        console.error("Error fetching grounds or images:", error);
      }
    };

    fetchGrounds();
  }, []);

  const handleClick = (ground) => {
    sessionStorage.setItem("ground_data", ground.id);
    console.log(sessionStorage.getItem("ground_data"));
    navigate("/ground", { state: { ground } });
  };

  // Function to truncate ground name if it's longer than 15 characters
  const truncateName = (name) => {
    return name.length > 15 ? name.slice(0, 13) + "..." : name;
  };

  return (
    <>
      {location.pathname !== "/reservations" &&
      location.pathname !== "/revenue_ground_details" &&
      location.pathname !== "/help" &&
      location.pathname !== "/authpage" &&
      location.pathname !== "/authpage_owner" ? (
        <>
          <div className="pages">
            <a href="/">Home</a>
            <a href="#contact">Contact</a>
          </div>
        </>
      ) : null}

      <div className="nav-style">
        <div className="nav-underline"></div>
      </div>

      {location.pathname !== "/authpage" &&
        location.pathname !== "/ground" &&
        location.pathname !== "/authpage_owner" &&
        location.pathname !== "/revenue_ground_details" &&
        location.pathname !== "/reservations" &&
        location.pathname !== "/help" && (
          <>
            <div className="map-grounds" id="home">
              <div className="grounds-container">
                {grounds.map((ground, index) => (
                  <div className="pitches" key={index}>
                    <img
                      className="pitches-img"
                      src={
                        groundImages[ground.id]
                          ? `data:image/jpeg;base64,${groundImages[ground.id]}` // Fetch from state
                          : stadium_icon // Use fallback image if not yet loaded
                      }
                      alt={`${ground.name}-Picture`}
                    />
                    <div className="info">
                      <div className="info-text">
                        <div className="name-review">
                          <h3>{truncateName(ground.name)}</h3>{" "}
                          {/* Truncate ground name */}
                          <span>{ground.rating}/5⭐</span>
                        </div>
                        <p>{ground.address}</p>
                      </div>
                      <button onClick={() => handleClick(ground)}>
                        Book Now at Rs.1500 {ground.price}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="map-container">
                <span>
                  <h1>Book Your Nearest</h1>
                </span>
                <div className="map">
                  <Map />
                </div>
              </div>
            </div>
          </>
        )}
    </>
  );
}
