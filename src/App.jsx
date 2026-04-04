import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landing'
import LoginPage from './pages/login/LoginPage'
import RegisterPage from './pages/register/RegisterPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )
}

export default App
