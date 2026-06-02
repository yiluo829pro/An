import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/appStore'
import { getMoodWord, getMoodBarColor } from '../utils/moodColors'

export default function Dashboard() {
  const { currentMood } = useAppStore()
  const navigate = useNavigate()
  const mood = currentMood ?? 50
  const moodWord = getMoodWord(mood)
  const moodColor = getMoodBarColor(mood)

  const isLow = mood < 40
  const isHigh = mood >= 65

  const features = [
    { id: 'anchor', label: 'Anchor Now', icon: '⚓', desc: 'A moment of grounding', path: '/anchor', always: true, priority: isLow },
    { id: 'vault', label: 'Identity Vault', icon: '🪬', desc: "Who you've proven yourself to be", path: '/vault', always: true, priority: false },
    { id: 'treasury', label: 'Treasury', icon: '✦', desc: 'Everything that shaped you', path: '/treasury', always: true, priority: false },
    { id: 'journal', label: 'Living Journal', icon: '◎', desc: 'Write — no structure needed', path: '/journal', always: true, priority: false },
    { id: 'reflect', label: 'Daily Reflection', icon: '◇', desc: 'What did you handle well today?', path: '/reflect', always: !isLow, priority: false },
  ]

  return (
    <div className="min-h-screen bg-[#0f0f14] px-6 pt-12 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: moodColor }} />
          <span className="text-white/40 text-sm">{moodWord}</span>
        </div>
        <h1 className="font-serif text-3xl text-white/90">An</h1>
      </motion.div>

      {/* Low mood message */}
      {isLow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 p-4 rounded-xl border border-white/8 bg-white/3"
        >
          <p className="font-serif text-white/60 leading-relaxed">
            You're carrying something today. That's okay. The vault is here when you need it.
          </p>
        </motion.div>
      )}

      {/* High mood prompt */}
      {isHigh && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 p-4 rounded-xl border border-white/10 bg-white/3"
        >
          <p className="font-serif text-white/60 leading-relaxed">
            You're in a good place today. A good moment to add something to your Treasury.
          </p>
          <button
            onClick={() => navigate('/treasury')}
            className="mt-3 text-white/40 text-xs uppercase tracking-widest hover:text-white/60 transition-colors"
          >
            Add to Treasury →
          </button>
        </motion.div>
      )}

      {/* Feature grid */}
      <div className="flex flex-col gap-3">
        {features.filter(f => f.always).map((feature, i) => (
          <motion.button
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => navigate(feature.path)}
            className={`w-full text-left px-6 py-5 rounded-2xl border transition-all ${
              feature.priority
                ? 'border-white/25 bg-white/5 hover:bg-white/8'
                : 'border-white/10 bg-white/2 hover:bg-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{feature.icon}</span>
              <div>
                <p className="text-white/80 font-medium">{feature.label}</p>
                <p className="text-white/35 text-sm mt-0.5">{feature.desc}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
