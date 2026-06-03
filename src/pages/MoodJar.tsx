import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/appStore'
import { getMoodBarColor, getMoodWord } from '../utils/moodColors'

// Ball grid positions inside jar — bottom to top, left to right
function getBallPositions(count: number): { x: number; y: number }[] {
  const cols = 4
  const positions: { x: number; y: number }[] = []
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols)
    const col = i % cols
    const xBase = 18 + col * 22
    const xJitter = (Math.sin(i * 7.3) * 4)
    const yBase = 78 - row * 20
    const yJitter = (Math.cos(i * 3.7) * 3)
    positions.push({ x: xBase + xJitter, y: yBase + yJitter })
  }
  return positions
}

export default function MoodJar() {
  const { moodHistory, currentMood } = useAppStore()
  const navigate = useNavigate()
  const [dropDone, setDropDone] = useState(false)

  // Current month moods only
  const now = new Date()
  const monthMoods = moodHistory.filter(m => {
    const d = new Date(m.timestamp)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  // The latest entry is the one that just dropped
  const latestMood = monthMoods[monthMoods.length - 1]
  const previousMoods = monthMoods.slice(0, -1)

  const ballPositions = getBallPositions(monthMoods.length)

  useEffect(() => {
    const t = setTimeout(() => setDropDone(true), 1200)
    return () => clearTimeout(t)
  }, [])

  const jarColor = currentMood !== null ? getMoodBarColor(currentMood) : '#c4a862'
  const moodWord = currentMood !== null ? getMoodWord(currentMood) : ''

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(180deg, #080810 0%, #10080e 100%)' }}>

      {/* Month label */}
      <p className="text-white/30 text-xs uppercase tracking-widest mb-2">
        {now.toLocaleString('default', { month: 'long' })} {now.getFullYear()}
      </p>
      <p className="text-white/20 text-xs mb-10">
        {monthMoods.length} {monthMoods.length === 1 ? 'day' : 'days'} collected
      </p>

      {/* Mason jar SVG */}
      <div className="relative" style={{ width: 140, height: 200 }}>
        <svg viewBox="0 0 140 200" className="absolute inset-0 w-full h-full" fill="none">
          {/* Jar lid */}
          <rect x="32" y="8" width="76" height="14" rx="4" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
          <rect x="28" y="20" width="84" height="8" rx="2" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          {/* Jar body */}
          <path d="M35 28 L22 170 Q22 188 40 188 L100 188 Q118 188 118 170 L105 28 Z"
            fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
          {/* Glass shine */}
          <path d="M40 35 L30 155" stroke="rgba(255,255,255,0.08)" strokeWidth="3" strokeLinecap="round" />
          {/* Jar label band */}
          <path d="M26 100 L26 130 Q26 132 28 132 L112 132 Q114 132 114 130 L114 100 Q114 98 112 98 L28 98 Q26 98 26 100 Z"
            fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        </svg>

        {/* Balls inside jar — previous ones */}
        {previousMoods.map((mood, i) => {
          const pos = ballPositions[i]
          const color = getMoodBarColor(mood.value)
          return (
            <motion.div
              key={mood.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="absolute rounded-full"
              style={{
                width: 14,
                height: 14,
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                background: color,
                boxShadow: `0 0 6px ${color}80`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          )
        })}

        {/* Today's ball — drops in */}
        {latestMood && (
          <motion.div
            initial={{ top: '-20%', opacity: 1 }}
            animate={{ top: `${ballPositions[monthMoods.length - 1]?.y ?? 70}%`, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.4 }}
            className="absolute rounded-full z-10"
            style={{
              width: 18,
              height: 18,
              left: `${ballPositions[monthMoods.length - 1]?.x ?? 50}%`,
              background: jarColor,
              boxShadow: `0 0 14px ${jarColor}`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      </div>

      {/* Today's mood word */}
      <AnimatePresence>
        {dropDone && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <p className="font-serif text-lg text-white/70">
              Today: <span style={{ color: jarColor }}>{moodWord}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue */}
      <AnimatePresence>
        {dropDone && (
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate('/intent')}
            className="mt-10 px-8 py-3 rounded-full text-sm tracking-widest uppercase text-white/55 border border-white/18 hover:border-white/38 hover:text-white/78 transition-all"
          >
            Continue
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
