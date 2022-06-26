const getDaysBetweenDates = (day1, day2) => {
  const dayInMilliSeconds = 24 * 60 * 60 * 1000

  const diff = Math.abs(day1.getTime() - day2.getTime())

  const days = Math.floor(diff / dayInMilliSeconds)

  return days
}

const formatDateToString = (dateObject) => {
  var dd = String(dateObject.getDate()).padStart(2, '0')
  var mm = String(dateObject.getMonth() + 1).padStart(2, '0') //January is 0!
  var yyyy = dateObject.getFullYear()

  let date = yyyy + '-' + mm + '-' + dd
  return date
}

module.exports = {
  getDaysBetweenDates,
  formatDateToString,
}
