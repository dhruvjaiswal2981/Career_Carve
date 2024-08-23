const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MySQL Database Connection
let db;
async function connectToDatabase() {
  try {
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Dhruv@2981', // Replace with your password
      database: 'career_carve', // Replace with your database name
    });
    console.log('Connected to database');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}
connectToDatabase();

// Fetch all mentors
app.get('/mentors', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM mentors');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching mentors' });
  }
});

// Create a new booking
// Create a new booking
app.post('/bookings', async (req, res) => {
  try {
    const { studentName, mentorId, areaOfInterest, duration, bookingDate, bookingTime } = req.body;
    const query = 'INSERT INTO bookings (student_name, mentor_id, area_of_interest, duration, booking_date, booking_time) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [studentName, mentorId, areaOfInterest, duration, bookingDate, bookingTime]);
    
    if (result.affectedRows === 1) {
      res.json({ message: 'Booking successful' });
    } else {
      res.status(500).json({ message: 'Failed to create booking' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error creating booking' });
  }
});


// Fetch all bookings
app.get('/bookings', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM bookings');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

app.post('/bookings', async (req, res) => {
  try {
    const { studentName, mentorId, areaOfInterest, duration, bookingDate, bookingTime } = req.body;
    const query = 'INSERT INTO bookings (student_name, mentor_id, area_of_interest, duration, booking_date, booking_time) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [studentName, mentorId, areaOfInterest, duration, bookingDate, bookingTime]);
    
    if (result.affectedRows === 1) {
      res.json({ message: 'Booking successful' });
    } else {
      res.status(500).json({ message: 'Failed to create booking' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error creating booking' });
  }
});


// Fetch bookings for a student
app.get('/bookings/:studentName', async (req, res) => {
  try {
    const { studentName } = req.params;
    const [rows] = await db.execute('SELECT * FROM bookings WHERE student_name = ?', [studentName]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

app.put('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { studentName, mentorId, areaOfInterest, duration } = req.body;

    // Ensure all required fields are present
    if (!studentName || !mentorId || !areaOfInterest || !duration) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = 'UPDATE bookings SET student_name = ?, mentor_id = ?, area_of_interest = ?, duration = ? WHERE id = ?';
    const [result] = await db.execute(query, [studentName, mentorId, areaOfInterest, duration, id]);

    if (result.affectedRows === 1) {
      res.json({ message: 'Booking updated successfully' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (err) {
    console.error('Error updating booking:', err); // Log the error details
    res.status(500).json({ message: 'Error updating booking', error: err.message });
  }
});

// Delete a booking
app.delete('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM bookings WHERE id = ?';
    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 1) {
      res.json({ message: 'Booking deleted successfully' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ message: 'Error deleting booking', error: err.message });
  }
});



// Start server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
