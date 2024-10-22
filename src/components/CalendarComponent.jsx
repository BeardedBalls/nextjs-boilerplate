import React from 'react';
import './Calendar.css';

const CalendarComponent = ({ selectedMonth, onMonthChange }) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleMonthClick = (month) => {
    onMonthChange(month); // Call the parent function to update the selected month
  };

  return (
    <div className="calendar-grid">
      {months.map((month, index) => (
        <div
          key={index}
          className={`calendar-month ${selectedMonth === index + 1 ? 'selected' : ''}`}
          onClick={() => handleMonthClick(index + 1)}
        >
          {month}
        </div>
      ))}
    </div>
  );
};

export default CalendarComponent;
