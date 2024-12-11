import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaEdit } from "react-icons/fa";
import axios from "axios";

export default function Revenue_Ground_Details() {
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);
  const [stadiumDetails, setStadiumDetails] = useState(null);
  const [pitchDetails, setPitchDetails] = useState([]);
  const [stadiumPhotos, setStadiumPhotos] = useState([]);

  const fetchDetails = async () => {
    try {
      const userId = "currentLoggedInUserId"; // Replace with actual user ID

      // Fetch owner details
      const ownerResponse = await axios.get(
        `http://localhost:5000/api/owners/${userId}`
      );
      setOwnerDetails(ownerResponse.data);

      // Fetch revenue and bookings data
      const bookingsResponse = await axios.get(
        `http://localhost:5000/api/bookings?ownerId=${userId}`
      );
      const bookings = bookingsResponse.data;

      // Calculate statistics
      const now = new Date();
      const thisMonth = now.getMonth();
      const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
      const currentYear = now.getFullYear();

      let stats = {
        totalBookings: 0,
        totalRevenue: 0,
        lastMonthBookings: 0,
        lastMonthRevenue: 0,
        thisMonthBookings: 0,
        thisMonthRevenue: 0,
      };

      bookings.forEach((booking) => {
        const bookingDate = new Date(booking.date);
        const bookingMonth = bookingDate.getMonth();
        const bookingYear = bookingDate.getFullYear();

        stats.totalBookings += 1;
        stats.totalRevenue += booking.amount;

        if (bookingMonth === lastMonth && bookingYear === currentYear) {
          stats.lastMonthBookings += 1;
          stats.lastMonthRevenue += booking.amount;
        }

        if (bookingMonth === thisMonth && bookingYear === currentYear) {
          stats.thisMonthBookings += 1;
          stats.thisMonthRevenue += booking.amount;
        }
      });

      setRevenueStats(stats);

      // Fetch stadium, pitch details, and photos
      const stadiumResponse = await axios.get(
        `http://localhost:5000/api/stadiums/${ownerResponse.data.stadiumId}`
      );
      setStadiumDetails(stadiumResponse.data);

      if (stadiumResponse.data.pitches) {
        setPitchDetails(stadiumResponse.data.pitches);
      }

      if (stadiumResponse.data.photos) {
        setStadiumPhotos(stadiumResponse.data.photos);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (!ownerDetails || !revenueStats || !stadiumDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container">
        <div className="container mt-5 mb-2 first-portion">
          <div className="img-name-edit">
            <div className="owner-image">
              <img src={ownerDetails.photoUrl} alt="Owner-Image" />
            </div>
            <div className="owner-name-edit">
              <h2 className="owner-name">{ownerDetails.name}</h2>
              <Link
                to={{
                  pathname: "/authpage_owner",
                  state: { ownerDetails },
                }}
                className="btn-edit-owner custom-edit-css"
              >
                Edit Personal Details <FaEdit />
              </Link>
            </div>
          </div>
          <div className="revenue">
            <h2>Revenue Details</h2>
            <div className="revenue-data">
              <div
                style={{ borderBottom: "3px dashed #55ad9b" }}
                className="revenue-data-specific pt-1 pb-4"
              >
                <span>
                  <b>No. of Bookings Last Month:</b>{" "}
                  {revenueStats.lastMonthBookings}
                </span>
                <span>
                  <b>Revenue Last Month:</b> {revenueStats.lastMonthRevenue}
                </span>
              </div>
              <div
                style={{ borderBottom: "3px dashed #55ad9b" }}
                className="revenue-data-specific pt-1 pb-4"
              >
                <span>
                  <b>No. of Bookings this Month:</b>{" "}
                  {revenueStats.thisMonthBookings}
                </span>
                <span>
                  <b>Revenue this Month:</b> {revenueStats.thisMonthRevenue}
                </span>
              </div>
              <div className="revenue-data-specific pt-1 pb-1">
                <span>
                  <b>Total No. of Bookings:</b> {revenueStats.totalBookings}
                </span>
                <span>
                  <b>Total Revenue:</b> {revenueStats.totalRevenue}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="edit-ground-details my-5">
          <h2 className="py-3" style={{ color: "#55ad9b", fontSize: "45px" }}>
            Stadium Details
          </h2>
          <div className="info-specific-ground">
            <div className="info-text-ground">
              <div className="name-rev">
                <div className="name-rating-ground">
                  <h3>{stadiumDetails.name}</h3>
                </div>
                <div className="rating-ground">
                  <span>{stadiumDetails.rating}/5⭐</span>
                </div>
              </div>
              <div className="venue">
                <p>Stadium Type: {stadiumDetails.type}</p>
                <p>Sports Hours: {stadiumDetails.sportsHours}</p>
              </div>
              <div className="loc">
                <FaMapMarkerAlt className="icon" />
                <p>{stadiumDetails.address}</p>
              </div>
            </div>
            <div className="pitch-pictures-edit">
              <div id="carouselExampleIndicators" className="carousel slide">
                <div className="carousel-indicators">
                  {stadiumPhotos.map((_, index) => (
                    <button
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide-to={index}
                      className={index === 0 ? "active" : ""}
                      aria-label={`Slide ${index + 1}`}
                      key={index}
                    ></button>
                  ))}
                </div>
                <div className="carousel-inner">
                  {stadiumPhotos.map((photo, index) => (
                    <div
                      className={`carousel-item image-slide ${
                        index === 0 ? "active" : ""
                      }`}
                      key={index}
                    >
                      <img
                        src={photo.url}
                        className="d-block w-100"
                        alt={`Stadium Photo ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
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
                  data-bs-target="#carouselExampleIndicators"
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
            <div className="description py-4">
              <h3>Description</h3>
              <p>{stadiumDetails.description}</p>
            </div>
            <div className="pitch-data pb-3">
              <h3>Pitch Details</h3>
              {pitchDetails.map((pitch, index) => (
                <div className="pitch-dimen-price" key={index}>
                  <span style={{ color: "#55ad9b", fontWeight: 700 }}>
                    {pitch.name} ({pitch.dimensions})
                  </span>
                  <span style={{ fontWeight: 500 }}>Rs.{pitch.price}/H</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-3">
            <button className="edit-ground">
              <FaEdit /> Edit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}