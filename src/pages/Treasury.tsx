import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/appStore'

const ARTIFACT_TYPES = [
  { id: 'words' as const, label: 'Words', icon: '✦', color: '#e8c547', placeholder: 'Something you read or someone said...' },
  { id: 'places' as const, label: 'Places', icon: '◎', color: '#6ec996', placeholder: 'A place that changed something in you...' },
  { id: 'people' as const, label: 'People', icon: '◇', color: '#90a8f0', placeholder: 'Someone who gave you something important...' },
  { id: 'ideas' as const, label: 'Ideas', icon: '〜', color: '#e090c8', placeholder: 'A concept that reoriented how you see the world...' },
  { id: 'own-words' as const, label: 'My Words', icon: '◈', color: '#f0c870', placeholder: 'Something you wrote, realized, or said...' },
  { id: 'objects' as const, label: 'Sensory', icon: '❋', color: '#70c8e8', placeholder: 'A song, photo, smell, texture, taste...' },
]

type ArtifactTypeId = typeof ARTIFACT_TYPES[number]['id']

const STARTER_TEMPLATES = [
  'When I was young, my ___ told me that ___.',
  'The place that always makes me feel like myself is ___.',
  'A line that changed me: "___"',
  'Someone once told me I was ___, and they were right.',
  'The song that takes me back to ___ is ___.',
  'A piece of advice I keep returning to: "___"',
  'I felt most alive when ___.',
  'The book that shifted something in me was ___.',
]

// Leaf positions on the tree canvas
const LEAF_POSITIONS = [
  { x: 50, y: 8 },
  { x: 33, y: 16 }, { x: 67, y: 14 },
  { x: 22, y: 26 }, { x: 50, y: 22 }, { x: 76, y: 24 },
  { x: 30, y: 36 }, { x: 56, y: 34 }, { x: 70, y: 38 },
  { x: 18, y: 44 }, { x: 44, y: 46 }, { x: 74, y: 48 },
  { x: 26, y: 56 }, { x: 52, y: 58 }, { x: 68, y: 54 },
]

function TreeVisualization({ items, onTap }: { items: any[]; onTap: (item: any) => void }) {
  return (
    <div className="relative w-full mx-auto" style={{ maxWidth: 340, height: 320 }}>
      {/* SVG tree trunk and branches */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 320" fill="none">
        {/* Trunk */}
        <path d="M170 320 C168 280 165 240 167 200 C169 160 172 130 170 80" stroke="#5a3d20" strokeWidth="14" strokeLinecap="round" />
        {/* Left main branch */}
        <path d="M168 210 C148 195 118 185 88 178" stroke="#5a3d20" strokeWidth="9" strokeLinecap="round" />
        {/* Right main branch */}
        <path d="M169 185 C192 170 218 162 248 158" stroke="#5a3d20" strokeWidth="9" strokeLinecap="round" />
        {/* Left sub-branch */}
        <path d="M118 184 C98 168 78 155 62 140" stroke="#5a3d20" strokeWidth="6" strokeLinecap="round" />
        {/* Right sub-branch */}
        <path d="M220 164 C240 148 254 132 262 118" stroke="#5a3d20" strokeWidth="6" strokeLinecap="round" />
        {/* Top left branch */}
        <path d="M169 140 C150 118 132 102 110 88" stroke="#5a3d20" strokeWidth="5" strokeLinecap="round" />
        {/* Top right branch */}
        <path d="M170 120 C188 100 204 85 220 70" stroke="#5a3d20" strokeWidth="5" strokeLinecap="round" />
        {/* Center top */}
        <path d="M170 90 C168 62 166 40 165 18" stroke="#5a3d20" strokeWidth="4" strokeLinecap="round" />
      </svg>

      {/* Empty ghost leaves */}
      {items.length === 0 && LEAF_POSITIONS.slice(0, 8).map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-5 h-5 rounded-full border border-white/15"
          style={{ left: `${pos.x}%`, top: `${pos.y * 3.2}px`, transform: 'translate(-50%, -50%)' }}
          animate={{ opacity: [0.06, 0.18, 0.06] }}
          transition={{ duration: 2.8, delay: i * 0.35, repeat: Infinity }}
        />
      ))}

      {/* Artifact leaves */}
      {items.slice(0, LEAF_POSITIONS.length).map((item, i) => {
        const pos = LEAF_POSITIONS[i]
        const typeInfo = ARTIFACT_TYPES.find(t => t.id === item.type)
        const color = typeInfo?.color || '#e8c547'
        return (
          <motion.button
            key={item.id}
            className="absolute"
            style={{ left: `${pos.x}%`, top: `${pos.y * 3.2}px`, transform: 'translate(-50%, -50%)' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: i * 0.07 }}
            whileHover={{ scale: 1.5 }}
            onClick={() => onTap(item)}
          >
            {/* Glow */}
            <motion.div
              className="absolute rounded-full blur-lg"
              style={{ inset: -6, background: color, opacity: 0.4 }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2.5 + i * 0.2, repeat: Infinity }}
            />
            {/* Leaf */}
            <div
              className="relative w-4 h-4 rounded-full"
              style={{ background: color, boxShadow: `0 0 10px ${color}` }}
            />
          </motion.button>
        )
      })}
    </div>
  )
}

