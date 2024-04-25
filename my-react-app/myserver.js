const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const { Form } = require('react-router-dom');


const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());
//MySQL Connection Pool
const pool = mysql.createPool({
     host: "localhost",
     user: "root",//Your User ID here
     password: "",//Insert your password here
     database: 'studysync',//Your Database name
     connectionLimit : 10
 });

// pool.query(`select * from studysync.user`, (err, res)=>{
//     return console.log(res)
// })
//Above is a test query to make sure it works

// Route to add calendar events to the database
app.post('/api/add-event', (req, res) => {
    const eventData = req.body;//Gets the JSON body
    console.log('Received event data:', eventData);

    if (eventData) {
        var {title, dateTime} = eventData;//Parses the JSON sent to the function
        var FormattedDate = new Date(dateTime).toISOString().slice(0, 19).replace('T', ' ')//Sets the date in SQL Format by slicing it

        // Add event to database
        var sql = "INSERT INTO task (taskTitle, userID, date) VALUES ('"+title+"', '123', '"+FormattedDate+"')";//The SQL Insert statement, Note 123 is a current placeholder
        pool.query(sql, function (err, result){//Querys to add the values in
            if (err)//If SQL gives an error
            {
                console.error('Error inserting:', err);//Print the error to the console
                res.status(500).json({ error: 'Failed to add to database' });//Inform the website it failed to add
            }
            else//If successful
            {
                console.log("1 record inserted");//Print that it recorded the data
                res.status(201).json({ message: 'Data added successfully'});  //Send to the database a success along with event and insertID 
            }
        });
    } else {
        res.status(400).json({ error: 'Event data not received' });//Sets the response status to 400 so the website knows it data wasn't recieved
    }
});

// Default route
app.get('/', (req, res) => res.send('Hello World!'));

// Start the server
app.listen(port, () => console.log(`Calendar app listening on port ${port}!`));
