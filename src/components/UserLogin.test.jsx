import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserLogin from './UserLogin'

describe('UserLogin Component', () => {
  beforeEach(() => {
    // Clear any previous mocks
    jest.clearAllMocks()
    // Suppress console.log for tests
    jest.spyOn(console, 'log').mockImplementation(() => {})
    window.alert = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('renders user login form', () => {
    render(<UserLogin />)
    
    expect(screen.getByText('User Login')).toBeInTheDocument()
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  test('renders email input field with placeholder', () => {
    render(<UserLogin />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email')
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  test('renders password input field with placeholder', () => {
    render(<UserLogin />)
    
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    expect(passwordInput).toBeInTheDocument()
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('handles email input changes', async () => {
    const user = userEvent.setup()
    render(<UserLogin />)
    
    const emailInput = screen.getByLabelText('Email')
    await user.type(emailInput, 'user@example.com')
    
    expect(emailInput).toHaveValue('user@example.com')
  })

  test('handles password input changes', async () => {
    const user = userEvent.setup()
    render(<UserLogin />)
    
    const passwordInput = screen.getByLabelText('Password')
    await user.type(passwordInput, 'password123')
    
    expect(passwordInput).toHaveValue('password123')
  })

  test('shows error message when submitting empty form', async () => {
    const user = userEvent.setup()
    render(<UserLogin />)
    
    const submitButton = screen.getByRole('button', { name: /login/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument()
    })
  })

  test('shows error message when email is empty', async () => {
    const user = userEvent.setup()
    render(<UserLogin />)
    
    const passwordInput = screen.getByLabelText('Password')
    await user.type(passwordInput, 'password123')
    
    const submitButton = screen.getByRole('button', { name: /login/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument()
    })
  })

  test('shows error message when password is empty', async () => {
    const user = userEvent.setup()
    render(<UserLogin />)
    
    const emailInput = screen.getByLabelText('Email')
    await user.type(emailInput, 'user@example.com')
    
    const submitButton = screen.getByRole('button', { name: /login/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument()
    })
  })

  test('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(<UserLogin />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /login/i })
    
    await user.type(emailInput, 'user@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    // Button should show loading state
    expect(screen.getByText('Logging in...')).toBeInTheDocument()
    
    // Wait for form submission to complete
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('User login successful!')
    }, { timeout: 2000 })
  })

  test('disables inputs during submission', async () => {
    const user = userEvent.setup()
    render(<UserLogin />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /login/i })
    
    await user.type(emailInput, 'user@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    // Inputs should be disabled during loading
    expect(emailInput).toBeDisabled()
    expect(passwordInput).toBeDisabled()
    expect(submitButton).toBeDisabled()
  })

  test('clears form after successful submission', async () => {
    const user = userEvent.setup()
    render(<UserLogin />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /login/i })
    
    await user.type(emailInput, 'user@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    // Wait for submission to complete and form to reset
    await waitFor(() => {
      expect(emailInput).toHaveValue('')
      expect(passwordInput).toHaveValue('')
    }, { timeout: 2000 })
  })

  test('renders forgot password link', () => {
    render(<UserLogin />)
    
    const forgotPasswordLink = screen.getByText('Forgot password?')
    expect(forgotPasswordLink).toBeInTheDocument()
    expect(forgotPasswordLink).toHaveAttribute('href', '#')
  })
})

