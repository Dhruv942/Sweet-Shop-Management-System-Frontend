import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import UserLogin from './components/UserLogin'
import Register from './auth/Register'
import Shop from './pages/Shop'

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shop" element={<Shop />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

