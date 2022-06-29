import { Box, Button, Container, Stack, Typography, Paper } from '@mui/material'
import React from 'react'
import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useNavigate, Navigate } from 'react-router-dom'
import url from '../utils/urls'
import removeTime from '../utils/removeTime'
import formatDateToString from '../utils/formatDateToString'
import axios from 'axios'
import SimpleDialog from './SimpleDialog'
import getDaysBetweenDates from '../utils/getDaysBetweenDates'

const phoneNumber = JSON.parse(window.localStorage.getItem('USER_PHONE_NUMBER'))

function Logger() {
  const navigate = useNavigate()

  // inputs
  const [date, setDate] = useState(removeTime(new Date()))
  const [weight, setWeight] = useState('')

  // from db
  const [weights, setWeights] = useState([])
  const [recentWeight, setRecentWeight] = useState({})
  const [isLogged, setIsLogged] = useState(false)

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

  useEffect(() => {
    if (weight > 0) setShowButton(true)
    else setShowButton(false)
  }, [weight])

  useEffect(() => {
    loadSelectedDateWeight(weights)
  }, [date])

  useEffect(() => {
    getUserData()
  }, [])

  const getUserData = async () => {
    try {
      const res = await axios.get(url.users + `/${phoneNumber}`, {
        baseURL: '/',
      })

      if (res.data.status === 200) {
        let user = res.data.data
        console.log(user)
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
      }
    } catch (err) {
      console.log(err)
    }
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

    let newWeights = []

    // if there is recent weight,
    if (recentWeight) {
      // check the diff between today and recent weight
      let diffInDays = getDaysBetweenDates(
        removeTime(recentWeight.date),
        removeTime(date)
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

    const res = await axios.post(
      url.logWeight,
      {
        phoneNumber,
        newWeights,
      },
      {
        baseURL: '/',
      }
    )

    console.log(res)
  }

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
            height: '300px',
          }}
          onClick={handleInputClick}
        >
          {recentWeight.weight && (
            <Typography variant='caption' color='gray'>
              Recent: {recentWeight.weight.toFixed(1)}KG (
              {formatDateToString(recentWeight.date)})
            </Typography>
          )}

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
              input: { textAlign: 'center', fontSize: '3em' },
              width: 150,
            }}
          />
          <Typography color='gray'>KG</Typography>
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
    </Container>
  )
}

export default Logger
