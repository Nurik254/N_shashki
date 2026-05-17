'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { GameBoard } from '@/components/game/game-board'
import { GameInfo } from '@/components/game/game-info'
import { MoveHistory } from '@/components/game/move-history'
import { SettingsModal } from '@/components/layout/settings-modal'
import { useGameStore } from '@/store/game-store'

export default function GamePage() {
  const [showSettings, setShowSettings] = useState(false)
  const { settings } = useGameStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar 
        currentPage="game" 
        onPageChange={() => {}} 
        onSettingsOpen={() => setShowSettings(true)} 
      />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Game Board */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold">
                    {settings.gameMode === 'ai' ? 'vs AI' : 'Local Multiplayer'}
                  </h1>
                  {settings.gameMode === 'ai' && (
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-500 text-sm font-medium">
                      {settings.aiDifficulty.toUpperCase()}
                    </span>
                  )}
                </div>
                <GameBoard />
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              <GameInfo />
              <MoveHistory />
            </div>
          </div>
        </div>
      </div>

      {showSettings && (
        <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}
