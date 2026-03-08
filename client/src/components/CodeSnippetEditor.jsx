import React, { useState } from 'react'
import { X, Plus } from 'lucide-react'

const LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'csharp',
  'php',
  'ruby',
  'go',
  'rust',
  'sql',
  'html',
  'css',
  'jsx',
  'tsx',
  'json',
  'xml',
  'bash',
  'shell',
  'yaml',
]

const CodeSnippetEditor = ({ onAddSnippet }) => {
  const [showForm, setShowForm] = useState(false)
  const [language, setLanguage] = useState('javascript')
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')

  const handleAdd = () => {
    if (!code.trim()) {
      alert('Please enter some code')
      return
    }

    onAddSnippet({
      title: title || `${language} snippet`,
      language,
      code,
    })

    // Reset form
    setCode('')
    setTitle('')
    setLanguage('javascript')
    setShowForm(false)
  }

  return (
    <div>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className='flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer'
        >
          <Plus className='w-4 h-4' />
          Add Code Snippet
        </button>
      ) : (
        <div className='bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-200'>
          <div className='flex items-center justify-between'>
            <h3 className='font-semibold text-gray-900'>Add Code Snippet</h3>
            <button
              onClick={() => setShowForm(false)}
              className='text-gray-500 hover:text-gray-700 cursor-pointer'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          <div className='space-y-3'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Title (optional)
              </label>
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='e.g., Authentication Logic'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm'
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Code
              </label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder='Paste your code here...'
                rows={8}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm font-mono resize-none'
              />
            </div>

            <div className='flex gap-2 justify-end'>
              <button
                onClick={() => setShowForm(false)}
                className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition cursor-pointer text-sm'
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className='px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition cursor-pointer text-sm'
              >
                Add Snippet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CodeSnippetEditor
