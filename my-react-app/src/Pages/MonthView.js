import React, { useState } from 'react';
import '../App.css';

const MonthView = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Use the current date to determine the month

  // Function to generate all dates for the month view
  const generateMonthDates = (currentDate) => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const dates = [];

    // Fill dates from start of the month to the end
    for (let date = new Date(startOfMonth); date <= endOfMonth; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date));
    }

    // Adjust to include the start of the week to the end of the week
    const startDay = dates[0].getDay(); // Sunday - 0, Monday - 1, etc.
    for (let i = 0; i < startDay; i++) {
      dates.unshift(new Date(startOfMonth.setDate(startOfMonth.getDate() - 1)));
    }

    // Also, fill to the end of the last week of the month
    const endDay = dates[dates.length - 1].getDay();
    for (let i = endDay; i < 6; i++) {
      dates.push(new Date(endOfMonth.setDate(endOfMonth.getDate() + 1)));
    }

    return dates;
  };

  // Function to handle going to the next month
  const handleNextMonth = () => {
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    setCurrentDate(nextMonth);
  };

  // Function to handle going to the previous month
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    setCurrentDate(prevMonth);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2 className="text-3xl font-bold text-blue-500">{currentDate.toLocaleDateString("en-US", { year: 'numeric', month: 'long' })}</h2>
        <div>
          <button className="mr-1 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handlePrevMonth}>&#8592; Prev Month</button>
          <button className="mr-1 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleNextMonth}>Next Month &#8594;</button>
        </div>
      </header>      
      <div className="month-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
      <div key='0' className="date-column">
            <h3>Sunday</h3>
      </div>
      <div key='1' className="date-column">
            <h3>Monday</h3>
      </div>
      <div key='3' className="date-column">
            <h3>Tuesday</h3>
      </div>
      <div key='4' className="date-column">
            <h3>Wednesday</h3>
      </div>
      <div key='5' className="date-column">
            <h3>Thursday</h3>
      </div>
      <div key='6' className="date-column">
            <h3>Friday</h3>
      </div>
      <div key='7' className="date-column">
            <h3>Saturday</h3>
      </div>
        {generateMonthDates(currentDate).map((date, index) => (
          <div key={index} className="date-cell" style={{ border: '1px solid #ccc', padding: '10px' }}>
            <span>{date.getDate()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;
