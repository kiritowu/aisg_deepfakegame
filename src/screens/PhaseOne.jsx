import { useEffect, useRef, useState } from 'react'
import { PHASE_ONE_SCENARIOS, QUESTION_TIME_LIMIT } from '../data/scenarios'
import { playDangerTick } from '../audio/audio'
import FeedbackOverlay from '../components/FeedbackOverlay'

const TOTAL = PHASE_ONE_SCENARIOS.length

export default function PhaseOne({ onComplete }) {
  const [qIndex, setQIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT)
  const [feedback, setFeedback] = useState(null)
  const resolvedRef = useRef(false)
  const videoRef = useRef(null)

  const scenario = PHASE_ONE_SCENARIOS[qIndex]

  // New question: reset timer + resolution, autoplay the clip.
  useEffect(() => {
    resolvedRef.current = false
    setFeedback(null)
    setTimeLeft(QUESTION_TIME_LIMIT)
    if (videoRef.current) videoRef.current.play().catch(() => {})
  }, [qIndex])

  // Countdown tick.
  useEffect(() => {
    if (feedback || timeLeft <= 0) return
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [feedback, qIndex, timeLeft <= 0])

  // Danger tick sound in the last 3s; timeout when it hits 0.
  useEffect(() => {
    if (feedback) return
    if (timeLeft <= 0) { submitAnswer(null, true); return }
    if (timeLeft <= 3) playDangerTick(timeLeft)
  }, [timeLeft, feedback]) // eslint-disable-line react-hooks/exhaustive-deps

  function submitAnswer(answer, timedOut = false) {
    if (resolvedRef.current) return
    resolvedRef.current = true
    if (videoRef.current) videoRef.current.pause()
    const correct = !timedOut && (answer === 'real') === scenario.isReal
    if (correct) setScore(s => s + 1)
    setAnswers(a => [...a, {
      q: qIndex,
      correct,
      userAnswer: timedOut ? 'timeout' : answer,
      actual: scenario.isReal ? 'real' : 'fake',
    }])
    setFeedback({ correct, timedOut })
  }

  function next() {
    if (qIndex >= TOTAL - 1) onComplete({ score, answers })
    else setQIndex(i => i + 1)
  }

  return (
    <div className="screen active" id="screen-game">
      <div className="phase-one-shell">
        <div className="phase-one-top">
          <div className="phase-one-progress-row">
            <div className="phase-one-progress-left">
              <div className="phase-one-phase-tag">PHASE ONE</div>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${(qIndex / TOTAL) * 100}%` }} />
              </div>
            </div>
            <div className="phase-one-question-progress">{qIndex + 1}/{TOTAL}</div>
          </div>

          <div className="round-meta">
            <div className="phase-one-watch-row">
              <div className="phase-one-watch-label">WATCH &amp; DETECT</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="hud-score">SCORE: <span>{score}</span></div>
              <div className={`timer-pill${timeLeft <= 3 && timeLeft > 0 ? ' danger' : ''}`}>Time: {Math.max(timeLeft, 0)}s</div>
            </div>
          </div>
        </div>

        <div className="phase-one-video-card">
          <div className="video-frame">
            <div className="corner tl" />
            <div className="corner tr" />
            <div className="corner bl" />
            <div className="corner br" />
            <div className="video-inner">
              <video
                key={scenario.id}
                ref={videoRef}
                className="scenario-video"
                loop
                playsInline
                autoPlay
              >
                <source src={scenario.video} />
                Your browser does not support the video tag.
              </video>
              <div style={{ fontSize: '0.8rem', color: '#607090', marginTop: 10 }}>
                [ Video Clip {String(qIndex + 1).padStart(2, '0')}/{String(TOTAL).padStart(2, '0')} ]
              </div>
            </div>
          </div>
        </div>

        <div className="panel phase-one-scenario-panel" style={{ textAlign: 'left' }}>
          <div className="scenario-frames">
            <div className="scenario-frame">
              <div className="section-label">Context</div>
              <p>{scenario.description}</p>
            </div>
            <div className="scenario-frame">
              <div className="section-label">Clues</div>
              <div>
                {scenario.clues.map((c, i) => (
                  <span className={`clue-tag ${scenario.clueTypes[i]}`} key={i}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="phase-one-action-row">
          <div className="verdict-btns">
            <button className="verdict-btn verdict-real" disabled={!!feedback} onClick={() => submitAnswer('real')}>✅ REAL</button>
            <button className="verdict-btn verdict-fake" disabled={!!feedback} onClick={() => submitAnswer('fake')}>🚨 FAKE</button>
          </div>
        </div>
      </div>

      <FeedbackOverlay
        feedback={feedback}
        scenario={scenario}
        isLast={qIndex >= TOTAL - 1}
        onNext={next}
      />
    </div>
  )
}
