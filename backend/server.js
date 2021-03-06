const path = require('path')
const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware.js')
const PORT = process.env.PORT || 5000

var http = require('http')

// ping the site so that it doesn't go down(heroku shuts it down when there is no ping)
setInterval(function () {
  http.get('http://fittin.herokuapp.com')
  console.log('ping')
}, 300000) // every 5 minutes (300000)

const fireEverydayOnTime = (UTCHour = 15) => {
  setInterval(() => {
    const now = new Date()
    // console.log(now.getUTCHours(), now.getMinutes())

    if (now.getMinutes() === 0 && now.getUTCHours() === UTCHour) {
      // fires everyday on UTCHour : Korea = 15
      // copy later
      const baseURL =
        process.env.NODE_ENV === 'production'
          ? 'http://fittin.herokuapp.com'
          : 'http://localhost:8000'
      http.get(baseURL + `/api/users/autoupdatehabits/${UTCHour}`)
    }
  }, 60000)
}

fireEverydayOnTime(15)
// http.get('http://localhost:8000/api/users/01042403121')

// Connect to database
const connectDB = require('./config/db')
connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.use('/api', require('./routes/index'))
app.use('/api/users', require('./routes/users'))

// Serve Frontend
if (process.env.NODE_ENV === 'production') {
  console.log('yup')
  // Set build folder as static
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  // FIX: below code fixes app crashing on refresh in deployment
  app.get('*', (_, res) => {
    console.log('djdjdj')
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the FITTIN' })
  })
}

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
