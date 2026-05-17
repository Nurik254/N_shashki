'use client'

import { motion } from 'framer-motion'
import { Settings, Moon, Sun, Trophy, Home } from 'lucide-react'
import { useGameStore } from '@/store/game-store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NavbarProps {
  currentPage: 'home' | 'game' | 'leaderboard'
  onPageChange: (page: 'home' | 'game' | 'leaderboard') => void
  onSettingsOpen: () => void
}

export function Navbar({ currentPage, onPageChange, onSettingsOpen }: NavbarProps) {
  const { theme, toggleTheme } = useGameStore()

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          onClick={() => onPageChange('home')}
          style={{ cursor: 'pointer' }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">♔</span>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Checkers Pro
          </span>
        </motion.div>

        <div className="flex items-center gap-2">
          <Button
            variant={currentPage === 'home' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPageChange('home')}
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
          
          <Button
            variant={currentPage === 'game' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPageChange('game')}
          >
            Play
          </Button>
          
          <Button
            variant={currentPage === 'leaderboard' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPageChange('leaderboard')}
          >
            <Trophy className="h-4 w-4 mr-2" />
            Leaderboard
          </Button>

          <div className="w-px h-6 bg-border mx-2" />

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Button variant="ghost" size="icon" onClick={onSettingsOpen}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.nav>
  )
}
