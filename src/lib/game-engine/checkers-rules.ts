import { Piece, Position, Move, Player } from '@/types/checkers'

const BOARD_SIZE = 8

export class CheckersRules {
  static initializeBoard(): (Piece | null)[][] {
    const board: (Piece | null)[][] = Array(BOARD_SIZE).fill(null).map(() => 
      Array(BOARD_SIZE).fill(null)
    )

    // Place black pieces (top 3 rows)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if ((row + col) % 2 === 1) {
          board[row][col] = {
            id: `black-${row}-${col}`,
            player: 'black',
            type: 'regular',
            row,
            col
          }
        }
      }
    }

    // Place red pieces (bottom 3 rows)
    for (let row = 5; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if ((row + col) % 2 === 1) {
          board[row][col] = {
            id: `red-${row}-${col}`,
            player: 'red',
            type: 'regular',
            row,
            col
          }
        }
      }
    }

    return board
  }

  static getValidMoves(board: (Piece | null)[][], piece: Piece, mustCapture: boolean = false): Move[] {
    const moves: Move[] = []
    const { row, col, player, type } = piece

    // Direction based on player (red moves up, black moves down)
    const directions = type === 'king' 
      ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
      : player === 'red' 
        ? [[-1, -1], [-1, 1]]
        : [[1, -1], [1, 1]]

    // Check for captures first (mandatory)
    const captures = this.getCaptureMoves(board, piece)
    
    if (mustCapture && captures.length > 0) {
      return captures
    }

    if (captures.length > 0) {
      // If captures are available, only return captures
      return captures
    }

    // If no captures and not forced to capture, check regular moves
    if (!mustCapture) {
      for (const [dRow, dCol] of directions) {
        const newRow = row + dRow
        const newCol = col + dCol

        if (this.isValidPosition(newRow, newCol) && !board[newRow][newCol]) {
          const isKingPromotion = this.checkKingPromotion(piece, newRow)
          moves.push({
            from: { row, col },
            to: { row: newRow, col: newCol },
            isCapture: false,
            isKingPromotion
          })
        }
      }

      // Kings can move multiple squares
      if (type === 'king') {
        for (const [dRow, dCol] of directions) {
          let newRow = row + dRow
          let newCol = col + dCol

          while (this.isValidPosition(newRow, newCol) && !board[newRow][newCol]) {
            const isKingPromotion = false // Kings are already kings
            moves.push({
              from: { row, col },
              to: { row: newRow, col: newCol },
              isCapture: false,
              isKingPromotion
            })
            newRow += dRow
            newCol += dCol
          }
        }
      }
    }

    return moves
  }

  static getCaptureMoves(board: (Piece | null)[][], piece: Piece): Move[] {
    const moves: Move[] = []
    const { row, col, player, type } = piece

    const directions = type === 'king' 
      ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
      : player === 'red' 
        ? [[-1, -1], [-1, 1]]
        : [[1, -1], [1, 1]]

    for (const [dRow, dCol] of directions) {
      const jumpRow = row + dRow
      const jumpCol = col + dCol
      const landRow = row + dRow * 2
      const landCol = col + dCol * 2

      if (this.isValidPosition(jumpRow, jumpCol) && 
          this.isValidPosition(landRow, landCol)) {
        const jumpedPiece = board[jumpRow][jumpCol]
        
        if (jumpedPiece && jumpedPiece.player !== player && !board[landRow][landCol]) {
          const isKingPromotion = this.checkKingPromotion(piece, landRow)
          moves.push({
            from: { row, col },
            to: { row: landRow, col: landCol },
            capturedPiece: jumpedPiece,
            isCapture: true,
            isKingPromotion
          })
        }
      }

      // Kings can capture at any distance
      if (type === 'king') {
        let checkRow = row + dRow
        let checkCol = col + dCol

        while (this.isValidPosition(checkRow, checkCol)) {
          const pieceAtPos = board[checkRow][checkCol]
          
          if (pieceAtPos && pieceAtPos.player !== player) {
            const landRow = checkRow + dRow
            const landCol = checkCol + dCol

            if (this.isValidPosition(landRow, landCol) && !board[landRow][landCol]) {
              const isKingPromotion = false
              moves.push({
                from: { row, col },
                to: { row: landRow, col: landCol },
                capturedPiece: pieceAtPos,
                isCapture: true,
                isKingPromotion
              })
            }
            break
          }

          if (pieceAtPos) break
          checkRow += dRow
          checkCol += dCol
        }
      }
    }

    return moves
  }

  static hasAvailableCaptures(board: (Piece | null)[][], player: Player): boolean {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = board[row][col]
        if (piece && piece.player === player) {
          const captures = this.getCaptureMoves(board, piece)
          if (captures.length > 0) return true
        }
      }
    }
    return false
  }

  static hasAnyValidMoves(board: (Piece | null)[][], player: Player): boolean {
    const mustCapture = this.hasAvailableCaptures(board, player)
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = board[row][col]
        if (piece && piece.player === player) {
          const moves = this.getValidMoves(board, piece, mustCapture)
          if (moves.length > 0) return true
        }
      }
    }
    return false
  }

  static applyMove(board: (Piece | null)[][], move: Move): (Piece | null)[][] {
    const newBoard = board.map(row => [...row])
    const { from, to, capturedPiece } = move

    const piece = newBoard[from.row][from.col]
    if (!piece) return newBoard

    // Move piece
    newBoard[to.row][to.col] = {
      ...piece,
      row: to.row,
      col: to.col,
      type: move.isKingPromotion ? 'king' : piece.type
    }
    newBoard[from.row][from.col] = null

    // Remove captured piece
    if (capturedPiece) {
      newBoard[capturedPiece.row][capturedPiece.col] = null
    }

    return newBoard
  }

  static checkKingPromotion(piece: Piece, newRow: number): boolean {
    if (piece.type === 'king') return false
    return (piece.player === 'red' && newRow === 0) || 
           (piece.player === 'black' && newRow === BOARD_SIZE - 1)
  }

  static checkWinner(board: (Piece | null)[][], currentPlayer: Player): Player | null {
    const redPieces = this.countPieces(board, 'red')
    const blackPieces = this.countPieces(board, 'black')

    if (redPieces === 0) return 'black'
    if (blackPieces === 0) return 'red'

    // Check if current player has any valid moves
    if (!this.hasAnyValidMoves(board, currentPlayer)) {
      return currentPlayer === 'red' ? 'black' : 'red'
    }

    return null
  }

  static countPieces(board: (Piece | null)[][], player: Player): number {
    let count = 0
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col]?.player === player) count++
      }
    }
    return count
  }

  static isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE
  }

  static canContinueCapture(board: (Piece | null)[][], piece: Piece): boolean {
    const captures = this.getCaptureMoves(board, piece)
    return captures.length > 0
  }
}
