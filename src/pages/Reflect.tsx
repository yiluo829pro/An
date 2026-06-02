import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/appStore'
export default function Reflect() {
  const { currentMood, addVaultEntry } = useAppStore()
  const navigate = useNavigate()
  const [answer, setAnswer] = useState('')
  const [saved, setSaved] = useState(false)
  const mood = currentMood ?? 50

  const question = mood < 40
    ? "What's one small thing that's okay right now?"
    : mood >= 65
    ? "What made today feel this way — and what does that tell you about yourself?"
    : "What did you handle well today?"

  const handleSave = () => {
    if (!answer.trim()) return
    addVaultEntry({ content: answer.trim(), quality: [], date: new Date().toLocaleDateString() })
    setSaved(true)
  }

  return (
    <div className="min-h-screen bg-[#0f0f14] flex flex-col px-6 pt-12 pb-24">
      <button onClick={() => navigate('/dashboard')} className="text-white/30 text-sm mb-8 block hover:text-white/60 transition-colors">
        ← Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <p className="text-white/30 text-xs uppercase tracking-widest mb-6">Daily Reflection</p>
        <p className="font-serif text-2xl text-white/80 leading-snug mb-10">{question}</p>

        {!saved ? (
          <>
            <textarea
              autoFocus
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Take your time..."
              className="w-full bg-transparent border-b border-white/15 text-white/75 placeholder-white/20 text-sm resize-none outline-none font-serif leading-relaxed min-h-28 pb-4 focus:border-white/30 transition-colors"
            />
            <button
              onClick={handleSave}
              disabled={!answer.trim()}
              className="mt-8 px-8 py-3 rounded-full border border-white/20 text-white/50 text-sm hover:text-white/75 hover:border-white/35 transition-all disabled:opacity-30 disabled:cursor-not-allowed self-start"
            >
              Save to Vault
            </button>
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="font-serif text-white/55 italic">{answer}</p>
            <p className="text-white/30 text-sm mt-6">Added to your Identity Vault.</p>
            <button onClick={() => navigate('/dashboard')} className="mt-8 text-white/35 text-sm hover:text-white/55 transition-colors">
              Return home
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
