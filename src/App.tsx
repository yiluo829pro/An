import { Routes, Route, useNavigate } from 'react-router-dom'
import { useAppStore } from './store/appStore'
import MoodBar from './components/MoodBar'
import MoodJar from './pages/MoodJar'
import IntentScreen from './pages/IntentScreen'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import AnchorNow from './pages/AnchorNow'
import IdentityVault from './pages/IdentityVault'
import Treasury from './pages/Treasury'
import Journal from './pages/Journal'
import Reflect from './pages/Reflect'

function SessionEntry() {
  const { currentMood, setCurrentMood, logMood } = useAppStore()
  const navigate = useNavigate()

  if (currentMood === null) {
    return (
      <MoodBar
        onComplete={(value) => {
          setCurrentMood(value)
          logMood(value)
          navigate('/jar')
        }}
      />
    )
  }
  return null
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SessionEntry />} />
      <Route path="/jar" element={<MoodJar />} />
      <Route path="/intent" element={<IntentScreen />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/anchor" element={<AnchorNow />} />
      <Route path="/vault" element={<IdentityVault />} />
      <Route path="/treasury" element={<Treasury />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/reflect" element={<Reflect />} />
      <Route path="/joy-map" element={<Journal />} />
    </Routes>
  )
}
