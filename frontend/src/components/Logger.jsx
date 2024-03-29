import {
  Button,
  Container,
  Stack,
  Typography,
  Snackbar,
  Box,
} from '@mui/material'
import React from 'react'
import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useNavigate } from 'react-router-dom'
import url from '../utils/urls'
import removeTime from '../utils/removeTime'
import {
  formatDateToString,
  isSameDay,
  getEWMAArray,
} from '../utils/utilFunctions'
import axios from 'axios'
import SimpleDialog from './SimpleDialog'
import getDaysBetweenDates from '../utils/getDaysBetweenDates'
import { getUserData } from '../apiCalls/getUserData'
// toggle button
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import colors from '../utils/colors'
const { weightGoodHabitColor } = colors

function Logger() {
  const navigate = useNavigate()

  // login data
  const [phoneNumber, setPhoneNumber] = useState('')

  // inputs
  const [date, setDate] = useState(removeTime(new Date()))
  const [weight, setWeight] = useState('')
  const [calorie, setCalorie] = useState('0')
  const [exerciseDuration, setExerciseDuration] = useState('0')
  const [challenge, setChallenge] = useState(null)
  const [habits, setHabits] = useState(() => [])

  // from db
  const [weights, setWeights] = useState([])
  const [habitLogs, setHabitLogs] = useState([])
  const [recentWeight, setRecentWeight] = useState({})
  const [isLogged, setIsLogged] = useState(false)
  const [user, setUser] = useState()

  // send to db

  // layout
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [weightInputBoxStyle, setWeightInputBoxStyle] = useState({
    border: '1px solid',
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderRadius: '4px',
    height: '300px',
  })
  const [openLoginSnackBar, setOpenLoginSnackBar] = useState(false)

  // set user login data from local storage. if not logged in go to login page
  useEffect(() => {
    const phoneNumber = JSON.parse(
      window.localStorage.getItem('USER_PHONE_NUMBER')
    )
    if (phoneNumber) setPhoneNumber(phoneNumber)
    else navigate('/')
  }, [])

  useEffect(() => {
    getUserData(phoneNumber, setUser)
  }, [phoneNumber])

  useEffect(() => {
    if (weight > 0 && calorie && exerciseDuration && challenge !== null)
      setShowButton(true)
    else setShowButton(false)
  }, [weight, calorie, exerciseDuration, challenge])

  useEffect(() => {
    loadSelectedDateWeight(weights)
    loadSelectedDateHabitLog(habitLogs)
  }, [date])

  useEffect(() => {
    if (user) {
      let weights = user.weightLogs
      setWeights(weights)

      // get the most recent weight data if available
      if (weights.length > 0) {
        let recentWeight = weights[weights.length - 1].weight
        let recentDate = weights[weights.length - 1].date
        setRecentWeight({
          weight: recentWeight,
          date: new Date(recentDate),
        })
        // get the current day's weight data if available
        loadSelectedDateWeight(weights)
      }

      // get the current date's habitLog and update the habit state
      const newHabitLogs = user.habitLogs
      setHabitLogs(newHabitLogs)
      if (user.habitLogs.length > 0) {
        const selectedDateHabitLog = loadSelectedDateHabitLog(newHabitLogs)
      }

      // open login success snackbar
      setOpenLoginSnackBar(true)
    }
  }, [user])

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenLoginSnackBar(false)
  }

  const action = (
    <Box>
      <IconButton
        size='small'
        aria-label='close'
        color='inherit'
        onClick={handleCloseSnackBar}
      >
        <CloseIcon fontSize='small' />
      </IconButton>
    </Box>
  )

  const handleHabits = (event, newHabits) => {
    setHabits(newHabits)
  }

  const handleChallenge = (event, newChallenge) => {
    setChallenge(newChallenge)
  }

  const loadSelectedDateHabitLog = (habitLogs) => {
    let selectedDateHabitLog = false

    habitLogs.forEach((habitLog) => {
      if (isSameDay(habitLog.date, date)) selectedDateHabitLog = habitLog
    })

    // if no match, set habits state to empty array
    if (!selectedDateHabitLog) setHabits([])

    // if there is match, update habits state array
    const newHabits = []
    if (selectedDateHabitLog?.exercise) newHabits.push('exercise')
    if (selectedDateHabitLog?.diet) newHabits.push('diet')
    if (selectedDateHabitLog?.calorie) setCalorie(selectedDateHabitLog.calorie)
    if (selectedDateHabitLog?.exerciseDuration)
      setExerciseDuration(selectedDateHabitLog.exerciseDuration)
    if (selectedDateHabitLog?.challenge !== null)
      setChallenge(selectedDateHabitLog.challenge)
    setHabits(newHabits)
  }

  const loadSelectedDateWeight = (weights) => {
    if (weights.length > 0) {
      for (let i = 0; i < weights.length; i++) {
        let elem = weights[i]
        if (
          formatDateToString(new Date(elem.date)) === formatDateToString(date)
        ) {
          if (elem.logged === true) {
            setIsLogged(true)
            setWeight(elem.weight.toFixed(1))
          } else {
            setIsLogged(false)
          }
          break
        } else {
          setIsLogged(false)

          setWeight('')
        }
      }
    }
  }

  const handleInputClick = () => {
    document.querySelector('#weight-input').focus()
    console.log(
      document.querySelector('#weight-input') === document.activeElement
    )
  }

  const handleWeightInput = (e) => {
    if (e.target.value.length < 6) setWeight(e.target.value)
  }

  const handleCalorieInput = (e) => {
    if (e.target.value.length < 6) setCalorie(e.target.value)
  }

  const handleExerciseDurationInput = (e) => {
    if (e.target.value.length < 4) setExerciseDuration(e.target.value)
  }

  const handleSubmit = async () => {
    // if value is already logged, open dialog
    if (isLogged) setIsDialogOpen(true)
    else {
      try {
        // send info to server
        await saveWeight()

        // go to results page
        navigate('/home/dashboard')
      } catch (err) {
        console.log(err)
      }
    }
  }

  const saveWeight = async () => {
    // if diff. between most recent date > 1, create an array of newWeights

    let timezoneOffset = new Date().getTimezoneOffset()

    let newWeights = []

    // if there is recent weight,
    if (recentWeight) {
      // check the diff between today and recent weight
      let diffInDays = getDaysBetweenDates(
        removeTime(date),
        removeTime(recentWeight.date)
      )

      console.log('diffindays', diffInDays)

      // if it is more than 1, push estimate values to the array

      if (diffInDays > 1) {
        let dayInMiliseconds = 1000 * 60 * 60 * 24
        let diffInWeight = weight - recentWeight.weight
        let estimateIncrementPerDay = diffInWeight / diffInDays

        for (let i = 1; i < diffInDays; i++) {
          let estimateWeight = {
            date: new Date(
              removeTime(recentWeight.date).getTime() + dayInMiliseconds * i
            ),
            weight: (recentWeight.weight + estimateIncrementPerDay * i).toFixed(
              1
            ),
            logged: false,
          }
          newWeights.push(estimateWeight)
        }
      }
    }
    newWeights.push({
      weight,
      date,
      logged: true,
    })

    // CALCULATE WEIGHT CHANGE SCORE : WIN / LOSS

    // extract only weight values
    const weightValues = weights.map((elem) => {
      return elem.weight
    })

    // push today's weight to weights Array
    weightValues.push(+weight)

    console.log(weightValues)

    // get EWMAArray and calculate weight score
    const EWMAArray = getEWMAArray(weightValues)
    console.log(EWMAArray)

    // calculate change rate/week : compare it to last week's EWMA
    let rate = null

    // only when there are more than 8 entries, you can calculate rate. until then, it is all good.
    if (EWMAArray.length >= 8) {
      rate =
        (EWMAArray[EWMAArray.length - 1] - EWMAArray[EWMAArray.length - 8]) /
        EWMAArray[EWMAArray.length - 8]
    }

    // check diet mode
    let dietMode = user.goals[0].dietMode

    // according to diet mode, get score

    let weightScore = 'good'
    if (rate !== null) {
      if (dietMode === 'gain') {
        const minimumRate = 0
        const goodRateLowerBound = 0.001
        const goodRateUpperBound = 0.005

        if (rate <= minimumRate) weightScore = 'bad'
        else if (rate > minimumRate && rate < goodRateLowerBound)
          weightScore = 'slow'
        else if (rate >= goodRateLowerBound && rate <= goodRateUpperBound)
          weightScore = 'good'
        else if (rate > goodRateUpperBound) weightScore = 'too fast'
      } else if (dietMode === 'lose') {
        const minimumRate = 0
        const goodRateLowerBound = -0.005
        const goodRateUpperBound = -0.01

        if (rate >= minimumRate) weightScore = 'bad'
        else if (rate < minimumRate && rate > goodRateLowerBound)
          weightScore = 'slow'
        else if (rate <= goodRateLowerBound && rate >= goodRateUpperBound)
          weightScore = 'good'
        else if (rate < goodRateUpperBound) weightScore = 'too fast'
      }
    }

    // when creating a newHabitLog, input the score to weigh

    const newHabitLog = {
      date: removeTime(new Date(date)),
      weigh: weightScore,
      exercise: habits.includes('exercise'),
      diet: habits.includes('diet'),
      calorie,
      exerciseDuration,
      challenge,
    }

    const res = await axios.post(
      url.logWeight,
      {
        phoneNumber,
        newWeights,
        newHabitLog,
        timezoneOffset,
      },
      {
        baseURL: '/',
      }
    )

    console.log(res)
  }
  // end of saveWeight()

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const handleDialogClose = async (e) => {
    setIsDialogOpen(false)
    if (e.target.value === 'yes') {
      saveWeight()
      navigate('/home/dashboard')
    }
  }

  return (
    <Container>
      <Stack mt={3} spacing={3}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            disabled
            label='Date'
            value={date}
            inputFormat={'yyyy-MM-dd'}
            mask={'____-__-__'}
            onChange={(newValue) => {
              setDate(newValue)
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <Stack
          spacing={2}
          justifyContent='center'
          alignItems='center'
          sx={{
            border: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.23)',
            borderRadius: '4px',
            // height: '300px',
            padding: '1em',
          }}
          // onClick={handleInputClick}
        >
          {recentWeight.weight && (
            <Typography variant='caption' color='gray'>
              Recent: {recentWeight.weight.toFixed(1)}KG (
              {formatDateToString(recentWeight.date)})
            </Typography>
          )}
          <Stack spacing={0.2} justifyContent='center' alignItems='center'>
            <Typography variant='caption' fontWeight='bold' mb={-1}>
              몸무게
            </Typography>
            <TextField
              // disabled
              id='weight-input'
              variant='standard'
              placeholder={recentWeight.weight?.toFixed(1) || '00.0'}
              type='number'
              value={weight}
              onChange={handleWeightInput}
              onKeyDown={handleKeyDown}
              inputProps={{ inputMode: 'decimal' }}
              sx={{
                input: { textAlign: 'center', fontSize: '2em' },
                width: 150,
              }}
            />
            <Typography color='gray'>KG</Typography>
          </Stack>
          <Stack spacing={0.2} justifyContent='center' alignItems='center'>
            <Typography variant='caption' fontWeight='bold' mb={-1}>
              칼로리
            </Typography>
            <TextField
              // disabled
              id='calorie-input'
              variant='standard'
              // placeholder={recentWeight.weight?.toFixed(1) || '00.0'}
              type='number'
              value={calorie}
              onChange={handleCalorieInput}
              onKeyDown={handleKeyDown}
              inputProps={{ inputMode: 'decimal' }}
              sx={{
                input: { textAlign: 'center', fontSize: '2em' },
                width: 150,
              }}
            />
            <Typography color='gray'>KCAL</Typography>
          </Stack>
          <Stack spacing={0.2} justifyContent='center' alignItems='center'>
            <Typography variant='caption' fontWeight='bold' mb={-1}>
              운동 시간
            </Typography>
            <TextField
              // disabled
              id='exerciseDuration-input'
              variant='standard'
              // placeholder={recentWeight.weight?.toFixed(1) || '00.0'}
              type='number'
              value={exerciseDuration}
              onChange={handleExerciseDurationInput}
              onKeyDown={handleKeyDown}
              inputProps={{ inputMode: 'decimal' }}
              sx={{
                input: { textAlign: 'center', fontSize: '2em' },
                width: 150,
              }}
            />
            <Typography color='gray'>MIN</Typography>
          </Stack>

          <Stack alignItems='center'>
            <Typography variant='caption' fontWeight='bold' mb={-2}>
              챌린지
            </Typography>
            <ToggleButtonGroup
              value={challenge}
              exclusive
              onChange={handleChallenge}
              aria-label='text formatting'
              sx={{
                pt: 3,
              }}
              pt='3'
            >
              <ToggleButton
                value={true}
                aria-label='bold'
                sx={{
                  '&.Mui-selected:hover, &.Mui-selected': {
                    backgroundColor: colors.exerciseButton,
                    border: '1px solid white',
                    color: 'white',
                    fontWeight: 'bold',
                  },
                  // '&.Mui-selected': {
                  //   backgroundColor: '#00CE00',
                  // },
                }}
              >
                YES 💪
              </ToggleButton>
              <ToggleButton
                value={false}
                aria-label='italic'
                sx={{
                  '&.Mui-selected:hover, &.Mui-selected': {
                    backgroundColor: colors.dietButton,
                    border: '1px solid white',
                    color: 'white',
                    fontWeight: 'bold',
                  },
                }}
              >
                NOO ❌
              </ToggleButton>
            </ToggleButtonGroup>
            <Typography color='gray' variant='caption'>
              오늘 인증했다면 체크
            </Typography>
          </Stack>
        </Stack>
        {showButton && (
          <Button onClick={handleSubmit} variant='contained'>
            Enter
          </Button>
        )}
        {/* <img src={gettingReadyImage} alt='getting ready' width={'100%'} /> */}
      </Stack>
      <SimpleDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        question='이미 기록이 있다. 덮어쓸것인가?'
        yesText='네'
        noText='취소'
      />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openLoginSnackBar}
        autoHideDuration={1000}
        onClose={handleCloseSnackBar}
        message={`Welcome, ${user?.name}`}
        action={action}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: weightGoodHabitColor,
            color: 'black',
          },
        }}
      />
    </Container>
  )
}

export default Logger
