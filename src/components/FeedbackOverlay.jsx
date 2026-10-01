export default function FeedbackOverlay({ feedback, scenario, isLast, onNext }) {
  if (!feedback) return null
  const { correct, timedOut } = feedback

  const emoji = timedOut ? 'TIME' : correct ? 'OK' : 'CLUE'
  const title = timedOut
    ? `TIME'S UP! IT WAS ${scenario.label}`
    : correct ? 'CORRECT!' : `IT WAS ${scenario.label}`

  return (
    <div className="feedback-overlay show" id="feedback-overlay">
      <div className={`feedback-card ${correct ? 'correct' : 'wrong'}`}>
        <div className="feedback-emoji">{emoji}</div>
        <div className="feedback-title">{title}</div>
        <div className="feedback-explanation">{scenario.explanation}</div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ background: '#ffffff08', borderRadius: 8, padding: '10px 12px', fontSize: '0.82rem', color: '#a0c0e0', textAlign: 'left' }}>
            <strong style={{ color: 'var(--gold)' }}>Tip:</strong> {scenario.tip}
          </div>
        </div>
        <button className="btn-primary btn-cyan" onClick={onNext} style={{ width: '100%' }}>
          {isLast ? 'SEE RESULTS ->' : 'NEXT ROUND ->'}
        </button>
      </div>
    </div>
  )
}
