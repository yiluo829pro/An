import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/appStore'

type Step = 'situation' | 'treasury' | 'vault' | 'calm' | 'done'

const SITUATIONS = [
  { id: 'doubt', label: "I'm doubting myself", icon: '🌫' },
  { id: 'failure', label: "I feel like a failure", icon: '◎' },
  { id: 'overwhelm', label: "I'm overwhelmed", icon: '〜' },
  { id: 'compare', label: "I'm comparing myself", icon: '⟺' },
  { id: 'pain', label: "Something painful just happened", icon: '◇' },
]

const CALM_STEPS = [
  "Put your feet flat on the floor. Feel the ground — it's holding you.",
  "Take one slow breath. Not to calm down — just to mark this moment.",
  "Name one thing that's true about you that has nothing to do with what just happened.",
  "You've been in hard moments before. You moved through them. This one is no different.",
]

function getTreasuryEntry(treasury: Array<{ content: string; type: string }>): { content: string; type: string } {
  if (treasury.length === 0) {
    return { content: '"You are not behind. You are not broken. You are in the middle of something hard. That is different."', type: 'words' }
  }
  const entry = treasury[Math.floor(Math.random() * treasury.length)]
  return { content: entry.content, type: entry.type }
}

function getVaultEntry(vault: Array<{ content: string }>): string {
  if (vault.length === 0) {
    return "You have survived everything that has come before this moment. That is not nothing. That is everything."
  }
  const entry = vault[Math.floor(Math.random() * vault.length)]
  return entry.content
}

export default function AnchorNow() {
  const [step, setStep] = useState<Step>('situation')
  const [calmStep, setCalmStep] = useState(0)
  const { treasury, identityVault } = useAppStore()
  const navigate = useNavigate()

  const treasuryEntry = getTreasuryEntry(treasury)
  const vaultEntry = getVaultEntry(identityVault)

  return (
    <div className="min-h-screen bg-[#0a0a10] flex flex-col">
      {/* Back button */}
      <button onClick={() => navigate('/dashboard')} className="absolute top-6 left-6 text-white/30 text-sm hover:text-white/60 transition-colors">
        ← Back
      </button>

      <AnimatePresence mode="wait">

        {step === 'situation' && (
          <motion.div key="situation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center flex-1 px-6">
            <p className="font-serif text-2xl text-white/80 text-center mb-12">What's happening right now?</p>
            <div className="flex flex-col gap-3 w-full max-w-sm">
              {SITUATIONS.map(s => (
                <motion.button key={s.id} whileHover={{ x: 4 }}
                  onClick={() => { setStep('treasury') }}
                  className="py-4 px-6 rounded-xl border border-white/15 text-white/65 hover:border-white/30 hover:text-white/85 text-left flex items-center gap-4 transition-all">
                  <span>{s.icon}</span>
                  <span className="font-serif">{s.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'treasury' && (
          <motion.div key="treasury" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center flex-1 px-8">
            <p className="text-white/25 text-xs uppercase tracking-widest mb-12">From your Treasury</p>
            <p className="font-serif text-2xl text-white/80 text-center leading-relaxed italic max-w-sm">
              {treasuryEntry.content}
            </p>
            <div className="flex gap-4 mt-16">
              <button onClick={() => setStep('vault')} className="px-8 py-3 rounded-full border border-white/20 text-white/50 hover:text-white/70 hover:border-white/35 text-sm transition-all">
                Continue →
              </button>
            </div>
          </motion.div>
        )}

        {step === 'vault' && (
          <motion.div key="vault" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center flex-1 px-8">
            <p className="text-white/25 text-xs uppercase tracking-widest mb-12">From your Identity Vault</p>
            <p className="font-serif text-xl text-white/80 text-center leading-relaxed max-w-sm">
              {vaultEntry}
            </p>
            <button onClick={() => setStep('calm')} className="mt-16 px-8 py-3 rounded-full border border-white/20 text-white/50 hover:text-white/70 hover:border-white/35 text-sm transition-all">
              Continue →
            </button>
          </motion.div>
        )}

        {step === 'calm' && (
          <motion.div key="calm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center flex-1 px-8">
            <p className="text-white/25 text-xs uppercase tracking-widest mb-12">
              Step {calmStep + 1} of {CALM_STEPS.length}
            </p>
            <AnimatePresence mode="wait">
              <motion.p key={calmStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="font-serif text-xl text-white/80 text-center leading-relaxed max-w-sm">
                {CALM_STEPS[calmStep]}
              </motion.p>
            </AnimatePresence>
            <button
              onClick={() => {
                if (calmStep + 1 < CALM_STEPS.length) setCalmStep(c => c + 1)
                else setStep('done')
              }}
              className="mt-16 px-8 py-3 rounded-full border border-white/20 text-white/50 hover:text-white/70 hover:border-white/35 text-sm transition-all">
              {calmStep + 1 < CALM_STEPS.length ? 'Next →' : 'Done'}
            </button>
          </motion.div>
        )}

        {step === 'done' && (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center flex-1 px-8">
            <p className="font-serif text-2xl text-white/70 text-center mb-6">
              You moved through it.
            </p>
            <p className="text-white/35 text-center max-w-xs mb-16">
              That's what you do. That's who you are.
            </p>
            <button onClick={() => navigate('/dashboard')} className="px-8 py-3 rounded-full border border-white/20 text-white/50 hover:text-white/70 text-sm transition-all">
              Return
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
