import React, { useState, useEffect } from 'react'
import { Copy, Check, Sun, Moon } from 'lucide-react'
import toast from 'react-hot-toast'

// Syntax highlighting helper - simple implementation
const highlightCode = (code, language) => {
  // This is a simplified version. In production, use highlight.js or prism.js
  // For now, we'll just return the code with basic formatting
  return code
}

const CodeSnippetDisplay = ({ snippet }) => {
  const [copied, setCopied] = useState(false)
  const [theme, setTheme] = useState('dark') // 'dark' or 'light'

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code)
    setCopied(true)
    toast.success('Code copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const isDarkTheme = theme === 'dark'

  return (
    <div
      className={`rounded-lg overflow-hidden border ${
        isDarkTheme
          ? 'bg-gray-900 border-gray-700'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b ${
          isDarkTheme
            ? 'bg-gray-800 border-gray-700'
            : 'bg-gray-100 border-gray-200'
        }`}
      >
        <div className='flex items-center gap-3'>
          <span
            className={`text-sm font-semibold ${
              isDarkTheme ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {snippet.title}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded ${
              isDarkTheme
                ? 'bg-indigo-900/50 text-indigo-300'
                : 'bg-indigo-100 text-indigo-700'
            }`}
          >
            {snippet.language}
          </span>
        </div>

        <div className='flex items-center gap-2'>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-1.5 rounded transition cursor-pointer ${
              isDarkTheme
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
            }`}
            title='Toggle theme'
          >
            {isDarkTheme ? (
              <Sun className='w-4 h-4' />
            ) : (
              <Moon className='w-4 h-4' />
            )}
          </button>

          <button
            onClick={handleCopy}
            className={`p-1.5 rounded transition cursor-pointer flex items-center gap-1 ${
              isDarkTheme
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
            }`}
            title='Copy code'
          >
            {copied ? (
              <>
                <Check className='w-4 h-4 text-green-500' />
                <span className='text-xs text-green-500'>Copied!</span>
              </>
            ) : (
              <Copy className='w-4 h-4' />
            )}
          </button>
        </div>
      </div>

      {/* Code */}
      <pre
        className={`p-4 overflow-x-auto text-sm font-mono ${
          isDarkTheme
            ? 'bg-gray-900 text-gray-100'
            : 'bg-white text-gray-900'
        }`}
      >
        <code>{snippet.code}</code>
      </pre>
    </div>
  )
}

export default CodeSnippetDisplay
