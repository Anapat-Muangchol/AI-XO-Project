const express = require('express')
const app = express()

// Constant variable
const port = 3000

app.listen(port, () => {
    console.log('Start server at port ' + port)
})

// import api path
const users = require('./path/users')
app.use('/users', users)
