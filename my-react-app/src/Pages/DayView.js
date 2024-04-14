import React, { useState } from 'react';
import '../App.css';

const DayView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const hoursOfDay = Array.from({ length: 15 }, (_, i) => i + 6); // Hours from 6am to 8pm

  // Function to convert 24-hour format to 12-hour format
  const to12HourFormat = (hour) => {
    if (hour === 0) return "12 am";
    else if (hour === 12) return "12 pm";
    else if (hour < 12) return `${hour} am`;
    else return `${hour - 12} pm`;
  };

  // Function to generate times from 6am to 8pm in 1-hour intervals
  const generateTimes = () => {
    const times = [];
    for (let hour = 6; hour <= 20; hour++) {
      times.push(hour);
    }
    return times;
  };

  // Function to handle going to the next day
  const handleNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDay);
  };

  // Function to handle going to the previous day
  const handlePrevDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(currentDate.getDate() - 1);
    setCurrentDate(prevDay);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2 className="text-3xl font-bold text-blue-500">{currentDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} </h2>
        <div>
          <button className="mr-1 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handlePrevDay}>&#8592;</button>
          <button className="mr-1 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleNextDay}>&#8594;</button>
        </div>
      </header>
      <div className="planner">
        {/* Column with times from 6am to 8pm */}
        <div className="date-column">
          {generateTimes().map((hour) => (
            <div key={hour} className="hour">
              <span>{to12HourFormat(hour)} </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayView;
