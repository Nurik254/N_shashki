'use client'

import { motion } from 'framer-motion'
import { Clock, RotateCcw, Trophy, User } from 'lucide-react'
import { useGameStore } from '@/store/game-store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useGameTimer } from '@/hooks/use-game-timer'
import { useEffect } from 'react'

export function GameInfo() {
  const { currentPlayer, winner, isGameOver, resetGame, moveHistory, playerStats, settings } = useGameStore()
  
  const { timeLeft, formatTime, reset: resetTimer } = useGameTimer(
    settings.timerEnabled,
    settings.timerDuration,
    () => {
      // Handle time up - could end game or switch turns
    }
  )

  useEffect(() => {
    if (isGameOver) {
      resetTimer()
    }
  }, [isGameOver, resetTimer])

  useEffect(() => {
    if (!isGameOver) {
      resetTimer()
    }
  }, [currentPlayer, isGameOver, resetTimer])

  return (
    <div className="space-y-4">
      {/* Current Player Indicator */}
      {!isGameOver && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-4 h-4 rounded-full',
                currentPlayer === 'red' ? 'bg-red-500' : 'bg-gray-800'
              )}
            />
            <span className="font-semibold">
              {currentPlayer === 'red' ? "Red's Turn" : "Black's Turn"}
            </span>
            {settings.gameMode === 'ai' && currentPlayer === 'black' && (
              <span className="text-sm text-muted-foreground">(AI)</span>
            )}
          </div>
          
          {settings.timerEnabled && (
            <div className={cn(
              'flex items-center gap-2 font-mono',
              timeLeft <= 30 && 'text-red-500'
            )}>
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Game Over Banner */}
      {isGameOver && winner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 shadow-2xl text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h2 className="text-2xl font-bold">
              {winner === 'red' ? 'Red' : 'Black'} Wins!
            </h2>
          </div>
          <p className="text-muted-foreground mb-4">
            {moveHistory.length} moves played
          </p>
          <Button onClick={resetGame} size="lg" className="w-full">
            Play Again
          </Button>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-card border border-border/50 text-center"
        >
          <User className="h-5 w-5 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold">{playerStats.gamesPlayed}</div>
          <div className="text-xs text-muted-foreground">Games</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-card border border-border/50 text-center"
        >
          <Trophy className="h-5 w-5 mx-auto mb-2 text-yellow-500" />
          <div className="text-2xl font-bold">{playerStats.wins}</div>
          <div className="text-xs text-muted-foreground">Wins</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-card border border-border/50 text-center"
        >
          <div className="text-2xl font-bold">{playerStats.rating}</div>
          <div className="text-xs text-muted-foreground">Rating</div>
        </motion.div>
      </div>

      {/* Controls */}
      <Button
        variant="outline"
        onClick={resetGame}
        className="w-full"
        disabled={isGameOver}
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset Game
      </Button>
    </div>
  )
}
