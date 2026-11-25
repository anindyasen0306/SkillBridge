/**
 * ThemeContext
 * Manages dark/light mode. Persists preference to localStorage.
 * Applies 'dark' class to <html> element for Tailwind dark mode.
 */

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('sb_theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('sb_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('sb_theme', 'light')
    }
  }, [dark])

  const toggleTheme = () => setDark((d) => !d)

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
