import { useEffect, useState } from 'react'

const TOTAL = 5

// Steps 1-4 share the same layout; step 0 is the intro.
const LETTER_STEPS = [
  { label: 'Step 1 of 4', title: 'S — SOURCE', color: 'var(--cyan)', img: '/sure-source.jpg', letter: 'S', letterColor: undefined,
    text: 'Where did the video come from? Is it from a reliable account or platform?', word: 'Source' },
  { label: 'Step 2 of 4', title: 'U — UNDERSTAND', color: 'var(--gold)', img: '/sure-understand.jpg', letter: 'U', letterColor: 'var(--gold)',
    text: 'Look carefully at the face, lighting, lip movement, and background. Do they look natural?', word: 'Understand' },
  { label: 'Step 3 of 4', title: 'R — RESEARCH', color: 'var(--purple-bright)', img: '/sure-research.jpg', letter: 'R', letterColor: 'var(--purple-bright)',
    text: 'Check whether trusted news outlets or official sources report the same thing.', word: 'Research' },
  { label: 'Step 4 of 4', title: 'E — EVALUATE', color: 'var(--pink)', img: '/sure-evaluate.jpg', letter: 'E', letterColor: 'var(--pink)',
    text: 'Think before believing or sharing. Could the video be manipulated?', word: 'Evaluate' },
]

export default function SurePopup({ show, onClose, onContinue }) {
  const [step, setStep] = useState(0)

  // Restart at the intro each time the popup opens.
  useEffect(() => { if (show) setStep(0) }, [show])

  function next() { setStep(s => Math.min(s + 1, TOTAL - 1)) }
  function prev() { if (step > 0) setStep(s => s - 1); else onClose() }

  const s = LETTER_STEPS[step - 1] // undefined on the intro

  return (
    <div className={`sure-popup${show ? ' show' : ''}`} id="sure-popup">
      <div className="sure-popup-card" style={{ animation: show ? 'fadeIn 0.35s ease' : undefined }} key={step}>
        <div className="sure-step-dots">
          {Array.from({ length: TOTAL }, (_, i) => (
            <div key={i} className={`sure-dot${i === step ? ' active' : i < step ? ' done' : ''}`} />
          ))}
        </div>

        {step === 0 ? (
          <>
            <div className="section-label" style={{ textAlign: 'center' }}>Before You Play</div>
            <div className="sure-popup-title">S.U.R.E FRAMEWORK</div>
            <div className="sure-img-wrap"><img src="/sure-overview.jpg" alt="S.U.R.E Framework overview" /></div>
            <div className="sure-popup-subtext">
              Welcome to <strong style={{ color: 'var(--cyan)' }}>Deepfake Detective</strong>, a media literacy game where you learn to spot{' '}
              <strong>REAL vs FAKE media</strong>. Before starting the quiz, learn the{' '}
              <strong style={{ color: 'var(--gold)' }}>S.U.R.E.</strong> framework across the next four steps.
            </div>
            <div className="sure-popup-actions">
              <button className="btn-primary btn-purple" onClick={onClose} style={{ minWidth: 140 }}>BACK</button>
              <button className="btn-primary btn-cyan" onClick={next} style={{ minWidth: 140 }}>NEXT →</button>
            </div>
          </>
        ) : (
          <>
            <div className="section-label" style={{ textAlign: 'center' }}>{s.label}</div>
            <div className="sure-popup-title" style={{ color: s.color }}>{s.title}</div>
            <div className="sure-img-wrap"><img src={s.img} alt={s.title} /></div>
            <div className="sure-item">
              <div className="sure-letter" style={s.letterColor ? { color: s.letterColor } : undefined}>{s.letter}</div>
              <div className="sure-text"><strong>{s.word}</strong> — {s.text}</div>
            </div>
            <div className="sure-popup-actions">
              <button className="btn-primary btn-purple" onClick={prev} style={{ minWidth: 140 }}>← BACK</button>
              {step < TOTAL - 1
                ? <button className="btn-primary btn-cyan" onClick={next} style={{ minWidth: 140 }}>NEXT →</button>
                : <button className="btn-primary btn-cyan" onClick={onContinue} style={{ minWidth: 140 }}>CONTINUE</button>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
