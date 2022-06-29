import React from 'react'
import gettingReadyImage from '../images/gettingready.png'
import { Stack, Typography, Box } from '@mui/material'
import * as V from 'victory'
import CircleIcon from '@mui/icons-material/Circle'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'
import { useState, useEffect } from 'react'
import url from '../utils/urls'
import removeTime from '../utils/removeTime'
import formatDateToString from '../utils/formatDateToString'
import axios from 'axios'
import {
  getSimpleMovingAverageArray,
  getEWMAArray,
  getMonday,
  isSameDay,
} from '../utils/utilFunctions'

// let data2 = [
//   { x: '4/1/2022', y: 65.6 },
//   { x: '4/2/2022', y: 65.6 },
//   { x: '4/3/2022', y: 65.1 },
//   { x: '4/4/2022', y: 64.7 },
//   { x: '4/5/2022', y: 65.3 },
//   { x: '4/6/2022', y: 64.7 },
//   { x: '4/7/2022', y: 64.7 },
//   { x: '4/8/2022', y: 65.2 },
//   { x: '4/9/2022', y: 65.1 },
//   { x: '4/10/2022', y: 65.2 },
//   { x: '4/11/2022', y: 65.2 },
//   { x: '4/12/2022', y: 64.2 },
//   { x: '4/13/2022', y: 65 },
//   { x: '4/14/2022', y: 65.9 },
//   { x: '4/15/2022', y: 65.2 },
//   { x: '4/16/2022', y: 65.4 },
//   { x: '4/17/2022', y: 65 },
//   { x: '4/18/2022', y: 64.6 },
//   { x: '4/19/2022', y: 64.2 },
//   { x: '4/20/2022', y: 64 },
//   { x: '4/21/2022', y: 63.7 },
//   { x: '4/22/2022', y: 63.9 },
//   { x: '4/23/2022', y: 64.1 },
//   { x: '4/24/2022', y: 64.1 },
//   { x: '4/25/2022', y: 64.4 },
//   { x: '4/26/2022', y: 64.4 },
//   { x: '4/27/2022', y: 64.4 },
//   { x: '4/28/2022', y: 64.1 },
//   { x: '4/29/2022', y: 64.1 },
//   { x: '4/30/2022', y: 64.6 },
//   { x: '5/1/2022', y: 64.4 },
//   { x: '5/2/2022', y: 64.2 },
//   { x: '5/3/2022', y: 64.4 },
//   { x: '5/4/2022', y: 64.1 },
//   { x: '5/5/2022', y: 64.1 },
//   { x: '5/6/2022', y: 64.3 },
//   { x: '5/7/2022', y: 63.7 },
//   { x: '5/8/2022', y: 63.55 },
//   { x: '5/9/2022', y: 63.4 },
//   { x: '5/10/2022', y: 63.5 },
//   { x: '5/11/2022', y: 63.5 },
//   { x: '5/12/2022', y: 63.8 },
//   { x: '5/13/2022', y: 63.2 },
//   { x: '5/14/2022', y: 63.4 },
//   { x: '5/15/2022', y: 63.35 },
//   { x: '5/16/2022', y: 63.3 },
//   { x: '5/17/2022', y: 63 },
//   { x: '5/18/2022', y: 63.2 },
//   { x: '5/19/2022', y: 63 },
//   { x: '5/20/2022', y: 63.5 },
//   { x: '5/21/2022', y: 63.6 },
//   { x: '5/22/2022', y: 63.7 },
//   { x: '5/23/2022', y: 63.1 },
//   { x: '5/24/2022', y: 62.8 },
//   { x: '5/25/2022', y: 62.8 },
//   { x: '5/26/2022', y: 62.6 },
//   { x: '5/27/2022', y: 62.8 },
//   { x: '5/28/2022', y: 62.9 },
//   { x: '5/29/2022', y: 62.7 },
//   { x: '5/30/2022', y: 62.5 },
//   { x: '5/31/2022', y: 62.8 },
//   { x: '6/1/2022', y: 62.8 },
//   { x: '6/2/2022', y: 63 },
//   { x: '6/3/2022', y: 62.7 },
//   { x: '6/4/2022', y: 62.55 },
//   { x: '6/5/2022', y: 62.55 },
//   { x: '6/6/2022', y: 62.4 },
//   { x: '6/7/2022', y: 62.7 },
//   { x: '6/8/2022', y: 61.9 },
//   { x: '6/9/2022', y: 63.5 },
//   { x: '6/10/2022', y: 62.4 },
//   { x: '6/11/2022', y: 63.5 },
//   { x: '6/12/2022', y: 62.8 },
//   { x: '6/13/2022', y: 62.1 },
//   { x: '6/14/2022', y: 62.5 },
//   { x: '6/15/2022', y: 62.8 },
//   { x: '6/16/2022', y: 63 },
//   { x: '6/17/2022', y: 63.2 },
//   { x: '6/18/2022', y: 63.8 },
//   { x: '6/19/2022', y: 62.6 },
//   { x: '6/20/2022', y: 63.5 },
// ]

const makeDataDateObjects = (data) => {
  return data.map((elem) => {
    return {
      x: new Date(elem.x),
      y: elem.y,
    }
  })
}

function Dashboard() {
  // data2 = makeDataDateObjects(data2)
  const [weights, setWeights] = useState([])
  const [recentWeight, setRecentWeight] = useState({})
  const [habitTracker, setHabitTracker] = useState(0)
  const [averageWeightPlotData, setAverageWeightPlotData] = useState([])
  const [actualWeightPlotData, setActualWeightPlotData] = useState([])

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

  useEffect(() => {
    getUserData()
  }, [])

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

  const getUserData = async () => {
    const phoneNumber = JSON.parse(
      window.localStorage.getItem('USER_PHONE_NUMBER')
    )

    try {
      const res = await axios.get(url.users + `/${phoneNumber}`, {
        baseURL: '/',
      })

      if (res.data.status === 200) {
        let user = res.data.data
        console.log(user)
        let weights = user.weightLogs
        setWeights(weights)

        setHabitTracker(drawHabitTracker(weights))
        // let logArray = []
        // for (let i = 1; i <= 7; i++) {
        //   if (i <= weights.length)
        //     logArray.push(
        //       <CircleIcon key={i} sx={{ fontSize: 45, color: 'green' }} />
        //     )
        //   else {
        //     logArray.push(
        //       <CircleOutlinedIcon
        //         key={i}
        //         sx={{ fontSize: 45, color: 'black' }}
        //       />
        //     )
        //   }
        // }

        // setLogCount(logArray)

        // get the most recent weight data if available
        if (weights.length > 0) {
          let recentWeight = weights[weights.length - 1].weight
          let recentDate = weights[weights.length - 1].date
          setRecentWeight({
            weight: recentWeight,
            date: new Date(recentDate),
          })
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      {/* <img src={gettingReadyImage} alt='getting ready' width={'100%'} /> */}
      <Stack mt={3} spacing={5}>
        {/* <Typography variant='body1' textAlign='center'>
          Goal: 9월 1일까지 67kg 까지 벌크업해서 풀빌라 파티 놀러간다
        </Typography> */}
        <Stack>
          <Typography variant='h1' textAlign='center' fontWeight={900}>
            GOOD 💪
          </Typography>

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
                  fill: 'gray',
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
