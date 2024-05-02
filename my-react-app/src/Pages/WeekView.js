import React, { useState, useEffect } from 'react';
import '../App.css';

const App = () => {
  const [startDate, setStartDate] = useState(new Date());
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hoursOfDay = Array.from({ length: 15 }, (_, i) => i + 6); // Hours from 6am to 8pm
  const [notes, setNotes] = useState({});
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDateTime, setEventDateTime] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const diff = startDate.getDay();
    const tempDate = startDate;
    tempDate.setDate(startDate.getDate() - diff);
    setStartDate(tempDate);
  
    const fetchEvents = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch('http://localhost:3001/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: token
          })
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch events - ${response.status}`);
        }
        const data = await response.json();
  
        // Convert event dates from UTC to local time zone
        const convertedEvents = data.map(event => {
          const eventDate = new Date(event.dateTime);
          // Adjust for the timezone offset
          const localDate = new Date(eventDate.getTime() - (eventDate.getTimezoneOffset() * 60000));
          return {
            ...event,
            dateTime: localDate.toLocaleString() // Convert to local time string
          };
        });
  
        setEvents(convertedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
  
    fetchEvents();
  }, []);

  const to12HourFormat = (hour) => {
    const suffix = hour >= 12 ? 'pm' : 'am';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour} ${suffix}`;
  };

  const generateWeekDates = (startDate) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const handleNextWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() + 7);
    setStartDate(newStartDate);
  };

  const handlePrevWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() - 7);
    setStartDate(newStartDate);
  };

  const handleNotesChange = (day, event) => {
    setNotes({
      ...notes,
      [day]: event.target.value
    });
  };

  const handleAddEventClick = () => setShowAddEventModal(true);

  const handleCancelAddEvent = () => {
    setShowAddEventModal(false);
    setEventTitle('');
    setEventDateTime('');
  };

  const handleEventTitleChange = (e) => setEventTitle(e.target.value);

  const handleEventDateTimeChange = (e) => setEventDateTime(e.target.value);
  

  const handleAddEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/add-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: eventTitle,
          dateTime: eventDateTime
        })
      });
      if (!response.ok) {
        throw new Error(`Failed to add event - ${response.status}`);
      }
      const data = await response.json();
      // Convert event date from UTC to local time zone
      const convertedEvent = {
        ...data,
        dateTime: new Date(data.dateTime).toLocaleString()
      };
      console.log('Added event time:', convertedEvent.dateTime); // Log added event time
      setEvents([...events, convertedEvent]);
      setEventTitle('');
      setEventDateTime('');
      setShowAddEventModal(false);
      window.location.reload(); // Refreshes page
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <button className="mr-1 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handlePrevWeek}>&#8592;</button>
          <button className="mr-1 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleNextWeek}>&#8594;</button>
          <button className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleAddEventClick}>Add Event</button>
        </div>
      </header>
      <div className="planner">
        {/* Render the dates of the week */}
        {generateWeekDates(startDate).map((date, index) => (
          <div key={index} className="date-column">
            <h3>{date.toLocaleDateString("en-US", { weekday: 'long' })}</h3>
            <span>{date.toLocaleDateString()}</span>
            {/* Render the hours of the day */}
            {hoursOfDay.map(hour => {
              // Filter events for the current day and hour
              const eventsForHour = events.filter(event => {
                const eventDate = new Date(event.dateTime);
                return (
                  eventDate.getDate() === date.getDate() && // Check if the event is for the current day
                  eventDate.getMonth() === date.getMonth() && // Checks if the event is on the right month
                  eventDate.getFullYear() === date.getFullYear() && // Checks if the event is on the right year
                  eventDate.getHours() === hour // Check if the event is at the current hour
                );
              });

              // Render the hour and associated events
              return (
                <div key={hour} className="hour">
                  <span>{to12HourFormat(hour)}</span>
                  {/* Render events for the current hour */}
                  {eventsForHour.map((event, eventIndex) => (
                    <div key={eventIndex} className="event">
                      {/* Render the task title */}
                      {event.taskTitle}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {/* Event Add Modal */}
      {showAddEventModal && (
        <div className="modal-overlay">
          <div className="modal">
            <form className="event-form" onSubmit={handleAddEventSubmit}>
              <input
                type="text"
                value={eventTitle}
                onChange={handleEventTitleChange}
                placeholder="Event Title"
                required
              />
              <input
                type="datetime-local"
                value={eventDateTime}
                onChange={handleEventDateTimeChange}
                required
              />
              <div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Submit</button>
                <button type="button" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={handleCancelAddEvent}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
