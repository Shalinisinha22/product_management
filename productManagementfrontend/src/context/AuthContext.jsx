import { createContext, useState } from 'react'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  // Demo user credentials
  const DEMO_USER = {
    username: 'admin',
    password: 'admin123',
    name: 'Admin User',
  }

  // Check if user is logged in from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true'
  })

  // Login function
  const login = (username, password) => {
    // Check credentials
    if (username === DEMO_USER.username && password === DEMO_USER.password) {
      const userData = {
        username: DEMO_USER.username,
        name: DEMO_USER.name,
      }
      setUser(userData)
      setIsAuthenticated(true)
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('isAuthenticated', 'true')
      return { success: true, message: 'Login successful!' }
    } else {
      return { success: false, message: 'Invalid username or password' }
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    // Clear localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('isAuthenticated')
  }

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

