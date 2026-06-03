import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface JoyDialProps {
  onComplete: (categories: string[]) => void
}

const scenes = [
  { id: 1, emoji: '🌲', label: 'Being in nature', category: 'nature' },
  { id: 2, emoji: '📚', label: 'Getting lost in a book', category: 'solitude' },
  { id: 3, emoji: '🍳', label: 'Cooking something from scratch', category: 'creating' },
  { id: 4, emoji: '🎵', label: 'Music filling a room', category: 'sensory' },
  { id: 5, emoji: '💬', label: 'A real conversation, just two people', category: 'connection' },
  { id: 6, emoji: '🌊', label: 'Water — ocean, lake, rain', category: 'nature' },
  { id: 7, emoji: '✍️', label: 'Writing something honest', category: 'creating' },
  { id: 8, emoji: '🐾', label: 'Animals, pets, being chosen by a creature', category: 'connection' },
  { id: 9, emoji: '🏃', label: 'Moving your body until your mind goes quiet', category: 'movement' },
  { id: 10, emoji: '🌙', label: 'Late nights when the world is still', category: 'solitude' },
  { id: 11, emoji: '🎨', label: 'Making something with your hands', category: 'creating' },
  { id: 12, emoji: '🤝', label: 'Helping someone through something hard', category: 'purpose' },
  { id: 13, emoji: '☕', label: 'A slow morning with nowhere to be', category: 'rest' },
  { id: 14, emoji: '🌅', label: 'Watching something begin or end', category: 'sensory' },
  { id: 15, emoji: '🗺️', label: 'Going somewhere new alone', category: 'solitude' },
]

export default function JoyDial({ onComplete }: JoyDialProps) {
  const [index, setIndex] = useState(0)
  const [yesCategories, setYesCategories] = useState<string[]>([])
  const [direction, setDirection] = useState(0)

  const current = scenes[index]

  const handleSwipe = (dir: 'yes' | 'no') => {
    if (dir === 'yes') {
      setYesCategories(prev => [...prev, current.category])
    }
    setDirection(dir === 'yes' ? 1 : -1)

    setTimeout(() => {
      if (index + 1 >= scenes.length) {
        onComplete([...yesCategories, ...(dir === 'yes' ? [current.category] : [])])
      } else {
        setIndex(i => i + 1)
        setDirection(0)
      }
    }, 200)
  }

  const progress = index / scenes.length

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f14] px-6">
      <p className="text-white/40 text-xs uppercase tracking-widest mb-8">Game 1 of 3 — The Joy Dial</p>

      {/* Progress bar */}
      <div className="w-full max-w-xs h-0.5 bg-white/10 rounded mb-12">
        <motion.div className="h-full bg-white/40 rounded" style={{ width: `${progress * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: direction * 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -60 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-6 mb-16"
        >
          <div className="text-7xl">{current.emoji}</div>
          <p className="font-serif text-xl text-white/80 text-center max-w-xs">{current.label}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-6">
        <button
          onClick={() => handleSwipe('no')}
          className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:border-white/40 hover:text-white/60 transition-all text-xl"
        >
          ✕
        </button>
        <button
          onClick={() => handleSwipe('yes')}
          className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-white/60 hover:text-white/80 transition-all text-xl"
        >
          ♥
        </button>
      </div>

      <p className="text-white/20 text-xs mt-8">Quick gut reaction — no overthinking</p>
    </div>
  )
}
