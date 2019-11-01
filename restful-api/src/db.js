const mysql = require('mysql')

// ---------- Constant variable ----------
const hostname = '10.0.20.10'
const port = '3306'
const user = 'root'
const password = 'password'
const database = 'DB_AI_XO_PROJECT'

// ---------- local mysql db connection ----------
const connection = mysql.createConnection({
    host : hostname,
    port : port,
    user : user,
    password : password,
    database : database
})

connection.connect(function(err) {
    if (err) throw err
    console.log('Connected to db successfully!')
})
module.exports = connection

// const pool = mysql.createPool({
//     host : hostname,
//     host : port,
//     user : user,
//     password: password,
//     database : database,

//     connectionLimit: 2, // Default value is 10.
//     waitForConnections: true, // Default value.
//     queueLimit: 0 // Unlimited - default value.
// });
// module.exports = pool