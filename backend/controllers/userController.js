const asyncHandler = require('express-async-handler')
const { use } = require('express/lib/application')
const User = require('../models/userModel')
const { getDaysBetweenDates, formatDateToString } = require('../utils')

const createUser = asyncHandler(async (req, res) => {
  const { phoneNumber, name, gender, birthday, height } = req.body

  if (!(phoneNumber && name && gender && birthday && height))
    return res.status(200).json({
      status: 400,
      message: 'Please provide phoneNumber, name, birthday and height',
    })

  // 이미 같은 번호로 있으면 에러
  const duplicatePhoneNumber = await User.findOne({ phoneNumber })
  if (duplicatePhoneNumber)
    return res.status(200).json({
      status: 400,
      message: 'You are already registered',
    })

  const result = await User.create({
    phoneNumber,
    name,
    gender,
    birthday,
    height,
  })

  // response
  return res.status(200).json({
    status: 200,
    data: result,
  })
})

// @desc get user data
// @route GET /user/:number
const getUser = asyncHandler(async (req, res) => {
  let phoneNumber = req.params.phoneNumber
  console.log(phoneNumber)

  // find user
  const user = await User.findOne({ phoneNumber })

  if (!user) {
    return res.status(200).json({
      status: 404,
      message: 'No user found',
    })
  } else {
    return res.status(200).json({
      status: 200,
      data: user,
    })
  }
})

// Goal 저장
const updateUser = asyncHandler(async (req, res) => {
  const { goal, phoneNumber } = req.body
  const {
    startDate,
    endDate,
    startWeight,
    startBodyFat,
    targetWeight,
    targetBodyFat,
    dietMode,
    dietSpeed,
    thisPlanTargetWeight,
    thisPlanAchieveDate,
    reasonForDiet,
    rewardAfterDiet,
  } = goal

  if (
    !(
      startDate &&
      endDate &&
      startWeight &&
      startBodyFat &&
      targetWeight &&
      (targetBodyFat || dietMode === 'gain') &&
      dietMode &&
      dietSpeed &&
      thisPlanTargetWeight &&
      thisPlanAchieveDate &&
      reasonForDiet &&
      rewardAfterDiet
    )
  )
    return res.status(200).json({
      status: 400,
      message: 'Please provide all the information',
    })

  const user = await User.findOne({ phoneNumber })

  if (!user)
    return res.status(200).json({
      status: 404,
      message: 'User not found',
    })
  user.goals[0] = goal
  const result = await user.save()

  // response
  return res.status(200).json({
    status: 200,
    data: result,
  })
})

// @desc 새로운 체중 정보 입력하기
// @route POST /users
const logWeight = asyncHandler(async (req, res) => {
  // takes in array of new weights
  let { newWeights, phoneNumber } = req.body

  // invalid input
  if (!(newWeights[0].date && newWeights[0].weight && phoneNumber))
    return res.status(200).json({
      status: 400,
      message: 'Please provide date, weight, and number',
    })

  // 유저 정보 불러오기
  let user = await User.findOne({ phoneNumber })

  // 일단 과거 기록 막자.

  // newWeights 마다 이미 있는 값인지 확인하고, 없으면 새로 추가하기. 근데 날짜 순서대로 추가해야한다. 그건 프론트에서 알아서 주나?

  console.log('user Found', user)
  console.log('newWeights', newWeights)

  newWeights.forEach((newWeight, index) => {
    console.log('here1')

    // 이미 있는 날짜인지 확인하기
    let updatedExistingValue = false

    user.weightLogs.forEach((weightLog, index) => {
      console.log('here2')

      if (
        formatDateToString(new Date(weightLog.date)) ===
        formatDateToString(new Date(newWeight.date))
      ) {
        console.log('same date found. Updating')
        user.weightLogs[index] = newWeight
        updatedExistingValue = true
      }
    })

    console.log(updatedExistingValue)

    // 새로운 몸무게면 추가
    if (!updatedExistingValue) {
      user.weightLogs.push(newWeight)
      console.log('inserting new data')
    }
  })

  let result = await user.save()

  // response
  return res.status(200).json({
    status: 200,
    data: result,
  })

  // 나중에 할 것

  // 가장 최근 몸무게 날짜 가져오기(정열되어있다고 가정)
  // if (user.weights.length > 0) {
  //   const lastWeight = user.weights[user.weights.length - 1]
  // }

  // 건너 뛴 기록들 자동으로 다 채우기

  // 몸무게 기록 추가

  // 건너 뛴 기록들 추정값 업데이트

  // 가장 최근 몸무게 날짜와 기록한 날짜 사이에 있는 값들 중 logged=false 인 것들 업데이트하기
})

const runUtil = asyncHandler(async (req, res) => {
  const result = await User.updateMany(
    {},
    { $rename: { weights: 'weightLogs' } }
  )
  // response
  return res.status(200).json({
    status: 200,
    data: result,
  })
})
module.exports = { logWeight, createUser, getUser, updateUser, runUtil }
