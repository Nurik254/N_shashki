import { useState, useEffect, useRef } from 'react'

export function useGameTimer(enabled: boolean, duration: number, onTimeUp?: () => void) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!enabled) {
      setIsRunning(false)
      setTimeLeft(duration)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    setIsRunning(true)
    setTimeLeft(duration)

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          setIsRunning(false)
          onTimeUp?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [enabled, duration, onTimeUp])

  const reset = () => {
    setTimeLeft(duration)
    setIsRunning(enabled)
  }

  const pause = () => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const resume = () => {
    if (enabled && timeLeft > 0) {
      setIsRunning(true)
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            setIsRunning(false)
            onTimeUp?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return {
    timeLeft,
    isRunning,
    formatTime,
    reset,
    pause,
    resume
  }
}
