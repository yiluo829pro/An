import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/appStore'

interface Template {
  id: string
  category: string
  sentence: string // uses ___ as placeholder
  chips: string[]
  customPlaceholder: string
}

const TEMPLATES: Template[] = [
  // Family
  { id: 'f1', category: 'Family', sentence: 'I am ___ to my family.', chips: ['loyal', 'caring', 'loving', 'supportive', 'protective', 'present', 'dependable', 'the steady one', 'the funny one', 'the listener'], customPlaceholder: 'your own word' },
  { id: 'f2', category: 'Family', sentence: 'In my family, I am known for being ___.', chips: ['the peacemaker', 'the ambitious one', 'the creative one', 'the responsible one', 'the adventurous one', 'the empathetic one'], customPlaceholder: 'your role' },

  // Friends
  { id: 'fr1', category: 'Friends', sentence: 'To my friends, I am ___.', chips: ['patient', 'kind', 'empathetic', 'fun to be around', 'a safe place', 'honest', 'someone who shows up', 'the planner', 'the one who listens', 'loyal to the end'], customPlaceholder: 'your own word' },
  { id: 'fr2', category: 'Friends', sentence: 'My friends come to me when they need ___.', chips: ['advice', 'a laugh', 'someone to listen', 'honesty', 'help solving a problem', 'to feel understood', 'a reality check'], customPlaceholder: 'what they need' },

  // Work & Craft
  { id: 'w1', category: 'Work & Craft', sentence: 'At work, I am someone who ___.', chips: ['gets things done', 'thinks creatively', 'leads quietly', 'asks good questions', 'cares about quality', 'lifts others up', 'sees the big picture', 'handles pressure well', 'earns trust', 'never stops learning'], customPlaceholder: 'your strength' },
  { id: 'w2', category: 'Work & Craft', sentence: 'I have a gift for ___.', chips: ['connecting people', 'breaking down complexity', 'seeing patterns', 'making things beautiful', 'building things', 'telling stories', 'reading a room', 'strategic thinking', 'deep focus', 'bringing calm to chaos'], customPlaceholder: 'your gift' },

  // Character
  { id: 'c1', category: 'Character', sentence: 'When things get hard, I am ___.', chips: ['resilient', 'calm', 'determined', 'honest with myself', 'someone who asks for help', 'the one who keeps going', 'adaptable', 'grounded', 'someone who learns from it'], customPlaceholder: 'how you show up' },
  { id: 'c2', category: 'Character', sentence: 'Something I believe that most people don\'t is ___.', chips: ['kindness is strength', 'slow is often faster', 'most people are trying their best', 'the process matters as much as the result', 'rest is productive', 'asking is braver than pretending to know'], customPlaceholder: 'your belief' },
  { id: 'c3', category: 'Character', sentence: 'I am at my best when ___.', chips: ['I have space to think', 'I\'m working on something that matters', 'I\'m around people I trust', 'I\'m moving my body', 'I\'m creating something', 'I have a clear goal', 'the stakes are real'], customPlaceholder: 'your condition' },

  // Society & World
  { id: 's1', category: 'World', sentence: 'In the world, I want to be someone who ___.', chips: ['makes things better', 'tells the truth', 'treats people well', 'leaves something behind', 'uses their talents fully', 'protects what matters', 'builds rather than tears down', 'inspires without trying to'], customPlaceholder: 'your aspiration' },
  { id: 's2', category: 'World', sentence: 'The kind of person I am becoming is ___.', chips: ['more patient', 'braver', 'more honest', 'more creative', 'calmer', 'more purposeful', 'more present', 'someone with fewer regrets'], customPlaceholder: 'who you\'re becoming' },

  // Achievements
  { id: 'a1', category: 'Achievements', sentence: 'I am proud that I ___.', chips: ['finished something hard', 'helped someone through a difficult time', 'kept going when I wanted to quit', 'built something from nothing', 'stood up for myself', 'learned something completely new', 'earned real trust', 'did the right thing when it cost me'], customPlaceholder: 'your achievement' },
  { id: 'a2', category: 'Achievements', sentence: 'I mastered ___.', chips: ['a skill others said was hard', 'a sport or physical discipline', 'a craft I started from zero', 'a subject that didn\'t come naturally', 'a new language', 'a professional skill I taught myself'], customPlaceholder: 'what you mastered' },
  { id: 'a3', category: 'Achievements', sentence: 'I did well in ___ and it showed me I could ___.', chips: ['school / academics', 'a job or project', 'a creative pursuit', 'a competition or challenge', 'a hard season of life'], customPlaceholder: 'your context' },
]

const CATEGORIES = ['All', 'Family', 'Friends', 'Work & Craft', 'Character', 'World', 'Achievements']

