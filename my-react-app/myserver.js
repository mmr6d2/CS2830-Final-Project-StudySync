const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const { Form } = require('react-router-dom');
const bcrypt = require("bcryptjs");
const jwt = require("jwt-simple");



// For encoding/decoding JWT
const secret = "randomStuffNoOneWillGuess";//No need to change since we aren't actually hosting

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


// Route to fetch all events from the database
app.get('/api/events', (req, res) => {
    // Query to select all events from the database
    const sql = "SELECT * FROM task";
    // Execute the query
    pool.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching events:', err);
            res.status(500).json({ error: 'Failed to fetch events' });
        } else {
            // Send the fetched events as JSON response
            res.status(200).json(result);
        }
    });
});


// Route to add calendar events to the database
app.post('/api/add-event', (req, res) => {
    const eventData = req.body;//Gets the JSON body
    console.log('Received event data:', eventData);

    if (eventData) {
        var {title, dateTime} = eventData;//Parses the JSON sent to the function
        var FormattedDate = new Date(dateTime).toISOString().slice(0, 19).replace('T', ' ')//Sets the date in SQL Format by slicing it

        // Add event to database
        var sql = "INSERT INTO task (taskTitle, userID, dateTime) VALUES ('"+title+"', '123', '"+FormattedDate+"')";//The SQL Insert statement, Note 123 is a current placeholder
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


app.post('/api/register', (req, res) => {
    const eventData = req.body;
    if(eventData){//Makes sure there is event data
        const { email, password, username} = eventData;//Gets the values
        const hash = bcrypt.hashSync(password, 10);//Encrypts the password
        const sql1 = "INSERT INTO user (email, userName) VALUES ('"+email+"', '"+username+"')";  //Makes new user
        pool.query(sql1, function (err, result){
            if (err) {
                console.error('Error during registration:', err);
                res.status(500).json({ error: 'Registration failed' });
            } else {
                const sql2 = "Select * From user Where email = '" + email +"'";//Gets new users userID
                pool.query(sql2, function (err2, result2){
                    if (err2) {//Should never be able to run into this error. But here just in case. This will make the email unusable until deleted
                        console.error('Error during registration:', err2);
                        res.status(500).json({ error: 'Registration failed' });
                    }
                    else
                    {
                        const userID = result2[0].userID;
                        console.log(result2);
                        const sql3 = "INSERT INTO userpassword (userID, hashedPassword) VALUES ('"+userID+"', '"+hash+"')";
                        pool.query(sql3, function (err3, result3){//Inserts the userID and Password into the table
                            if(err3)
                            {
                                console.error("Error during registration:", err3);
                                res.status(500).json({ error: 'Registration failed' });
                            }
                            else
                            {
                                console.log("Logged in user: " + userID);
                                const token = jwt.encode({ userID: userID }, secret);//Sets a token to put on the users browser
                                res.status(201).json({ token: token });
                            }
                        });
                    }
                });
            }
        });
    }
    else{
        res.status(400).json({ error: 'Data not recieved' })
    }
  });


  // Route to login a user
  app.post('/api/login', (req, res) => {
    const eventData = req.body;
    if(eventData)
    {
        const { email, password } = req.body;
        const sql = "SELECT * FROM user WHERE email = '" + email + "'";  
        console.log("1");
        pool.query(sql, function (err, result){//Querys to add the values in
            console.log("2");
            if (err)//If SQL gives an error
            {
                console.error('Error logging in:', err);//Print the error to the console
                res.status(500).json({ error: 'Failed to find user' });//Inform the website it failed to add
            }
            else//If successful
            {
                const userID = result[0].userID;
                const sql2 = "SELECT * FROM userpassword WHERE userID = '" + userID + "'";
                console.log("3");
                pool.query(sql2, function (err2, result2){
                    if(err2){
                        console.error('Error retrieving password:', err2);
                        res.status(500).json({ error: 'Failed to find passowrd'});
                    }
                    else{
                        if(!bcrypt.compareSync(password, result2[0].hashedPassword)){
                            console.error('Incorrect password given');
                            res.status(500).json({ error: 'Incorrect password'});
                        }
                        else{
                            const token = jwt.encode({ userID: userID }, secret);//Sets a token to put on the users browser
                            res.status(201).json({ token: token});
                        }
                    }
                });
            }
        });   
    }
    else{
        res.status(500).json({ error: 'No data sent'});
    }
  });

// Default route
app.get('/', (req, res) => res.send('Hello World!'));

// Start the server
app.listen(port, () => console.log(`Calendar app listening on port ${port}!`));
