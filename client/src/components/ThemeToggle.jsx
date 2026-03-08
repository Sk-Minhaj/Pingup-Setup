import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

const ThemeToggle = ({className = ''}) => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const handleToggle = () => {
    toggleTheme()
  }

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 justify-center px-3 py-2 rounded-lg border transition shadow-sm font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
        isDark
          ? 'bg-gray-900 border-gray-700 text-yellow-300 hover:bg-gray-800'
          : 'bg-white border-gray-200 text-indigo-700 hover:bg-gray-100'
      } ${className}`}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      type="button"
    >
      {isDark ? <Sun className='w-5 h-5' /> : <Moon className='w-5 h-5' />}
      <span className='hidden sm:inline text-nowrap'>{isDark ? 'Light' : 'Dark'} Mode</span>
    </button>
  )
}

export default ThemeToggle
