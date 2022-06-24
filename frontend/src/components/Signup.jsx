import { Container, Stack, TextField, Typography, Button } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import url from '../utils/urls'
import axios from 'axios'
import { useEffect } from 'react'
import getDateAsLocalTime from '../utils/getDateAsLocalTime'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { Box } from 'victory'
function Signup() {
  const navigate = useNavigate()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false)
  const [birthday, setBirthday] = useState(null)
  const [gender, setGender] = useState('')
  const [height, setHeight] = useState('')
  const [name, setName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [confirmPhoneNumber, setConfirmPhoneNumber] = useState('')
  const [phoneNumberConfirmed, setPhoneNumberConfirmed] = useState(false)

  useEffect(() => {
    isValidPhoneNumber &&
    birthday &&
    gender &&
    height &&
    name &&
    phoneNumberConfirmed
      ? setButtonDisabled(false)
      : setButtonDisabled(true)
  }, [isValidPhoneNumber, birthday, gender, height, name, phoneNumberConfirmed])

  useEffect(() => {
    confirmPhoneNumber === phoneNumber
      ? setPhoneNumberConfirmed(true)
      : setPhoneNumberConfirmed(false)
  }, [phoneNumber, confirmPhoneNumber])

  const handlePhoneNumber = (e) => {
    let num = e.target.value

    // don't accept input that's not a number
    // set max length to 11
    if (!/^[0-9]*$/.test(num) || num.length > 11) return

    if (/^01([0|1|6|7|8|9])([0-9]{7,})$/.test(num)) {
      setIsValidPhoneNumber(true)
    } else {
      setIsValidPhoneNumber(false)
    }

    setPhoneNumber(num)
  }

  const handleConfirmPhoneNumber = (e) => {
    let num = e.target.value

    // don't accept input that's not a number
    // set max length to 11
    if (!/^[0-9]*$/.test(num) || num.length > 11) return

    setConfirmPhoneNumber(num)
  }

  const handleSignup = async () => {
    try {
      const res = await axios.post(url.users, {
        phoneNumber,
        name,
        gender,
        birthday,
        height,
      })

      if (res.data.status === 200) {
        navigate('/')
      } else {
        setErrorMessage(res.data.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Container
      sx={{
        pt: 3,
      }}
    >
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
        <Typography variant='h4'>
          Welcome. <br />
          Get fit forever.
        </Typography>
        <TextField
          fullWidth
          label='Name'
          variant='standard'
          placeholder='홍길동'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          fullWidth
          label='Phone Number'
          variant='standard'
          placeholder='01012345678'
          value={phoneNumber}
          onChange={handlePhoneNumber}
          inputProps={{
            inputMode: 'numeric',
          }}
        />
        {!isValidPhoneNumber && phoneNumber && (
          <Typography
            style={{
              fontSize: '12px',
              color: 'tomato',
              width: '100%',
              marginTop: '0rem',
              marginBottom: '-1rem',
            }}
          >
            * enter a valid phone number
          </Typography>
        )}

        <Stack spacing={1} width='100%'>
          <TextField
            fullWidth
            label='Confirm Phone Number (확인)'
            variant='standard'
            placeholder='01012345678'
            value={confirmPhoneNumber}
            onChange={handleConfirmPhoneNumber}
            inputProps={{
              inputMode: 'numeric',
            }}
          />
          {phoneNumberConfirmed && (
            <CheckCircleOutlineIcon color='success' fontSize='small' />
          )}
        </Stack>

        <FormControl fullWidth>
          <FormLabel id='demo-radio-buttons-group-label'>Gender</FormLabel>
          <RadioGroup
            aria-labelledby='demo-radio-buttons-group-label'
            name='radio-buttons-group'
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <FormControlLabel
              value='female'
              control={<Radio />}
              label='Female 🙋🏻‍♀️'
            />
            <FormControlLabel
              value='male'
              control={<Radio />}
              label='Male 🙋🏻‍♂️'
            />
          </RadioGroup>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            inputFormat={'yyyy-MM-dd'}
            mask={'____-__-__'}
            openTo='year'
            views={['year', 'month', 'day']}
            label='Birthday'
            value={birthday}
            onChange={(newValue) => {
              setBirthday(getDateAsLocalTime(newValue))
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                helperText={null}
                fullWidth
                variant='standard'
              />
            )}
          />
        </LocalizationProvider>
        <TextField
          fullWidth
          label='Height'
          InputProps={{
            endAdornment: <InputAdornment position='end'>CM</InputAdornment>,
          }}
          inputProps={{
            inputMode: 'numeric',
          }}
          type='number'
          variant='standard'
          placeholder='165'
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <Stack>
          <Button
            disabled={buttonDisabled}
            fullWidth
            variant='contained'
            onClick={handleSignup}
          >
            Create Account
          </Button>
          <Typography
            sx={{
              color: 'tomato',
            }}
          >
            {errorMessage}
          </Typography>
        </Stack>
      </Stack>
    </Container>
  )
}

export default Signup
