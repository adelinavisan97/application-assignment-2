import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState(null);
  const [events, setEvents] = useState(() => {
    const storepersonents = localStorage.getItem('calendarEvents');
    return storepersonents ? JSON.parse(storepersonents) : [];
  });

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const handleSelectSlot = ({ start, end }) => {
    setShowModal(true);
    setNewEvent({
      start,
      end
    });
  };
  const dayPropGetter = (date) => {
    const isToday = moment(date).isSame(moment(), 'day'); // Check if date is today
    const style = {
      border: isToday ? '2px solid red' : '0.5px solid white', // Add border to today's date
      backgroundColor: isToday ? '#202B3E' : 'inherit' // Add background color to today's date
    };
    return { style };
  };

  const handleEventClick = (event) => {
    const deleteConfirmation = window.confirm('Are you sure you want to delete this event?');
    if (deleteConfirmation) {
      const updatepersonents = events.filter((item) => item.title !== event.title);
      setEvents(updatepersonents);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewEvent(null);
  };

    const handleAdpersonent = (title) => {
    const { start, end } = newEvent;
    const newEventObject = {
        start,
        end,
        title
    };
  setEvents([...events, newEventObject]);
  handleModalClose();
};

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
          <button className="mybutton" onClick={() => handleAdpersonent(newEvent.title)}>Add</button>
          <button className="mybutton" onClick={handleModalClose}>Cancel</button>
        </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
