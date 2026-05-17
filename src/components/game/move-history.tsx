'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/game-store'
import { cn } from '@/lib/utils'

export function MoveHistory() {
  const { moveHistory } = useGameStore()

  return (
    <div className="h-64 overflow-y-auto rounded-xl bg-card border border-border/50 p-4 shadow-lg">
      <h3 className="font-semibold mb-3 text-sm text-muted-foreground">Move History</h3>
      <div className="space-y-1">
        <AnimatePresence mode="popLayout">
          {moveHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No moves yet</p>
          ) : (
            moveHistory.map((move, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={cn(
                  'flex items-center justify-between p-2 rounded-lg text-sm',
                  index % 2 === 0 ? 'bg-accent/50' : 'bg-background'
                )}
              >
                <span className="font-mono text-muted-foreground w-8">{index + 1}.</span>
                <span className="flex-1">
                  {String.fromCharCode(97 + move.from.col)}{8 - move.from.row} →{' '}
                  {String.fromCharCode(97 + move.to.col)}{8 - move.to.row}
                </span>
                {move.isCapture && (
                  <span className="text-red-500 text-xs font-semibold">CAPTURE</span>
                )}
                {move.isKingPromotion && (
                  <span className="text-yellow-500 text-xs font-semibold">KING</span>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
