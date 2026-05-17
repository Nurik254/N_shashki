'use client'

import { motion } from 'framer-motion'
import { Trophy, Medal, Award, TrendingUp, Calendar } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Card } from '@/components/ui/card'
import { useGameStore } from '@/store/game-store'
import { cn } from '@/lib/utils'

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'GrandMaster', rating: 2450, wins: 156, losses: 23, winRate: 87 },
  { rank: 2, name: 'CheckersKing', rating: 2380, wins: 142, losses: 31, winRate: 82 },
  { rank: 3, name: 'StrategyPro', rating: 2310, wins: 128, losses: 28, winRate: 82 },
  { rank: 4, name: 'BoardMaster', rating: 2250, wins: 115, losses: 35, winRate: 77 },
  { rank: 5, name: 'TacticalGenius', rating: 2190, wins: 108, losses: 42, winRate: 72 },
  { rank: 6, name: 'GameWizard', rating: 2120, wins: 98, losses: 38, winRate: 72 },
  { rank: 7, name: 'ChessPlayer', rating: 2050, wins: 89, losses: 45, winRate: 66 },
  { rank: 8, name: 'ProGamer', rating: 1980, wins: 82, losses: 48, winRate: 63 },
  { rank: 9, name: 'StrategyNinja', rating: 1920, wins: 76, losses: 52, winRate: 59 },
  { rank: 10, name: 'BoardLegend', rating: 1850, wins: 71, losses: 55, winRate: 56 },
]

export default function LeaderboardPage() {
  const { playerStats } = useGameStore()

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
    if (rank === 2) return 'bg-gray-400/20 text-gray-400 border-gray-400/30'
    if (rank === 3) return 'bg-amber-600/20 text-amber-600 border-amber-600/30'
    return 'bg-muted text-muted-foreground'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar 
        currentPage="leaderboard" 
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
              <Trophy className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Global Rankings</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 gradient-text">Leaderboard</h1>
            <p className="text-muted-foreground text-lg">
              Top players from around the world
            </p>
          </motion.div>

          {/* Your Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="p-6 glass-card border-2 border-primary/30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1">Your Stats</h2>
                  <p className="text-muted-foreground text-sm">Keep playing to climb the ranks!</p>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{playerStats.rating}</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{playerStats.wins}</div>
                    <div className="text-xs text-muted-foreground">Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{playerStats.gamesPlayed}</div>
                    <div className="text-xs text-muted-foreground">Games</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Leaderboard Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="overflow-hidden glass-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <th className="px-6 py-4 text-left text-sm font-semibold">Rank</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Player</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">Rating</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">W/L</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">Win Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_LEADERBOARD.map((player, index) => (
                      <motion.tr
                        key={player.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className={cn(
                          'border-b border-border/30 hover:bg-muted/30 transition-colors',
                          index === 0 && 'bg-yellow-500/5'
                        )}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getRankIcon(player.rank)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                              getRankBadge(player.rank)
                            )}>
                              {player.name.charAt(0)}
                            </div>
                            <span className="font-semibold">{player.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="font-bold">{player.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-muted-foreground">
                          {player.wins}/{player.losses}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={cn(
                            'font-semibold',
                            player.winRate >= 70 ? 'text-green-500' : 
                            player.winRate >= 50 ? 'text-yellow-500' : 'text-red-500'
                          )}>
                            {player.winRate}%
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center text-muted-foreground text-sm"
          >
            <div className="flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Leaderboard updated daily at midnight UTC</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
