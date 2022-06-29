// create a separate function for calculating averages
const getSimpleMovingAverageArray = (array, lookbackDays) => {
  // from each point in array, lookback as far as it could until it hits lookbackDays.

  const simpleAverageArray = array.map((elem, index, array) => {
    // when number of data < lookbackdays
    if (index + 1 < lookbackDays) {
      let sum = 0
      for (let i = 0; i <= index; i++) {
        sum = sum + array[i]
      }
      const simpleAverage = sum / (index + 1)
      return simpleAverage
    } else {
      // when number of data >= lookbackdays
      let sum = 0
      for (let i = index; i > index - lookbackDays; i--) {
        sum = sum + array[i]
      }
      const simpleAverage = sum / lookbackDays
      return simpleAverage
    }
  })

  return simpleAverageArray
}

const getEWMAArray = (array, smoothingConstant) => {
  // const lookbackdays = 1 / (1 - smoothingConstant)

  const EWMAArray = []
  const fixedEWMAArray = []

  array.forEach((elem, index) => {
    const correctingVariable = 1 / (1 - Math.pow(smoothingConstant, index + 1))

    let EWMA
    if (index === 0) {
      EWMA = (1 - smoothingConstant) * elem
    } else {
      EWMA =
        (1 - smoothingConstant) * elem +
        smoothingConstant * EWMAArray[EWMAArray.length - 1]
    }

    EWMAArray.push(EWMA)
    fixedEWMAArray.push(EWMA * correctingVariable)
  })

  return fixedEWMAArray

  // const EWMAArray = array.map((elem,index,arr) => {
  //   let sum = 0
  //   for(i = index ; (i > (index - lookbackdays)) && i >=0 ; i-- ){
  //     sum = sum + arr[i]
  //   }
  // })
}

function removeTime(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function getMonday(date) {
  date = new Date(date)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
  return removeTime(new Date(date.setDate(diff)))
}

const formatDateToString = (dateObject) => {
  var dd = String(dateObject.getDate()).padStart(2, '0')
  var mm = String(dateObject.getMonth() + 1).padStart(2, '0') //January is 0!
  var yyyy = dateObject.getFullYear()

  let date = yyyy + '-' + mm + '-' + dd
  return date
}

function isSameDay(date1, date2) {
  date1 = new Date(date1)
  date2 = new Date(date2)

  return formatDateToString(date1) === formatDateToString(date2)
}
export { getSimpleMovingAverageArray, getEWMAArray, getMonday, isSameDay }
