import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from './store/appStore'

function Home() {
  const { profile, currentMood } = useAppStore()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-serif mb-3 tracking-wide">安</h1>
        <p className="text-lg text-[#a09898] mb-8 font-light">
          {profile.onboardingComplete
            ? `Welcome back. You are still you.`
            : `When life shakes you, An helps you find your way back to yourself.`}
        </p>
        {currentMood !== null && (
          <p className="text-sm text-[#7a7070] mb-6">
            Today you're feeling <span className="text-[#e8c547]">{currentMood}</span>
          </p>
        )}
        <div className="flex flex-col gap-3">
          {!profile.onboardingComplete && (
            <a
              href="/onboarding"
              className="px-6 py-3 bg-[#e8c547] text-[#0f0f14] rounded-lg font-medium hover:bg-[#f5e642] transition-colors"
            >
              Begin
            </a>
          )}
          {profile.onboardingComplete && (
            <>
              <a href="/dashboard" className="px-6 py-3 bg-[#1e1e28] border border-[#2e2e3a] rounded-lg hover:border-[#e8c547] transition-colors">
                Open Dashboard
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Placeholder({ name }: { name: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-serif mb-2">{name}</h2>
        <p className="text-[#7a7070]">Coming soon</p>
        <a href="/" className="mt-4 inline-block text-sm text-[#e8c547] hover:underline">← Back</a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/onboarding" element={<Placeholder name="Onboarding" />} />
      <Route path="/dashboard" element={<Placeholder name="Dashboard" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
