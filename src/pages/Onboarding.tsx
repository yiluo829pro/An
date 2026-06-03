import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import JoyDial from '../components/onboarding/JoyDial'
import LifeCanvas from '../components/onboarding/LifeCanvas'
import ComfortCompass from '../components/onboarding/ComfortCompass'
import IdentityPortrait from '../components/onboarding/IdentityPortrait'

type Step = 'joy' | 'canvas' | 'compass' | 'portrait'

export default function Onboarding() {
  const [step, setStep] = useState<Step>('joy')
  const [joyCategories, setJoyCategories] = useState<string[]>([])
  const [idealFeeling, setIdealFeeling] = useState('')
  const [comfortPattern, setComfortPattern] = useState('')
  const { completeOnboarding } = useAppStore()
  const navigate = useNavigate()

  return (
    <>
      {step === 'joy' && (
        <JoyDial onComplete={(cats) => { setJoyCategories(cats); setStep('canvas') }} />
      )}
      {step === 'canvas' && (
        <LifeCanvas onComplete={(feeling) => { setIdealFeeling(feeling); setStep('compass') }} />
      )}
      {step === 'compass' && (
        <ComfortCompass onComplete={(pattern) => { setComfortPattern(pattern); setStep('portrait') }} />
      )}
      {step === 'portrait' && (
        <IdentityPortrait
          joyCategories={joyCategories}
          idealFeeling={idealFeeling}
          comfortPattern={comfortPattern}
          onComplete={() => {
            completeOnboarding(
              `Joy: ${joyCategories.join(', ')} | Feeling: ${idealFeeling} | Pattern: ${comfortPattern}`,
              comfortPattern,
              joyCategories
            )
            navigate('/dashboard')
          }}
        />
      )}
    </>
  )
}
