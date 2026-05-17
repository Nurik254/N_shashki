'use client'

import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'
import { useGameStore } from '@/store/game-store'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const BOARD_THEMES = {
  classic: {
    light: '#f0d9b5',
    dark: '#b58863',
    highlight: 'rgba(255, 255, 0, 0.4)',
    validMove: 'rgba(0, 255, 0, 0.3)'
  },
  modern: {
    light: '#e8e8e8',
    dark: '#4a4a4a',
    highlight: 'rgba(100, 200, 255, 0.4)',
    validMove: 'rgba(0, 200, 100, 0.3)'
  },
  forest: {
    light: '#a8d5a2',
    dark: '#4a7c59',
    highlight: 'rgba(255, 255, 0, 0.4)',
    validMove: 'rgba(0, 255, 0, 0.3)'
  },
  ocean: {
    light: '#a8d5e2',
    dark: '#4a7c8f',
    highlight: 'rgba(255, 255, 0, 0.4)',
    validMove: 'rgba(0, 255, 0, 0.3)'
  }
}

export function GameBoard() {
  const { board, selectedPiece, validMoves, selectPiece, makeMove, settings, currentPlayer, mustCapture } = useGameStore()
  const theme = BOARD_THEMES[settings.boardTheme]
  const [draggedPiece, setDraggedPiece] = useState<{ row: number; col: number } | null>(null)

  const handleSquareClick = (row: number, col: number) => {
    const piece = board[row][col]
    
    if (piece) {
      selectPiece(piece)
    } else if (selectedPiece) {
      const validMove = validMoves.find(m => m.to.row === row && m.to.col === col)
      if (validMove) {
        makeMove(validMove)
      }
    }
  }

  const handleDragStart = (e: React.DragEvent, row: number, col: number) => {
    const piece = board[row][col]
    if (piece && piece.player === currentPlayer && (!mustCapture || (selectedPiece && piece.id === selectedPiece.id))) {
      setDraggedPiece({ row, col })
      selectPiece(piece)
      e.dataTransfer.effectAllowed = 'move'
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault()
    if (draggedPiece) {
      const validMove = validMoves.find(m => m.to.row === row && m.to.col === col)
      if (validMove) {
        makeMove(validMove)
      }
      setDraggedPiece(null)
    }
  }

  const handleDragEnd = () => {
    setDraggedPiece(null)
  }

  const isValidMove = (row: number, col: number) => {
    return validMoves.some(m => m.to.row === row && m.to.col === col)
  }

  const isSelected = (row: number, col: number) => {
    return selectedPiece?.row === row && selectedPiece?.col === col
  }

  return (
    <div className="relative aspect-square w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-border/50">
      <div className="grid grid-cols-8 grid-rows-8 h-full">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 === 0
            const backgroundColor = isLight ? theme.light : theme.dark
            
            return (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  'relative cursor-pointer transition-all',
                  isSelected(rowIndex, colIndex) && 'ring-4 ring-yellow-400 ring-inset',
                  isValidMove(rowIndex, colIndex) && 'after:content-[""] after:absolute after:inset-0 after:bg-green-400/30 after:rounded-full'
                )}
                style={{ backgroundColor }}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                whileHover={{ scale: piece ? 1.05 : 1 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (rowIndex * 8 + colIndex) * 0.02 }}
              >
                {piece && (
                  <motion.div
                    draggable={piece.player === currentPlayer && (!mustCapture || (selectedPiece && piece.id === selectedPiece.id))}
                    onDragStart={(e) => handleDragStart(e, rowIndex, colIndex)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      'absolute inset-2 rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing',
                      piece.player === 'red'
                        ? 'bg-gradient-to-br from-red-400 to-red-600 border-4 border-red-300'
                        : 'bg-gradient-to-br from-gray-700 to-gray-900 border-4 border-gray-600',
                      selectedPiece?.id === piece.id && 'ring-4 ring-yellow-400'
                    )}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {piece.type === 'king' && (
                      <Crown className={cn(
                        'h-6 w-6',
                        piece.player === 'red' ? 'text-yellow-300' : 'text-yellow-400'
                      )} />
                    )}
                  </motion.div>
                )}
              </motion.div>
            )
          })
        )}
      </div>
      
      {mustCapture && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg font-semibold"
        >
          Capture Required!
        </motion.div>
      )}
    </div>
  )
}
