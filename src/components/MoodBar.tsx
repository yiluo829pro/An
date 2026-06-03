import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMoodWord, getMoodBarColor } from '../utils/moodColors'
import { useAppStore } from '../store/appStore'

interface MoodBarProps {
  onComplete: (value: number) => void
}

export default function MoodBar({ onComplete }: MoodBarProps) {
  const [value, setValue] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [showQuestion, setShowQuestion] = useState(true)
  const barRef = useRef<HTMLDivElement>(null)
  const { logMood } = useAppStore()

  const getValueFromY = useCallback((clientY: number) => {
    if (!barRef.current) return 50
    const rect = barRef.current.getBoundingClientRect()
    const relativeY = clientY - rect.top
    const pct = 1 - relativeY / rect.height
    return Math.max(0, Math.min(100, pct * 100))
  }, [])

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setIsDragging(true)
    setHasInteracted(true)
    setShowQuestion(false)
    const v = getValueFromY(e.clientY)
    setValue(v)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    const v = getValueFromY(e.clientY)
    setValue(v)
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  const handleConfirm = () => {
    logMood(value)
    onComplete(value)
  }

  const word = getMoodWord(value)
  const barColor = getMoodBarColor(value)

  const getBgStyle = () => {
    const v = value
    if (v <= 15) return { background: 'linear-gradient(180deg, #050508 0%, #0d0d1a 100%)' }
    if (v <= 30) return { background: 'linear-gradient(180deg, #0d0d1a 0%, #1e2040 100%)' }
    if (v <= 45) return { background: 'linear-gradient(180deg, #151820 0%, #2a2f3a 100%)' }
    if (v <= 55) return { background: 'linear-gradient(180deg, #1a2020 0%, #2a3828 100%)' }
    if (v <= 70) return { background: 'linear-gradient(180deg, #1e1a10 0%, #352a15 100%)' }
    if (v <= 82) return { background: 'linear-gradient(180deg, #201a08 0%, #453510 100%)' }
    if (v <= 92) return { background: 'linear-gradient(180deg, #251800 0%, #5a3a08 100%)' }
    return { background: 'linear-gradient(180deg, #2a1e00 0%, #7a5510 100%)' }
  }

  const thumbY = `${100 - value}%`

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={getBgStyle()}
      animate={getBgStyle()}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <AnimatePresence>
        {showQuestion && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute top-1/4 font-serif text-2xl text-white/70 tracking-wide"
          >
            How are you today?
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-8">
        {/* The vertical bar */}
        <div
          ref={barRef}
          className="relative w-2 h-80 rounded-full cursor-pointer select-none"
          style={{ background: 'rgba(255,255,255,0.08)' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Fill */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 rounded-full"
            style={{ height: `${value}%`, background: barColor }}
            transition={{ duration: 0.05 }}
          />
          {/* Thumb */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-white/80"
            style={{
              top: thumbY,
              background: barColor,
              transform: `translateX(-50%) translateY(-50%)`,
            }}
            animate={{
              scale: isDragging ? 1.3 : 1,
              boxShadow: isDragging ? `0 0 20px ${barColor}80` : 'none',
            }}
          />
        </div>

        {/* Mood word */}
        <AnimatePresence mode="wait">
          {hasInteracted && (
            <motion.div
              key={word}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="font-serif text-xl text-white/80 w-20"
            >
              {word}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {hasInteracted && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleConfirm}
            className="absolute bottom-16 px-8 py-3 rounded-full text-sm tracking-widest uppercase text-white/60 border border-white/20 hover:border-white/40 hover:text-white/80 transition-all"
          >
            Continue
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
