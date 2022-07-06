import {
  Container,
  Stack,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Backdrop,
} from '@mui/material'
import sloganImage from '../images/slogan.jpeg'
import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import axios from 'axios'
import url from '../utils/urls'
import { getUserData } from '../apiCalls/getUserData'
import { useEffect } from 'react'

function Login() {
  const navigate = useNavigate()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [user, setUser] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [isAutoLogin, setIsAutoLogin] = useState(false)

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(
        'USER_PHONE_NUMBER',
        JSON.stringify(phoneNumber)
      )
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        navigate('/home')
      }, 500)
    }
  }, [user])

  // check if user is already logged in
  useEffect(() => {
    let phoneNumber = window.localStorage.getItem('USER_PHONE_NUMBER')
    if (phoneNumber) {
      phoneNumber = JSON.parse(phoneNumber)
      if (phoneNumber) {
        setPhoneNumber(phoneNumber)
        setIsAutoLogin(true)
      }
    }
  }, [])

  // check for valid phoneNumber and try logging in
  useEffect(() => {
    if (phoneNumber)
      handlePhoneNumber({
        target: { value: phoneNumber },
      })

    if (isValidPhoneNumber && isAutoLogin) {
      handleLogin()
    }
  }, [phoneNumber, isValidPhoneNumber, isAutoLogin])

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

  const handleLogin = async () => {
    await getUserData(phoneNumber, setUser)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <Container>
      <Backdrop open={isLoading}>
        <CircularProgress />
      </Backdrop>
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
        <img src={sloganImage} alt='logo' width={'100%'} />

        <TextField
          fullWidth
          label='Phone'
          variant='standard'
          placeholder='01012345678'
          value={phoneNumber}
          onChange={handlePhoneNumber}
          onKeyDown={handleKeyPress}
          autoFocus
          inputProps={{ inputMode: 'numeric' }}
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
        {/* <TextField fullWidth label='Birth' variant='standard' /> */}
        <Stack width='100%' spacing={5}>
          <Stack spacing={1}>
            <Button
              fullWidth
              variant='contained'
              disabled={!isValidPhoneNumber}
              onClick={handleLogin}
            >
              Log In
            </Button>
            <Typography
              variant='caption'
              sx={{
                color: 'tomato',
              }}
            >
              {errorMessage}
            </Typography>
          </Stack>

          <Button
            // color='info'
            size='small'
            fullWidth
            onClick={() => {
              navigate('/signup')
            }}
          >
            <Typography
              variant='body2'
              textTransform='none'
              sx={{
                display: 'inline-block',
                color: 'black',
              }}
            >
              Not a member? &nbsp;
            </Typography>
            <Typography
              variant='body2'
              textTransform='none'
              sx={{
                display: 'inline-block',
              }}
            >
              Create Account
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </Container>
  )
}

export default Login
