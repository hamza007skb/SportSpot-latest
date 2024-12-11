import React, { useState } from "react";
import L_Arrow from "../Assets/L_Arrow.png";
import R_Arrow from "../Assets/R_Arrow.png";

const Calendar = ({ selectedDate, setSelectedDate }) => {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const [monthOffset, setMonthOffset] = useState(0);

  const getMonthName = (month, year) => {
    const date = new Date(year, month);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const displayedMonth = (currentMonth + monthOffset) % 12;
  const displayedYear =
    currentYear + Math.floor((currentMonth + monthOffset) / 12);

  const daysInMonth = getDaysInMonth(displayedMonth, displayedYear);

  const twoMonthsLater = new Date(today);
  twoMonthsLater.setMonth(today.getMonth() + 2);

  const handleDateClick = (day) => {
    setSelectedDate(new Date(displayedYear, displayedMonth, day));
  };

  const isDateDisabled = (day) => {
    const dateToCheck = new Date(displayedYear, displayedMonth, day);
    return (
      dateToCheck < new Date(today.setHours(0, 0, 0, 0)) ||
      dateToCheck > twoMonthsLater
    );
  };

  const navigateMonth = (direction) => {
    const maxMonthsAllowed = 2;
    if (direction === "prev" && monthOffset > 0) {
      setMonthOffset(monthOffset - 1);
    } else if (direction === "next" && monthOffset < maxMonthsAllowed) {
      setMonthOffset(monthOffset + 1);
    }
  };

  return (
    <div className="calendar">
      <div className="month">
        <button
          className="arrow-button left-arrow"
          onClick={() => navigateMonth("prev")}
          disabled={monthOffset === 0}
        >
          <img src={L_Arrow} alt="Previous Month" className="arrow-image" />
        </button>

        <h3>{getMonthName(displayedMonth, displayedYear)}</h3>

        <button
          className="arrow-button right-arrow"
          onClick={() => navigateMonth("next")}
          disabled={monthOffset === 2}
        >
          <img src={R_Arrow} alt="Next Month" className="arrow-image" />
        </button>
      </div>

      <div className="days">
        <div className="day-header">Su</div>
        <div className="day-header">Mo</div>
        <div className="day-header">Tu</div>
        <div className="day-header">We</div>
        <div className="day-header">Th</div>
        <div className="day-header">Fr</div>
        <div className="day-header">Sa</div>

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const isDisabled = isDateDisabled(day);

          return (
            <button
              key={day}
              className={`day-button ${
                selectedDate?.getDate() === day &&
                selectedDate?.getMonth() === displayedMonth &&
                selectedDate?.getFullYear() === displayedYear
                  ? "selected"
                  : ""
              } ${
                currentDay === day && currentMonth === displayedMonth
                  ? "today"
                  : ""
              }`}
              onClick={() => !isDisabled && handleDateClick(day)}
              disabled={isDisabled}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
