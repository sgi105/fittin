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

function BodyFatPercentage() {
  const navigate = useNavigate()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false)

  return (
    <Container sx={{ my: '3rem' }}>
      <Stack
        spacing={3}
        justifyContent='center'
        alignItems='center'
        width='80%'
        sx={{
          // height: '100vh',
          margin: 'auto',
        }}
      >
        <Typography variant='h4' width='100%'>
          What is your body fat % ?
        </Typography>

        <img
          src={bodyFatMenImage}
          alt='body fat percentage men image'
          width={'100%'}
        />
        <img
          src={bodyFatWomenImage}
          alt='body fat percentage women image'
          width={'100%'}
        />

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

        <Button
          fullWidth
          variant='contained'
          onClick={() => {
            navigate('/goalsetting')
          }}
        >
          Next
        </Button>
      </Stack>
    </Container>
  )
}

export default BodyFatPercentage
