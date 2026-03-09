import React, { useState, useEffect } from 'react'

const TypeWriter = ({ text, speed = 150, className = '', loopDelay = 2000 }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[index])
        setIndex(index + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else if (index === text.length && text.length > 0) {
      // After typing is complete, wait and restart
      const restartTimer = setTimeout(() => {
        setDisplayedText('')
        setIndex(0)
      }, loopDelay)
      return () => clearTimeout(restartTimer)
    }
  }, [index, text, speed, loopDelay])

  return (
    <span className={className}>
      {displayedText}
      {index <= text.length && (
        <span className='animate-pulse'>|</span>
      )}
    </span>
  )
}

export default TypeWriter
