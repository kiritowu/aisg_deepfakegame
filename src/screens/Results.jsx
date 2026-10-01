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
        <div className="section-label">Phase One Complete</div>
        <div className="title-main glitch" style={{ fontSize: '2rem' }}>READY FOR PHASE TWO</div>

        <div className="score-ring" style={ringStyle(pct)}>
          <div className="score-ring-text">{score}/{P1_TOTAL}</div>
        </div>

        <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '1.1rem', textAlign: 'center', marginBottom: 6, color: gradeColor }}>{grade}</div>

        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '1.1rem', color: 'var(--gold)', marginBottom: 6 }}>Phase Two Briefing</div>
          <div style={{ fontSize: '0.98rem', color: '#c0d8f0', lineHeight: 1.6, maxWidth: 640, margin: '0 auto' }}>
            Video check complete. Now switch to still-image mode and find all the hidden edits.
          </div>
        </div>

        <div className="badge-row">
          <div className="badge"><div className="badge-val" style={{ color: 'var(--green)' }}>{correct}</div><div className="badge-label">Correct</div></div>
          <div className="badge"><div className="badge-val" style={{ color: 'var(--pink)' }}>{fakesCaught}</div><div className="badge-label">Fakes Caught</div></div>
          <div className="badge"><div className="badge-val" style={{ color: 'var(--cyan)' }}>{realVerified}</div><div className="badge-label">Real Verified</div></div>
        </div>

        <div className="panel" style={{ marginTop: 4, textAlign: 'left' }}>
          <div className="section-label">Key Takeaways</div>
          <Tips tips={[
            'Distinguish authentic media from manipulated media by checking facial movement, lighting, and background consistency.',
            'Identify common deepfake clues such as warped edges, blurred details, lip-sync mismatch, and unnatural textures.',
            'Apply the S.U.R.E. framework: Source, Understand, Research, Evaluate before believing or sharing content.',
          ]} />
        </div>

        <div className="panel results-next-mission-panel" style={{ marginTop: 6, textAlign: 'center' }}>
          <div className="section-label">Next Mission</div>
          <div style={{ fontSize: '0.92rem', lineHeight: 1.6, color: '#c0d8f0' }}>
            Phase Two is faster: scan edges, faces, hands, textures, and lighting before the timer runs out.
          </div>
        </div>

        <Actions primary="REPLAY PHASE ONE" onPrimary={onReplay} primaryMuted secondary="START PHASE TWO" onSecondary={onStartPhaseTwo} />
      </div>
    )
  }

  // Final results
  const { score, foundIds, misses, timeRemaining, timedOut, phaseTwoTotal } = data
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

      <div className="panel" style={{ marginTop: 4, textAlign: 'left' }}>
        <div className="section-label">Key Takeaways</div>
        <Tips tips={[
          'Recognize that deepfakes often reveal themselves through visual inconsistencies such as shifted edges, missing detail, and texture mismatches.',
          'Compare facial movement, audio sync, lighting, and surrounding context before deciding whether media is real or fake.',
          'Use evidence from both the content itself and the source that shared it when evaluating suspicious media.',
          'Apply S.U.R.E. before sharing: Source, Understand, Research, Evaluate.',
        ]} />
      </div>

      <div className="panel results-next-mission-panel" style={{ marginTop: 6, textAlign: 'center' }}>
        <div className="section-label">Final Message</div>
        <div style={{ fontSize: '0.92rem', lineHeight: 1.6, color: '#c0d8f0' }}>
          {timedOut
            ? 'You have practised how to spot suspicious media by looking for manipulation clues and checking whether the content feels consistent. The next step is to apply those same habits online before trusting or sharing what you see.'
            : 'You completed the two-part DETECTIVE challenge and practised the core skills of media literacy: spotting deepfake clues, comparing context, and evaluating the source before sharing.'}
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--gold)', marginTop: 12 }}>
          Unsure if something's a scam? Check with the ScamShield Helpline <strong>1799</strong>.
        </div>
      </div>

      <Actions primary="RETURN HOME" onPrimary={onReturnHome} secondary="REPLAY PHASE TWO" onSecondary={onReplayPhaseTwo} />
    </div>
  )
}
