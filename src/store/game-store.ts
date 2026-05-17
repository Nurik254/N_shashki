import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GameState, GameSettings, Player, Move, Piece, PlayerStats, Achievement } from '@/types/checkers'
import { CheckersRules } from '@/lib/game-engine/checkers-rules'
import { AIEngine } from '@/lib/game-engine/ai-engine'
import { soundManager } from '@/lib/sound-manager'

interface GameStore extends GameState {
  settings: GameSettings
  playerStats: PlayerStats
  achievements: Achievement[]
  theme: 'light' | 'dark'
  
  // Actions
  selectPiece: (piece: Piece | null) => void
  makeMove: (move: Move) => void
  resetGame: () => void
  undoMove: () => void
  updateSettings: (settings: Partial<GameSettings>) => void
  toggleTheme: () => void
  updatePlayerStats: (result: 'win' | 'loss' | 'draw') => void
  unlockAchievement: (achievementId: string) => void
  makeAIMove: () => void
}

const initialSettings: GameSettings = {
  gameMode: 'pvp',
  aiDifficulty: 'medium',
  timerEnabled: false,
  timerDuration: 600,
  soundEnabled: true,
  boardTheme: 'classic'
}

const initialPlayerStats: PlayerStats = {
  wins: 0,
  losses: 0,
  draws: 0,
  gamesPlayed: 0,
  rating: 1200
}

