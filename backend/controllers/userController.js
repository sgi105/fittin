const asyncHandler = require('express-async-handler')
const { use } = require('express/lib/application')
const User = require('../models/userModel')
const {
  getDaysBetweenDates,
  formatDateToString,
  upsertArrayByDate,
  removeTime,
  getUserTimezoneTodayInUTC,
  upsertPointsArrayByDateAndDescription,
} = require('../utils')

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
  let { phoneNumber, timezoneOffset } = req.body
  console.log(phoneNumber, timezoneOffset)

  // find user
  const user = await User.findOne({ phoneNumber })
  if (!user) {
    return res.status(200).json({
      status: 404,
      message: 'No user found',
    })
  } else {
    // update habit status -> don't do it. It overlaps with habit update, and is prone to double generating error.

    // 나중에 로딩을 추가해서 이 에러를 없앨 수 있겠다.

    // console.log(user.habitLogs, 'before')

    // const result = await addNewHabitGenerateFailedHabitsAndUpdatePoints(
    //   user,
    //   null,
    //   timezoneOffset
    // )
    // console.log(result.habitLogs, 'after')

    // calculate new point
    user.point = user.pointLogs.reduce((acc, elem) => {
      // if it becomes less than zero, set it to zero.
      let sum = acc + elem.point
      return sum >= 0 ? sum : 0
    }, 0)

    await user.save()

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
  let { newWeights, phoneNumber, newHabitLog, timezoneOffset } = req.body

  // invalid input
  if (!(newWeights[0].date && newWeights[0].weight && phoneNumber))
    return res.status(200).json({
      status: 400,
      message: 'Please provide date, weight, and number',
    })

  // 유저 정보 불러오기
  let user = await User.findOne({ phoneNumber })

  // newWeights array 돌면서 이미 있는 값인지 확인하고, 없으면 새로 추가하기.
  newWeights.forEach((newWeight) => {
    upsertArrayByDate(user.weightLogs, newWeight)
  })

  // generateFailedHabitsAndSaveAndUpdatePoints(user, newHabitLog, timezoneOffset)

  // 가장 최근 Habit 다음 날 ~ 어제까지 비어있는 값들 fail habits로 업데이트
  const result = await addNewHabitGenerateFailedHabitsAndUpdatePoints(
    user,
    newHabitLog,
    timezoneOffset
  )

  // response
  return res.status(200).json({
    status: 200,
    data: result,
  })

  // 나중에 할 것

  // 건너 뛴 기록들 자동으로 다 채우기

  // 몸무게 기록 추가

  // 건너 뛴 기록들 추정값 업데이트

  // 가장 최근 몸무게 날짜와 기록한 날짜 사이에 있는 값들 중 logged=false 인 것들 업데이트하기
})

const getTotalHabitScoreBoard = asyncHandler(async (req, res) => {
  const result = await User.count()

  // response
  return res.status(200).json({
    status: 200,
    data: result,
  })
})

const autoUpdateHabits = asyncHandler(async (req, res) => {
  let UTCHour = req.params.UTCHour
  console.log(UTCHour)
  console.log('auto updated!')

  // get all users

  const users = await User.find()

  // console.log(users)

  users.forEach(async (user) => {
    console.log(user.name)

    // calculate timezoneOffset from current time
    let timezoneOffset = (UTCHour - 24) * 60

    const result = await addNewHabitGenerateFailedHabitsAndUpdatePoints(
      user,
      null,
      timezoneOffset
    )

    console.log(user.habitLogs, 'new array')
  })

  // 그리고 현재 포인트 업데이트 한다. (-5)

  // response
  return res.status(200).json({
    status: 200,
    data: result,
  })
})

// util 목적으로 코드 쓸 때 여기다가 실행시킬 함수를 가져오자.

const runUtil = asyncHandler(async (req, res) => {
  await updateHabitsAndPointsByWeightLog(req, res)
})

