import { Piece, Move, Player, Position } from '@/types/checkers'
import { CheckersRules } from './checkers-rules'

export class AIEngine {
  static getBestMove(
    board: (Piece | null)[][], 
    player: Player, 
    difficulty: 'easy' | 'medium' | 'hard'
  ): Move | null {
    const mustCapture = CheckersRules.hasAvailableCaptures(board, player)
    const allMoves = this.getAllMoves(board, player, mustCapture)

    if (allMoves.length === 0) return null

    switch (difficulty) {
      case 'easy':
        return this.getRandomMove(allMoves)
      case 'medium':
        return this.getMediumMove(board, allMoves, player)
      case 'hard':
        return this.getHardMove(board, player, mustCapture)
      default:
        return this.getRandomMove(allMoves)
    }
  }

  private static getAllMoves(
    board: (Piece | null)[][], 
    player: Player, 
    mustCapture: boolean
  ): Move[] {
    const moves: Move[] = []
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece && piece.player === player) {
          const pieceMoves = CheckersRules.getValidMoves(board, piece, mustCapture)
          moves.push(...pieceMoves)
        }
      }
    }

    return moves
  }

  private static getRandomMove(moves: Move[]): Move {
    return moves[Math.floor(Math.random() * moves.length)]
  }

  private static getMediumMove(
    board: (Piece | null)[][], 
    moves: Move[], 
    player: Player
  ): Move {
    // Prefer captures
    const captures = moves.filter(m => m.isCapture)
    if (captures.length > 0) {
      return this.getRandomMove(captures)
    }

    // Prefer king promotions
    const promotions = moves.filter(m => m.isKingPromotion)
    if (promotions.length > 0) {
      return this.getRandomMove(promotions)
    }

    // Prefer moves toward center
    const scoredMoves = moves.map(move => ({
      move,
      score: this.evaluatePosition(board, move.to, player)
    }))

    scoredMoves.sort((a, b) => b.score - a.score)
    
    // Pick from top 3 moves
    const topMoves = scoredMoves.slice(0, Math.min(3, scoredMoves.length))
    return this.getRandomMove(topMoves.map(m => m.move))
  }

  private static getHardMove(
    board: (Piece | null)[][], 
    player: Player, 
    mustCapture: boolean
  ): Move {
    const depth = 4
    const bestMove = this.minimax(board, depth, -Infinity, Infinity, true, player, mustCapture)
    return bestMove.move || this.getRandomMove(this.getAllMoves(board, player, mustCapture))
  }

  private static minimax(
    board: (Piece | null)[][],
    depth: number,
    alpha: number,
    beta: number,
    maximizing: boolean,
    player: Player,
    mustCapture: boolean
  ): { move: Move | null; score: number } {
    const opponent: Player = player === 'red' ? 'black' : 'red'
    const winner = CheckersRules.checkWinner(board, maximizing ? player : opponent)

    if (winner === player) return { move: null, score: 1000 }
    if (winner === opponent) return { move: null, score: -1000 }
    if (depth === 0) return { move: null, score: this.evaluateBoard(board, player) }

    const moves = this.getAllMoves(board, maximizing ? player : opponent, mustCapture)

    if (moves.length === 0) {
      return { move: null, score: maximizing ? -1000 : 1000 }
    }

    let bestMove: Move | null = null

    if (maximizing) {
      let maxScore = -Infinity
      for (const move of moves) {
        const newBoard = CheckersRules.applyMove(board, move)
        const result = this.minimax(newBoard, depth - 1, alpha, beta, false, player, false)
        
        if (result.score > maxScore) {
          maxScore = result.score
          bestMove = move
        }
        alpha = Math.max(alpha, result.score)
        if (beta <= alpha) break
      }
      return { move: bestMove, score: maxScore }
    } else {
      let minScore = Infinity
      for (const move of moves) {
        const newBoard = CheckersRules.applyMove(board, move)
        const result = this.minimax(newBoard, depth - 1, alpha, beta, true, player, false)
        
        if (result.score < minScore) {
          minScore = result.score
          bestMove = move
        }
        beta = Math.min(beta, result.score)
        if (beta <= alpha) break
      }
      return { move: bestMove, score: minScore }
    }
  }

  private static evaluateBoard(board: (Piece | null)[][], player: Player): number {
    let score = 0
    const opponent = player === 'red' ? 'black' : 'red'

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece) {
          const pieceValue = piece.type === 'king' ? 5 : 1
          const positionValue = this.evaluatePosition(board, { row, col }, piece.player)
          
          if (piece.player === player) {
            score += pieceValue + positionValue
          } else {
            score -= pieceValue + positionValue
          }
        }
      }
    }

    return score
  }

  private static evaluatePosition(
    board: (Piece | null)[][], 
    pos: Position, 
    player: Player
  ): number {
    const { row, col } = pos
    let score = 0

    // Center control
    const centerDistance = Math.abs(row - 3.5) + Math.abs(col - 3.5)
    score += (7 - centerDistance) * 0.1

    // Edge preference (safer)
    if (row === 0 || row === 7 || col === 0 || col === 7) {
      score += 0.2
    }

    // Advancement toward promotion
    if (player === 'red') {
      score += (7 - row) * 0.15
    } else {
      score += row * 0.15
    }

    return score
  }
}