const initialAchievements: Achievement[] = [
  {
    id: 'first_win',
    title: 'First Victory',
    description: 'Win your first game',
    icon: '🏆',
    unlocked: false
  },
  {
    id: 'king_maker',
    title: 'King Maker',
    description: 'Promote a piece to king',
    icon: '👑',
    unlocked: false
  },
  {
    id: 'double_capture',
    title: 'Double Trouble',
    description: 'Capture two pieces in one turn',
    icon: '⚡',
    unlocked: false
  },
  {
    id: 'perfect_game',
    title: 'Perfect Game',
    description: 'Win without losing any pieces',
    icon: '💎',
    unlocked: false
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Win a game in under 2 minutes',
    icon: '🚀',
    unlocked: false
  }
]

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      board: CheckersRules.initializeBoard(),
      currentPlayer: 'red',
      selectedPiece: null,
      validMoves: [],
      moveHistory: [],
      winner: null,
      isGameOver: false,
      mustCapture: false,
      capturingPiece: null,
      settings: initialSettings,
      playerStats: initialPlayerStats,
      achievements: initialAchievements,
      theme: 'dark',

      // Actions
      selectPiece: (piece) => {
        const { board, currentPlayer, mustCapture, capturingPiece } = get()
        
        if (!piece || piece.player !== currentPlayer) {
          set({ selectedPiece: null, validMoves: [] })
          return
        }

        // If in the middle of a multi-capture, only allow selecting the capturing piece
        if (capturingPiece && piece.id !== capturingPiece.id) {
          set({ selectedPiece: null, validMoves: [] })
          return
        }

        const moves = CheckersRules.getValidMoves(board, piece, mustCapture)
        set({ selectedPiece: piece, validMoves: moves })
      },

      makeMove: (move) => {
        const { board, selectedPiece, moveHistory, settings, currentPlayer } = get()
        
        if (!selectedPiece) return

        const newBoard = CheckersRules.applyMove(board, move)
        const newMoveHistory = [...moveHistory, move]

        // Play sound effects
        if (settings.soundEnabled) {
          if (move.isCapture) {
            soundManager.playCapture()
          } else {
            soundManager.playMove()
          }
          
          if (move.isKingPromotion) {
            soundManager.playKingPromotion()
          }
        }

        // Check for king promotion achievement
        if (move.isKingPromotion) {
          const { achievements } = get()
          const kingMaker = achievements.find(a => a.id === 'king_maker')
          if (kingMaker && !kingMaker.unlocked) {
            get().unlockAchievement('king_maker')
          }
        }

        // Check for double capture achievement
        if (moveHistory.length > 0 && moveHistory[moveHistory.length - 1].isCapture && move.isCapture) {
          const { achievements } = get()
          const doubleCapture = achievements.find(a => a.id === 'double_capture')
          if (doubleCapture && !doubleCapture.unlocked) {
            get().unlockAchievement('double_capture')
          }
        }

        // Check if the piece can continue capturing
        const movedPiece = newBoard[move.to.row][move.to.col]
        const canContinueCapture = movedPiece && CheckersRules.canContinueCapture(newBoard, movedPiece)

        if (canContinueCapture) {
          set({
            board: newBoard,
            moveHistory: newMoveHistory,
            selectedPiece: movedPiece,
            capturingPiece: movedPiece,
            mustCapture: true,
            validMoves: CheckersRules.getCaptureMoves(newBoard, movedPiece)
          })
        } else {
          // Switch turns
          const nextPlayer: Player = currentPlayer === 'red' ? 'black' : 'red'
          const winner = CheckersRules.checkWinner(newBoard, nextPlayer)
          const mustCaptureNext = CheckersRules.hasAvailableCaptures(newBoard, nextPlayer)

          set({
            board: newBoard,
            moveHistory: newMoveHistory,
            currentPlayer: nextPlayer,
            selectedPiece: null,
            validMoves: [],
            capturingPiece: null,
            mustCapture: mustCaptureNext,
            winner,
            isGameOver: winner !== null
          })

          // Play win sound if game is over
          if (winner && settings.soundEnabled) {
            soundManager.playWin()
          }

          // If playing against AI and it's AI's turn, make AI move
          if (settings.gameMode === 'ai' && nextPlayer === 'black' && !winner) {
            setTimeout(() => get().makeAIMove(), 500)
          }
        }
      },

      resetGame: () => {
        const { settings, playerStats } = get()
        set({
          board: CheckersRules.initializeBoard(),
          currentPlayer: 'red',
          selectedPiece: null,
          validMoves: [],
          moveHistory: [],
          winner: null,
          isGameOver: false,
          mustCapture: false,
          capturingPiece: null
        })
      },

      undoMove: () => {
        const { moveHistory, board } = get()
        if (moveHistory.length === 0) return

        // This is a simplified undo - in a full implementation, you'd need to track board states
        // For now, just reset the game
        get().resetGame()
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }))
      },

      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light'
        }))
      },

      updatePlayerStats: (result) => {
        set((state) => {
          const newStats = {
            wins: state.playerStats.wins + (result === 'win' ? 1 : 0),
            losses: state.playerStats.losses + (result === 'loss' ? 1 : 0),
            draws: state.playerStats.draws + (result === 'draw' ? 1 : 0),
            gamesPlayed: state.playerStats.gamesPlayed + 1,
            rating: state.playerStats.rating + (result === 'win' ? 25 : result === 'loss' ? -20 : 0)
          }

          // Check for first win achievement
          if (result === 'win' && state.playerStats.wins === 0) {
            const firstWin = state.achievements.find(a => a.id === 'first_win')
            if (firstWin && !firstWin.unlocked) {
              get().unlockAchievement('first_win')
            }
          }

          return { playerStats: newStats }
        })
      },

      unlockAchievement: (achievementId) => {
        set((state) => ({
          achievements: state.achievements.map(a =>
            a.id === achievementId
              ? { ...a, unlocked: true, unlockedAt: new Date() }
              : a
          )
        }))
      },

      makeAIMove: () => {
        const { board, currentPlayer, settings, mustCapture } = get()
        const move = AIEngine.getBestMove(board, currentPlayer, settings.aiDifficulty)
        
        if (move) {
          // Find the piece at the from position
          const piece = board[move.from.row][move.from.col]
          if (piece) {
            set({ selectedPiece: piece, validMoves: [move] })
            setTimeout(() => get().makeMove(move), 300)
          }
        }
      }
    }),
    {
      name: 'checkers-game-storage',
      partialize: (state) => ({
        settings: state.settings,
        playerStats: state.playerStats,
        achievements: state.achievements,
        theme: state.theme,
        board: state.board,
        currentPlayer: state.currentPlayer,
        selectedPiece: state.selectedPiece,
        validMoves: state.validMoves,
        moveHistory: state.moveHistory,
        winner: state.winner,
        isGameOver: state.isGameOver,
        mustCapture: state.mustCapture,
        capturingPiece: state.capturingPiece
      })
    }
  )
)
