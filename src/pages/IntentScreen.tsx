import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/appStore'
import { getMoodWord, getMoodBarColor } from '../utils/moodColors'

const INTENTS = [
  {
    id: 'anchor',
    icon: '⚓',
    title: 'Anchor myself',
    desc: "I'm struggling. Help me find solid ground.",
    path: '/anchor',
    color: '#90a8f0',
  },
  {
    id: 'light-up',
    icon: '✦',
    title: 'Light myself up',
    desc: "I want to feel good. Help me find what fills me.",
    path: '/joy-map',
    color: '#e8c547',
  },
  {
    id: 'thoughts',
    icon: '◎',
    title: 'Random thoughts',
    desc: 'Something on my mind. Just need to put it somewhere.',
    path: '/journal',
    color: '#6ec996',
  },
  {
    id: 'treasury',
    icon: '✦',
    title: 'My Treasury',
    desc: 'Browse what shaped me. Add something new.',
    path: '/treasury',
    color: '#e090c8',
  },
]

export default function IntentScreen() {
  const { currentMood } = useAppStore()
  const navigate = useNavigate()
  const mood = currentMood ?? 50
  const moodWord = getMoodWord(mood)
  const moodColor = getMoodBarColor(mood)

  return (
    <div className="min-h-screen px-6 pt-14 pb-24" style={{ background: 'linear-gradient(180deg, #0a0814 0%, #0f0a10 100%)' }}>

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full" style={{ background: moodColor, boxShadow: `0 0 6px ${moodColor}` }} />
          <span className="text-white/40 text-sm">{moodWord} today</span>
        </div>
        <h1 className="font-serif text-3xl text-white/90 leading-snug">
          What do you need<br />right now?
        </h1>
      </motion.div>

      {/* Intent cards */}
      <div className="flex flex-col gap-3">
        {INTENTS.map((intent, i) => (
          <motion.button
            key={intent.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.09 }}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate(intent.path)}
            className="w-full text-left px-6 py-5 rounded-2xl transition-all"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.09)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = intent.color + '40'
              ;(e.currentTarget as HTMLElement).style.background = intent.color + '08'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.09)'
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'
            }}
          >
            <div className="flex items-start gap-4">
              <span className="text-xl mt-0.5" style={{ color: intent.color }}>{intent.icon}</span>
              <div>
                <p className="text-white/85 font-medium text-base">{intent.title}</p>
                <p className="text-white/38 text-sm mt-0.5 leading-snug">{intent.desc}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Soft link to full vault */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => navigate('/dashboard')}
        className="mt-10 text-white/22 text-xs text-center w-full hover:text-white/40 transition-colors"
      >
        More →
      </motion.button>
    </div>
  )
}
