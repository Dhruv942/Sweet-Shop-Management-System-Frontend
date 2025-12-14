import { useState } from 'react'
import './Login.css'

function UserLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    // Simulate API call
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('User login:', { email, password })
      alert('User login successful!')
      // Reset form
      setEmail('')
      setPassword('')
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">User Login</h1>
        <p className="login-subtitle">Sign in to your account</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <a href="#" className="forgot-password">Forgot password?</a>
        </div>
      </div>
    </div>
  )
}

export default UserLogin

