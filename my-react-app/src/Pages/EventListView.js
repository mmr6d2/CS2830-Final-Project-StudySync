import React, { useState, useEffect } from 'react';
import '../App.css';

const App = () => {
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDateTime, setEventDateTime] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch('http://localhost:3001/api/getOwnedEvents', {
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
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);


  const handleAddEventClick = () => setShowAddEventModal(true);

  const handleCancelAddEvent = () => {
    setShowAddEventModal(false);
    setEventTitle('');
    setEventDateTime('');
  };

  const printEvent = () => {
    return (
      <div className="EventList">
        <table style={{marginLeft:"auto", marginRight:"auto"}}>
        <caption>Events</caption>
        <thead>
        <tr key="-1">
          <th>Title</th>
          <th>Date</th>
          <th>Delete</th>
        </tr>
        </thead>
        <tbody>
        {events.map((currentEvent, currentIndex) => <tr key={currentIndex}>
          <td>{currentEvent.taskTitle}</td>
          <td>{new Date(currentEvent.dateTime).toISOString().slice(0, 19).replace('T', ' ')}</td>

          <td><button className="mr-1 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={ (e) => handleDelete(e, currentEvent.taskID)}>Delete</button></td>
        </tr>
        )}
        </tbody>
      </table>
      </div>
    );
  }

  const handleEventTitleChange = (e) => setEventTitle(e.target.value);

  const handleEventDateTimeChange = (e) => setEventDateTime(e.target.value);
  
  const handleDelete = async (e, id) =>{
    e.preventDefault();
    try {
      console.log(id);
      const response = await fetch('http://localhost:3001/api/deleteEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventID : id
        })
      });
      if (!response.ok) {
        throw new Error(`Failed to delete event - ${response.status}`);
      }
      //console.log("refresh");
      window.location.reload();//Refreshes page
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

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
      setEvents([...events, data]);
      setEventTitle('');
      setEventDateTime('');
      setShowAddEventModal(false);
      window.location.reload();//Refreshes page
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <button className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleAddEventClick}>Add Event</button>
        </div>
      </header>
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
      <div className="EventList">
          {printEvent()}
      </div>
    </div>
  );
  
  
};

export default App;
