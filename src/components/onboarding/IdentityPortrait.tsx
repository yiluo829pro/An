import { motion } from 'framer-motion'

interface IdentityPortraitProps {
  joyCategories: string[]
  idealFeeling: string
  comfortPattern: string
  onComplete: () => void
}

function generatePortrait(joy: string[], feeling: string, _comfort: string): string {
  const hasNature = joy.includes('nature')
  const hasCreating = joy.includes('creating')
  const hasConnection = joy.includes('connection')
  const hasSolitude = joy.includes('solitude')
  const hasPurpose = joy.includes('purpose')

  const lines: string[] = []

  if (hasSolitude && hasConnection) {
    lines.push(`You restore alone, but you need real people too — not crowds, but depth. That's not a contradiction. That's just you.`)
  } else if (hasSolitude) {
    lines.push(`You do your best thinking in quiet. Solitude isn't loneliness for you — it's how you come back to yourself.`)
  } else if (hasConnection) {
    lines.push(`You come alive with people who are truly present. The right conversation can restore you more than any amount of rest.`)
  }

  if (hasCreating) {
    lines.push(`When you're overwhelmed, your instinct is to make something. That instinct is right.`)
  }

  if (hasPurpose) {
    lines.push(`You need to feel like what you're doing matters. Work without meaning drains you faster than anything.`)
  }

  if (hasNature) {
    lines.push(`The natural world orients you. When you're lost, going outside is never the wrong first move.`)
  }

  lines.push(`Your ideal life feels ${feeling.toLowerCase()}. That's not a small thing — that's the whole thing.`)
  lines.push(`You already know all of this. We're just holding it somewhere you can find it.`)

  return lines.join(' ')
}

export default function IdentityPortrait({ joyCategories, idealFeeling, comfortPattern, onComplete }: IdentityPortraitProps) {
  const portrait = generatePortrait(joyCategories, idealFeeling, comfortPattern)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f14] px-8"
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-white/30 text-xs uppercase tracking-widest mb-12"
      >
        Your Identity Portrait
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1.5 }}
        className="font-serif text-xl text-white/80 text-center leading-relaxed max-w-sm mb-4"
      >
        {portrait}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="text-white/30 text-sm text-center mt-8 mb-16 max-w-xs"
      >
        This is your foundation. Everything in the app is built from this.
      </motion.p>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
        onClick={onComplete}
        className="px-8 py-3 rounded-full border border-white/25 text-white/60 hover:border-white/50 hover:text-white/80 text-sm tracking-widest uppercase transition-all"
      >
        Begin
      </motion.button>
    </motion.div>
  )
}
