// Import dependencies
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Set up moment.js localizer for the calendar
const localizer = momentLocalizer(moment);

// Define API_BASE constant for the API endpoint
const API_BASE = "http://localhost:3001";

// Define the CalendarComponent functional component
const CalendarComponent = () => {
  // Set up state variables for the calendar
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState(null);
  const [events, setEvents] = useState(() => {
    // Set up default state for the events by retrieving from local storage or empty array
    const storedEvents = localStorage.getItem('calendarEvents');
    return storedEvents ? JSON.parse(storedEvents) : [];
  });

  // Update the local storage with the current events whenever the events state changes
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  // Handle user selection of an empty time slot on the calendar
  const handleSelectSlot = ({ start, end }) => {
    setShowModal(true);
    // Set the newEvent state to the selected time slot
    setNewEvent({
      start,
      end
    });
  };

  // Customize the day cell style for each day on the calendar
  const dayPropGetter = (date) => {
    const isToday = moment(date).isSame(moment(), 'day'); // Check if date is today
    const style = {
      border: isToday ? '2px solid red' : '0.5px solid white', // Add border to today's date
      backgroundColor: isToday ? '#202B3E' : 'inherit' // Add background color to today's date
    };
    return { style };
  };

  const handleEventClick = (event) => {
    // Display confirmation dialog before deleting the event
    const deleteConfirmation = window.confirm('Are you sure you want to delete this event?');
  
    // If the user confirms to delete the event
    if (deleteConfirmation) {
      // Create a new array of events by filtering out the clicked event
      const updateEvents = events.filter((item) => {
        // Only remove the event that matches the clicked event
        return item.id !== event.id;
      });
  
      // Update the events state with the new array of events
      setEvents(updateEvents);
    }
  };
  
  // Handle closing the modal when adding a new event or editing an existing event
  const handleModalClose = () => {
    setShowModal(false);
    setNewEvent(null);
  };
  
  // Handle adding a new event
  const handleAddEvent = (title) => {
    // Get the start and end times of the new event from the newEvent state
    const { start, end } = newEvent;
  
    // Create a new event object with a unique id, title, and start and end times
    const newEventObject = {
      id: Date.now(),
      start,
      end,
      title
    };
  
    // Update the events state with the new event object
    setEvents([...events, newEventObject]);
  
    // Call API endpoint to send email
    fetch(API_BASE + '/people')
    .then(response => response.json())
    .then(data => {
      // Extract the email addresses from the response data
      const emails = data.map(item => item.email);
  
      // Send POST request to the sendEmail endpoint with the email recipients, subject, and message
      fetch(API_BASE + '/api/sendEmail', {
        method: 'POST',
        body: JSON.stringify({
          recipients: emails,
          subject: 'New event added',
          message: `A new event has been added: ${title} from ${start} to ${end}`
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to send email');
        }
      })
      .catch(error => {
        console.error(error);
      });
    })
    .catch(error => {
      console.log(error);
    });
    
    // Close the modal
    handleModalClose();
  };  
  
  // Render the component
  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        views={['month']}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleEventClick}
        defaultDate={new Date()}
        dayPropGetter={dayPropGetter}
      /><br />
      {showModal && (
        <div>
          <div className="popup"><h4>Add event:</h4>
          <input className="input" type="text" onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} /><br />
          <button className="mybutton" onClick={() => handleAddEvent(newEvent.title)}>Add</button>
          <button className="mybutton" onClick={handleModalClose}>Cancel</button>
        </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
