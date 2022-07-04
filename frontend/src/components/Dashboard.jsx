import React from 'react'
// import gettingReadyImage from '../images/gettingready.png'
import { Stack, Typography, Box } from '@mui/material'
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
const {
  weightGoodHabitSquare,
  weightSlowHabitSquare,
  weightTooFastHabitSquare,
  weightBadHabitSquare,
  exerciseHabitSquare,
  dietHabitSquare,
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
          color = weightGoodHabitSquare
          break
        case 'TOO FAST':
          color = weightTooFastHabitSquare
          break
        case 'SLOW':
          color = weightSlowHabitSquare
          break
        case 'BAD':
          color = weightBadHabitSquare
          break
      }

      setWeightChangeSpeed({
        text,
        color,
      })
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

    const EWMAArray = getEWMAArray(weightValues, 0.9)

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
      <Stack mt={3} spacing={5}>
        {/* <Typography variant='body1' textAlign='center'>
          Goal: 9월 1일까지 67kg 까지 벌크업해서 풀빌라 파티 놀러간다
        </Typography> */}
        <Stack>
          <Typography
            color={weightChangeSpeed.color}
            variant='h2'
            textAlign='center'
            fontWeight={900}
          >
            {weightChangeSpeed.text}
          </Typography>
          <Stack
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

          {/* <Typography variant='h5' textAlign='center'>
            GOOD × 3
          </Typography>
          <Typography variant='h1' textAlign='center' fontWeight={900}>
            -0.2%
          </Typography>
          <Typography mt={-2} mb={2} variant='subtitle2' textAlign='center'>
            (-0.1KG)
          </Typography>
          <Typography variant='h5' textAlign='center'>
            62.5KG
          </Typography> */}
        </Stack>
        {recentWeight.weight && (
          <Typography variant='caption' textAlign='right' color='gray'>
            {recentWeight.weight.toFixed(1)}KG (
            {formatDateToString(recentWeight.date)})
          </Typography>
        )}
        <Box
          sx={{
            borderTop: 'solid 1px gray',
          }}
        >
          <Typography mt={3} variant='h6' textAlign='center'>
            Goal : {user?.goals[0]?.dietMode === 'gain' ? 'BULK' : 'DIET'}
            {'  ' +
              (
                user?.goals[0]?.thisPlanTargetWeight -
                user?.goals[0]?.startWeight
              ).toFixed(1) +
              'KG'}
          </Typography>
          <Typography textAlign='center'>
            {user?.goals[0]?.startWeight + 'KG'}
            {' → ' + user?.goals[0]?.thisPlanTargetWeight + 'KG'}
          </Typography>

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
        </Box>
      </Stack>
    </div>
  )
}

export default Dashboard
