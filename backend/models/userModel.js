const mongoose = require('mongoose')

const goalSchema = mongoose.Schema(
  {
    startDate: Date,
    endDate: Date,
    startWeight: Number,
    startBodyFat: Number,
    targetWeight: Number,
    targetBodyFat: Number,
    dietMode: String,
    dietSpeed: Number,
    thisPlanTargetWeight: Number,
    thisPlanAcheiveDate: Date,
    reasonForDiet: String,
    rewardAfterDiet: String,
  },
  {
    timestamps: true,
  }
)

const weightLogSchema = mongoose.Schema(
  {
    date: Date,
    weight: Number,
    logged: Boolean,
  },
  {
    timestamps: true,
  }
)

const habitSchema = mongoose.Schema(
  {
    date: Date,
    weigh: String,
    exercise: Boolean,
    diet: Boolean,
  },
  {
    timestamps: true,
  }
)

const pointSchema = mongoose.Schema(
  {
    date: Date,
    point: Number,
    type: String,
    description: String,
  },
  {
    timestamps: true,
  }
)

const userSchema = mongoose.Schema(
  {
    active: Boolean,
    phoneNumber: String,
    name: String,
    gender: String,
    birthday: Date,
    height: Number,
    point: Number,
    goals: { default: [], type: [goalSchema] },
    weightLogs: { default: [], type: [weightLogSchema] },
    habitLogs: { delfault: [], type: [habitSchema] },
    pointLogs: { delfault: [], type: [pointSchema] },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
