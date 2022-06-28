const getDaysBetweenDates = (day1, day2) => {
  const dayInMilliSeconds = 24 * 60 * 60 * 1000

  const diff = Math.abs(day1.getTime() - day2.getTime())

  const days = Math.round(diff / dayInMilliSeconds)

  return days
}

export default getDaysBetweenDates
