import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

// Function to format the date
const formatDate = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return date.toISOString().split('T')[0]; // Returns date in YYYY-MM-DD format
};

function App() {
  const [mentors, setMentors] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [mentorId, setMentorId] = useState('');
  const [areaOfInterest, setAreaOfInterest] = useState('');
  const [duration, setDuration] = useState(30);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);

  // Fetch mentors
  useEffect(() => {
    axios.get('http://localhost:5000/mentors')
      .then(response => setMentors(response.data))
      .catch(error => console.error('Error fetching mentors:', error));
  }, []);

  // Handle booking submission
  const handleBookingSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:5000/bookings', {
      studentName,
      mentorId,
      areaOfInterest,
      duration,
      bookingDate: date,
      bookingTime: time,
    })
      .then(() => {
        alert('Booking successful');
        setStudentName('');
        setMentorId('');
        setAreaOfInterest('');
        setDuration(30);
        setDate('');
        setTime('');
        handleFetchBookings(); // Refresh the bookings after a new booking
      })
      .catch(error => console.error('Error booking session:', error));
  };
  
  // Fetch all bookings
  const handleFetchBookings = () => {
    axios.get('http://localhost:5000/bookings')
      .then(response => setBookings(response.data))
      .catch(error => console.error('Error fetching bookings:', error));
  };  

  // Handle editing a booking
  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
  };

  // Handle updating a booking
  const handleEditSubmit = (event) => {
    event.preventDefault();
    if (editingBooking) {
      axios.put(`http://localhost:5000/bookings/${editingBooking.id}`, {
        studentName: editingBooking.student_name,
        mentorId: editingBooking.mentor_id,
        areaOfInterest: editingBooking.area_of_interest,
        duration: editingBooking.duration,
        date: editingBooking.date,
        time: editingBooking.time,
      })
        .then(() => {
          alert('Booking updated successfully');
          setEditingBooking(null);
          handleFetchBookings(); // Refresh the list of bookings
        })
        .catch(error => {
          console.error('Error updating booking:', error);
          alert('Error updating booking: ' + error.response?.data?.message || error.message);
        });
    }
  };

  // Handle deleting a booking
  const handleDeleteBooking = (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      axios.delete(`http://localhost:5000/bookings/${id}`)
        .then(() => {
          alert('Booking deleted successfully');
          handleFetchBookings(); // Refresh the list of bookings
        })
        .catch(error => {
          console.error('Error deleting booking:', error);
          alert('Error deleting booking: ' + error.response?.data?.message || error.message);
        });
    }
  };

  return (
    <div className="container">
      <h1>1x1 Scheduler</h1>

      {/* Booking Form */}
      <form onSubmit={handleBookingSubmit}>
        <label>
          Student Name: 
          <input
            type="text"
            value={studentName}
            onChange={e => setStudentName(e.target.value)}
            required
          />
        </label>
        <label>
          Mentor:
          <select
            value={mentorId}
            onChange={e => setMentorId(e.target.value)}
            required
          >
            <option value="">Select Mentor</option>
            {mentors.map(mentor => (
              <option key={mentor.id} value={mentor.id}>
                {mentor.name} ({mentor.areas_of_expertise})
              </option>
            ))}
          </select>
        </label>
        <label>
          Area of Interest:
          <input
            type="text"
            value={areaOfInterest}
            onChange={e => setAreaOfInterest(e.target.value)}
            required
          />
        </label>
        <div className="date-container">
          <label>
            Date:
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="time-container">
          <label>
            Time:
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              required
            />
          </label>
        </div>
        <label>
          Duration:
          <select value={duration} onChange={e => setDuration(Number(e.target.value))}>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
        </label>
        <button type="submit">Schedule</button>
      </form>

      {/* Editing Form */}
      {editingBooking && (
        <form onSubmit={handleEditSubmit}>
          <h2>Edit Booking</h2>
          <label>
            Student Name:
            <input
              type="text"
              value={editingBooking.student_name}
              onChange={e => setEditingBooking({ ...editingBooking, student_name: e.target.value })}
              required
            />
          </label>
          <label>
            Mentor:
            <select
              value={editingBooking.mentor_id}
              onChange={e => setEditingBooking({ ...editingBooking, mentor_id: e.target.value })}
              required
            >
              <option value="">Select Mentor</option>
              {mentors.map(mentor => (
                <option key={mentor.id} value={mentor.id}>
                  {mentor.name} ({mentor.areas_of_expertise})
                </option>
              ))}
            </select>
          </label>
          <label>
            Area of Interest:
            <input
              type="text"
              value={editingBooking.area_of_interest}
              onChange={e => setEditingBooking({ ...editingBooking, area_of_interest: e.target.value })}
              required
            />
          </label>
          <div className="date-container">
            <label>
              Date:
              <input
                type="date"
                value={editingBooking.date}
                onChange={e => setEditingBooking({ ...editingBooking, date: e.target.value })}
                required
              />
            </label>
          </div>
          <div className="time-container">
            <label>
              Time:
              <input
                type="time"
                value={editingBooking.time}
                onChange={e => setEditingBooking({ ...editingBooking, time: e.target.value })}
                required
              />
            </label>
          </div>
          <label>
            Duration:
            <select
              value={editingBooking.duration}
              onChange={e => setEditingBooking({ ...editingBooking, duration: Number(e.target.value) })}
            >
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </label>
          <button type="submit">Update Booking</button>
          <button type="button" onClick={() => setEditingBooking(null)}>Cancel</button>
        </form>
      )}

      {/* Fetch Bookings */}
      <button onClick={handleFetchBookings}>Fetch All Bookings</button>
      <div className="bookings-list">
        {bookings.map(booking => (
          <div key={booking.id} className="booking-item">
            <div className="booking-details">
              <div><strong>Student Name:- </strong> {booking.student_name}</div>
              <div><strong>Duration:- </strong> {booking.duration} minutes</div>
              <div><strong>Mentor ID:- </strong> {booking.mentor_id}</div>
              <div><strong>Date:- </strong> {formatDate(booking.booking_date)}</div>
              <div><strong>Time:- </strong> {booking.booking_time}</div>
            </div>
            <button className="edit-button" onClick={() => handleEditBooking(booking)}>Edit</button>
            <button className="delete-button" onClick={() => handleDeleteBooking(booking.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
