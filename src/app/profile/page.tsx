'use client'

import { motion } from 'framer-motion'
import { User, Trophy, Target, TrendingUp, Award, Lock } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Card } from '@/components/ui/card'
import { useGameStore } from '@/store/game-store'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const { playerStats, achievements } = useGameStore()

  const unlockedAchievements = achievements.filter(a => a.unlocked)
  const lockedAchievements = achievements.filter(a => !a.unlocked)
  const winRate = playerStats.gamesPlayed > 0 
    ? Math.round((playerStats.wins / playerStats.gamesPlayed) * 100) 
    : 0

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
    >
      <Card className="p-6 glass-card text-center">
        <Icon className={cn('h-8 w-8 mx-auto mb-2', color)} />
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </Card>
    </motion.div>
  )

  const AchievementCard = ({ achievement, locked = false }: any) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="relative"
    >
      <Card className={cn(
        'p-6 text-center',
        locked ? 'opacity-50' : 'glass-card border-2 border-primary/30'
      )}>
        <div className="text-4xl mb-3">{achievement.icon}</div>
        <h3 className="font-bold mb-1">{achievement.title}</h3>
        <p className="text-sm text-muted-foreground">{achievement.description}</p>
        {locked && (
          <div className="absolute top-2 right-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        {!locked && achievement.unlockedAt && (
          <div className="mt-2 text-xs text-primary">
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </div>
        )}
      </Card>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar 
        currentPage="home" 
        onPageChange={() => {}} 
        onSettingsOpen={() => {}} 
      />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Player Profile</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 gradient-text">Your Profile</h1>
            <p className="text-muted-foreground text-lg">
              Track your progress and achievements
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            <StatCard 
              icon={Trophy} 
              label="Rating" 
              value={playerStats.rating} 
              color="text-yellow-500" 
            />
            <StatCard 
              icon={Target} 
              label="Games" 
              value={playerStats.gamesPlayed} 
              color="text-blue-500" 
            />
            <StatCard 
              icon={TrendingUp} 
              label="Win Rate" 
              value={`${winRate}%`} 
              color="text-green-500" 
            />
            <StatCard 
              icon={Award} 
              label="Achievements" 
              value={`${unlockedAchievements.length}/${achievements.length}`} 
              color="text-purple-500" 
            />
          </motion.div>

          {/* Detailed Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <Card className="p-6 glass-card">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-green-500" />
                Wins
              </h3>
              <div className="text-4xl font-bold text-green-500">{playerStats.wins}</div>
            </Card>
            <Card className="p-6 glass-card">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-red-500" />
                Losses
              </h3>
              <div className="text-4xl font-bold text-red-500">{playerStats.losses}</div>
            </Card>
            <Card className="p-6 glass-card">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Draws
              </h3>
              <div className="text-4xl font-bold text-yellow-500">{playerStats.draws}</div>
            </Card>
          </motion.div>

          {/* Achievements Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Award className="h-8 w-8 text-primary" />
              Achievements
            </h2>

            {/* Unlocked Achievements */}
            {unlockedAchievements.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-green-500">
                  Unlocked ({unlockedAchievements.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unlockedAchievements.map((achievement, index) => (
                    <AchievementCard 
                      key={achievement.id} 
                      achievement={achievement} 
                      locked={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Locked Achievements */}
            {lockedAchievements.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-muted-foreground">
                  Locked ({lockedAchievements.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lockedAchievements.map((achievement, index) => (
                    <AchievementCard 
                      key={achievement.id} 
                      achievement={achievement} 
                      locked={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {achievements.length === 0 && (
              <Card className="p-12 text-center glass-card">
                <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No achievements yet. Start playing to unlock them!
                </p>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
