import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ComfortCompassProps {
  onComplete: (pattern: string) => void
}

const PAIRS = [
  ['Alone, completely', 'With one person who gets it'],
  ['Doing something physical', 'Doing something mental'],
  ['Going somewhere', 'Staying put'],
  ['Talking it through', 'Processing in silence'],
  ['Distraction', 'Sitting with it'],
  ['Creative output', 'Passive input — films, music'],
  ['Order and structure', 'Soft chaos, letting go'],
]

const PATTERNS: Record<string, string> = {
  alone: 'The Quiet Restorer',
  together: 'The Witnessed Processor',
  mixed: 'The Flexible One',
}

export default function ComfortCompass({ onComplete }: ComfortCompassProps) {
  const [step, setStep] = useState(0)
  const [aloneCount, setAloneCount] = useState(0)
  const handlePick = (index: number) => {
    if (index === 0) setAloneCount(c => c + 1)
    setTimeout(() => {
      if (step + 1 >= PAIRS.length) {
        const ratio = aloneCount / PAIRS.length
        const pattern = ratio > 0.6 ? PATTERNS.alone : ratio < 0.4 ? PATTERNS.together : PATTERNS.mixed
        onComplete(pattern)
      } else {
        setStep(s => s + 1)
      }
    }, 200)
  }

  if (step >= PAIRS.length) return null
  const pair = PAIRS[step]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f14] px-6">
      <p className="text-white/40 text-xs uppercase tracking-widest mb-8">Game 3 of 3 — The Comfort Compass</p>
      <div className="w-full max-w-xs h-0.5 bg-white/10 rounded mb-12">
        <div className="h-full bg-white/40 rounded" style={{ width: `${(step / PAIRS.length) * 100}%` }} />
      </div>

      <p className="text-white/40 text-sm mb-8">When things are hard, you prefer...</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col gap-4 w-full max-w-sm"
        >
          {pair.map((option, i) => (
            <motion.button
              key={option}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handlePick(i)}
              className="py-5 px-6 rounded-xl border border-white/15 text-white/70 hover:border-white/40 hover:text-white/90 font-serif text-lg text-center transition-all"
            >
              {option}
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>

      <p className="text-white/20 text-xs mt-10">Pick one. Both is fine in life — not here.</p>
    </div>
  )
}
