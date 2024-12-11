import React, { useState, useEffect } from "react";
import Calendar from "./Calender";

const Booking = ({ selectedPitch, onDurationChange, selectedGroundID }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState("60 Mins");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showSlots, setShowSlots] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

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
      }
    } else {
      alert("No token found. Please log in.");
    }
  }, []);

  const slotsData = {
    "60 Mins": ["20:30", "21:30", "22:30", "23:30"],
    "90 Mins": ["20:30", "22:00", "23:30"],
  };

  const validatePhoneNumber = () => {
    const phoneRegex = /^[0-9]{11}$/; // Adjust this regex based on your phone number format
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneError("Please enter a valid 11-digit phone number.");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleDurationClick = (duration) => {
    setSelectedDuration(duration);
    onDurationChange(duration);
    setSelectedSlot(null);
  };

  const handleShowSlotsClick = () => {
    setShowSlots(!showSlots);
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBooking = async () => {
    if (!validatePhoneNumber()) {
      return; // Stop booking if phone number is invalid
    }

    const dateToBook = selectedDate || new Date();
    const formatDateTime = (date, time) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day} ${time}:00`;
    };

    const start_time = formatDateTime(dateToBook, selectedSlot);

    const duration_seconds = selectedDuration === "60 Mins" ? 60 * 60 : 90 * 60;

    function extractDate(inputString) {
      // Regular expression to match date patterns (YYYY-MM-DD HH:MM:SS)
      const dateRegex = /\b(\d{4})-(\d{2})-(\d{2})\s+\d{2}:\d{2}:\d{2}\b/;

      // Search for the date pattern in the input string
      const match = inputString.match(dateRegex);

      if (match) {
        // Extract the date components
        const [_, year, month, day] = match;
        // Return date in YY-MM-DD format
        return `${year.slice(2)}-${month}-${day}`;
      }

      // Return null if no date is found
      return null;
    }

    const bookingDetails = {
      pitch_name: selectedPitch.name,
      ground_id: selectedGroundID, // Update this with the actual ground_id as needed
      user_email: userEmail,
      user_contact_no: phoneNumber,
      start_time: start_time, // Use the formatted start_time
      duration: duration_seconds, // Send duration as seconds
      payment_status: "pending",
      booking_date: extractDate(start_time),
    };

    console.log("Booking details:", bookingDetails); // Log booking details

    try {
      const response = await fetch("http://127.0.0.1:8000/ground_booking/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingDetails),
      });

      const result = await response.json();
      if (response.ok) {
        alert(
          `You Booked it! \nDetails: ${JSON.stringify(bookingDetails, null, 2)}`
        );
      } else {
        alert(result.detail || "Something went wrong");
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  return (
    <div className="booking-container">
      <p>Select date and duration to show available slots</p>

      <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      <div className="phone-input my-4">
        <h4>Enter Phone Number</h4>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter your phone number"
          className="p-2"
          style={{
            border: "2px solid green",
            borderRadius: "5px",
            width: "100%",
          }}
        />
        {phoneError && <p style={{ color: "red" }}>{phoneError}</p>}
      </div>

      <div className="duration">
        <h4>Match Duration</h4>
        <div className="duration-buttons">
          <button
            className={`duration-button ${
              selectedDuration === "60 Mins" ? "selected" : ""
            }`}
            onClick={() => handleDurationClick("60 Mins")}
          >
            60 Mins
          </button>
          <button
            className={`duration-button ${
              selectedDuration === "90 Mins" ? "selected" : ""
            }`}
            onClick={() => handleDurationClick("90 Mins")}
          >
            90 Mins
          </button>
        </div>
      </div>

      <div style={{ position: "relative", display: "inline-block" }}>
        <button
          className="slots-button dropdown btn-back"
          type="button"
          aria-expanded={showSlots}
          onClick={handleShowSlotsClick}
        >
          SHOW AVAILABLE SLOTS
        </button>

        <ul
          className={`dropdown-menu mt-2 ${showSlots ? "show" : ""}`}
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            zIndex: 1000,
            display: showSlots ? "block" : "none",
          }}
        >
          <li>
            <div className="available-slots">
              <h4>Available Slots</h4>
              <p>{selectedDuration} Slots</p>
              <div className="slot-list">
                {slotsData[selectedDuration].map((slot, index) => (
                  <div
                    key={index}
                    className={`slot-item ${
                      selectedSlot === slot ? "selected" : ""
                    }`}
                    onClick={() => handleSlotClick(slot)}
                  >
                    <span>{slot}</span>
                    <span>30 BHD</span>
                  </div>
                ))}
              </div>
              <div className="btn">
                <button
                  className="book-button"
                  type="button"
                  onClick={handleBooking}
                  disabled={isBooked} // Disable button if already booked
                >
                  {isBooked ? "Booked" : "Book Now"}
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Booking;