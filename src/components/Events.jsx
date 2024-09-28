import axios from 'axios';
import Swal from 'sweetalert2';
const Events = ({
  decoded,
  events,
  setEvents,
  applications,
  setApplications,
  allUsers,
}) => {
  const userId = decoded.user_id;
  const roleId = decoded.role_id;

  const handleApply = async (eventId) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/userEventApplications/apply/${userId}/${eventId}`
      );
      if (response.status === 201) {
        setApplications([
          ...applications,
          { user_id: userId, event_id: eventId },
        ]);
        Swal.fire({
          text: 'Apllied!',
          showConfirmButton: false,
          timer: 1500,
          icon: 'success',
        });
      }
    } catch (error) {
      console.error(
        'Failed to apply to event:',
        error.response?.data?.error || error.message
      );
    }
  };

  const handleUnapply = async (eventId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/userEventApplications/unapply/${userId}/${eventId}`
      );
      if (response.status === 200) {
        console.log(applications);
        const updatedApplications = applications.filter(
          (app) => !(app.event_id === eventId && app.user_id === userId)
        );
        console.log(updatedApplications);
        setApplications(updatedApplications);
        Swal.fire({
          text: 'Unapplied!',
          showConfirmButton: false,
          timer: 1500,
          icon: 'success',
        });
      }
    } catch (error) {
      console.error(
        'Failed to unapply from event:',
        error.response?.data?.error || error.message
      );
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/events/deleteEvent/${eventId}`
      );
      if (response.status === 200) {
        setApplications((prevApplications) =>
          prevApplications.filter((app) => app.event_id !== eventId)
        );
        setEvents(events.filter((event) => event.id !== eventId));
        Swal.fire({
          text: 'Event deleted!',
          showConfirmButton: false,
          timer: 1500,
          icon: 'success',
        });
      }
    } catch (error) {
      console.error(
        'Failed to delete event:',
        error.response?.data?.error || error.message
      );
    }
  };

  const isUserApplied = (eventId) => {
    return applications.some(
      (app) => app.event_id === eventId && app.user_id === userId
    );
  };

  const getEventApplications = (eventId) => {
    return applications
      .filter((app) => app.event_id === eventId)
      .map((app) => {
        const appliedUser = allUsers.find((user) => user.id === app.user_id);
        if (appliedUser) {
          return {
            username: appliedUser.username,
            email: appliedUser.email,
          };
        } else {
          return null;
        }
      })
      .filter((user) => user !== null);
  };

  return (
    <div className='main-container'>
      <ul className='events-container'>
        {events.map((event) => {
          const eventApplications = getEventApplications(event.id);
          const isUserAppliedToEvent = isUserApplied(event.id);
          return (
            <li key={event.id} className='card event-card'>
              <h3>{event.name.toUpperCase()}</h3>
              <p>{event.description}</p>
              <p>
                <strong>Location: </strong>
                {event.location}
              </p>
              <p>
                <strong>Time: </strong>
                {new Date(event.time).toLocaleString()}
              </p>
              <p>
                {getEventApplications(event.id).length + ' '}
                <span style={{ color: '#ff5722' }}>
                  <i className='fa-solid fa-people-group fa-2xl'></i>
                </span>
                <span className='sr-only'>People</span>
              </p>
              {roleId < 3 ? (
                isUserAppliedToEvent ? (
                  <button
                    className='event-button'
                    onClick={() => handleUnapply(event.id)}
                  >
                    Quit
                  </button>
                ) : (
                  <button
                    className='event-button'
                    onClick={() => handleApply(event.id)}
                  >
                    Apply
                  </button>
                )
              ) : (
                <div>
                  <h4>Applied users:</h4>
                  <ul>
                    {eventApplications.length > 0 ? (
                      eventApplications.map((user, index) => (
                        <li key={index}>
                          {user.username} ({user.email})
                        </li>
                      ))
                    ) : (
                      <li>No users have applied</li>
                    )}
                    <button
                      className='event-button'
                      onClick={() => handleDelete(event.id)}
                    >
                      Delete
                    </button>
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Events;
