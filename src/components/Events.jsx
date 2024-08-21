import React, { useState } from 'react';

function Events({ events, roleId, onApply, onSubmit }) {
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    time: '',
  });

  const handleInputChange = (e) => {
    setNewEvent({
      ...newEvent,
      [e.target.name]: e.target.value,
    });
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    onSubmit(newEvent);
  };

  return (
    <div>
      <header>
        <h1>Events</h1>
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <h2>{event.name}</h2>
              <p>{event.description}</p>
              <p>{new Date(event.time).toLocaleString()}</p>
              {roleId >= 1 && (
                <button onClick={() => onApply(event.id)}>Apply</button>
              )}
            </li>
          ))}
        </ul>
      </header>
      {roleId >= 3 && (
        <form onSubmit={handleEventSubmit}>
          <h2>Add New Event</h2>
          <div>
            <label>Event Name:</label>
            <input
              type='text'
              name='name'
              value={newEvent.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              name='description'
              value={newEvent.description}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div>
            <label>Time:</label>
            <input
              type='datetime-local'
              name='time'
              value={newEvent.time}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type='submit'>Add Event</button>
        </form>
      )}
    </div>
  );
}

export default Events;