// ======== UTILS ==========
const updateHabitsAndPointsByWeightLog = async (req, res) => {
  // get all users
  const users = await User.find({})

  // loop through users

  users.forEach(async (user) => {
    // loop through weight logs
    user.weightLogs.forEach((weightLog) => {
      // for each weight log, add a habitLog with the same date
      let newHabitLog = {
        date: new Date(weightLog.date),
        weigh: weightLog.logged ? 'good' : '',
        exercise: false,
        diet: false,
      }

      // update habitLog
      upsertArrayByDate(user.habitLogs, newHabitLog)

      // update point log
      addPointLogsWhenNewHabitLogIsAdded(user.pointLogs, newHabitLog)
    })

    await user.save()
  })

  res.status(200).json({
    status: 200,
    data: users,
  })
}

const addNewHabitGenerateFailedHabitsAndUpdatePoints = async (
  user,
  newHabitLog,
  timezoneOffset
) => {
  // 새로운 Habit 추가
  let newHabits = []

  // habit 처음인지 확인
  if (user.habitLogs.length > 0) {
    // 마지막 habit 날짜 확인
    const lastHabitDate = new Date(
      user.habitLogs[user.habitLogs.length - 1].date
    )

    console.log(timezoneOffset, typeof timezoneOffset)

    // 어제 날짜 확인
    const oneDayInMiliseconds = 24 * 60 * 60 * 1000
    const today = getUserTimezoneTodayInUTC(timezoneOffset)

    const yesterday = new Date(today.getTime() - oneDayInMiliseconds)

    const dayAfterLastHabitDate = new Date(
      lastHabitDate.getTime() + oneDayInMiliseconds
    )

    // 그 마지막 habit날 +1 ~ 어제까지 newHabits fail한 것 만들기
    for (
      let date = dayAfterLastHabitDate.getTime();
      date <= yesterday.getTime();
      date += oneDayInMiliseconds
    ) {
      newHabits.push({
        date: new Date(date),
        weigh: '',
        diet: false,
        exercise: false,
      })
    }
  }

  // 마지막으로 가장 최근 habit 추가하기
  if (newHabitLog) {
    newHabits.push(newHabitLog)
  }

  // newHabits array 전체 저장하기
  newHabits.forEach((newHabit) => {
    upsertArrayByDate(user.habitLogs, newHabit)

    // add point logs
    addPointLogsWhenNewHabitLogIsAdded(user.pointLogs, newHabit)
  })

  // calculate new point
  user.point = user.pointLogs.reduce((acc, elem) => {
    // if it becomes less than zero, set it to zero.
    let sum = acc + elem.point
    return sum >= 0 ? sum : 0
  }, 0)

  // 업데이트 된 유저 정보 저장
  return await user.save()
}

const addPointLogsWhenNewHabitLogIsAdded = (pointLogs, newHabit) => {
  if (!newHabit.weigh) {
    upsertPointsArrayByDateAndDescription(pointLogs, {
      date: new Date(newHabit.date),
      point: -5,
      type: 'weigh habit',
      description: 'weigh habit failed',
    })
  } else {
    upsertPointsArrayByDateAndDescription(pointLogs, {
      date: new Date(newHabit.date),
      point: 2,
      type: 'weigh habit',
      description: 'weigh habit success',
    })
  }

  if (newHabit.exercise === true)
    upsertPointsArrayByDateAndDescription(pointLogs, {
      date: new Date(newHabit.date),
      point: 1,
      type: 'exercise habit',
      description: 'exercise habit success',
    })
  if (newHabit.diet === true)
    upsertPointsArrayByDateAndDescription(pointLogs, {
      date: new Date(newHabit.date),
      point: 1,
      type: 'diet habit',
      description: 'diet habit success',
    })
}

module.exports = {
  logWeight,
  createUser,
  getUser,
  updateUser,
  runUtil,
  getTotalHabitScoreBoard,
  autoUpdateHabits,
}
