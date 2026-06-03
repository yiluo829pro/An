import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMoodWord, getMoodBarColor } from '../utils/moodColors'
import { useAppStore } from '../store/appStore'

interface MoodBarProps {
  onComplete: (value: number) => void
}

const SCALE_LABELS = [
  { word: 'Bright', pct: 96 },
  { word: 'Light', pct: 87 },
  { word: 'Good', pct: 76 },
  { word: 'Steady', pct: 62 },
  { word: 'Okay', pct: 50 },
  { word: 'Quiet', pct: 37 },
  { word: 'Low', pct: 22 },
  { word: 'Heavy', pct: 7 },
]

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
    const pct = 1 - (clientY - rect.top) / rect.height
    return Math.max(0, Math.min(100, pct * 100))
  }, [])

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setIsDragging(true)
    setHasInteracted(true)
    setShowQuestion(false)
    setValue(getValueFromY(e.clientY))
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    setValue(getValueFromY(e.clientY))
  }

  const handlePointerUp = () => setIsDragging(false)

  const handleConfirm = () => {
    logMood(value)
    onComplete(value)
  }

  const activeWord = getMoodWord(value)
  const barColor = getMoodBarColor(value)

  const getBgStyle = (): React.CSSProperties => {
    if (value <= 15) return { background: 'linear-gradient(180deg, #050508 0%, #0d0d1a 100%)' }
    if (value <= 30) return { background: 'linear-gradient(180deg, #0d0d1a 0%, #1e2040 100%)' }
    if (value <= 45) return { background: 'linear-gradient(180deg, #151820 0%, #2a2f3a 100%)' }
    if (value <= 55) return { background: 'linear-gradient(180deg, #1a2020 0%, #2a3828 100%)' }
    if (value <= 70) return { background: 'linear-gradient(180deg, #1e1a10 0%, #352a15 100%)' }
    if (value <= 82) return { background: 'linear-gradient(180deg, #201a08 0%, #453510 100%)' }
    if (value <= 92) return { background: 'linear-gradient(180deg, #251800 0%, #5a3a08 100%)' }
    return { background: 'linear-gradient(180deg, #2a1e00 0%, #7a5510 100%)' }
  }

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={getBgStyle()}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      animate={getBgStyle() as any}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {showQuestion && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute font-serif text-2xl text-white/70 tracking-wide"
            style={{ top: '22%' }}
          >
            How are you today?
          </motion.p>
        )}
      </AnimatePresence>

      {/* Bar + labels layout */}
      <div className="flex items-stretch gap-0" style={{ height: 320 }}>

        {/* Labels on the left */}
        <div className="relative flex flex-col justify-between pr-3 py-0" style={{ width: 72 }}>
          {SCALE_LABELS.map(({ word }) => {
            const isActive = activeWord === word
            return (
              <div key={word} className="flex items-center justify-end gap-2">
                <span
                  className="text-xs font-sans tracking-wide transition-all duration-200 select-none"
                  style={{
                    color: isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.22)',
                    fontWeight: isActive ? 500 : 400,
                    fontSize: isActive ? 13 : 11,
                  }}
                >
                  {word}
                </span>
                {/* tick */}
                <div
                  className="h-px transition-all duration-200"
                  style={{
                    width: isActive ? 10 : 6,
                    background: isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.12)',
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* The bar */}
        <div
          ref={barRef}
          className="relative rounded-full cursor-pointer select-none"
          style={{ width: 8, background: 'rgba(255,255,255,0.08)' }}
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
            className="absolute left-1/2 rounded-full border-2 border-white/80"
            style={{
              width: 20,
              height: 20,
              top: `${100 - value}%`,
              transform: 'translate(-50%, -50%)',
              background: barColor,
            }}
            animate={{
              scale: isDragging ? 1.3 : 1,
              boxShadow: isDragging ? `0 0 20px ${barColor}80` : 'none',
            }}
          />
        </div>
      </div>

      {/* Continue button */}
      <AnimatePresence>
        {hasInteracted && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
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
