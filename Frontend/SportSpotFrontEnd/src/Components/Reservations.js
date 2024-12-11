import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import Calendar from "./Calender";

export default function Reservations() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showFilteredBookings, setShowFilteredBookings] = useState(false);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [ownerDetails, setOwnerDetails] = useState({ name: "", image: "" });
  const [loadingOwner, setLoadingOwner] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoadingBookings(true);
        const response = await fetch("http://your-backend-url/api/bookings"); // Replace with your backend API URL
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await response.json();
        setBookings(data);
        setLoadingBookings(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);

  // Fetch owner details
  useEffect(() => {
    const fetchOwnerDetails = async () => {
      try {
        setLoadingOwner(true);
        const response = await fetch("http://your-backend-url/api/owner"); // Replace with your backend API URL
        if (!response.ok) {
          throw new Error("Failed to fetch owner details");
        }
        const data = await response.json();
        setOwnerDetails(data); // Assuming `data` contains all owner details
        setLoadingOwner(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoadingOwner(false);
      }
    };

    fetchOwnerDetails();
  }, []);

  const formatDate = (date) => {
    return `${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })} ${date.getFullYear()}`;
  };

  const parseTime = (timeString) => {
    const [time, meridian] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (meridian === "PM" && hours !== 12) hours += 12;
    if (meridian === "AM" && hours === 12) hours = 0;
    return new Date(0, 0, 0, hours, minutes);
  };

  const sortedBookings = bookings.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateA - dateB === 0) {
      return (
        parseTime(a.timing.split(" - ")[0]) -
        parseTime(b.timing.split(" - ")[0])
      );
    }
    return dateA - dateB;
  });

  const handleShowSlotsClick = () => {
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      const filtered = bookings
        .filter((booking) => booking.date === formattedDate)
        .sort(
          (a, b) =>
            parseTime(a.timing.split(" - ")[0]) -
            parseTime(b.timing.split(" - ")[0])
        );
      setFilteredBookings(filtered);
      setShowFilteredBookings(true);
    } else {
      alert("Please select a date from the calendar!");
    }
  };

  return (
    <>
      <div className="container my-5">
        <div className="owner-img-name-edit">
          <div className="owner-image">
            {loadingOwner ? (
              <p>Loading...</p>
            ) : error && loadingOwner ? (
              <p>Error fetching owner details</p>
            ) : (
              <img src={ownerDetails.image} alt="Owner-Image" />
            )}
          </div>
          <div className="owner-name-edit">
            <h2 className="owner-name">
              Welcome,{" "}
              {loadingOwner
                ? "Loading..."
                : error
                ? "Error fetching name"
                : ownerDetails.name}
              !
            </h2>
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

        <div className="reservations pt-5 mt-5">
          <div className="reservations-list">
            <h2 className="mb-3" style={{ color: "#55ad9b" }}>
              Upcoming Bookings
            </h2>
            {loadingBookings ? (
              <p>Loading bookings...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              sortedBookings.map((booking, index) => (
                <div key={index} className="upcoming-booking p-3 border mb-2">
                  <h5 style={{ color: "#55ad9b" }}>{booking.pitch}</h5>
                  <span>
                    <b>Timing:</b> {booking.timing}
                    <br />
                  </span>
                  <span>
                    <b>Date:</b> {booking.date}
                    <br />
                  </span>
                  <span>
                    <b>Booked By:</b> {booking.bookedBy}
                    <br />
                  </span>
                  <span>
                    <b>Contact:</b> {booking.contact}
                    <br />
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="calender">
            <h2 className="mb-5" style={{ color: "#55ad9b" }}>
              Check Upcoming Bookings
            </h2>
            <Calendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
            <div className="booked-slots">
              <button
                className="mt-5 slots-button dropdown btn-back"
                onClick={handleShowSlotsClick}
              >
                SHOW SLOTS STATUS
              </button>
            </div>

            {showFilteredBookings && (
              <div className="overlay-bookings">
                <div className="dropdown-bookings mt-3">
                  <button
                    className="close-button"
                    onClick={() => setShowFilteredBookings(false)}
                  >
                    &times;
                  </button>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking, index) => (
                      <div key={index} className="upcoming-booking p-2 border">
                        <h5 style={{ color: "#55ad9b" }}>{booking.pitch}</h5>
                        <span>
                          <b>Timing:</b> {booking.timing}
                          <br />
                        </span>
                        <span>
                          <b>Date:</b> {booking.date}
                          <br />
                        </span>
                        <span>
                          <b>Booked By:</b> {booking.bookedBy}
                          <br />
                        </span>
                        <span>
                          <b>Contact:</b> {booking.contact}
                          <br />
                        </span>
                      </div>
                    ))
                  ) : (
                    <p>No bookings found for the selected date.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
