import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/appStore'

const ARTIFACT_TYPES = [
  { id: 'words' as const, label: 'Words', placeholder: 'Something you read or someone said...' },
  { id: 'places' as const, label: 'Places', placeholder: 'A place that changed something...' },
  { id: 'people' as const, label: 'People', placeholder: 'Someone who gave you something...' },
  { id: 'ideas' as const, label: 'Ideas', placeholder: 'A concept that reoriented how you see...' },
  { id: 'own-words' as const, label: 'Your Own Words', placeholder: 'Something you wrote, realized, said...' },
  { id: 'objects' as const, label: 'Objects & Sensory', placeholder: 'A song, photo, smell, texture...' },
]

type ArtifactTypeId = typeof ARTIFACT_TYPES[number]['id']

export default function Treasury() {
  const { treasury, addTreasuryArtifact } = useAppStore()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'browse' | 'add' | 'shuffle'>('browse')
  const [type, setType] = useState<ArtifactTypeId>('words')
  const [content, setContent] = useState('')
  const [attribution, setAttribution] = useState('')
  const [shuffleIndex, setShuffleIndex] = useState(0)

  const handleAdd = () => {
    if (!content.trim()) return
    addTreasuryArtifact({ type, content: content.trim(), attribution: attribution.trim() || undefined, date: new Date().toLocaleDateString() })
    setContent('')
    setAttribution('')
    setMode('browse')
  }

  const shuffleEntry = treasury.length > 0 ? treasury[shuffleIndex % treasury.length] : null

  return (
    <div className="min-h-screen bg-[#0f0f14] px-6 pt-12 pb-24">
      <button onClick={() => navigate('/dashboard')} className="text-white/30 text-sm mb-8 block hover:text-white/60 transition-colors">
        ← Back
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl text-white/90">Treasury</h2>
          <p className="text-white/35 text-sm mt-1">Everything that made you</p>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1 mb-8 p-1 bg-white/5 rounded-xl">
        {(['browse', 'add', 'shuffle'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-lg text-sm capitalize transition-all ${mode === m ? 'bg-white/10 text-white/80' : 'text-white/35 hover:text-white/55'}`}>
            {m === 'shuffle' ? 'Shuffle' : m === 'add' ? '+ Add' : 'All'}
          </button>
        ))}
      </div>

      {/* Browse mode */}
      {mode === 'browse' && (
        <div className="flex flex-col gap-3">
          {treasury.length === 0 && (
            <div className="text-center mt-16">
              <p className="font-serif text-white/40 text-lg mb-3">Your Treasury is empty.</p>
              <p className="text-white/25 text-sm">A quote, a place, a person — anything that shaped you.</p>
            </div>
          )}
          {treasury.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              className="p-5 rounded-2xl border border-white/10 bg-white/2">
              <p className="text-white/25 text-xs uppercase tracking-widest mb-2">{a.type}</p>
              <p className="font-serif text-white/75 leading-relaxed">{a.content}</p>
              {a.attribution && <p className="text-white/30 text-sm mt-2 italic">— {a.attribution}</p>}
              <p className="text-white/20 text-xs mt-3">{a.date}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add mode */}
      {mode === 'add' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-2">
            {ARTIFACT_TYPES.map(t => (
              <button key={t.id} onClick={() => setType(t.id)}
                className={`py-2 px-3 rounded-lg border text-xs transition-all ${type === t.id ? 'border-white/35 text-white/70 bg-white/5' : 'border-white/10 text-white/30 hover:border-white/25'}`}>
                {t.label}
              </button>
            ))}
          </div>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={ARTIFACT_TYPES.find(t => t.id === type)?.placeholder}
            className="w-full bg-white/3 border border-white/10 rounded-xl p-4 text-white/75 placeholder-white/20 text-sm resize-none outline-none font-serif leading-relaxed min-h-28 focus:border-white/25 transition-colors"
          />
          <input
            value={attribution}
            onChange={e => setAttribution(e.target.value)}
            placeholder="Source or attribution (optional)"
            className="w-full bg-white/3 border border-white/10 rounded-xl p-4 text-white/75 placeholder-white/20 text-sm outline-none focus:border-white/25 transition-colors"
          />
          <button onClick={handleAdd} className="py-3 rounded-full border border-white/25 text-white/60 text-sm hover:text-white/80 hover:border-white/40 transition-all">
            Save to Treasury
          </button>
        </motion.div>
      )}

      {/* Shuffle mode */}
      {mode === 'shuffle' && (
        <div className="flex flex-col items-center justify-center flex-1 min-h-64">
          {shuffleEntry ? (
            <AnimatePresence mode="wait">
              <motion.div key={shuffleIndex} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="text-center px-4">
                <p className="text-white/25 text-xs uppercase tracking-widest mb-8">{shuffleEntry.type}</p>
                <p className="font-serif text-2xl text-white/80 leading-relaxed">{shuffleEntry.content}</p>
                {shuffleEntry.attribution && <p className="text-white/35 text-sm mt-4 italic">— {shuffleEntry.attribution}</p>}
                <button onClick={() => setShuffleIndex(i => i + 1)} className="mt-12 text-white/35 text-sm hover:text-white/55 transition-colors">
                  Show me another
                </button>
              </motion.div>
            </AnimatePresence>
          ) : (
            <p className="font-serif text-white/40 text-center">Add something to your Treasury first.</p>
          )}
        </div>
      )}
    </div>
  )
}
