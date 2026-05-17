'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Bot, Users, Trophy, Zap, Shield, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Navbar } from '@/components/layout/navbar'
import { useGameStore } from '@/store/game-store'
import { cn } from '@/lib/utils'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'home' | 'game' | 'leaderboard'>('home')
  const [showSettings, setShowSettings] = useState(false)
  const { updateSettings, resetGame } = useGameStore()

  const handleModeSelect = (mode: 'pvp' | 'ai') => {
    updateSettings({ gameMode: mode })
    resetGame()
    setCurrentPage('game')
  }

  if (currentPage === 'game') {
    window.location.href = '/game'
    return null
  }

  if (currentPage === 'leaderboard') {
    window.location.href = '/leaderboard'
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
        onSettingsOpen={() => setShowSettings(true)} 
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Premium Checkers Experience</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Checkers Pro
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the classic game of checkers reimagined for the modern era. 
              Beautiful design, smart AI, and seamless gameplay.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button size="lg" onClick={() => handleModeSelect('pvp')} className="h-14 px-8 text-lg">
                <Play className="h-5 w-5 mr-2" />
                Play Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => setCurrentPage('leaderboard')} className="h-14 px-8 text-lg">
                <Trophy className="h-5 w-5 mr-2" />
                Leaderboard
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Game Modes */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Choose Your Mode</h2>
            <p className="text-muted-foreground text-lg">Select how you want to play</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="p-8 h-full glass-card cursor-pointer group" onClick={() => handleModeSelect('pvp')}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Local Multiplayer</h3>
                  <p className="text-muted-foreground mb-4">
                    Play with a friend on the same device. Perfect for casual games and learning together.
                  </p>
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Start Game
                  </Button>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="p-8 h-full glass-card cursor-pointer group" onClick={() => handleModeSelect('ai')}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Bot className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Play vs AI</h3>
                  <p className="text-muted-foreground mb-4">
                    Challenge our intelligent AI with multiple difficulty levels. Test your skills!
                  </p>
                  <Button className="w-full" variant="secondary">
                    <Play className="h-4 w-4 mr-2" />
                    Start Game
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-primary/5">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Premium Features</h2>
            <p className="text-muted-foreground text-lg">Everything you need for the perfect game</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Shield,
                title: 'Smart AI',
                description: 'Advanced AI with multiple difficulty levels that adapts to your playstyle'
              },
              {
                icon: Star,
                title: 'Achievements',
                description: 'Unlock achievements and track your progress as you improve'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Optimized performance for smooth gameplay on any device'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full glass-card">
                  <feature.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/50">
        <div className="container mx-auto text-center text-muted-foreground">
          <p className="mb-2">Built with Next.js, React, and TypeScript</p>
          <p className="text-sm">© 2026 Checkers Pro. Premium gaming experience.</p>
        </div>
      </footer>
    </div>
  )
}
