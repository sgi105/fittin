import { Box, Button, Container, Stack, Typography, Paper } from '@mui/material'
import React from 'react'
import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { borderRadius } from '@mui/system'
import { useNavigate, Navigate } from 'react-router-dom'
//bottom nav
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import RestoreIcon from '@mui/icons-material/Restore'
import FavoriteIcon from '@mui/icons-material/Favorite'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import gettingReadyImage from '../images/gettingready.png'

function Logger() {
  const navigate = useNavigate()
  const [value, setValue] = useState(new Date())
  const [weight, setWeight] = useState('')
  const [weightInputBoxStyle, setWeightInputBoxStyle] = useState({
    border: '1px solid',
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderRadius: '4px',
    height: '300px',
  })
  const [showButton, setShowButton] = useState(false)
  useEffect(() => {
    if (weight > 0) setShowButton(true)
    else setShowButton(false)
  }, [weight])

  // useEffect(() => {
  //   console.log(
  //     document.querySelector('#weight-input') === document.activeElement
  //   )
  // }, [document.activeElement])

  const handleInputClick = () => {
    document.querySelector('#weight-input').focus()
    console.log(
      document.querySelector('#weight-input') === document.activeElement
    )
  }

  const handleWeightInput = (e) => {
    if (e.target.value.length < 6) setWeight(e.target.value)
  }

  const handleButtonClick = () => {
    // send info to server

    // go to results page
    navigate('/results')
  }

  return (
    <Container>
      <Stack mt={3} spacing={3}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label='Date'
            value={value}
            onChange={(newValue) => {
              setValue(newValue)
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
          <Typography variant='caption' color='gray'>
            Recent: 62.5kg (22/06/25)
          </Typography>

          <TextField
            disabled // 임시로 막아둠
            id='weight-input'
            variant='standard'
            placeholder='62.8'
            type='number'
            value={weight}
            onChange={handleWeightInput}
            inputProps={{ inputMode: 'numeric' }}
            sx={{
              input: { textAlign: 'center', fontSize: '3em' },
              width: 150,
            }}
          />
          <Typography color='gray'>KG</Typography>
        </Stack>
        {showButton && (
          <Button onClick={handleButtonClick} variant='contained'>
            Enter
          </Button>
        )}
        <img src={gettingReadyImage} alt='getting ready' width={'100%'} />
      </Stack>
    </Container>
  )
}

export default Logger
