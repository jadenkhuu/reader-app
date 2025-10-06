import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState('')
  const [words, setWords] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [wpm, setWpm] = useState(250)
  const [displayText, setDisplayText] = useState('Ready to start')
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (text.trim()) {
      const newWords = text.split(/\s+/).filter(word => word.length > 0)
      setWords(newWords)
    } else {
      setWords([])
    }
  }, [text])

  useEffect(() => {
    if (isPlaying && currentIndex < words.length) {
      setDisplayText(words[currentIndex])
      const delay = 60000 / wpm
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex(prev => prev + 1)
      }, delay)
    } else if (currentIndex >= words.length && words.length > 0 && isPlaying) {
      setDisplayText('Complete!')
      setIsPlaying(false)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isPlaying, currentIndex, words, wpm])

  const togglePlayPause = () => {
    if (!text.trim()) return

    if (!isPlaying) {
      if (currentIndex >= words.length) {
        setCurrentIndex(0)
      }
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
      setDisplayText('Paused')
    }
  }

  const resetReading = () => {
    setIsPlaying(false)
    setCurrentIndex(0)
    setDisplayText('Ready to start')
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const progressPercentage = words.length > 0 ? (currentIndex / words.length) * 100 : 0
  const wordsRemaining = words.length - currentIndex
  const minutesLeft = wordsRemaining / wpm
  const seconds = Math.round(minutesLeft * 60)
  const displayMinutes = Math.floor(seconds / 60)
  const displaySeconds = seconds % 60

  return (
    <div className="container">
      <h1>Reader App</h1>

      <div className="input-section">
        <textarea
          id="text-input"
          placeholder="Paste or type your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isPlaying}
        />
      </div>

      <div className="display-area">
        <div id="word-display">{displayText}</div>
      </div>

      <div className="controls">
        <button
          className="btn-primary"
          onClick={togglePlayPause}
          disabled={!text.trim()}
        >
          {isPlaying ? <span className="pause-icon">❚❚</span> : <span className="play-icon">▶</span>}
        </button>
        <button
          className="btn-danger"
          onClick={resetReading}
          disabled={words.length === 0}
        >
          ⏮
        </button>
      </div>

      <div className="speed-control">
        <label htmlFor="speed-slider">Speed:</label>
        <input
          type="range"
          id="speed-slider"
          min="100"
          max="1000"
          value={wpm}
          step="10"
          onChange={(e) => setWpm(parseInt(e.target.value))}
        />
        <span id="speed-value">{wpm} WPM</span>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
      </div>

      <div className="stats">
        <div className="stat-item">
          <div className="stat-label">Words</div>
          <div className="stat-value">{words.length}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Current</div>
          <div className="stat-value">{currentIndex}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Time Left</div>
          <div className="stat-value">
            {displayMinutes}:{displaySeconds.toString().padStart(2, '0')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
