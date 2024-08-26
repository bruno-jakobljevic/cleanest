import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddEvent = ({ events, setEvents, decoded }) => {
  const userId = decoded.user_id;

  const [event, setEvent] = useState({
    name: '',
    description: '',
    location: '',
    time: '',
    manager_id: userId,
  });

  const handleChange = (e) => {
    setEvent({
      ...event,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedTime = event.time.replace('T', ' ') + ':00';
    const newEvent = { ...event, time: formattedTime };
    try {
      const response = await axios.post(
        'http://localhost:3001/events/addEvent',
        newEvent
      );
      setEvents([...events, { ...newEvent, id: response.data.id }]);
      Swal.fire({
        text: 'Event added successfully!',
        showConfirmButton: false,
        timer: 1500,
        icon: 'success',
      });

      setEvent({
        name: '',
        description: '',
        location: '',
        time: '',
        manager_id: userId,
      });
    } catch (error) {
      console.error('There was an error adding the event:', error);
      Swal.fire({
        text: 'Failed to add the event, please try again later.',
        showConfirmButton: false,
        timer: 1500,
        icon: 'error',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add Event</h1>
      <label>Event Name:</label>
      <input
        type='text'
        name='name'
        value={event.name}
        onChange={handleChange}
        required
      />
      <label>Description:</label>
      <textarea
        name='description'
        value={event.description}
        onChange={handleChange}
        required
      />
      <label>Location:</label>
      <input
        type='text'
        name='location'
        value={event.location}
        onChange={handleChange}
        required
      />
      <label>Time: </label>
      <input
        type='datetime-local'
        name='time'
        value={event.time}
        onChange={handleChange}
        required
      />
      <button className='' type='submit'>
        Add Event
      </button>
    </form>
  );
};

export default AddEvent;
