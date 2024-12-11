import React, { useState } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function SearchBar() {
  const [startDate, setStartDate] = useState(null);

  return (
    <div className="search-bar">
      <div className="search-item">
        <FaMapMarkerAlt className="icon" />
        <input type="text" placeholder="Location" />
      </div>
      <div className="search-item">
        <FaCalendarAlt className="icon" />
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText="Pick a date"
          dateFormat="MM/dd/yyyy"
          className="date-picker-input"
        />
      </div>
      <button className="search-button">
        <FaSearch />
      </button>
    </div>
  );
}

export default SearchBar;