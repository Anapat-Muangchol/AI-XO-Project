const express = require('express')
const app = express()

// Constant variable
const port = 3000

app.listen(port, () => {
    console.log('Start server at port ' + port)
})

// import api path
const pattern = require('./path/pattern')
app.use('/pattern', pattern)

const pathToWin = require('./path/pathToWin')
app.use('/pathToWin', pathToWin)

