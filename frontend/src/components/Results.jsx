import { Stack, Typography, Box } from '@mui/material'
import React from 'react'
import ReactDOM from 'react-dom'
import * as V from 'victory'

let data2 = [
  { x: '4/1/2022', y: 65.6 },
  { x: '4/2/2022', y: 65.6 },
  { x: '4/3/2022', y: 65.1 },
  { x: '4/4/2022', y: 64.7 },
  { x: '4/5/2022', y: 65.3 },
  { x: '4/6/2022', y: 64.7 },
  { x: '4/7/2022', y: 64.7 },
  { x: '4/8/2022', y: 65.2 },
  { x: '4/9/2022', y: 65.1 },
  { x: '4/10/2022', y: 65.2 },
  { x: '4/11/2022', y: 65.2 },
  { x: '4/12/2022', y: 64.2 },
  { x: '4/13/2022', y: 65 },
  { x: '4/14/2022', y: 65.9 },
  { x: '4/15/2022', y: 65.2 },
  { x: '4/16/2022', y: 65.4 },
  { x: '4/17/2022', y: 65 },
  { x: '4/18/2022', y: 64.6 },
  { x: '4/19/2022', y: 64.2 },
  { x: '4/20/2022', y: 64 },
  { x: '4/21/2022', y: 63.7 },
  { x: '4/22/2022', y: 63.9 },
  { x: '4/23/2022', y: 64.1 },
  { x: '4/24/2022', y: 64.1 },
  { x: '4/25/2022', y: 64.4 },
  { x: '4/26/2022', y: 64.4 },
  { x: '4/27/2022', y: 64.4 },
  { x: '4/28/2022', y: 64.1 },
  { x: '4/29/2022', y: 64.1 },
  { x: '4/30/2022', y: 64.6 },
  { x: '5/1/2022', y: 64.4 },
  { x: '5/2/2022', y: 64.2 },
  { x: '5/3/2022', y: 64.4 },
  { x: '5/4/2022', y: 64.1 },
  { x: '5/5/2022', y: 64.1 },
  { x: '5/6/2022', y: 64.3 },
  { x: '5/7/2022', y: 63.7 },
  { x: '5/8/2022', y: 63.55 },
  { x: '5/9/2022', y: 63.4 },
  { x: '5/10/2022', y: 63.5 },
  { x: '5/11/2022', y: 63.5 },
  { x: '5/12/2022', y: 63.8 },
  { x: '5/13/2022', y: 63.2 },
  { x: '5/14/2022', y: 63.4 },
  { x: '5/15/2022', y: 63.35 },
  { x: '5/16/2022', y: 63.3 },
  { x: '5/17/2022', y: 63 },
  { x: '5/18/2022', y: 63.2 },
  { x: '5/19/2022', y: 63 },
  { x: '5/20/2022', y: 63.5 },
  { x: '5/21/2022', y: 63.6 },
  { x: '5/22/2022', y: 63.7 },
  { x: '5/23/2022', y: 63.1 },
  { x: '5/24/2022', y: 62.8 },
  { x: '5/25/2022', y: 62.8 },
  { x: '5/26/2022', y: 62.6 },
  { x: '5/27/2022', y: 62.8 },
  { x: '5/28/2022', y: 62.9 },
  { x: '5/29/2022', y: 62.7 },
  { x: '5/30/2022', y: 62.5 },
  { x: '5/31/2022', y: 62.8 },
  { x: '6/1/2022', y: 62.8 },
  { x: '6/2/2022', y: 63 },
  { x: '6/3/2022', y: 62.7 },
  { x: '6/4/2022', y: 62.55 },
  { x: '6/5/2022', y: 62.55 },
  { x: '6/6/2022', y: 62.4 },
  { x: '6/7/2022', y: 62.7 },
  { x: '6/8/2022', y: 61.9 },
  { x: '6/9/2022', y: 63.5 },
  { x: '6/10/2022', y: 62.4 },
  { x: '6/11/2022', y: 63.5 },
  { x: '6/12/2022', y: 62.8 },
  { x: '6/13/2022', y: 62.1 },
  { x: '6/14/2022', y: 62.5 },
  { x: '6/15/2022', y: 62.8 },
  { x: '6/16/2022', y: 63 },
  { x: '6/17/2022', y: 63.2 },
  { x: '6/18/2022', y: 63.8 },
  { x: '6/19/2022', y: 62.6 },
  { x: '6/20/2022', y: 63.5 },
]

const makeDataDateObjects = (data) => {
  return data.map((elem) => {
    return {
      x: new Date(elem.x),
      y: elem.y,
    }
  })
}

function Results() {
  data2 = makeDataDateObjects(data2)
  console.log(data2)
  return (
    <Stack mt={3} spacing={5}>
      <Typography variant='body1' textAlign='center'>
        Goal: 9월 1일까지 67kg 까지 벌크업해서 풀빌라 파티 놀러간다
      </Typography>
      <Stack>
        <Typography variant='h5' textAlign='center'>
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
        </Typography>
      </Stack>
      <Typography variant='caption' textAlign='right' color='gray'>
        62.7KG (22/06/25)
      </Typography>
      <Box
        sx={{
          borderTop: 'solid 1px gray',
        }}
      >
        <V.VictoryChart
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
          <V.VictoryGroup
            data={data2}
            style={{
              data: {
                fill: 'green',
                fillOpacity: 0.1,
                stroke: 'green',
                strokeOpacity: 0.1,
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
            <V.VictoryScatter size={1.5} />
          </V.VictoryGroup>
        </V.VictoryChart>
      </Box>
    </Stack>
  )
}

export default Results
