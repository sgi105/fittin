import React from 'react'
import { Box, Typography, Stack } from '@mui/material'
import { formatDateToString } from '../utils/utilFunctions'
import colors from '../utils/colors'
const {
  weightGoodHabitSquare,
  weightSlowHabitSquare,
  weightTooFastHabitSquare,
  weightBadHabitSquare,
  exerciseHabitSquare,
  dietHabitSquare,
} = colors

function HabitBox({ name, state = false }) {
  // const successColor = 'rgba(39, 202, 51, 1)'
  // const weightGood = colors.weightGood
  // const weightSlow = colors.weightSlow
  // const weightTooFast = colors.weightTooFast
  // const wieghtBad = colors.wieghtBad
  const blankColor = '#F0F0F0'
  const dietColor = 'rgba(81, 102, 252, 1)'
  const exerciseColor = 'rgba(255, 197, 0, 1)'
  const failColor = '#949494'

  let color = blankColor

  if (!state) color = failColor
  else if (state === 'blank') color = blankColor
  else {
    if (name === 'weigh') {
      if (state === 'good') color = weightGoodHabitSquare
      else if (state === 'slow') color = weightSlowHabitSquare
      else if (state === 'too fast') color = weightTooFastHabitSquare
      else color = weightBadHabitSquare
    } else if (name === 'exercise') color = exerciseHabitSquare
    else color = dietHabitSquare
  }

  let size = '45px'

  return (
    <Box
      sx={{
        width: size,
        height: size,
        // border: '1px solid black',
        backgroundColor: color,
        mr: '1px',
        mb: '1px',
      }}
    ></Box>
  )
}

function HabitColumn({ currentDateHabit }) {
  return (
    <Stack key={currentDateHabit.date} justifyContent={'center'}>
      <HabitBox name={'weigh'} state={currentDateHabit.weigh} />
      <HabitBox name={'exercise'} state={currentDateHabit.exercise} />
      <HabitBox name={'diet'} state={currentDateHabit.diet} />
      <Typography color='gray' textAlign={'center'} variant='caption'>
        {formatDateToString(currentDateHabit.date).slice(5)}
      </Typography>
    </Stack>
  )
}

export default HabitColumn
