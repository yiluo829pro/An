import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/appStore'

const QUALITIES = ['Resilience', 'Creativity', 'Leadership', 'Care', 'Persistence', 'Integrity', 'Humor', 'Wisdom']

export default function IdentityVault() {
  const { identityVault, addVaultEntry } = useAppStore()
  const navigate = useNavigate()
  const [adding, setAdding] = useState(false)
  const [content, setContent] = useState('')
  const [selectedQualities, setSelectedQualities] = useState<string[]>([])

  const handleAdd = () => {
    if (!content.trim()) return
    addVaultEntry({
      content: content.trim(),
      quality: selectedQualities,
      date: new Date().toLocaleDateString(),
    })
    setContent('')
    setSelectedQualities([])
    setAdding(false)
  }

  const toggleQuality = (q: string) => {
    setSelectedQualities(prev =>
      prev.includes(q) ? prev.filter(x => x !== q) : [...prev, q]
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f14] px-6 pt-12 pb-24">
      <button onClick={() => navigate('/dashboard')} className="text-white/30 text-sm mb-8 block hover:text-white/60 transition-colors">
        ← Back
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-2xl text-white/90">Identity Vault</h2>
          <p className="text-white/35 text-sm mt-1">Who you've proven yourself to be</p>
        </div>
        <button onClick={() => setAdding(true)} className="text-white/40 text-2xl hover:text-white/70 transition-colors">+</button>
      </div>

      {/* Add entry form */}
      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-8 p-5 rounded-2xl border border-white/15 bg-white/3">
            <p className="text-white/50 text-sm mb-4">What did you handle well? What does this say about who you are?</p>
            <textarea
              autoFocus
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="I stayed calm when the project fell apart. I led without being asked to..."
              className="w-full bg-transparent text-white/80 placeholder-white/20 text-sm resize-none outline-none font-serif leading-relaxed min-h-24"
            />
            <div className="flex flex-wrap gap-2 mt-4 mb-4">
              {QUALITIES.map(q => (
                <button key={q} onClick={() => toggleQuality(q)}
                  className={`px-3 py-1 rounded-full text-xs border transition-all ${
                    selectedQualities.includes(q)
                      ? 'border-white/40 text-white/70 bg-white/8'
                      : 'border-white/15 text-white/30 hover:border-white/30'
                  }`}>
                  {q}
                </button>
              ))}
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setAdding(false)} className="text-white/30 text-sm hover:text-white/50 transition-colors">Cancel</button>
              <button onClick={handleAdd} className="px-5 py-2 rounded-full border border-white/25 text-white/60 text-sm hover:text-white/80 transition-all">Save</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries */}
      {identityVault.length === 0 && !adding && (
        <div className="text-center mt-20">
          <p className="font-serif text-white/40 text-lg mb-3">Your vault is waiting.</p>
          <p className="text-white/25 text-sm">Start with one thing you handled well — ever.</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {identityVault.map((entry, i) => (
          <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl border border-white/10 bg-white/2">
            <p className="font-serif text-white/75 leading-relaxed">{entry.content}</p>
            {entry.quality.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {entry.quality.map(q => (
                  <span key={q} className="text-xs text-white/30 border border-white/10 px-2 py-0.5 rounded-full">{q}</span>
                ))}
              </div>
            )}
            <p className="text-white/20 text-xs mt-3">{entry.date}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
