import React, { useState, useEffect } from 'react';
import '../App.css';

const App = () => {
  const [showAddEventModal, setShowAddEventModal] = useState(false);//Add event sourced from MonthView
  const [eventTitle, setEventTitle] = useState('');//Add event sourced from MonthView
  const [eventDateTime, setEventDateTime] = useState('');//Add event sourced from MonthView
  const [events, setEvents] = useState([]);//Event array
  const [shareNames, setShareNames] = useState([]);//shareNames array



  const styles = {//Imported from AuthForm
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        backgroundColor: '#fffffee'
    },
    formContainer: {
        padding: '20px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '320px'
    },
    logo: {
        width: '300px',
        marginBottom: '40px'
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px'
    },
    button: {
        width: '100%',
        padding: '10px',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px'
    },
    toggleButton: {
        marginTop: '10px',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: '#007bff'
    }
};


  useEffect(() => {//Uses this at the start of loading the webpage
    const fetchEvents = async () => {
      try {
        const token = sessionStorage.getItem("token");//Get the token from the users browser
        const response = await fetch('http://localhost:3001/api/getOwnedEvents', {//getOwnedEvents
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: token//Give the server the token
          })
        });
        if (!response.ok) {//If it didn't give a response
          throw new Error(`Failed to fetch events - ${response.status}`);//ERROR
        }
        const data = await response.json();//The data will be the response from the getOwnedEvents
        setEvents(data);//Set the events to be the data
        const tempNames = [];//Temp array
        for(var i = 0; i < data.length; i++){//Go through all data and make a new empty string element for the array
          tempNames[i] = ""
        }
        setShareNames(tempNames);//Sets the shareNames to the array with empty elements
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();//Call the function
  }, []);


  const handleAddEventClick = () => setShowAddEventModal(true);//Function sourced from MonthView

  const handleCancelAddEvent = () => {//Function sourced from MonthView
    setShowAddEventModal(false);
    setEventTitle('');
    setEventDateTime('');
  };

  const printEvent = () => {//Prints all the events as a list
    const setShareName = (e, index) => {//setShareName function
      const tempName = [...shareNames];//Copies array to new array
      tempName[index] = e.target.value;//Edits the current elements info
      setShareNames(tempName);//Updates the States
    }
    return (
      <div className="EventList">
        <table style={{marginLeft:"auto", marginRight:"auto"}}>
        <caption>Events</caption>
        <thead>
        <tr key="-1">
          <th>Title</th>
          <th>Date</th>
          <th>Share</th>
          <th>Delete</th>
        </tr>
        </thead>
        <tbody>
        {events.map((currentEvent, currentIndex) => <tr key={currentEvent.taskID}>
          <td>{currentEvent.taskTitle}</td>
          <td>{new Date(currentEvent.dateTime).toISOString().slice(0, 19).replace('T', ' ')}</td>
          <td>
            <div>
            <form onSubmit={(e) => handleShare(e, currentEvent.taskID, shareNames[currentIndex])}> 
              <input
                  type="text"
                  value={shareNames[currentIndex]}
                  onChange={e => setShareName(e, currentIndex)}
                  placeholder="Share With"
                  required
                  style={styles.input}
              />
              <button type="submit" style={styles.button}>Share</button>
            </form>
            </div>
          </td>
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
  
  const handleShare = async (e, id, shareUser) =>{
    e.preventDefault();
    try{
      const response = await fetch('http://localhost:3001/api/shareEvent', {//shareEvent
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
      eventID : id,//id of event to delete
      shareUser: shareUser
      })
    });
    if (!response.ok) {//If it failed
      throw new Error(`Failed to share event - ${response.status}`);//ERROR
    }
    //console.log("refresh");
    window.location.reload();//Refreshes page
    } catch (error) {
      console.error('Error sharing event:', error);
    }
  };

  const handleDelete = async (e, id) =>{//Delete function to delete a singular task
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/deleteEvent', {//deleteEvent
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventID : id//id of event to delete
        })
      });
      if (!response.ok) {//If it failed
        throw new Error(`Failed to delete event - ${response.status}`);//ERROR
      }
      //console.log("refresh");
      window.location.reload();//Refreshes page
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleAddEventSubmit = async (e) => {//AddEventSubmit sourced from MonthView
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
