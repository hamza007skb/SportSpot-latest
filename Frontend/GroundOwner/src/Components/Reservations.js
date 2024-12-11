import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, Navigate } from "react-router-dom";
import Calendar from "./Calender";

export default function Reservations() {
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(null);
  const [showFilteredBookings, setShowFilteredBookings] = useState(false);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [redirectToGroundSelection, setRedirectToGroundSelection] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");

    if (!location.state || !location.state.groundID) {
      alert("Ground ID is missing. Redirecting...");
      setRedirectToGroundSelection(true);
      return;
    }

    const ground_id = location.state?.groundID || sessionStorage.getItem("groundID");

    if (ground_id) {
      sessionStorage.setItem("groundID", ground_id);
    } else {
      alert("Ground ID is missing. Redirecting...");
      setRedirectToGroundSelection(true);
    }

    if (!token) {
      alert("No authentication token found. Redirecting to login.");
      setRedirectToLogin(true);
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8090/bookings/${parseInt(ground_id)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBookings(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        alert("Unauthorized access. Please log in again.");
        setRedirectToLogin(true);
      }
    };

    fetchBookings();
  }, [location.state]);

  if (redirectToLogin) {
    return <Navigate to="/authpageownerlogin" replace />;
  }

  if (redirectToGroundSelection) {
    return <Navigate to="/groundselection" replace />;
  }

  // Helper functions for parsing and formatting
  const parseDateTime = (dateTime) => new Date(dateTime);

  const formatTime = (dateTime) => {
    const date = parseDateTime(dateTime);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString) => {
    const date = parseDateTime(dateString);
    return date.toLocaleDateString("en-CA"); // YYYY-MM-DD format
  };

  // Filter and sort bookings
  const today = new Date();
  const upcomingBookings = bookings.filter((booking) => {
    const bookingDate = parseDateTime(booking.booking_date);
    return bookingDate >= today;
  });

  const sortedBookings = upcomingBookings.sort((a, b) => {
    const dateA = parseDateTime(a.booking_date);
    const dateB = parseDateTime(b.booking_date);
    if (dateA - dateB === 0) {
      const timeA = parseDateTime(a.start_time);
      const timeB = parseDateTime(b.start_time);
      return timeA - timeB;
    }
    return dateA - dateB;
  });

  const handleShowSlotsClick = () => {
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString("en-CA");
      const filtered = bookings.filter(
        (booking) => booking.booking_date === formattedDate
      );
      setFilteredBookings(filtered);
      setShowFilteredBookings(true);
    } else {
      alert("Please select a date from the calendar!");
    }
  };


  const handlePaymentStatusChange = async (id, newStatus) => {
    try {
      await axios.post(`http://127.0.0.1:8090/bookings/update/${id}`, {
        payment: newStatus,
      });
      window.location.reload(false);
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  return (
    <>
      <div className="nav-style">
        <div className="nav-underline"></div>
      </div>

      {location.pathname !== "/authpageownerlogin" &&
        location.pathname !== "/authpageownersignup" &&
        location.pathname !== "/revenuegrounddetails" &&
        location.pathname !== "/viewprofile" &&
        location.pathname !== "/help" && (
          <>
            <div className="container my-5">
              <h2 className="pt-5" style={{ color: "#55ad9b" }}>
                Upcoming Bookings
              </h2>
              <div className="reservations">
                <div className="reservations-list">
                  {sortedBookings.length > 0 ? (
                    sortedBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="upcoming-booking p-3 border mb-2"
                      >
                        <h5 style={{ color: "#55ad9b" }}>{booking.pitch_name}</h5>
                        <span>
                          <b>Timing:</b>{" "}
                          {`${formatTime(booking.start_time)} - ${formatTime(
                            booking.end_time
                          )}`}
                          <br />
                        </span>
                        <span>
                          <b>Date:</b> {formatDate(booking.booking_date)}
                          <br />
                        </span>
                        <span>
                          <b>Booked By:</b> {booking.user_email}
                          <br />
                        </span>
                        <span>
                          <b>Contact:</b> {booking.user_contact_no}
                          <br />
                        </span>
                        <span>
                          <b>Status:</b>{" "}
                          {booking.payment_status !== "pending" ? (
                            <span>{booking.payment_status}</span>
                          ) : (
                            <>
                              <button className="btn btn-success btn-sm me-2" 
                                onClick={()=>handlePaymentStatusChange(
                                  booking.id,
                                  "paid"
                                )}
                              >
                                Paid
                              </button>
                              <button className="btn btn-warning btn-sm"
                              onClick={()=>handlePaymentStatusChange(
                                booking.id,
                                "pending"  //TODO
                              )}
                              >
                                UnPaid
                              </button>
                            </>
                          )}
                          <br />
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="no-booking-message text-center mt-3">
                      <h5 style={{ color: "#0d705c" }}>No upcoming Booking!</h5>
                    </div>
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
                      className="my-5 slots-button dropdown btn-back"
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
                            <div
                              key={index}
                              className="upcoming-booking p-2 border"
                            >
                              <h5 style={{ color: "#55ad9b" }}>
                                {booking.pitch_name}
                              </h5>
                              <span>
                                <b>Timing:</b>{" "}
                                {`${formatTime(booking.start_time)} - ${formatTime(
                                  booking.end_time
                                )}`}
                                <br />
                              </span>
                              <span>
                                <b>Date:</b> {formatDate(booking.booking_date)}
                                <br />
                              </span>
                              <span>
                                <b>Booked By:</b> {booking.user_email}
                                <br />
                              </span>
                              <span>
                                <b>Contact:</b> {booking.user_contact_no}
                                <br />
                              </span>
                              <span>
                                <b>Status:</b> {booking.payment_status || "Not Paid"}
                                <br />
                              </span>
                            </div>
                          ))
                        ) : (
                          <h5 className="text-center">
                            No bookings available for the selected date.
                          </h5>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
    </>
  );
}
