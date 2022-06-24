import { Container, Stack, TextField, Typography, Button } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import bodyFatMenImage from '../images/bodyfatmen.png'
import bodyFatWomenImage from '../images/bodyfatwomen.png'

function GoalSetting() {
  const navigate = useNavigate()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false)

  return (
    <Container sx={{ my: '3rem' }}>
      <Stack
        spacing={5}
        justifyContent='center'
        alignItems='center'
        width='80%'
        sx={{
          // height: '100vh',
          margin: 'auto',
        }}
      >
        <Typography variant='h4' width='100%'>
          What is your target?
        </Typography>

        {/* <img
          src={bodyFatMenImage}
          alt='body fat percentage men image'
          width={'100%'}
        />
        <img
          src={bodyFatWomenImage}
          alt='body fat percentage women image'
          width={'100%'}
        /> */}

        <TextField
          fullWidth
          label='Body Fat %'
          InputProps={{
            endAdornment: <InputAdornment position='end'>%</InputAdornment>,
            inputMode: 'numeric',
          }}
          type='number'
          variant='standard'
        />

        <FormControl fullWidth>
          <FormLabel id='demo-radio-buttons-group-label'>Goal</FormLabel>
          <RadioGroup
            aria-labelledby='demo-radio-buttons-group-label'
            name='radio-buttons-group'
          >
            <FormControlLabel
              value='Fitness Model'
              control={<Radio />}
              label='Fitness Model'
            />
            <FormControlLabel value='Fit' control={<Radio />} label='Fit' />
            <FormControlLabel
              value='Healthy'
              control={<Radio />}
              label='Healthy'
            />
          </RadioGroup>
        </FormControl>

        <Button fullWidth variant='contained'>
          Next
        </Button>
      </Stack>
    </Container>
  )
}

export default GoalSetting
