import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import Booking from "./Booking";
import Map from "./Map";
import Review from "./Review";

export default function Ground() {
  const location = useLocation();
  const [groundData, setGroundData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedPitch, setSelectedPitch] = useState("");
  const [images, setImages] = useState([]);
  const [pitches, setPitches] = useState([]);
  const [pricePer60Mins, setPricePer60Mins] = useState(null);
  const [pricePer90Mins, setPricePer90Mins] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);


  useEffect(() => {
    if (location.state && location.state.ground) {
      setGroundData(location.state.ground);
      fetchImages(location.state.ground.id);
      fetchPitches(location.state.ground.id);
      fetchReviews(location.state.ground.id); // Fetch reviews for the opened ground
    }
  }, [location.state]);

  const handlePitchClick = (pitch) => {
    setSelectedPitch(pitch); // Save the entire pitch object
  };

  const fetchImages = async (groundId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/ground_list/groundimages/${groundId}`
      );
      const formattedImages = response.data.images.map(
        (img) => `data:image/jpeg;base64,${img}`
      );
      setImages(formattedImages);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchPitches = async (groundId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/ground_list/ground_detail/pitches/${groundId}`
      );
      const pitchesData = response.data;
      setPitches(pitchesData);

      if (pitchesData.length > 0) {
        setPricePer60Mins(pitchesData[0].price_per_60mins);
        setPricePer90Mins(pitchesData[0].price_per_90mins || null); // Update for 90 mins
        setSelectedPrice(pitchesData[0].price_per_60mins); // Default to 60 mins
      }
    } catch (error) {
      console.error("Error fetching pitches:", error);
    }
  };


  const handleDurationChange = (duration) => {
    if (duration === "60 Mins") {
      setSelectedPrice(pricePer60Mins);
    } else if (duration === "90 Mins") {
      setSelectedPrice(pricePer90Mins);
    }
    // Add more conditions if you have other durations (e.g., 120 mins)
  };

  const fetchReviews = async (groundId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/review/get_reviews/${groundId}` // Fetch reviews for the specific ground
      );
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const addReview = async (review) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/review/post_review`,
        review
      );
      if (response.status === 201) {
        fetchReviews(groundData.id); // Refresh reviews after posting
      }
    } catch (error) {
      console.error("Error posting review:", error);
    }
  };

  if (!groundData) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="page-ground">
        <div className="info-specific-ground">
          <div className="info-text-ground">
            <div className="name-rev">
              <div className="name-rating-ground">
                <h3>{groundData.name}</h3>
              </div>
              <div className="rating-ground">
                <span>
                  {groundData.rating
                    ? `${groundData.rating}/5 ⭐`
                    : "No rating available"}
                </span>
              </div>
            </div>
            <div className="venue">
              <p>Stadium Type: {groundData.stadiumType || "OutDoor"}</p>
              <p>
                Sports Hours: {groundData.sportsHours || "01:00PM - 01:00AM"}
              </p>
            </div>
            <div className="loc">
              <FaMapMarkerAlt className="icon" />
              <p>{groundData.address || "No location available"}</p>
            </div>
          </div>
          <div className="pitch-pictures">
            <div
              id="carouselExampleAutoplaying"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                {images.length > 0 ? (
                  <>
                    <div className="carousel-item active">
                      <img
                        src={images[0]}
                        className="d-block w-100"
                        alt="Ground Picture"
                      />
                    </div>
                    {images.slice(1).map((img, index) => (
                      <div key={index} className="carousel-item">
                        <img
                          src={img}
                          className="d-block w-100"
                          alt="Ground Picture"
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <p>No images available</p>
                )}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleAutoplaying"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleAutoplaying"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
          <p className="pitch-price">
            Rs.{selectedPrice || "No price available"}/Hour
          </p>
          <div className="description">
            <h3>Description</h3>
            <p>{groundData.description || "No description available"}</p>
          </div>
        </div>

        <div className="calender-map">
          <div className="calender">
            <Booking
              selectedPitch={selectedPitch}
              onDurationChange={handleDurationChange}
              selectedGroundID={groundData.id}
            />
          </div>
          <div className="ground-loc">
            <div className="ground-map">
              <Map />
            </div>
          </div>
        </div>
      </div>

      <div className="ground-info">
        <p>Pitch Types</p>
        <div className="pitch-type spacing">
          {pitches.length > 0 ? (
            pitches.map((pitch, index) => (
              <span
                key={index}
                className={selectedPitch === pitch ? "selected" : ""}
                onClick={() => handlePitchClick(pitch)}
              >
                {pitch.name}
              </span>
            ))
          ) : (
            <p>No pitch types available</p>
          )}
        </div>

        <p>Stadium Facilities</p>
        <div className="pitch-facility spacing">
          <span>Canteen</span>
          <span>Changing Room</span>
          <span>Toilets</span>
          <span>Parking</span>
        </div>

        <p>Equipment Provided</p>
        <div className="pitch-equipment spacing-1rem">
          <span>Football</span>
          <span>Paddle</span>
          <span>Bat n Ball</span>
        </div>
      </div>

      <div className="nav-style">
        <div className="nav-underline"></div>
      </div>
      <div className="review">
        <p className="review-p-heading">Customer Reviews</p>
        <Review groundId={groundData.id} addReview={addReview} />
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <div className="reviewer-name">
                <p>{review.user_id}</p>
                <p className="rev-date">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
              <div className="review-rating">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`star ${
                      index < review.rating ? "selected" : ""
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="per-review">{review.comment}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
