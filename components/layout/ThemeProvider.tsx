'use client'
import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
interface ThemeContextValue { theme: Theme; toggleTheme: () => void }
const ThemeContext = createContext<ThemeContextValue>({ theme: 'light', toggleTheme: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')

  useEffect(() => {
    const stored = localStorage.getItem('maisonoir-theme') as Theme | null
    const t = stored ?? 'light'
    setThemeState(t)
    applyTheme(t)
  }, [])

  const applyTheme = (t: Theme) => {
    document.body.classList.remove('dark', 'light')
    document.body.classList.add(t)
    document.documentElement.classList.toggle('dark', t === 'dark')
  }

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setThemeState(next)
    localStorage.setItem('maisonoir-theme', next)
    applyTheme(next)
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
