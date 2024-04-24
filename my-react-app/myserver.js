// const express = require('express')
// const app = express()
// const port = 3000

// const mysql = require("mysql2");

// const pool = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password: "",//Insert your password here
//     connectionLimit: 10
// })

// pool.query(`select * from studysync.user`, (err, res)=>{
//     return console.log(res)
// })



// app.get('/', (req, res) => res.send('Hello World!'))
// app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Insert your password here
    database: 'studysync', // Your database name
    connectionLimit: 10
});

// Route to add calendar events to the database
app.post('/api/add-event', (req, res) => {
    const eventData = req.body;
    console.log('Received event data:', eventData);

    if (eventData) {
        res.status(200).json({ message: 'Event data received!' });

        // Add event to database
        // pool.query('INSERT INTO events (title, dateTime) VALUES (?, ?)', [eventData.title, eventData.dateTime], (err, results) => {
        //     if (err) {
        //         console.error('Error inserting event:', err);
        //         return res.status(500).json({ error: 'Failed to add event to database' });
        //     }
    
        //     console.log('Event added to database:', results.insertId);
        //     res.status(201).json({ message: 'Event added successfully', eventId: results.insertId });
        // });
    } else {
        res.status(400).json({ error: 'Event data not received or invalid' });
    }
});

// Default route
app.get('/', (req, res) => res.send('Hello World!'));

// Start the server
app.listen(port, () => console.log(`Calendar app listening on port ${port}!`));
