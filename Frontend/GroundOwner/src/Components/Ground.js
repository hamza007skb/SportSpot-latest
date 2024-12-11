import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import Map from "./Map";

export default function Ground() {
  const location = useLocation();
  const [groundData, setGroundData] = useState({});
  const [reviews, setReviews] = useState([]);
  const [images, setImages] = useState([]);
  const [pitches, setPitches] = useState([]);

  useEffect(() => {
    if (location.state && location.state.ground) {
      setGroundData(location.state.ground);
      fetchImages(location.state.ground.id);
      fetchReviews(location.state.ground.id);
      fetchPitches(location.state.ground.id);
    }
  }, [location.state]);

  const fetchImages = async (groundId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8090/ground_detail/groundimages/${groundId}`
      );
      const formattedImages = response.data.images.map(
        (img) => `data:image/jpeg;base64,${img}`
      );
      setImages(formattedImages);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchReviews = async (groundId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8090/ground_detail/reviews/${groundId}`
      );
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchPitches = async (groundId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8090/ground_detail/pitches/${groundId}`
      );
      setPitches(response.data || []);
    } catch (error) {
      console.error("Error fetching pitches:", error);
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
              <p>
                Stadium Type: {groundData.stadiumType || "Outdoor"}
              </p>
              <p>
                Sports Hours: {groundData.sportsHours || "01:00 PM - 01:00 AM"}
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

          <div className="description">
            <h3>Description</h3>
            <p>{groundData.description || "No description available"}</p>
          </div>
        </div>

        <div className="ground-loc">
          <div className="ground-map">
            <Map />
          </div>
        </div>
      </div>

      <div className="ground-info">
        <p>Pitch Types</p>
        <div className="pitch-type spacing">
          {pitches.length > 0 ? (
            pitches.map((pitch, index) => (
              <span key={index}>
                {pitch.length} / {pitch.width}
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
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <div className="reviewer-name">
                <p>{review.username}</p>
                <p className="rev-date">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
              <p className="per-review">{review.comment}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}