import {
  Stack,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormHelperText,
  ToggleButtonGroup,
  ToggleButton,
  Popover,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material'
import React from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useState } from 'react'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import bodyFatMenImage from '../images/bodyfatmen.png'
import bodyFatWomenImage from '../images/bodyfatwomen.png'
import { useEffect } from 'react'
import * as V from 'victory'
import removeTime from '../utils/removeTime'
import axios from 'axios'
import url from '../utils/urls'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

function Profile() {
  // user basic profile states
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [gender, setGender] = useState('')
  const [birthday, setBirthday] = useState(null)
  const [height, setHeight] = useState('')

  // layout states
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [showGraph, setShowGraph] = useState(false)
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)
  const [openSaveSuccessSnackBar, setOpenSaveSuccessSnackBar] = useState(false)

  // goal related states
  const [startDate, setStartDate] = useState(removeTime(new Date()))
  const [endDate, setEndDate] = useState(new Date('2022/09/02'))
  const [startWeight, setStartWeight] = useState('')
  const [startBodyFat, setStartBodyFat] = useState('')
  const [targetWeight, setTargetWeight] = useState()
  const [targetBodyFat, setTargetBodyFat] = useState()
  const [dietMode, setDietMode] = useState('')
  const [dietSpeed, setDietSpeed] = useState()
  const [thisPlanTargetWeight, setThisPlanTargetWeight] = useState()
  const [thisPlanAchieveDate, setThisPlanAchieveDate] = useState()
  const [reasonForDiet, setReasonForDiet] = useState('')
  const [rewardAfterDiet, setRewardAfterDiet] = useState('')

  // graph data
  const [weightLossPlanData, setWeightLossPlanData] = useState([])

  const open = Boolean(anchorEl)

  const getUserData = async () => {
    const data = JSON.parse(window.localStorage.getItem('USER_PHONE_NUMBER'))

    console.log(data)
    try {
      const res = await axios.get(url.users + `/${data}`, { baseURL: '/' })
      if (res.data.status === 200) {
        let user = res.data.data
        console.log(user)
        setName(user.name)
        setPhoneNumber(user.phoneNumber)
        setGender(user.gender)
        setBirthday(user.birthday)
        setHeight(user.height)

        if (user.goals[0]) {
          const goal = user.goals[0]

          console.log(new Date(goal.startDate))
          console.log(new Date(goal.endDate))
          // console.log(new Date(goal.thisPlanAchieveDate))

          setStartDate(new Date(goal.startDate))
          setEndDate(new Date(goal.endDate))
          setStartWeight(goal.startWeight)
          setStartBodyFat(goal.startBodyFat)
          setTargetWeight(goal.targetWeight)
          setTargetBodyFat(goal.targetBodyFat)
          setDietMode(goal.dietMode)
          setDietSpeed(goal.dietSpeed)
          setThisPlanTargetWeight(goal.thisPlanTargetWeight)
          // setThisPlanAchieveDate(goal.thisPlanAchieveDate)
          setReasonForDiet(goal.reasonForDiet)
          setRewardAfterDiet(goal.rewardAfterDiet)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getUserData()
  }, [])

  useEffect(() => {
    if (dietMode === 'lose' && startWeight && startBodyFat && targetBodyFat) {
      const bodyFatDiff = startBodyFat - targetBodyFat
      const weightToLose = (bodyFatDiff / 100) * startWeight
      console.log(+(startWeight - weightToLose).toFixed(1))
      setTargetWeight(+(startWeight - weightToLose).toFixed(1))
    }
  }, [targetBodyFat, startBodyFat, startWeight, dietMode])

  useEffect(() => {
    if (
      startDate &&
      endDate &&
      dietMode &&
      dietSpeed &&
      targetWeight &&
      startWeight &&
      startBodyFat &&
      (targetBodyFat || dietMode === 'gain') &&
      gender
    ) {
      createGraph()
      setShowGraph(true)
    } else {
      setShowGraph(false)
    }
  }, [
    gender,
    dietMode,
    dietSpeed,
    targetWeight,
    startWeight,
    startBodyFat,
    targetBodyFat,
    startDate,
    endDate,
  ])

  useEffect(() => {
    rewardAfterDiet && reasonForDiet
      ? setSaveButtonDisabled(false)
      : setSaveButtonDisabled(true)
  }, [rewardAfterDiet, reasonForDiet])

  const createGraph = () => {
    // create array that has projection for future weight
    const days = (date_1, date_2) => {
      let difference = date_1.getTime() - date_2.getTime()
      let TotalDays = Math.ceil(difference / (1000 * 3600 * 24))
      return TotalDays
    }

    const dietPlanDuration = days(endDate, startDate) + 1

    let oneDay = 1000 * 3600 * 24

    let newData = []
    console.log(dietSpeed)

    for (let i = 0; i < dietPlanDuration; i++) {
      let date = startDate.getTime() + oneDay * i
      let newWeight = startWeight * Math.pow(Math.pow(1 + dietSpeed, 1 / 7), i)

      // if losing, when newWeight <= targetWeight, stop
      // if gaining, when newWeight >= targetWeight, stop

      if (
        (dietMode === 'lose' && newWeight <= targetWeight) ||
        (dietMode === 'gain' && newWeight >= targetWeight)
      ) {
        newWeight = targetWeight
      }

      // when weight changes, update the achieve date.
      if (i === 0) setThisPlanAchieveDate(new Date(date))
      if (i > 0 && newData[newData.length - 1].y !== newWeight)
        setThisPlanAchieveDate(new Date(date))

      newData.push({ x: new Date(date), y: newWeight })
    }
    setWeightLossPlanData(newData)

    setThisPlanTargetWeight(newData[newData.length - 1].y.toFixed(1))
  }

  const dateObjectToString = (date) => {
    var dd = String(date.getDate()).padStart(2, '0')
    var mm = String(date.getMonth() + 1).padStart(2, '0') //January is 0!
    var yyyy = date.getFullYear()

    return yyyy + '-' + mm + '-' + dd
  }

  const handleSave = async () => {
    // 일단은 goal 하나만 가질 수 있도록 하자.
    // save user's goal

    const goal = {
      startDate,
      endDate,
      startWeight,
      startBodyFat,
      targetWeight,
      targetBodyFat,
      dietMode,
      dietSpeed,
      thisPlanTargetWeight,
      thisPlanAchieveDate,
      reasonForDiet,
      rewardAfterDiet,
    }

    try {
      const res = await axios.put(
        url.users,
        {
          goal,
          phoneNumber,
        },
        {
          baseURL: '/',
        }
      )

      console.log(res)
      setOpenSaveSuccessSnackBar(true)
    } catch (err) {
      console.log(err)
    }
  }

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenSaveSuccessSnackBar(false)
  }

  const action = (
    <React.Fragment>
      <IconButton
        size='small'
        aria-label='close'
        color='inherit'
        onClick={handleCloseSnackBar}
      >
        <CloseIcon fontSize='small' />
      </IconButton>
    </React.Fragment>
  )

  return (
    <>
      <Stack spacing={4} px={2} mx='auto'>
        <Typography variant='h3' fontWeight='bold'>
          Profile
        </Typography>
        <Typography variant='h5' fontWeight='normal'>
          Basic
        </Typography>
        <TextField label='Name' value={name} variant='standard' disabled />
        <TextField
          label='Phone'
          value={phoneNumber}
          variant='standard'
          disabled
        />
        <FormControl fullWidth>
          <FormLabel id='demo-radio-buttons-group-label'>Gender</FormLabel>
          <RadioGroup
            aria-labelledby='demo-radio-buttons-group-label'
            name='radio-buttons-group'
            onChange={(e) => {
              setGender(e.target.value)
            }}
            value={gender}
          >
            <FormControlLabel
              disabled
              value='female'
              control={<Radio />}
              label='Female 🙋🏻‍♀️'
            />
            <FormControlLabel
              disabled
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
            disabled
            openTo='year'
            views={['year', 'month', 'day']}
            label='Birthday'
            value={birthday}
            onChange={(newValue) => {
              setBirthday(newValue)
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
          disabled
          value={height}
          fullWidth
          label='Height'
          InputProps={{
            endAdornment: <InputAdornment position='end'>CM</InputAdornment>,
            inputMode: 'numeric',
          }}
          type='number'
          variant='standard'
          placeholder='165'
        />

        <Typography pt={2} variant='h5'>
          Plan
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack direction='row' spacing={3}>
            <DatePicker
              // disabled
              inputFormat={'yyyy-MM-dd'}
              mask={'____-__-__'}
              label='Start Date'
              value={startDate}
              onChange={(newValue) => {
                setStartDate(removeTime(newValue))
              }}
              renderInput={(params) => (
                <TextField {...params} helperText={null} variant='standard' />
              )}
            />
            <DatePicker
              disabled
              inputFormat={'yyyy-MM-dd'}
              mask={'____-__-__'}
              label='End Date'
              value={endDate}
              onChange={(newValue) => {
                setEndDate(removeTime(newValue))
              }}
              renderInput={(params) => (
                <TextField {...params} helperText={null} variant='standard' />
              )}
            />
          </Stack>
        </LocalizationProvider>

        {/* <Typography variant='h6' fontWeight='normal' pt={2}>
          Current Data
        </Typography> */}

        <TextField
          fullWidth
          label='Start Weight (시작 몸무게)'
          InputProps={{
            endAdornment: <InputAdornment position='end'>KG</InputAdornment>,
            inputMode: 'numeric',
          }}
          value={startWeight}
          onChange={(e) => {
            e.target.value ? setStartWeight(+e.target.value) : setStartWeight()
          }}
          type='number'
          placeholder='62.5'
          variant='standard'
        />
        <Stack spacing={1}>
          <TextField
            fullWidth
            label='Start Body Fat % (시작 체지방률)'
            InputProps={{
              endAdornment: <InputAdornment position='end'>%</InputAdornment>,
              inputMode: 'numeric',
            }}
            type='number'
            variant='standard'
            value={startBodyFat}
            onChange={(e) => {
              e.target.value
                ? setStartBodyFat(+e.target.value)
                : setStartBodyFat()
            }}
          />
          <Button
            size='small'
            variant='standard'
            startIcon={<HelpOutlineIcon />}
            mt='100rem'
            sx={{
              py: 0,
              px: 0,
              color: 'rgba(0,0,0,0.6)',
              justifyContent: 'left',
            }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            모르겠다.
          </Button>
        </Stack>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={() => {
            setAnchorEl(null)
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Typography sx={{ p: 2 }}>본인과 가장 비슷한 체형은?</Typography>

          <img
            src={gender === 'male' ? bodyFatMenImage : bodyFatWomenImage}
            alt='body fat percentage image'
            width={'100%'}
          />
        </Popover>

        {/* <Typography variant='h6' fontWeight='normal' pt={2}>
          Goal Setting
        </Typography> */}

        <FormControl fullWidth>
          <InputLabel id='demo-simple-select-label'>Diet Mode</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={dietMode}
            label='Diet Mode'
            onChange={(e) => {
              setDietMode(e.target.value)
              setTargetBodyFat(null)
              setTargetWeight('')
              setDietSpeed(null)
            }}
          >
            <MenuItem value={'lose'}>🍏 LOSE WEIGHT (-)</MenuItem>
            <MenuItem value={'gain'}>🍖 GAIN WEIGHT (+)</MenuItem>
          </Select>
        </FormControl>

        {/* goal body fat percentage */}
        {dietMode &&
          (dietMode === 'lose' ? (
            <>
              <FormControl fullWidth>
                <FormLabel id='demo-radio-buttons-group-label'>
                  Body Fat % Goal
                </FormLabel>
                <RadioGroup
                  aria-labelledby='demo-radio-buttons-group-label'
                  name='radio-buttons-group'
                  onChange={(e) => {
                    setTargetBodyFat(+e.target.value)
                  }}
                >
                  <Stack flexDirection='row' alignItems='center'>
                    <FormControlLabel
                      value={gender === 'male' ? 15 : 25}
                      label={
                        gender === 'male'
                          ? '15% - 건강해졌다.'
                          : '25% - 건강해졌다.'
                      }
                      control={<Radio />}
                    />
                    <FormHelperText sx={{ ml: -1 }}>유지 쉬움.</FormHelperText>
                  </Stack>
                  <Stack flexDirection='row' alignItems='center'>
                    <FormControlLabel
                      control={<Radio />}
                      value={gender === 'male' ? 10 : 20}
                      label={
                        gender === 'male'
                          ? '10% - 핏하다. 복근 보인다.'
                          : '20% - 핏하다. 복근 보인다.'
                      }
                    />
                    <FormHelperText sx={{ ml: -1 }}>유지 가능.</FormHelperText>
                  </Stack>
                  <Stack flexDirection='row' alignItems='center'>
                    <FormControlLabel
                      control={<Radio />}
                      value={gender === 'male' ? 7 : 17}
                      label={
                        gender === 'male'
                          ? '7% - 모델이 됐다.'
                          : '17% - 모델이 됐다.'
                      }
                    />
                    <FormHelperText sx={{ ml: -1 }}>
                      장기간 유지 불가능.
                    </FormHelperText>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl fullWidth>
                <FormLabel id='demo-radio-buttons-group-label'>
                  Weight Change Speed
                </FormLabel>
                <RadioGroup
                  aria-labelledby='demo-radio-buttons-group-label'
                  name='radio-buttons-group'
                  onChange={(e) => setDietSpeed(+e.target.value)}
                  value={dietSpeed}
                >
                  <Stack flexDirection='row' alignItems='center'>
                    <FormControlLabel
                      value={-0.01}
                      control={<Radio />}
                      label='Fast'
                    />
                    <FormHelperText sx={{ ml: -1 }}>-1%/week</FormHelperText>
                  </Stack>
                  <Stack flexDirection='row' alignItems='center'>
                    <FormControlLabel
                      value={-0.007}
                      control={<Radio />}
                      label='Normal(권장)'
                    />
                    <FormHelperText sx={{ ml: -1 }}>-0.7%/week</FormHelperText>
                  </Stack>
                  <Stack flexDirection='row' alignItems='center'>
                    <FormControlLabel
                      value={-0.005}
                      control={<Radio />}
                      label='Slow'
                    />
                    <FormHelperText sx={{ ml: -1 }}>-0.5%/week</FormHelperText>
                  </Stack>
                </RadioGroup>
              </FormControl>
            </>
          ) : (
            <>
              <TextField
                fullWidth
                label='Target Weight (최종 목표)'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>KG</InputAdornment>
                  ),
                  inputMode: 'numeric',
                }}
                value={targetWeight}
                onChange={(e) => {
                  e.target.value
                    ? setTargetWeight(+e.target.value)
                    : setTargetWeight()
                }}
                type='number'
                placeholder={`${startWeight}`}
                variant='standard'
              />
              <FormControl fullWidth sx={{ pt: 2 }}>
                <FormLabel id='demo-radio-buttons-group-label'>
                  Weight Change Speed
                </FormLabel>
                <RadioGroup
                  aria-labelledby='demo-radio-buttons-group-label'
                  name='radio-buttons-group'
                  onChange={(e) => {
                    setDietSpeed(+e.target.value)
                  }}
                  value={dietSpeed}
                >
                  <Stack flexDirection='row' alignItems='center'>
                    <FormControlLabel
                      value={0.0035}
                      control={<Radio />}
                      label='Fast'
                    />
                    <FormHelperText sx={{ ml: -1 }}>+0.35%/week</FormHelperText>
                  </Stack>
                  <Stack flexDirection='row' alignItems='center'>
                    <FormControlLabel
                      value={0.0025}
                      control={<Radio />}
                      label='Normal(권장)'
                    />
                    <FormHelperText sx={{ ml: -1 }}>+0.25%/week</FormHelperText>
                  </Stack>
                </RadioGroup>
              </FormControl>
            </>
          ))}

        <Divider />

        <Stack>
          {showGraph && (
            <>
              {targetWeight && (
                <Stack direction='row' alignItems='end'>
                  <Typography pt={1} variant='body2' color='gray'>
                    최종 목표:{' '}
                    {targetWeight >= startWeight
                      ? '+' + (targetWeight - startWeight).toFixed(1)
                      : (targetWeight - startWeight).toFixed(1)}{' '}
                    KG
                  </Typography>
                  <Typography color='gray' variant='body2' ml={1}>
                    ({startWeight} KG → {targetWeight} KG)
                  </Typography>
                </Stack>
              )}
              <Stack flexDirection={'row'} alignItems='end'>
                <Typography pt={1} variant='h6' fontWeight={700}>
                  이번 목표:{' '}
                  {thisPlanTargetWeight >= startWeight
                    ? '+' + (thisPlanTargetWeight - startWeight).toFixed(1)
                    : (thisPlanTargetWeight - startWeight).toFixed(1)}{' '}
                  KG
                </Typography>
                <Typography variant='body2' ml={1} mb={0.5}>
                  ({startWeight} KG → {thisPlanTargetWeight} KG)
                </Typography>
              </Stack>
              <Typography mt={-0.5} variant='caption'>
                by {dateObjectToString(thisPlanAchieveDate)}
              </Typography>
              <V.VictoryChart
                scale={{ x: 'time', y: 'linear' }}
                containerComponent={
                  <V.VictoryZoomContainer
                    zoomDimension='x'
                    minimumZoom={{ x: 0.1, y: 1 }}
                  />
                }
                domainPadding={30}
              >
                <V.VictoryAxis
                  tickFormat={(x) =>
                    x.toLocaleDateString(undefined, {
                      day: '2-digit',
                      month: '2-digit',
                      // year: 'numeric',
                    })
                  }
                />
                <V.VictoryAxis dependentAxis />
                <V.VictoryGroup
                  data={weightLossPlanData}
                  style={{
                    data: {
                      fill: 'red',
                      fillOpacity: 0.1,
                      stroke: 'green',
                      strokeOpacity: 1,
                      strokeWidth: 2,
                    },
                    // labels: {
                    //   fontSize: 15,
                    //   fill: ({ datum }) => (datum.x === 3 ? '#000000' : '#c43a31'),
                    // },
                  }}
                >
                  <V.VictoryLine
                    interpolation='natural'
                    // animate={{
                    //   duration: 2000,
                    //   onLoad: { duration: 1000 },
                    // }}
                  />
                </V.VictoryGroup>
              </V.VictoryChart>
              <Stack spacing={2}>
                <TextField
                  multiline
                  maxRows={2}
                  placeholder='달성하고 싶은 이유'
                  label='달성하고 싶은 이유'
                  inputProps={{ style: { fontSize: 12 } }}
                  value={reasonForDiet}
                  onChange={(e) => {
                    setReasonForDiet(e.target.value)
                  }}
                />

                <TextField
                  multiline
                  maxRows={2}
                  placeholder='달성하고 가장 하고 싶은 것'
                  label='달성하고 가장 하고 싶은 것'
                  inputProps={{ style: { fontSize: 12 } }}
                  value={rewardAfterDiet}
                  onChange={(e) => {
                    setRewardAfterDiet(e.target.value)
                  }}
                />
                <Button
                  onClick={handleSave}
                  disabled={saveButtonDisabled}
                  variant='contained'
                >
                  Save
                </Button>
                <Snackbar
                  open={openSaveSuccessSnackBar}
                  autoHideDuration={2000}
                  onClose={handleCloseSnackBar}
                  message='Save Success'
                  action={action}
                  color='success'
                />
              </Stack>
            </>
          )}
        </Stack>
      </Stack>
    </>
  )
}

export default Profile
