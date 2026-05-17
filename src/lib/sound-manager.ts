class SoundManager {
  private audioContext: AudioContext | null = null
  private enabled: boolean = true

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.enabled || !this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  playMove() {
    // Soft click sound for regular moves
    this.playTone(800, 0.1, 'sine')
  }

  playCapture() {
    // More pronounced sound for captures
    this.playTone(400, 0.15, 'square')
    setTimeout(() => this.playTone(600, 0.1, 'sine'), 50)
  }

  playKingPromotion() {
    // Celebratory sound for king promotion
    this.playTone(523.25, 0.2, 'sine') // C5
    setTimeout(() => this.playTone(659.25, 0.2, 'sine'), 100) // E5
    setTimeout(() => this.playTone(783.99, 0.3, 'sine'), 200) // G5
  }

  playWin() {
    // Victory fanfare
    const notes = [523.25, 659.25, 783.99, 1046.50]
    notes.forEach((note, index) => {
      setTimeout(() => this.playTone(note, 0.3, 'sine'), index * 150)
    })
  }

  playError() {
    // Error sound for invalid moves
    this.playTone(200, 0.2, 'sawtooth')
  }
}

export const soundManager = new SoundManager()
