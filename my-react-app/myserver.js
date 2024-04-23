const express = require('express')
const app = express()
const port = 3000

const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",//Insert your password here
    connectionLimit: 10
})

pool.query(`select * from studysync.user`, (err, res)=>{
    return console.log(res)
})



app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))