import { Container, Stack, TextField, Typography, Button } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'

function WeightInput() {
  const navigate = useNavigate()

  const [phoneNumber, setPhoneNumber] = useState('')
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false)

  return (
    <Container>
      <Stack
        spacing={5}
        justifyContent='center'
        alignItems='center'
        width='70%'
        sx={{
          height: '100vh',
          margin: 'auto',
        }}
      >
        <Typography variant='h4' width='100%'>
          Basic Info
        </Typography>

        <TextField
          fullWidth
          label='Height'
          InputProps={{
            endAdornment: <InputAdornment position='end'>CM</InputAdornment>,
            inputMode: 'numeric',
          }}
          type='number'
          variant='standard'
        />
        <TextField
          fullWidth
          label='Weight'
          InputProps={{
            endAdornment: <InputAdornment position='end'>KG</InputAdornment>,
            inputMode: 'numeric',
          }}
          type='number'
          variant='standard'
        />

        <Button
          fullWidth
          variant='contained'
          onClick={() => {
            navigate('/bodyfatpercentage')
          }}
        >
          Next
        </Button>
      </Stack>
    </Container>
  )
}

export default WeightInput
