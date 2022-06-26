import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import AssessmentIcon from '@mui/icons-material/Assessment'
import PersonIcon from '@mui/icons-material/Person'
import { Container, Paper } from '@mui/material'
import { useNavigate, Navigate, Outlet } from 'react-router-dom'
import { useEffect } from 'react'

import React from 'react'

function BottomNav() {
  const [bottomNavValue, setBottomNavValue] = React.useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    console.log(window.location.href)
    if (window.location.href.includes('profile')) setBottomNavValue(2)
    else if (window.location.href.includes('dashboard')) setBottomNavValue(1)
    else setBottomNavValue(0)
  }, [])

  return (
    <Container
      sx={{
        pt: 3,
        pb: 10,
      }}
    >
      <Outlet />
      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={bottomNavValue}
          onChange={(event, newValue) => {
            setBottomNavValue(newValue)
          }}
        >
          <BottomNavigationAction
            onClick={() => {
              navigate('/home')
            }}
            label='Weight'
            icon={<AddCircleOutlineIcon />}
          />
          <BottomNavigationAction
            onClick={() => {
              navigate('/home/dashboard')
            }}
            label='Dashboard'
            icon={<AssessmentIcon />}
          />
          <BottomNavigationAction
            onClick={() => {
              navigate('/home/profile')
            }}
            label='Mypage'
            icon={<PersonIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Container>
  )
}

export default BottomNav
