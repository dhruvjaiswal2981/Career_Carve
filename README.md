# 1x1 Scheduler

## Description

1x1 Scheduler is a web application that allows students to book one-on-one sessions with mentors. The application features a booking form, editing and deleting functionalities for bookings, and the ability to view all bookings. The backend is built with Node.js and Express, while the frontend is developed using React.

## Features

- Schedule one-on-one sessions with mentors.
- Edit and delete bookings.
- View all bookings.
- Fetch and display mentor information.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js with Express
- **Database:** MySQL

## Setup Instructions

### Prerequisites

1. **Node.js**: Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
2. **MySQL**: Ensure you have MySQL installed and running. You can download it from [mysql.com](https://www.mysql.com/).

### Backend Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/dhruvjaiswal2981/career-carve.git
    cd your-repo
    ```

2. Install backend dependencies:

    ```bash
    cd backend
    npm install
    ```

3. Configure the database connection:

    - Open `backend/server.js` and update the MySQL connection details:
      ```javascript
      const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'your-password', // Replace with your MySQL password
        database: 'career_carve', // Replace with your database name
      });
      ```

4. Start the backend server:

    ```bash
    npm start
    ```

### Frontend Setup

1. Navigate to the frontend directory:

    ```bash
    cd ../frontend
    ```

2. Install frontend dependencies:

    ```bash
    npm install
    ```

3. Configure API endpoints:

    - Open `frontend/src/App.js` and update the API endpoints if necessary:
      ```javascript
      axios.get('http://localhost:5000/mentors')
      axios.post('http://localhost:5000/bookings', { ... })
      axios.get('http://localhost:5000/bookings')
      ```

4. Start the React development server:

    ```bash
    npm start
    ```

## API Endpoints

- **GET** `/mentors` - Retrieve all mentors
- **POST** `/bookings` - Create a new booking
- **GET** `/bookings` - Retrieve all bookings
- **GET** `/bookings/:studentName` - Retrieve bookings for a specific student
- **PUT** `/bookings/:id` - Update a booking
- **DELETE** `/bookings/:id` - Delete a booking

## Database Schema

**mentors Table:**
- `id` (INT, Primary Key, Auto Increment)
- `name` (VARCHAR(255))
- `areas_of_expertise` (VARCHAR(255))
- `is_premium` (TINYINT(1), Default: 0)

**bookings Table:**
- `id` (INT, Primary Key, Auto Increment)
- `student_name` (VARCHAR(255))
- `mentor_id` (INT, Foreign Key)
- `area_of_interest` (VARCHAR(255))
- `duration` (INT)
- `booking_date` (DATE)
- `booking_time` (TIME)

## Usage

1. Start the backend server.
2. Start the React frontend application.
3. Open your browser and navigate to `http://localhost:3000` to use the application.

## Troubleshooting

- Ensure MySQL is running and accessible.
- Verify API endpoints are correctly configured.
- Check console logs for error messages if something isn't working as expected.