export default function Treasury() {
  const { treasury, addTreasuryArtifact } = useAppStore()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'tree' | 'add' | 'shuffle' | 'detail'>('tree')
  const [type, setType] = useState<ArtifactTypeId>('words')
  const [content, setContent] = useState('')
  const [attribution, setAttribution] = useState('')
  const [shuffleIndex, setShuffleIndex] = useState(0)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [showTemplates, setShowTemplates] = useState(true)

  const handleAdd = () => {
    if (!content.trim()) return
    addTreasuryArtifact({
      type,
      content: content.trim(),
      attribution: attribution.trim() || undefined,
      date: new Date().toLocaleDateString(),
    })
    setContent('')
    setAttribution('')
    setMode('tree')
  }

  const handleLeafTap = (item: any) => {
    setSelectedItem(item)
    setMode('detail')
  }

  const shuffleEntry = treasury.length > 0 ? treasury[shuffleIndex % treasury.length] : null
  const activeType = ARTIFACT_TYPES.find(t => t.id === type)!

  return (
    <div className="min-h-screen px-6 pt-12 pb-24" style={{ background: 'linear-gradient(180deg, #0a0814 0%, #120d1a 60%, #0f0a10 100%)' }}>
      <button onClick={() => navigate('/dashboard')} className="text-white/40 text-sm mb-6 block hover:text-white/70 transition-colors">
        ← Back
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-serif text-2xl text-white/95">Treasury</h2>
          <p className="text-white/45 text-sm mt-0.5">
            {treasury.length === 0 ? 'Everything that made you' : `${treasury.length} artifact${treasury.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMode(mode === 'shuffle' ? 'tree' : 'shuffle')}
            className={`px-3 py-1.5 rounded-full border text-xs transition-all ${mode === 'shuffle' ? 'border-amber-400/50 text-amber-300' : 'border-white/15 text-white/40 hover:border-white/30'}`}
          >
            Shuffle
          </button>
          <button
            onClick={() => { setMode('add'); setContent(''); setAttribution('') }}
            className={`px-3 py-1.5 rounded-full border text-xs transition-all ${mode === 'add' ? 'border-amber-400/50 text-amber-300' : 'border-white/15 text-white/40 hover:border-white/30'}`}
          >
            + Add
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* Tree view */}
        {mode === 'tree' && (
          <motion.div key="tree" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {treasury.length === 0 && (
              <p className="text-center text-white/35 text-sm mb-4 font-serif italic">
                Your tree is bare. Add something that shaped you.
              </p>
            )}

            <TreeVisualization items={treasury} onTap={handleLeafTap} />

            {/* Color legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-3 mb-6">
              {ARTIFACT_TYPES.map(t => (
                <div key={t.id} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: t.color, boxShadow: `0 0 4px ${t.color}` }} />
                  <span className="text-white/40 text-xs">{t.label}</span>
                </div>
              ))}
            </div>

            {/* Item list */}
            {treasury.length > 0 && (
              <div className="flex flex-col gap-3 mt-2">
                {[...treasury].reverse().map((a, i) => {
                  const info = ARTIFACT_TYPES.find(t => t.id === a.type)
                  return (
                    <motion.button
                      key={a.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => handleLeafTap(a)}
                      className="text-left p-4 rounded-2xl transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span style={{ color: info?.color, fontSize: 12 }}>{info?.icon} {info?.label}</span>
                        <span className="text-white/25 text-xs">{a.date}</span>
                      </div>
                      <p className="font-serif leading-relaxed text-sm" style={{ color: 'rgba(255,255,255,0.82)' }}>
                        {a.content}
                      </p>
                      {a.attribution && (
                        <p className="text-white/45 text-xs mt-2 italic">— {a.attribution}</p>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Detail view */}
        {mode === 'detail' && selectedItem && (
          <motion.div key="detail" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <button onClick={() => setMode('tree')} className="text-white/40 text-sm mb-10 block hover:text-white/70">
              ← Back to tree
            </button>
            {(() => {
              const info = ARTIFACT_TYPES.find(t => t.id === selectedItem.type)
              return (
                <>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-3 h-3 rounded-full" style={{ background: info?.color, boxShadow: `0 0 10px ${info?.color}` }} />
                    <span className="text-xs uppercase tracking-widest" style={{ color: info?.color }}>{info?.label}</span>
                  </div>
                  <p className="font-serif text-2xl leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    {selectedItem.content}
                  </p>
                  {selectedItem.attribution && (
                    <p className="text-white/55 text-base italic">— {selectedItem.attribution}</p>
                  )}
                  <p className="text-white/25 text-xs mt-8">{selectedItem.date}</p>
                </>
              )
            })()}
          </motion.div>
        )}

        {/* Add view */}
        {mode === 'add' && (
          <motion.div key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">

            {/* Starter templates */}
            <div>
              <button
                onClick={() => setShowTemplates(s => !s)}
                className="text-white/45 text-xs uppercase tracking-widest mb-3 flex items-center gap-2 hover:text-white/65 transition-colors"
              >
                Start with a prompt {showTemplates ? '▲' : '▼'}
              </button>
              {showTemplates && (
                <div className="flex flex-col gap-2 mb-4">
                  {STARTER_TEMPLATES.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => { setContent(t); setShowTemplates(false) }}
                      className="text-left px-4 py-3 rounded-xl text-sm font-serif italic transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Type picker */}
            <div className="grid grid-cols-3 gap-2">
              {ARTIFACT_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className="py-2.5 px-2 rounded-xl border text-xs transition-all flex items-center gap-1.5 justify-center"
                  style={{
                    borderColor: type === t.id ? t.color : 'rgba(255,255,255,0.1)',
                    color: type === t.id ? t.color : 'rgba(255,255,255,0.45)',
                    background: type === t.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                  }}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* Text input */}
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={activeType.placeholder}
              className="w-full rounded-2xl p-4 resize-none outline-none font-serif leading-relaxed min-h-32 text-sm transition-colors"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${content ? activeType.color + '60' : 'rgba(255,255,255,0.12)'}`,
                color: 'rgba(255,255,255,0.9)',
              }}
            />
            <input
              value={attribution}
              onChange={e => setAttribution(e.target.value)}
              placeholder="Source or who said it (optional)"
              className="w-full rounded-xl p-3.5 outline-none text-sm transition-colors"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.8)',
              }}
            />
            <button
              onClick={handleAdd}
              disabled={!content.trim()}
              className="w-full py-4 rounded-2xl font-serif text-base transition-all disabled:opacity-25 disabled:cursor-not-allowed"
              style={{
                border: `1px solid ${activeType.color}60`,
                color: activeType.color,
                background: `${activeType.color}10`,
              }}
            >
              Place in Treasury
            </button>
          </motion.div>
        )}

        {/* Shuffle view */}
        {mode === 'shuffle' && (
          <motion.div key="shuffle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-72 pt-8">
            {shuffleEntry ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={shuffleIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center px-4"
                >
                  {(() => {
                    const info = ARTIFACT_TYPES.find(t => t.id === shuffleEntry.type)
                    return (
                      <>
                        <div className="flex items-center justify-center gap-2 mb-8">
                          <div className="w-2 h-2 rounded-full" style={{ background: info?.color, boxShadow: `0 0 8px ${info?.color}` }} />
                          <span className="text-xs uppercase tracking-widest" style={{ color: info?.color }}>{info?.label}</span>
                        </div>
                        <p className="font-serif text-2xl leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.9)' }}>
                          {shuffleEntry.content}
                        </p>
                        {shuffleEntry.attribution && (
                          <p className="text-white/50 text-sm italic">— {shuffleEntry.attribution}</p>
                        )}
                        <button
                          onClick={() => setShuffleIndex(i => i + 1)}
                          className="mt-12 text-white/40 text-sm hover:text-white/65 transition-colors"
                        >
                          Show me another
                        </button>
                      </>
                    )
                  })()}
                </motion.div>
              </AnimatePresence>
            ) : (
              <p className="font-serif text-white/45 text-center">Add something to your Treasury first.</p>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