export default function IdentityVault() {
  const { identityVault, addVaultEntry } = useAppStore()
  const navigate = useNavigate()
  const [view, setView] = useState<'home' | 'explore' | 'template'>('home')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null)
  const [selectedChips, setSelectedChips] = useState<string[]>([])
  const [customText, setCustomText] = useState('')

  const filteredTemplates = TEMPLATES.filter(t =>
    activeCategory === 'All' || t.category === activeCategory
  )

  const toggleChip = (chip: string) => {
    setSelectedChips(prev =>
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    )
  }

  const buildSentence = (template: Template, chips: string[], custom: string) => {
    const values = [...chips, ...(custom.trim() ? [custom.trim()] : [])]
    if (values.length === 0) return null
    return template.sentence.replace('___', values.join(', '))
  }

  const handleSave = () => {
    if (!activeTemplate) return
    const sentence = buildSentence(activeTemplate, selectedChips, customText)
    if (!sentence) return
    addVaultEntry({
      content: sentence,
      quality: [activeTemplate.category],
      date: new Date().toLocaleDateString(),
    })
    setActiveTemplate(null)
    setSelectedChips([])
    setCustomText('')
    setView('home')
  }

  const openTemplate = (t: Template) => {
    setActiveTemplate(t)
    setSelectedChips([])
    setCustomText('')
    setView('template')
  }

  // Template fill screen
  if (view === 'template' && activeTemplate) {
    const preview = buildSentence(activeTemplate, selectedChips, customText)
    return (
      <div className="min-h-screen bg-[#0f0f14] px-6 pt-12 pb-24">
        <button onClick={() => setView('explore')} className="text-white/30 text-sm mb-8 block hover:text-white/60 transition-colors">
          ← Back
        </button>

        <p className="text-white/30 text-xs uppercase tracking-widest mb-6">{activeTemplate.category}</p>

        {/* Live preview sentence */}
        <motion.div className="mb-10 p-5 rounded-2xl border border-white/10 bg-white/3 min-h-16">
          {preview ? (
            <p className="font-serif text-xl text-white/85 leading-relaxed">{preview}</p>
          ) : (
            <p className="font-serif text-xl text-white/25 leading-relaxed">{activeTemplate.sentence}</p>
          )}
        </motion.div>

        {/* Chips */}
        <p className="text-white/35 text-sm mb-4">Choose one or more:</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {activeTemplate.chips.map(chip => (
            <motion.button
              key={chip}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggleChip(chip)}
              className={`px-4 py-2 rounded-full border text-sm transition-all ${
                selectedChips.includes(chip)
                  ? 'border-white/50 text-white/85 bg-white/10'
                  : 'border-white/15 text-white/40 hover:border-white/30 hover:text-white/60'
              }`}
            >
              {chip}
            </motion.button>
          ))}
        </div>

        {/* Custom input */}
        <div className="mb-10">
          <p className="text-white/25 text-xs mb-2">Or write your own:</p>
          <input
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            placeholder={activeTemplate.customPlaceholder}
            className="w-full bg-transparent border-b border-white/15 text-white/70 placeholder-white/20 text-sm outline-none py-2 focus:border-white/35 transition-colors"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!preview}
          className="w-full py-4 rounded-2xl border border-white/25 text-white/65 font-serif text-lg hover:border-white/45 hover:text-white/85 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        >
          Add to my Vault
        </button>
      </div>
    )
  }

  // Explore templates
  if (view === 'explore') {
    return (
      <div className="min-h-screen bg-[#0f0f14] px-6 pt-12 pb-24">
        <button onClick={() => setView('home')} className="text-white/30 text-sm mb-8 block hover:text-white/60 transition-colors">
          ← Back
        </button>
        <h2 className="font-serif text-2xl text-white/90 mb-2">Discover yourself</h2>
        <p className="text-white/35 text-sm mb-8">Finish a sentence. One at a time.</p>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full border text-xs whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'border-white/45 text-white/80 bg-white/8'
                  : 'border-white/12 text-white/35 hover:border-white/28'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filteredTemplates.map((t, i) => (
            <motion.button
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => openTemplate(t)}
              className="text-left p-5 rounded-2xl border border-white/10 bg-white/2 hover:border-white/22 hover:bg-white/4 transition-all"
            >
              <p className="text-white/28 text-xs uppercase tracking-widest mb-2">{t.category}</p>
              <p className="font-serif text-white/70 text-lg leading-snug">{t.sentence}</p>
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  // Home view
  return (
    <div className="min-h-screen bg-[#0f0f14] px-6 pt-12 pb-24">
      <button onClick={() => navigate('/dashboard')} className="text-white/30 text-sm mb-8 block hover:text-white/60 transition-colors">
        ← Back
      </button>

      <div className="mb-8">
        <h2 className="font-serif text-2xl text-white/90">Identity Vault</h2>
        <p className="text-white/35 text-sm mt-1">Who you are, in your own words</p>
      </div>

      {/* CTA to explore */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setView('explore')}
        className="w-full mb-8 p-5 rounded-2xl border border-white/20 bg-white/4 text-left hover:border-white/32 hover:bg-white/6 transition-all"
      >
        <p className="font-serif text-white/75 text-lg mb-1">+ Discover more about yourself</p>
        <p className="text-white/35 text-sm">Finish a sentence. We have {TEMPLATES.length} to start with.</p>
      </motion.button>

      {/* Empty state */}
      {identityVault.length === 0 && (
        <div className="text-center mt-16">
          <p className="font-serif text-white/40 text-lg mb-3">Your vault is waiting.</p>
          <p className="text-white/25 text-sm max-w-xs mx-auto">Tap above to complete a sentence about who you are. It takes 30 seconds.</p>
        </div>
      )}

      {/* Entries */}
      <div className="flex flex-col gap-4">
        {identityVault.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl border border-white/10 bg-white/2"
          >
            <p className="font-serif text-white/78 leading-relaxed text-lg">"{entry.content}"</p>
            {entry.quality.length > 0 && (
              <span className="inline-block mt-3 text-xs text-white/28 border border-white/10 px-2 py-0.5 rounded-full">
                {entry.quality[0]}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
