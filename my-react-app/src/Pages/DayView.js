import React, { useState, useEffect } from 'react';
import '../App.css';

const DayView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const hoursOfDay = Array.from({ length: 15 }, (_, i) => i + 6); // Hours from 6am to 8pm
  const [notes, setNotes] = useState({});
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDateTime, setEventDateTime] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/events');
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
  }, [selectedDate]);

  const to12HourFormat = (hour) => {
    const suffix = hour >= 12 ? 'pm' : 'am';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour} ${suffix}`;
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
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

  const handlePrevDay = () => {
    const newSelectedDate = new Date(selectedDate);
    newSelectedDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newSelectedDate);
  };

  const handleNextDay = () => {
    const newSelectedDate = new Date(selectedDate);
    newSelectedDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newSelectedDate);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <button className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handlePrevDay}>&#8592; Previous Day</button>
          <button className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleNextDay}>Next Day &#8594;</button>
          <button className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleAddEventClick}>Add Event</button>
        </div>
      </header>
      <div className="planner">
        <h3>{selectedDate.toLocaleDateString("en-US", { weekday: 'long' })}</h3>
        <span>{selectedDate.toLocaleDateString()}</span>
        {/* Render the hours of the day */}
        {hoursOfDay.map(hour => {
          // Filter events for the current hour
          const eventsForHourAndDay = events.filter(event => {
            const eventDate = new Date(event.dateTime);
            return (
              eventDate.getDate() === selectedDate.getDate() && // Check if the event is for the selected day
              eventDate.getMonth() === selectedDate.getMonth() && // Checks if the event is on the right month
              eventDate.getFullYear() === selectedDate.getFullYear() && // Checks if the event is on the right year
              eventDate.getHours() === hour // Check if the event is at the current hour
            );
          });
          
          // Render the hour and associated events for the selected day
          return (
            <div key={hour} className="hour">
              <span>{to12HourFormat(hour)}</span>
              {/* Render events for the current hour and selected day */}
              {eventsForHourAndDay.map((event, eventIndex) => (
                <div key={eventIndex} className="event">
                  {/* Render the task title */}
                  {event.taskTitle}
                </div>
              ))}
            </div>
          );
        })}
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

export default DayView;
