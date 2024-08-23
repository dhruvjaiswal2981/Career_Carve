require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


// MySQL Database Connection
const PORT = process.env.PORT || 5000;

async function connectToDatabase() {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Dhruv@2981',
      database: process.env.DB_NAME || 'career_carve'
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); // Exit process if DB connection fails
  }
}

// Ensure database is connected before starting the server
connectToDatabase().then(() => {
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

  // Update a booking
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
      console.error('Error updating booking:', err);
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
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
