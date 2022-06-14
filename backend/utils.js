const getDaysBetweenDates = (day1, day2) => {
  const dayInMilliSeconds = 24 * 60 * 60 * 1000

  const diff = Math.abs(day1.getTime() - day2.getTime())

  const days = Math.floor(diff / dayInMilliSeconds)

  return days
}

module.exports = getDaysBetweenDates
