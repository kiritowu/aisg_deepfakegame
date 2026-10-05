const TIPS = [
  ['🔍', 'var(--cyan)', 'Scan.', 'Look for warped edges or melted details.'],
  ['📋', 'var(--gold)', 'Check.', 'Do faces, hands, and shadows look right?'],
  ['🌐', 'var(--purple-bright)', 'Compare.', 'Does each part match the rest of the photo?'],
  ['⚡', 'var(--pink)', 'Tap.', 'Select only the areas that look edited.'],
]

export default function LearnPhaseTwo({ onStart }) {
  return (
    <div className="screen active" id="screen-learn-phase-two">
      <div className="section-label">PHASE 2</div>
      <div className="title-main" style={{ fontSize: '1.8rem', marginBottom: 20 }}>IMAGE ANALYSIS TIPS</div>
      <div className="panel" style={{ maxWidth: 680 }}>
        {TIPS.map(([emoji, color, head, body]) => (
          <div className="tip-item" key={head} style={{ fontSize: '1.15rem', padding: '12px 16px' }}>
            <span className="tip-num">{emoji}</span>
            <div><strong style={{ color }}>{head}</strong> {body}</div>
          </div>
        ))}

        <div className="divider" />

        <div style={{ background: '#7b2ff711', border: '1px solid #7b2ff755', borderRadius: 10, padding: 14, marginBottom: 16, fontSize: '1.1rem', color: '#c0a8f0', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--purple-bright)' }}>🎯 Phase 2 Challenge:</strong><br />
          Find every hidden edit · 30 seconds · Hit <strong style={{ color: 'var(--green)' }}>+2s</strong> · Miss <strong style={{ color: 'var(--pink)' }}>−3s</strong>
        </div>

        <button className="btn-primary btn-cyan" onClick={onStart} style={{ width: '100%' }}>START PHASE TWO</button>
      </div>
    </div>
  )
}
