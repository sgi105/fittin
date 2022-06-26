const formatDateToString = (dateObject) => {
  var dd = String(dateObject.getDate()).padStart(2, '0')
  var mm = String(dateObject.getMonth() + 1).padStart(2, '0') //January is 0!
  var yyyy = dateObject.getFullYear()

  let date = yyyy + '-' + mm + '-' + dd
  return date
}

export default formatDateToString
