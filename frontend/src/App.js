import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PageTransition } from '@steveeeie/react-page-transition'

import Login from './components/Login'
import Logger from './components/Logger'
import Signup from './components/Signup'
import { Container } from '@mui/material'
import Results from './components/Results'
import WeightInput from './components/WeightInput'
import BodyFatPercentage from './components/BodyFatPercentage'
import GoalSetting from './components/GoalSetting'
import BottomNav from './components/BottomNav'
import Profile from './components/Profile'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <Container sx={{ backgroundColor: 'none' }} maxWidth='sm'>
      <Router>
        <Routes>
          <Route path='/home' element={<BottomNav />}>
            <Route path='profile' element={<Profile />} />
            <Route index element={<Logger />} />
            <Route path='dashboard' element={<Dashboard />} />
          </Route>
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/weightinput' element={<WeightInput />} />
          <Route path='/bodyfatpercentage' element={<BodyFatPercentage />} />
          <Route path='/goalsetting' element={<GoalSetting />} />
          <Route path='/results' element={<Results />} />
        </Routes>
      </Router>
    </Container>
  )
}

export default App
