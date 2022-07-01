const getDaysBetweenDates = (day1, day2) => {
  const dayInMilliSeconds = 24 * 60 * 60 * 1000

  const diff = Math.abs(day1.getTime() - day2.getTime())

  const days = Math.floor(diff / dayInMilliSeconds)

  return days
}

const formatDateToString = (dateObject) => {
  var dd = String(new Date(dateObject).getDate()).padStart(2, '0')
  var mm = String(new Date(dateObject).getMonth() + 1).padStart(2, '0') //January is 0!
  var yyyy = new Date(dateObject).getFullYear()

  let date = yyyy + '-' + mm + '-' + dd
  return date
}

function upsertArrayByDate(arrayToUpdate, newElement) {
  // look for an elem with the same date
  const i = arrayToUpdate.findIndex(
    (element) =>
      formatDateToString(element.date) === formatDateToString(newElement.date)
  )
  // if the newElement's date is found, update it
  if (i > -1) arrayToUpdate[i] = newElement
  // else insert new element
  else arrayToUpdate.push(newElement)
}

function upsertPointsArrayByDateAndDescription(pointsLogArray, newPointLog) {
  // look for an elem with the same date
  const i = pointsLogArray.findIndex(
    (element) =>
      formatDateToString(element.date) ===
        formatDateToString(newPointLog.date) &&
      element.type === newPointLog.type
  )
  // if the newElement's date is found, update it
  if (i > -1) pointsLogArray[i] = newPointLog
  // else insert new element
  else pointsLogArray.push(newPointLog)
}

function removeTime(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

const getUserTimezoneTodayInUTC = (timezoneOffset) => {
  // make UTC to be the same hour as user timezone
  // why? when manipulating time in server, you need to use UTC in order to get rid of server timezone dependecies.
  const currentTimeInUserTimezone =
    new Date().getTime() - timezoneOffset * 1000 * 60

  // console.log(new Date(currentTimeInUserTimezone))

  let UserTimezoneTodayInUTC = new Date(currentTimeInUserTimezone)
  console.log(UserTimezoneTodayInUTC)

  // set time to start of the day
  UserTimezoneTodayInUTC = new Date(UserTimezoneTodayInUTC.setUTCHours(0))
  UserTimezoneTodayInUTC = new Date(UserTimezoneTodayInUTC.setUTCMinutes(0))
  UserTimezoneTodayInUTC = new Date(UserTimezoneTodayInUTC.setUTCSeconds(0))
  UserTimezoneTodayInUTC = new Date(
    UserTimezoneTodayInUTC.setUTCMilliseconds(0)
  )
  console.log(UserTimezoneTodayInUTC)

  // add back the timezoneoffset to convert to actual UTC
  UserTimezoneTodayInUTC = new Date(
    UserTimezoneTodayInUTC.getTime() + timezoneOffset * 1000 * 60
  )

  return UserTimezoneTodayInUTC
}

module.exports = {
  getDaysBetweenDates,
  formatDateToString,
  upsertArrayByDate,
  removeTime,
  getUserTimezoneTodayInUTC,
  upsertPointsArrayByDateAndDescription,
}
