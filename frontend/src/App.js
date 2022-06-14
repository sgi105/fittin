import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import { Container } from '@mui/material'

function App() {
  return (
    <Container sx={{ backgroundColor: 'none' }} maxWidth='sm'>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
        </Routes>
      </Router>
    </Container>
  )
}

export default App
