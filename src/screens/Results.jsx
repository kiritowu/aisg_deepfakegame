import { useEffect } from 'react'
import { PHASE_ONE_SCENARIOS } from '../data/scenarios'
import { playResultsWinSound, playResultsLoseSound } from '../audio/audio'

const P1_TOTAL = PHASE_ONE_SCENARIOS.length

function ringStyle(pct) {
  return { background: `conic-gradient(var(--cyan) ${pct}%, var(--purple) ${pct}% 100%, #1a2550 100%)` }
}

function Tips({ tips }) {
  return tips.map((tip, i) => (
    <div className="tip-item" key={i}>
      <span className="tip-num">{i + 1}</span>
      <div>{tip}</div>
    </div>
  ))
}

function Actions({ primary, onPrimary, primaryMuted, secondary, onSecondary }) {
  return (
    <div className="results-btn-row" style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
      <button className={`btn-primary btn-cyan${primaryMuted ? ' btn-muted' : ''}`} onClick={onPrimary}>{primary}</button>
      <button className="btn-primary btn-purple" onClick={onSecondary}>{secondary}</button>
    </div>
  )
}

export default function Results({ mode, data, onReplay, onStartPhaseTwo, onReturnHome, onReplayPhaseTwo }) {
  const isFinal = mode === 'final'

  useEffect(() => {
    let win
    if (isFinal) win = !data.timedOut && data.foundIds.length >= data.phaseTwoTotal
    else win = Math.round((data.score / P1_TOTAL) * 100) >= 50
    const id = setTimeout(() => (win ? playResultsWinSound() : playResultsLoseSound()), 400)
    return () => clearTimeout(id)
  }, [isFinal, data])

  if (!isFinal) {
    const { score, answers } = data
    const pct = Math.round((score / P1_TOTAL) * 100)
    let grade = 'KEEP PRACTISING', gradeColor = '#ff2d78'
    if (pct === 100) { grade = 'EXPERT DETECTIVE'; gradeColor = '#ffd700' }
    else if (pct >= 67) { grade = 'SKILLED ANALYST'; gradeColor = '#00f5ff' }
    else if (pct >= 34) { grade = 'LEARNING FAST'; gradeColor = '#a855f7' }

    const correct = answers.filter(a => a.correct).length
    const fakesCaught = answers.filter(a => a.correct && a.actual === 'fake').length
    const realVerified = answers.filter(a => a.correct && a.actual === 'real').length

    return (
      <div className="screen active" id="screen-results">
        <div className="section-label" style={{ marginTop: 48 }}>Phase One Complete</div>
        <div className="title-main glitch" style={{ fontSize: '2rem' }}>READY FOR PHASE TWO</div>

        <div className="score-ring" style={ringStyle(pct)}>
          <div className="score-ring-text">{score}/{P1_TOTAL}</div>
        </div>

        <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '1.1rem', textAlign: 'center', marginBottom: 6, color: gradeColor }}>{grade}</div>

        <div className="badge-row">
          <div className="badge"><div className="badge-val" style={{ color: 'var(--green)' }}>{correct}</div><div className="badge-label">Correct</div></div>
          <div className="badge"><div className="badge-val" style={{ color: 'var(--pink)' }}>{fakesCaught}</div><div className="badge-label">Fakes Caught</div></div>
          <div className="badge"><div className="badge-val" style={{ color: 'var(--cyan)' }}>{realVerified}</div><div className="badge-label">Real Verified</div></div>
        </div>

        <div className="panel takeaways-big" style={{ marginTop: 4, textAlign: 'left' }}>
          <div className="section-label">Key Takeaways</div>
          <Tips tips={[
            'Distinguish authentic media from manipulated media by checking facial movement, lighting, and background consistency.',
            'Identify common deepfake clues such as warped edges, blurred details, lip-sync mismatch, and unnatural textures.',
            'Apply the S.U.R.E. framework: Source, Understand, Research, Evaluate before believing or sharing content.',
          ]} />
        </div>

        <Actions primary="REPLAY PHASE ONE" onPrimary={onReplay} primaryMuted secondary="START PHASE TWO" onSecondary={onStartPhaseTwo} />
      </div>
    )
  }

  // Final results
  const { score, foundIds, timeRemaining, phaseTwoTotal } = data
  const total = P1_TOTAL + phaseTwoTotal
  const totalScore = score + foundIds.length
  const pct = Math.round((totalScore / total) * 100)

  let grade = 'KEEP PRACTISING', gradeColor = '#ff2d78'
  if (pct >= 88) { grade = 'EXPERT DETECTIVE'; gradeColor = '#ffd700' }
  else if (pct >= 63) { grade = 'SKILLED ANALYST'; gradeColor = '#00f5ff' }
  else if (pct >= 38) { grade = 'LEARNING FAST'; gradeColor = '#a855f7' }

  let badgeTitle = '"The Glitch"'
  let badgeDesc = 'Still learning to see through the noise. Keep practising!'
  if (totalScore === total) {
    badgeTitle = '"The Deepfake Architect"'
    badgeDesc = 'You cleared both phases without missing a signal.'
  } else if (totalScore >= total - 2) {
    badgeTitle = '"S.U.R.E. Specialist"'
    badgeDesc = 'Strong media literacy instincts across both video and image challenges.'
  } else if (totalScore >= total / 2) {
    badgeTitle = '"Skeptical Scout"'
    badgeDesc = 'You caught several red flags and built a solid comparison habit.'
  }

  return (
    <div className="screen active" id="screen-results">
      <div className="section-label">Mission Complete</div>
      <div className="title-main glitch" style={{ fontSize: '2rem' }}>FINAL RESULTS</div>

      <div className="score-ring" style={ringStyle(pct)}>
        <div className="score-ring-text">{totalScore}/{total}</div>
      </div>

      <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '1.1rem', textAlign: 'center', marginBottom: 6, color: gradeColor }}>{grade}</div>

      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '1.1rem', color: 'var(--gold)', marginBottom: 6 }}>Detective Badge: {badgeTitle}</div>
        <div style={{ fontSize: '0.98rem', color: '#c0d8f0', lineHeight: 1.6, maxWidth: 640, margin: '0 auto' }}>{badgeDesc}</div>
      </div>

      <div className="badge-row">
        <div className="badge"><div className="badge-val" style={{ color: 'var(--cyan)' }}>{score}/{P1_TOTAL}</div><div className="badge-label">Phase One</div></div>
        <div className="badge"><div className="badge-val" style={{ color: 'var(--green)' }}>{foundIds.length}/{phaseTwoTotal}</div><div className="badge-label">Phase Two</div></div>
        <div className="badge"><div className="badge-val" style={{ color: 'var(--gold)' }}>{timeRemaining}s</div><div className="badge-label">Time Left</div></div>
      </div>

      <div className="panel takeaways-big" style={{ marginTop: 4, textAlign: 'left' }}>
        <div className="section-label">Key Takeaways</div>
        <Tips tips={[
          'Look for glitches: warped edges, smeared hair, blurry teeth.',
          'Check that the face, voice and lighting all match.',
          "Urgent money requests and 'guaranteed returns' are red flags.",
          'Apply S.U.R.E. before sharing: Source, Understand, Research, Evaluate.',
        ]} />
      </div>

      <div className="panel results-next-mission-panel" style={{ marginTop: 6, textAlign: 'center' }}>
        <div className="section-label">Final Message</div>
        <div style={{ fontSize: '0.92rem', lineHeight: 1.6, color: '#c0d8f0' }}>
          Use these habits online before you trust or share what you see.
        </div>
      </div>

      <Actions primary="RETURN HOME" onPrimary={onReturnHome} secondary="REPLAY PHASE TWO" onSecondary={onReplayPhaseTwo} />
    </div>
  )
}
