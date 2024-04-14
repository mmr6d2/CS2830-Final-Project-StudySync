import React, { useState } from 'react';
import '../App.css';

function App() {
  const [startDate, setStartDate] = useState(new Date("2024-04-08"));
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hoursOfDay = Array.from({ length: 15 }, (_, i) => i + 6); // Hours from 6am to 8pm
  const [notes, setNotes] = useState({
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
    Saturday: '',
    Sunday: ''
  });

  // Function to convert 24-hour format to 12-hour format
  const to12HourFormat = (hour) => {
    if (hour === 0) return "12 am";
    else if (hour === 12) return "12 pm";
    else if (hour < 12) return `${hour} am`;
    else return `${hour - 12} pm`;
  };

  // Function to generate dates for a week
  const generateWeekDates = (startDate) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Function to handle going to the next week
  const handleNextWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() + 7);
    setStartDate(newStartDate);
  };

  // Function to handle going to the previous week
  const handlePrevWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() - 7);
    setStartDate(newStartDate);
  };

  // Function to handle changes in notes
  const handleNotesChange = (day, event) => {
    setNotes({
      ...notes,
      [day]: event.target.value
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <button className="mr-1 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handlePrevWeek}>&#8592;</button>
          <button className="mr-1 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleNextWeek}>&#8594;</button>
        </div>
      </header>
      <div className="planner">
        {/* Render the dates of the week */}
        {generateWeekDates(startDate).map((date, index) => (
          <div key={index} className="date-column">
            <h3>{date.toLocaleDateString("en-US", { weekday: 'long' })}</h3>
            <span>{date.toLocaleDateString()}</span>
          </div>
        ))}
        {/* Render the days of the week */}
        {daysOfWeek.map((day, index) => (
          <div key={day} className="day">
            <h2>{day}</h2>
            {/* Render the hours of the day */}
            {hoursOfDay.map(hour => (
              <div key={hour} className="hour">
                <span>{to12HourFormat(hour)} </span>
                {/* You can add tasks or events for each hour here */}
              </div>
            ))}
            {/* Notes section */}
            <div className="notes">
              <textarea value={notes[day]} onChange={(e) => handleNotesChange(day, e)} placeholder="Add notes..." />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
