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

const weightSchema = mongoose.Schema(
  {
    date: Date,
    weight: Number,
  },
  {
    timestamps: true,
  }
)

const userSchema = mongoose.Schema(
  {
    phoneNumber: String,
    name: String,
    gender: String,
    birthday: Date,
    height: Number,
    goals: [goalSchema],
    weights: [weightSchema],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
