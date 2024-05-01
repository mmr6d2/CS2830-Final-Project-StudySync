import React, { useState, useEffect } from 'react';
import '../App.css';

const MonthView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/events');
        if (!response.ok) {
          throw new Error(`Failed to fetch events - ${response.status}`);
        }
        const data = await response.json();
        const convertedEvents = data.map(event => ({
          ...event,
          dateTime: new Date(event.dateTime)
        }));
        setEvents(convertedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [currentDate]);

  const generateMonthDates = (currentDate) => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const dates = [];
    for (let date = new Date(startOfMonth); date <= endOfMonth; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date));
    }
    const startDay = dates[0].getDay();
    for (let i = 0; i < startDay; i++) {
      dates.unshift(new Date(startOfMonth.setDate(startOfMonth.getDate() - 1)));
    }
    const endDay = dates[dates.length - 1].getDay();
    for (let i = endDay; i < 6; i++) {
      dates.push(new Date(endOfMonth.setDate(endOfMonth.getDate() + 1)));
    }
    return dates;
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
        {daysOfWeek.map((day, index) => (
          <div key={index} className="date-header" style={{ padding: '10px', fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>
            {day}
          </div>
        ))}
        {generateMonthDates(currentDate).map((date, index) => {
          const dayEvents = events.filter(event => 
            event.dateTime.getDate() === date.getDate() &&
            event.dateTime.getMonth() === date.getMonth() &&
            event.dateTime.getFullYear() === date.getFullYear());
          return (
            <div key={index} className="date-cell" style={{ border: '1px solid #ccc', padding: '10px' }}>
              <div className="date-number">{date.getDate()}</div>
              <div className="events-list">
                {dayEvents.map((event, eventIndex) => (
                  <div key={eventIndex} className="event" style={{ marginTop: '5px' }}>
                    {event.taskTitle || "No title"} {/* Use taskTitle instead of title */}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
