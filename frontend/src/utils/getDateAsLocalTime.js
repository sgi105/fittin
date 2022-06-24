const getDateAsLocalTime = (date) => {
  const onlyDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  const timezoneOffset = new Date().getTimezoneOffset()
  const newDate = new Date(onlyDate.getTime() - timezoneOffset * 60000)

  return newDate
}

export default getDateAsLocalTime
