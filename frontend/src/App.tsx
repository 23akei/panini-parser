import { useState, useEffect } from 'react'
import { apiClient } from './api/api-client'
import './App.css'

interface GameSession {
  session_id: string;
  message: string;
  current_word: string;
  instructions: string;
}

interface ParseResponse {
  word: string;
  parsed: boolean;
  analysis: string;
  message: string;
}

function App() {
  const [gameSession, setGameSession] = useState<GameSession | null>(null)
  const [parseResult, setParseResult] = useState<ParseResponse | null>(null)
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const startGame = async () => {
    try {
      setIsLoading(true)
      const session = await apiClient.startGame()
      setGameSession(session)
      setParseResult(null)
    } catch (error) {
      console.error('Failed to start game:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const parseWord = async () => {
    if (!userInput.trim()) return
    
    try {
      setIsLoading(true)
      const result = await apiClient.parseWord(userInput)
      setParseResult(result)
    } catch (error) {
      console.error('Failed to parse word:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    startGame()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎮 Panini Parser</h1>
        <p>Sanskrit Parsing Game using Vidyut Engine</p>
      </header>

      <main className="game-container">
        {gameSession && (
          <div className="game-session">
            <h2>Game Session</h2>
            <div className="word-display">
              <h3>Parse this word:</h3>
              <div className="sanskrit-word">{gameSession.current_word}</div>
            </div>
            
            <div className="input-section">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter your analysis..."
                disabled={isLoading}
              />
              <button onClick={parseWord} disabled={isLoading || !userInput.trim()}>
                {isLoading ? 'Parsing...' : 'Parse'}
              </button>
            </div>

            {parseResult && (
              <div className="parse-result">
                <h3>Result:</h3>
                <p><strong>Word:</strong> {parseResult.word}</p>
                <p><strong>Analysis:</strong> {parseResult.analysis}</p>
                <p><strong>Note:</strong> {parseResult.message}</p>
              </div>
            )}
          </div>
        )}

        <div className="actions">
          <button onClick={startGame} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'New Game'}
          </button>
        </div>
      </main>
    </div>
  )
}

export default App