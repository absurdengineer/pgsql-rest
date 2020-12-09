const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const student = require('./routes/apis/student.api')
const { json } = require('express')

//* Application
const app = express()

//* Middlewares
app.use(morgan('combined', {
    stream: fs.createWriteStream('./access.log', {flags: 'a'})
}));

//* Settings
const PORT = (process.env.PORT || 3000)
app.use(json())

//* Routers
app.use("/api/students/",student)

//* App Listener
app.listen(PORT,() => {
    console.log(`Listening on PORT ${PORT} ...`)
    console.log(`Server Started http://127.0.0.1:${PORT}/`)
})