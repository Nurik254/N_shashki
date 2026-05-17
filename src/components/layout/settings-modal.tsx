'use client'

import { useGameStore } from '@/store/game-store'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Volume2, VolumeX, Timer, Cpu, Palette } from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useGameStore()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <CardHeader>
        <CardTitle className="text-2xl">Settings</CardTitle>
        <CardDescription>Customize your game experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Game Mode */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Game Mode</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['pvp', 'ai', 'replay'] as const).map((mode) => (
              <Button
                key={mode}
                variant={settings.gameMode === mode ? 'default' : 'outline'}
                onClick={() => updateSettings({ gameMode: mode })}
                className="capitalize"
              >
                {mode === 'pvp' ? '2 Players' : mode === 'ai' ? 'vs AI' : 'Replay'}
              </Button>
            ))}
          </div>
        </div>

        {/* AI Difficulty */}
        {settings.gameMode === 'ai' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">AI Difficulty</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={settings.aiDifficulty === difficulty ? 'default' : 'outline'}
                  onClick={() => updateSettings({ aiDifficulty })}
                  className="capitalize"
                >
                  {difficulty}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Board Theme */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Board Theme</h3>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {(['classic', 'modern', 'forest', 'ocean'] as const).map((theme) => (
              <Button
                key={theme}
                variant={settings.boardTheme === theme ? 'default' : 'outline'}
                onClick={() => updateSettings({ boardTheme: theme })}
                className="capitalize"
              >
                {theme}
              </Button>
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Timer</h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Enable game timer</span>
            <Button
              variant={settings.timerEnabled ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSettings({ timerEnabled: !settings.timerEnabled })}
            >
              {settings.timerEnabled ? 'On' : 'Off'}
            </Button>
          </div>
        </div>

        {/* Sound */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {settings.soundEnabled ? (
              <Volume2 className="h-5 w-5 text-primary" />
            ) : (
              <VolumeX className="h-5 w-5 text-primary" />
            )}
            <h3 className="font-semibold">Sound Effects</h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Play sounds on moves</span>
            <Button
              variant={settings.soundEnabled ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            >
              {settings.soundEnabled ? 'On' : 'Off'}
            </Button>
          </div>
        </div>

        <Button onClick={onClose} className="w-full" size="lg">
          Done
        </Button>
      </CardContent>
    </Modal>
  )
}
