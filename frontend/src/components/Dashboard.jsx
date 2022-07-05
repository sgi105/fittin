import React from 'react'
// import gettingReadyImage from '../images/gettingready.png'
import { Stack, Typography, Box, Grid } from '@mui/material'
import * as V from 'victory'
import CircleIcon from '@mui/icons-material/Circle'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'
import { useState, useEffect } from 'react'
import urls from '../utils/urls'
import removeTime from '../utils/removeTime'
// import formatDateToString from '../utils/formatDateToString'
import axios from 'axios'
import {
  formatDateToString,
  getSimpleMovingAverageArray,
  getEWMAArray,
  getMonday,
  isSameDay,
} from '../utils/utilFunctions'
import HabitColumn from './HabitColumn'
import { getUserData } from '../apiCalls/getUserData'
import fittinCoinImage from '../images/fittincoin.png'
import colors from '../utils/colors'
import ReactSpeedometer from 'react-d3-speedometer'

import LinearProgress from '@mui/material/LinearProgress'

const {
  weightGoodHabitColor,
  weightSlowHabitColor,
  weightTooFastHabitColor,
  weightBadHabitColor,
  exerciseHabitColor,
  dietHabitColor,
} = colors

function Dashboard() {
  // data2 = makeDataDateObjects(data2)
  const [weights, setWeights] = useState([])
  const [recentWeight, setRecentWeight] = useState({})
  const [habitTracker, setHabitTracker] = useState(0)
  const [averageWeightPlotData, setAverageWeightPlotData] = useState([])
  const [actualWeightPlotData, setActualWeightPlotData] = useState([])
  const [user, setUser] = useState()
  const [point, setPoint] = useState('')
  const [weightChangeSpeed, setWeightChangeSpeed] = useState({})
  const [weightChangeRate, setWeightChangeRate] = useState(null)
  const [progress, setProgress] = useState(0)
  const [dietMode, setDietMode] = useState('')

  // get user data on load
  useEffect(() => {
    getUserData(setUser)
  }, [])

  // when loaded, set relevant states
  useEffect(() => {
    if (user) {
      let weights = user.weightLogs
      setWeights(weights)

      // setHabitTracker(drawHabitTracker(weights))
      setHabitTracker(drawHabitTracker2(user.habitLogs))

      // get the most recent weight
      if (weights.length > 0) {
        let recentWeight = weights[weights.length - 1].weight
        let recentDate = weights[weights.length - 1].date
        setRecentWeight({
          weight: recentWeight,
          date: new Date(recentDate),
        })
      }

      setPoint(user.point)

      let color
      let text = user.habitLogs[user.habitLogs.length - 1].weigh.toUpperCase()
      switch (text) {
        case 'GOOD':
          color = weightGoodHabitColor
          break
        case 'TOO FAST':
          color = weightTooFastHabitColor
          break
        case 'SLOW':
          color = weightSlowHabitColor
          break
        case 'BAD':
          color = weightBadHabitColor
          break
      }

      setWeightChangeSpeed({
        text,
        color,
      })
      setDietMode(user.goals[0].dietMode)
      // setDietMode('lose')
    }
  }, [user])

  // make plot data for average and actual weights
  useEffect(() => {
    // extract only weight values
    const weightValues = weights.map((elem) => {
      return elem.weight
    })

    // extract only dates
    const dateValues = weights.map((elem) => {
      return new Date(elem.date)
    })

    const EWMAArray = getEWMAArray(weightValues)

    // calculate change rate/week : compare it to last week's EWMA
    let rate = null

    // only when there are more than 8 entries, you can calculate rate. until then, it is all good.
    if (EWMAArray.length >= 8) {
      rate =
        (EWMAArray[EWMAArray.length - 1] - EWMAArray[EWMAArray.length - 8]) /
        EWMAArray[EWMAArray.length - 8]
    }

    // set rate state
    setWeightChangeRate(rate)

    const newAverageWeightPlotData = []
    const newActualWeightPlotData = []

    for (let i = 0; i < weights.length; i++) {
      newAverageWeightPlotData.push({ x: dateValues[i], y: EWMAArray[i] })

      if (weights[i].logged)
        newActualWeightPlotData.push({ x: dateValues[i], y: weightValues[i] })
    }

    setAverageWeightPlotData(newAverageWeightPlotData)
    setActualWeightPlotData(newActualWeightPlotData)
  }, [weights])

  // setting progress weight
  useEffect(() => {
    console.log('setting progress')

    setProgress(
      Math.abs(
        averageWeightPlotData[averageWeightPlotData?.length - 1]?.y -
          user?.goals[0]?.startWeight
      ) /
        Math.abs(
          user?.goals[0]?.thisPlanTargetWeight - user?.goals[0]?.startWeight
        )
    )

    // setProgress(1.2)
  }, [averageWeightPlotData, user])

  const drawHabitTracker = (weightLogs) => {
    // find the monday of this week.
    const monday = getMonday(new Date())
    console.log(monday)
    const sunday = new Date(monday.getTime() + 1000 * 60 * 60 * 24 * 6)

    const thisWeekHabitArray = []

    // if there is logged value, push 1, if not, push 0
    weightLogs.forEach((elem) => {
      let date = removeTime(new Date(elem.date))
      if (date >= monday && date <= sunday) {
        elem.logged ? thisWeekHabitArray.push(1) : thisWeekHabitArray.push(0)
      }
    })

    console.log(thisWeekHabitArray)

    // fill in the rest of the days of this week that didn't come yet
    for (let i = thisWeekHabitArray.length; i < 7; i++) {
      thisWeekHabitArray.push('?')
    }

    console.log(thisWeekHabitArray)

    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

    const habitTracker = thisWeekHabitArray.map((elem, i) => {
      let circle
      if (elem === 1)
        circle = <CircleIcon key={i} sx={{ fontSize: 45, color: 'green' }} />
      else if (elem === 0)
        circle = <CircleIcon key={i} sx={{ fontSize: 45, color: 'red' }} />
      else
        circle = (
          <CircleOutlinedIcon key={i} sx={{ fontSize: 45, color: 'black' }} />
        )

      return (
        <Stack justifyContent={'center'}>
          {circle}
          <Typography color='gray' textAlign={'center'}>
            {days[i]}
          </Typography>
        </Stack>
      )
    })

    return habitTracker
  }
  const drawHabitTracker2 = (habitLogs) => {
    // find the monday of this week.
    const monday = getMonday(new Date())
    const oneDayInMiliseconds = 1000 * 60 * 60 * 24
    const sunday = new Date(monday.getTime() + oneDayInMiliseconds * 6)
    const today = removeTime(new Date()).getTime()
    const thisWeekHabitLogs = habitLogs.map((elem) => {
      if (new Date(elem.date) >= monday && new Date(elem.date) <= sunday)
        return elem
    })

    // console.log(thisWeekHabitLogs)

    const fontSize = 20
    const habitTracker = [
      <Stack key={0} height={137} justifyContent='space-around' mr={1}>
        <Typography fontSize={fontSize}>📆</Typography>
        <Typography fontSize={fontSize}>💪</Typography>
        <Typography fontSize={fontSize}>🥣</Typography>
      </Stack>,
    ]

    for (
      let date = monday.getTime();
      date <= sunday.getTime();
      date += oneDayInMiliseconds
    ) {
      // up until today, search inside habitLogs for same date, and render by data (YES or NO)

      // if not found, it is a failed day by default

      let currentDateHabit = null

      habitLogs.forEach((elem) => {
        // if there is a match, set data to push to the elem.
        if (isSameDay(elem.date, date)) {
          currentDateHabit = elem
        }
      })

      // if it doesn't exist, set it to default values
      if (!currentDateHabit && date < today) {
        // if before today, set to failed habit
        currentDateHabit = {
          date: new Date(date),
          weigh: false,
          diet: false,
          exercise: false,
        }
      }
      // from today, set it current value or to blank habit
      if (date >= today) {
        currentDateHabit = {
          date: new Date(date),
          weigh: currentDateHabit?.weigh || 'blank',
          diet: currentDateHabit?.diet || 'blank',
          exercise: currentDateHabit?.exercise || 'blank',
        }
      }

      // push one column of habit tracker
      habitTracker.push(<HabitColumn currentDateHabit={currentDateHabit} />)
    }
    return habitTracker
  }

  return (
    <div>
      {/* <img src={gettingReadyImage} alt='getting ready' width={'100%'} /> */}
      <Stack spacing={1} alignItems='center'>
        {/* <Typography variant='body1' textAlign='center'>
          Goal: 9월 1일까지 67kg 까지 벌크업해서 풀빌라 파티 놀러간다
        </Typography> */}
        <Typography
          color={weightChangeSpeed.color}
          variant='h4'
          textAlign='center'
          fontWeight={900}
        >
          {weightChangeSpeed.text}
        </Typography>
        <ReactSpeedometer
          forceRender={true}
          height={200}
          // valueFormat='P'
          needleHeightRatio={0.6}
          minValue={-0.005}
          maxValue={dietMode === 'gain' ? 0.01 : 0.015}
          value={
            dietMode === 'gain'
              ? weightChangeRate > 0.01
                ? 0.01
                : weightChangeRate < -0.005
                ? -0.005
                : weightChangeRate
              : -weightChangeRate > 0.015
              ? 0.015
              : -weightChangeRate < -0.005
              ? -0.005
              : -weightChangeRate
          }
          customSegmentStops={
            dietMode === 'gain'
              ? [-0.005, 0, 0.0025, 0.005, 0.01]
              : [-0.005, 0, 0.005, 0.01, 0.015]
          }
          segmentColors={[
            weightBadHabitColor,
            weightSlowHabitColor,
            weightGoodHabitColor,
            weightTooFastHabitColor,
          ]}
          currentValueText={
            'WEEKLY CHANGE: ' +
            (weightChangeRate >= 0 ? '+' : '') +
            (weightChangeRate * 100).toFixed(2) +
            '%'
          }
          customSegmentLabels={[
            {
              text: 'Bad',
              position: 'OUTSIDE',
              color: 'black',
            },
            {
              text: 'Slow',
              position: 'OUTSIDE',
              color: 'black',
            },
            {
              text: 'Good',
              position: 'OUTSIDE',
              color: 'black',
            },
            {
              text: 'Too Fast',
              position: 'OUTSIDE',
              color: 'black',
            },
          ]}
          ringWidth={47}
          needleTransitionDuration={5000}
          needleTransition='easeElastic'
          needleColor={'black'}
          textColor={'black'}
        />

        <Stack
          width='100%'
          direction={'row'}
          justifyContent='end'
          alignItems='center'
          spacing={1}
          mb={1}
        >
          <img width='30' src={fittinCoinImage} />
          <Typography variant='h5' textAlign='right' fontWeight={900}>
            {point}
          </Typography>
        </Stack>

        <Stack direction={'row'} justifyContent='center'>
          {habitTracker}
        </Stack>

        <Box
          sx={{
            borderTop: 'solid 1px gray',
          }}
        >
          <Stack spacing={1} pt={2}>
            <Stack spacing={1}>
              <Typography variant='h5' textAlign='center'>
                🎯 {user?.goals[0]?.dietMode === 'gain' ? 'BULK' : 'DIET'}
                {'  ' +
                  (
                    user?.goals[0]?.thisPlanTargetWeight -
                    user?.goals[0]?.startWeight
                  ).toFixed(1) +
                  'KG'}
              </Typography>
              <Stack spacing={1}>
                <Stack
                  spacing={0.5}
                  alignItems='center'
                  justifyContent='center'
                >
                  <LinearProgress
                    variant='determinate'
                    value={progress * 100 > 100 ? 100 : progress * 100}
                    sx={{
                      backgroundColor: weightSlowHabitColor,
                      height: 20,
                      width: '100%',
                      borderRadius: 2,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: weightGoodHabitColor,
                      },
                    }}
                  />
                  <Typography
                    color='black'
                    variant='caption'
                    textAlign='center'
                    sx={{
                      fontWeight: 'bold',
                      position: 'absolute',
                      zIndex: 1,
                    }}
                  >
                    {(progress * 100).toFixed(2)}%
                  </Typography>
                </Stack>
                <Stack direction='row' justifyContent='space-between'>
                  <Typography color='gray' variant='caption' textAlign='center'>
                    {user?.goals[0]?.startWeight + 'KG'}
                  </Typography>
                  <Typography variant='body' textAlign='center'>
                    {averageWeightPlotData[
                      averageWeightPlotData?.length - 1
                    ]?.y.toFixed(2)}
                    KG
                  </Typography>
                  <Typography color='gray' variant='caption' textAlign='center'>
                    {user?.goals[0]?.thisPlanTargetWeight + 'KG'}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            <V.VictoryChart
              domainPadding={30}
              // domain={{ y: [minWeight, maxWeight] }}
              scale={{ x: 'time', y: 'linear' }}
              containerComponent={<V.VictoryZoomContainer zoomDimension='x' />}
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
              <V.VictoryLine
                style={{
                  data: {
                    stroke: 'black',
                    strokeOpacity: 1,
                    strokeWidth: 3,
                  },
                }}
                data={averageWeightPlotData}
                interpolation='natural'
              />
              <V.VictoryGroup
                style={{
                  data: {
                    // dot
                    fill: ({ datum, index }) => {
                      let dietMode = user.goals[0].dietMode
                      if (dietMode === 'gain') {
                        return averageWeightPlotData[index].y <= datum.y
                          ? 'green'
                          : 'red'
                      } else {
                        return averageWeightPlotData[index].y >= datum.y
                          ? 'green'
                          : 'red'
                      }
                    },
                    fillOpacity: 0.5,
                    // line
                    stroke: 'gray',
                    strokeOpacity: 0.5,
                    strokeWidth: 1,
                  },
                }}
                data={actualWeightPlotData}
              >
                {/* <V.VictoryLine /> */}
                <V.VictoryScatter
                  size={5}
                  labels={({ datum }) =>
                    `${formatDateToString(datum.x)}
                  ${datum.y.toFixed(2)}KG`
                  }
                  labelComponent={
                    <V.VictoryTooltip dy={0} centerOffset={{ x: 25 }} />
                  }
                />
              </V.VictoryGroup>
            </V.VictoryChart>
          </Stack>
        </Box>
      </Stack>
    </div>
  )
}

export default Dashboard
