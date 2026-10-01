import { useEffect, useState } from 'react'
import Background from './components/Background'
import SurePopup from './components/SurePopup'
import Welcome from './screens/Welcome'
import SchoolSelect from './screens/SchoolSelect'
import LearnPhaseTwo from './screens/LearnPhaseTwo'
import PhaseOne from './screens/PhaseOne'
import PhaseTwo from './screens/PhaseTwo'
import Results from './screens/Results'
import { armInitialLobbyMusic, primeLobbyMusic, stopLobbyMusic, stopPhaseTwoMusic } from './audio/audio'

const LOBBY_SCREENS = new Set(['welcome', 'schoolSelect', 'learnPhaseTwo'])

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [showSure, setShowSure] = useState(false)
  const [school, setSchool] = useState(null)
  const [phaseOneData, setPhaseOneData] = useState(null)
  const [phaseTwoData, setPhaseTwoData] = useState(null)

  // Lobby music follows the non-gameplay screens.
  useEffect(() => { armInitialLobbyMusic() }, [])
  useEffect(() => {
    window.scrollTo(0, 0)
    if (LOBBY_SCREENS.has(screen)) primeLobbyMusic()
    else stopLobbyMusic()
  }, [screen])

  function goWelcome() {
    stopPhaseTwoMusic()
    setPhaseOneData(null)
    setPhaseTwoData(null)
    setScreen('welcome')
  }

  function confirmHome() {
    if (window.confirm('Return to home? Your progress will be lost.')) goWelcome()
  }

  return (
    <>
      <Background />

      {screen === 'welcome' && <Welcome onPlay={() => { primeLobbyMusic(); setShowSure(true) }} />}

      {screen === 'schoolSelect' && (
        <SchoolSelect onSelect={s => { setSchool(s); setScreen('phaseOne') }} />
      )}

      {screen === 'phaseOne' && (
        <PhaseOne onComplete={data => { setPhaseOneData(data); setScreen('phaseOneResults') }} />
      )}

      {screen === 'phaseOneResults' && (
        <Results
          mode="phaseOne"
          data={phaseOneData}
          onReplay={() => setScreen('phaseOne')}
          onStartPhaseTwo={() => setScreen('learnPhaseTwo')}
        />
      )}

      {screen === 'learnPhaseTwo' && <LearnPhaseTwo onStart={() => setScreen('phaseTwo')} />}

      {screen === 'phaseTwo' && school && (
        <PhaseTwo
          school={school}
          onHome={confirmHome}
          onComplete={data => { setPhaseTwoData(data); setScreen('finalResults') }}
        />
      )}

      {screen === 'finalResults' && (
        <Results
          mode="final"
          data={{ ...phaseTwoData, score: phaseOneData?.score ?? 0, phaseTwoTotal: school?.hotspots.length ?? 0 }}
          onReturnHome={goWelcome}
          onReplayPhaseTwo={() => setScreen('learnPhaseTwo')}
        />
      )}

      <SurePopup
        show={showSure}
        onClose={() => setShowSure(false)}
        onContinue={() => { setShowSure(false); setScreen('schoolSelect') }}
      />
    </>
  )
}
