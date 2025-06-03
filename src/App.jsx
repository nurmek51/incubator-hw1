import { useState, useEffect, createContext, useContext } from 'react'
import './App.css'

// Создаем контекст для темы
const ThemeContext = createContext()

function App() {
  // Состояние темы и функция для её изменения
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`app-root ${theme}`} style={{ fontFamily: 'Roboto, sans-serif' }}>
        <header className="app-header">
          <h1>Welcome brat</h1>
        </header>
        <main>
          <p></p>
          <TimerApp />
        </main>
      </div>
    </ThemeContext.Provider>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext)
  return (
    <div className="theme-toggle">
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="theme-btn"
      >
        {theme === 'light' ? 'Темная тема' : 'Светлая тема'}
      </button>
    </div>
  )
}

function TimerApp() {
  // Уровень 1
  const [name, setName] = useState('')
  const [timeLeft, setTimeLeft] = useState(10)
  const [isRunning, setIsRunning] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  // Уровень 2
  const [motivationalPhrases] = useState([
    'Salamaleikum, [Имя]',
    'Krasava ty leeee [Имя]!',
    'emaaaa danu nafig ee [Имя]!',
    'oooouuuu eeeeeeeeeeeee, [Имя]! ',
    'sozim jok legenda, [Имя]!'
  ])

  // Уровень 3
  const [selectedTime, setSelectedTime] = useState(10)
  const [completedCount, setCompletedCount] = useState(() =>
    parseInt(localStorage.getItem('completedCount') || '0')
  )
  const [savedName, setSavedName] = useState(() =>
    localStorage.getItem('savedName') || ''
  )

  useEffect(() => {
    if (savedName && !name) {
      setName(savedName)
    }
  }, [savedName, name])

  useEffect(() => {
    let interval = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false)
      setIsCompleted(true)

      const newCount = completedCount + 1
      setCompletedCount(newCount)
      localStorage.setItem('completedCount', newCount.toString())

      if (name) {
        localStorage.setItem('savedName', name)
        setSavedName(name)
      }
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, completedCount, name])

  const startTimer = () => {
    if (name.trim()) {
      setIsRunning(true)
      setIsCompleted(false)
      setTimeLeft(selectedTime)
    }
  }

  const resetTimer = () => {
    setIsRunning(false)
    setIsCompleted(false)
    setTimeLeft(selectedTime)
    setName('')
    setCompletedCount(0)
    setSavedName('')
    localStorage.removeItem('completedCount')
    localStorage.removeItem('savedName')
  }

  const tryAgain = () => {
    setIsCompleted(false)
    setTimeLeft(selectedTime)
  }

  const getRandomPhrase = () => {
    const randomIndex = Math.floor(Math.random() * motivationalPhrases.length)
    return motivationalPhrases[randomIndex].replace('[Имя]', name)
  }

  const progressPercentage = ((selectedTime - timeLeft) / selectedTime) * 100

  return (
    <div className="timer-container">
      <ThemeToggle />
      <h1>Таймер мотивации</h1>

      {completedCount > 0 && (
        <div className="stats">
          <p>Завершено таймеров: {completedCount}</p>
        </div>
      )}

      {!isCompleted && (
        <div className="input-section">
          <input
            type="text"
            placeholder="Введите ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isRunning}
            className="name-input"
          />

          <div className="time-selector">
            <label>Выберите время:</label>
            <select
              value={selectedTime}
              onChange={(e) => {
                const newTime = parseInt(e.target.value)
                setSelectedTime(newTime)
                if (!isRunning) setTimeLeft(newTime)
              }}
              disabled={isRunning}
            >
              <option value={10}>10 секунд</option>
              <option value={20}>20 секунд</option>
              <option value={30}>30 секунд</option>
            </select>
          </div>
        </div>
      )}

      <div className="timer-display">
        {isRunning && (
          <div className="countdown">
            <h2>{name}, осталось {timeLeft} сек</h2>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="completion-message">
            <h2 className="success-message">{getRandomPhrase()}</h2>
            <div className="celebration"></div>
          </div>
        )}
      </div>

      <div className="button-section">
        {!isRunning && !isCompleted && (
          <button
            onClick={startTimer}
            disabled={!name.trim()}
            className="start-btn"
          >
            Старт таймера
          </button>
        )}

        {isCompleted && (
          <button onClick={tryAgain} className="try-again-btn">
            Попробовать ещё раз
          </button>
        )}

        <button onClick={resetTimer} className="reset-btn">
          Сброс
        </button>
      </div>
    </div>
  )
}

export default App
