import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type MoodLevel = 'heavy' | 'low' | 'quiet' | 'okay' | 'steady' | 'good' | 'light' | 'bright'

export interface MoodEntry {
  id: string
  value: number // 0-100
  label: MoodLabel
  timestamp: number
}

export type MoodLabel = 'Heavy' | 'Low' | 'Quiet' | 'Okay' | 'Steady' | 'Good' | 'Light' | 'Bright'

export interface VaultEntry {
  id: string
  content: string
  quality: string[]
  date: string
  context?: string
}

export interface TreasuryArtifact {
  id: string
  type: 'words' | 'places' | 'people' | 'ideas' | 'own-words' | 'objects'
  content: string
  attribution?: string
  date: string
  tags?: string[]
}

export interface JournalEntry {
  id: string
  content: string
  type: 'raw-thought'
  timestamp: number
  emotionalTag?: string
}

export interface UserProfile {
  onboardingComplete: boolean
  identityPortrait?: string
  comfortPattern?: string
  joyCategories?: string[]
  idealLifeFeelings?: string[]
}

interface AppState {
  profile: UserProfile
  moodHistory: MoodEntry[]
  currentMood: number | null
  identityVault: VaultEntry[]
  treasury: TreasuryArtifact[]
  journal: JournalEntry[]

  setCurrentMood: (value: number) => void
  logMood: (value: number) => void
  completeOnboarding: (portrait: string, comfortPattern: string, joyCategories: string[]) => void
  addVaultEntry: (entry: Omit<VaultEntry, 'id'>) => void
  addTreasuryArtifact: (artifact: Omit<TreasuryArtifact, 'id'>) => void
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void
}

function getMoodLabel(value: number): MoodLabel {
  if (value <= 15) return 'Heavy'
  if (value <= 30) return 'Low'
  if (value <= 45) return 'Quiet'
  if (value <= 55) return 'Okay'
  if (value <= 70) return 'Steady'
  if (value <= 82) return 'Good'
  if (value <= 92) return 'Light'
  return 'Bright'
}

export { getMoodLabel }

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: { onboardingComplete: false },
      moodHistory: [],
      currentMood: null,
      identityVault: [],
      treasury: [],
      journal: [],

      setCurrentMood: (value) => set({ currentMood: value }),

      logMood: (value) => set((state) => ({
        currentMood: value,
        moodHistory: [...state.moodHistory, {
          id: Date.now().toString(),
          value,
          label: getMoodLabel(value),
          timestamp: Date.now(),
        }]
      })),

      completeOnboarding: (portrait, comfortPattern, joyCategories) => set((state) => ({
        profile: {
          ...state.profile,
          onboardingComplete: true,
          identityPortrait: portrait,
          comfortPattern,
          joyCategories,
        }
      })),

      addVaultEntry: (entry) => set((state) => ({
        identityVault: [...state.identityVault, { ...entry, id: Date.now().toString() }]
      })),

      addTreasuryArtifact: (artifact) => set((state) => ({
        treasury: [...state.treasury, { ...artifact, id: Date.now().toString() }]
      })),

      addJournalEntry: (entry) => set((state) => ({
        journal: [...state.journal, { ...entry, id: Date.now().toString(), timestamp: Date.now() }]
      })),
    }),
    { name: 'an-app-storage' }
  )
)
