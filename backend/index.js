const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Buvana@652',
    database: 'user_registration',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

const formatDate = (dob) => {
    const date = new Date(dob);
    return date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
};

// Route to register a student
app.post("/register", (req, res) => {
    const { firstName, lastName, email, dob, rollNumber } = req.body;
    const formattedDob = formatDate(dob);

    console.log("Incoming data:", req.body);

    const query = 'INSERT INTO user (firstName, lastName, email, dob, rollNumber) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [firstName, lastName, email, formattedDob, rollNumber], (error, results) => {
        if (error) {
            console.error('Error inserting data:', error.message);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'User registered successfully!', userId: results.insertId });
    });
});

// Route to get all students
app.get("/users", (req, res) => {
    const query = 'SELECT * FROM user';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching data:', error.message);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
});

// Route to delete a student by ID
app.delete("/delete/:id", (req, res) => {
    const studentId = req.params.id;
    const query = 'DELETE FROM user WHERE id = ?';

    db.query(query, [studentId], (error, results) => {
        if (error) {
            console.error('Error deleting data:', error.message);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'Student deleted successfully!' });
    });
});

// Route to update student details
app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, dob, rollNumber } = req.body;

    // Check for required fields
    if (!firstName || !lastName || !email || !dob || !rollNumber) {
        return res.status(400).send({ message: 'Missing fields in the request body' });
    }

    // Format the date
    const formattedDob = formatDate(dob);

    const sql = 'UPDATE user SET firstName = ?, lastName = ?, email = ?, dob = ?, rollNumber = ? WHERE id = ?';

    db.query(sql, [firstName, lastName, email, formattedDob, rollNumber, id], (err, result) => {
        if (err) {
            console.error('Error updating student:', err.message, err.stack);
            return res.status(500).send({ message: 'Error updating student data' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Student not found' });
        }

        return res.status(200).send({ message: 'Student data updated successfully' });
    });
});


// Start the server
app.listen(5001, () => {
    console.log("Server started on port 5001...");
});
