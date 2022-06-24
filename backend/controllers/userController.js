const asyncHandler = require('express-async-handler')
const { use } = require('express/lib/application')
const User = require('../models/userModel')
const getDaysBetweenDates = require('../utils')

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
    goals: [],
    weights: [],
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

// @desc 새로운 러닝 정보 입력하고 streak, totalDistance 받기
// @route POST /users
const logRun = asyncHandler(async (req, res) => {
  let { number, distance, timeInSeconds, timezoneOffset } = req.body

  if (!(number && distance && timeInSeconds))
    return res.status(200).json({
      status: 400,
      message: 'Please provide number, distance, and time',
    })

  // 유저 정보 불러오기
  let user = await User.findOne({ number })

  // 유저 없으면 새로 생성
  if (!user) user = await User.create({ number, totalDistance: 0, streak: 0 })

  // 이번 run 정보 업데이트하기
  const now = new Date() // UTC

  console.log(now, 'server time')
  console.log(timezoneOffset)
  const timeInUserTimezone = new Date(now.getTime() - timezoneOffset * 60000)

  console.log(timeInUserTimezone, 'timeInUserTimezone')

  // getFullYear, Month, Date는 서버의 local time으로 환산해서 값을 준다. 그래서 여기서 쓰면 안됨.
  // UTC 시간으로 String으로 변환해준다음에 slice로 날짜까지만 자른다.
  dateInUserTimeZone = timeInUserTimezone.toUTCString().slice(0, 16)

  console.log(dateInUserTimeZone, 'dateInUserTimeZone')

  // console.log(timeInUserTimezone.setHours(0, 0, 0, 0))

  // 날짜를 다시 new Date에 넣으면 UTC로 형성된다. (-9시간)
  const dateInUTC = new Date(dateInUserTimeZone)

  // const dateInUTC = new Date(
  //   new Date(dateInUserTimeZone).getTime() + timezoneOffset * 60000
  // )

  console.log(dateInUTC, 'dateInUTC')

  const timezone =
    timezoneOffset > 0
      ? 'GMT-' +
        String(Math.abs(timezoneOffset / 60))
          .padStart(2, '0')
          .padEnd(4, '0')
      : 'GMT+' +
        String(Math.abs(timezoneOffset / 60))
          .padStart(2, '0')
          .padEnd(4, '0')
  console.log(timezone, 'usertimezone')

  const newRun = {
    time: new Date(), // in UTC
    date: dateInUTC, // in UTC. Korea is GMT + 9(9 hours ahead)
    distance,
    timeInSeconds,
    timezone,
    dateInUserTimeZone,
  }

  if (user.runs.length !== 0) {
    // 오늘 이미 기록했는지 확인
    const lastRunDate = new Date(
      user.runs[user.runs.length - 1].date
    ).toDateString()
    if (dateInUTC.toDateString() === lastRunDate) {
      // 가장 최근 거 삭제
      user.runs.pop()
    }
  }

  user.runs.push(newRun)

  // new Streak 계산
  let newStreak = 1

  if (user.runs.length > 1) {
    // calculate streak and when you miss 2 days in a row, that's end of streak.
    for (let i = user.runs.length - 1; i >= 1; i--) {
      // console.log(user.runs[i].date)

      let days = getDaysBetweenDates(user.runs[i].date, user.runs[i - 1].date)

      if (days > 2) break
      else if (days > 0 && days <= 2) {
        newStreak++
        console.log('streak added', newStreak)
      }
    }
  }

  // new total distance
  const newTotalDistance = user.runs.reduce((acc, elem) => {
    return acc + elem.distance
  }, 0)

  // 저장
  // round to 2 decimal places
  user.totalDistance =
    Math.round((newTotalDistance + Number.EPSILON) * 100) / 100
  user.streak = newStreak
  const result = await user.save()

  // response
  return res.status(200).json({
    status: 200,
    data: result,
  })
})

module.exports = { logRun, createUser, getUser, updateUser }
