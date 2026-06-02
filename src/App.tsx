import { useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from './store/appStore'
import MoodBar from './components/MoodBar'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import AnchorNow from './pages/AnchorNow'
import IdentityVault from './pages/IdentityVault'
import Treasury from './pages/Treasury'
import Journal from './pages/Journal'
import Reflect from './pages/Reflect'

function AppRouter() {
  const { profile, currentMood, setCurrentMood } = useAppStore()
  const navigate = useNavigate()
  const location = useLocation()

  // Guard: if not onboarded and not already on onboarding route, redirect
  useEffect(() => {
    if (!profile.onboardingComplete && location.pathname !== '/onboarding') {
      // handled by render logic below
    }
  }, [profile.onboardingComplete, location.pathname])

  // If not onboarded, show mood bar first, then onboarding
  if (!profile.onboardingComplete && location.pathname !== '/onboarding') {
    if (currentMood === null) {
      return (
        <MoodBar onComplete={(value) => {
          setCurrentMood(value)
          navigate('/onboarding')
        }} />
      )
    }
    return <Onboarding />
  }

  // If onboarded but no mood yet this session
  if (profile.onboardingComplete && currentMood === null && location.pathname === '/') {
    return (
      <MoodBar onComplete={(value) => {
        setCurrentMood(value)
        navigate('/dashboard')
      }} />
    )
  }

  return (
    <Routes>
      <Route path="/" element={
        currentMood === null
          ? <MoodBar onComplete={(value) => { setCurrentMood(value); navigate('/dashboard') }} />
          : <Dashboard />
      } />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/anchor" element={<AnchorNow />} />
      <Route path="/vault" element={<IdentityVault />} />
      <Route path="/treasury" element={<Treasury />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/reflect" element={<Reflect />} />
    </Routes>
  )
}

export default function App() {
  return <AppRouter />
}
