import { Box, Button, Container, Stack, Typography, Paper } from '@mui/material'
import React from 'react'
import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { borderRadius } from '@mui/system'
import { useNavigate, Navigate } from 'react-router-dom'
import url from '../utils/urls'
import removeTime from '../utils/removeTime'
import formatDateToString from '../utils/formatDateToString'
import axios from 'axios'

const phoneNumber = JSON.parse(window.localStorage.getItem('USER_PHONE_NUMBER'))

function Logger() {
  const navigate = useNavigate()
  const [date, setDate] = useState(removeTime(new Date()))
  const [weight, setWeight] = useState('')
  const [weightInputBoxStyle, setWeightInputBoxStyle] = useState({
    border: '1px solid',
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderRadius: '4px',
    height: '300px',
  })
  const [showButton, setShowButton] = useState(false)
  const [weights, setWeights] = useState([])
  const [recentWeight, setRecentWeight] = useState({})

  useEffect(() => {
    if (weight > 0) setShowButton(true)
    else setShowButton(false)
  }, [weight])

  useEffect(() => {
    loadCurrentDateWeight(weights)
  }, [date])

  // useEffect(() => {
  //   console.log(
  //     document.querySelector('#weight-input') === document.activeElement
  //   )
  // }, [document.activeElement])

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
        let weights = user.weights
        setWeights(weights)

        // get the most recent weight data if available
        if (weights.length > 0) {
          let recentWeight = weights[weights.length - 1].weight
          let recentDate = weights[weights.length - 1].date
          setRecentWeight({
            weight: recentWeight,
            date: formatDateToString(new Date(recentDate)),
          })
          // get the current day's weight data if available
          loadCurrentDateWeight(weights)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const loadCurrentDateWeight = (weights) => {
    if (weights.length > 0) {
      weights.forEach((elem, index) => {
        if (
          formatDateToString(new Date(elem.date)) === formatDateToString(date)
        ) {
          setWeight(elem.weight.toFixed(1))
        }
      })
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
    try {
      // send info to server
      const res = await axios.post(
        url.logWeight,
        {
          phoneNumber,
          date,
          weight,
        },
        {
          baseURL: '/',
        }
      )

      console.log(res)

      // go to results page
      navigate('/home/dashboard')
    } catch (err) {
      console.log(err)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
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
              Recent: {recentWeight.weight.toFixed(1)}KG ({recentWeight.date})
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
    </Container>
  )
}

export default Logger
