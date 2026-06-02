import { useState } from 'react'
import { motion } from 'framer-motion'

interface LifeCanvasProps {
  onComplete: (feeling: string) => void
}

const FEELINGS = ['Calm', 'Free', 'Present', 'Purposeful', 'Connected', 'Creative', 'Peaceful', 'Alive']

export default function LifeCanvas({ onComplete }: LifeCanvasProps) {
  const [step, setStep] = useState(0)
  const [_selectedFeeling, setSelectedFeeling] = useState('')

  const steps = [
    {
      question: 'Where does your ideal self spend their time?',
      options: ['🏡 Home, deeply known', '🌆 A city with energy', '🌲 Near nature', '✈️ Moving often'],
    },
    {
      question: 'Who is around you?',
      options: ['A few close people', 'A lively community', 'Mostly solitude', 'A partner, primarily'],
    },
    {
      question: 'What are you known for?',
      options: ['The quality of my work', 'How I make people feel', 'My ideas', 'My integrity'],
    },
  ]

  const [answers, setAnswers] = useState<string[]>([])

  const handleSelect = (option: string) => {
    const newAnswers = [...answers, option]
    setAnswers(newAnswers)
    if (step < steps.length - 1) {
      setStep(s => s + 1)
    } else {
      setStep(steps.length) // feeling step
    }
  }

  if (step === steps.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f14] px-6">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-12">What feeling do you wake up with most mornings?</p>
        <p className="font-serif text-lg text-white/60 mb-10 text-center">In your ideal life.</p>
        <div className="grid grid-cols-2 gap-3 max-w-xs w-full">
          {FEELINGS.map(f => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setSelectedFeeling(f); onComplete(f) }}
              className="py-4 px-6 rounded-xl border border-white/15 text-white/60 hover:border-white/35 hover:text-white/80 font-serif text-lg transition-all"
            >
              {f}
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  const current = steps[step]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f14] px-6">
      <p className="text-white/40 text-xs uppercase tracking-widest mb-8">Game 2 of 3 — The Life Canvas</p>
      <div className="w-full max-w-xs h-0.5 bg-white/10 rounded mb-12">
        <div className="h-full bg-white/40 rounded" style={{ width: `${(step / steps.length) * 100}%` }} />
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <p className="font-serif text-xl text-white/80 text-center mb-10">{current.question}</p>
        <div className="flex flex-col gap-3">
          {current.options.map(opt => (
            <motion.button
              key={opt}
              whileHover={{ x: 4 }}
              onClick={() => handleSelect(opt)}
              className="py-4 px-6 rounded-xl border border-white/15 text-white/60 hover:border-white/35 hover:text-white/80 text-left transition-all"
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
