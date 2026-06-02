import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/appStore'

const PROMPTS = [
  "What are you trying to figure out right now?",
  "What happened today that you need to say out loud?",
  "What are you not saying to anyone?",
  "What's one thing you actually feel, underneath what you're telling people you feel?",
]

const EMOTIONAL_TAGS = ['Resolving', 'Heavy', 'Uncertain', 'Relieved', 'Angry', 'Clear', 'Lost', 'Okay']

export default function Journal() {
  const { journal, addJournalEntry } = useAppStore()
  const navigate = useNavigate()
  const [writing, setWriting] = useState(false)
  const [content, setContent] = useState('')
  const [showPrompt, setShowPrompt] = useState(false)
  const [currentPrompt] = useState(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)])
  const [selectedTag, setSelectedTag] = useState('')

  const handleSave = () => {
    if (!content.trim()) return
    addJournalEntry({ content: content.trim(), type: 'raw-thought', emotionalTag: selectedTag || undefined })
    setContent('')
    setSelectedTag('')
    setWriting(false)
    setShowPrompt(false)
  }

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' +
      d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-[#0f0f14] px-6 pt-12 pb-24">
      <button onClick={() => navigate('/dashboard')} className="text-white/30 text-sm mb-8 block hover:text-white/60 transition-colors">
        ← Back
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-2xl text-white/90">Living Journal</h2>
          <p className="text-white/35 text-sm mt-1">No structure needed</p>
        </div>
        <button onClick={() => setWriting(true)} className="text-white/40 text-2xl hover:text-white/70 transition-colors">+</button>
      </div>

      <AnimatePresence>
        {writing && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-8 p-5 rounded-2xl border border-white/12 bg-white/2">

            {showPrompt && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="font-serif text-white/45 text-sm italic mb-4 leading-relaxed">
                {currentPrompt}
              </motion.p>
            )}

            <textarea
              autoFocus
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write anything. It stays here."
              className="w-full bg-transparent text-white/80 placeholder-white/20 text-sm resize-none outline-none font-serif leading-relaxed min-h-36"
            />

            {/* Emotional tag */}
            <div className="flex flex-wrap gap-2 mt-4 mb-4">
              {EMOTIONAL_TAGS.map(tag => (
                <button key={tag} onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                  className={`px-3 py-1 rounded-full text-xs border transition-all ${
                    selectedTag === tag ? 'border-white/35 text-white/65' : 'border-white/10 text-white/25 hover:border-white/25'
                  }`}>
                  {tag}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button onClick={() => setShowPrompt(p => !p)} className="text-white/25 text-xs hover:text-white/45 transition-colors">
                {showPrompt ? 'Hide prompt' : 'Give me a prompt'}
              </button>
              <div className="flex gap-3">
                <button onClick={() => setWriting(false)} className="text-white/25 text-xs hover:text-white/45 transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-5 py-2 rounded-full border border-white/20 text-white/55 text-xs hover:text-white/75 transition-all">
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries */}
      {journal.length === 0 && !writing && (
        <div className="text-center mt-20">
          <p className="font-serif text-white/40 text-lg mb-3">A space just for you.</p>
          <p className="text-white/25 text-sm">No structure. No judgment. Just write.</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {[...journal].reverse().map((entry, i) => (
          <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
            className="p-5 rounded-2xl border border-white/8 bg-white/2">
            <p className="text-white/20 text-xs mb-3">{formatTime(entry.timestamp)}</p>
            <p className="font-serif text-white/70 leading-relaxed text-sm whitespace-pre-wrap">{entry.content}</p>
            {entry.emotionalTag && (
              <span className="inline-block mt-3 text-xs text-white/25 border border-white/10 px-2 py-0.5 rounded-full">
                {entry.emotionalTag}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
