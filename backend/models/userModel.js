const mongoose = require('mongoose')

const runSchema = mongoose.Schema({
  time: Date,
  date: Date,
  distance: Number,
  timeInSeconds: Number,
  timezone: String,
  dateInUserTimeZone: String,
})

const userSchema = mongoose.Schema(
  {
    number: String,
    name: String,
    gender: String,
    totalDistance: Number,
    streak: Number,
    runs: [runSchema],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
