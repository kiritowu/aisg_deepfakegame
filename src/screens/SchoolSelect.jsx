import { SCHOOLS } from '../data/schools'

export default function SchoolSelect({ onSelect }) {
  return (
    <div className="screen active" id="screen-school-select">
      <div className="section-label">PHASE 1</div>
      <div className="title-main" style={{ fontSize: '1.8rem', marginBottom: 8 }}>SELECT YOUR AGE GROUP</div>
      <p style={{ color: '#a0c4e8', fontSize: '1rem', textAlign: 'center', marginBottom: 28, maxWidth: 480 }}>
        Pick your age group — we'll show the deepfake scams that target it.
      </p>
      <div className="panel" style={{ maxWidth: 560, padding: '28px 32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {SCHOOLS.map(school => (
            <button className="school-select-btn" key={school.id} onClick={() => onSelect(school)}>
              <span className="school-select-icon">{school.icon}</span>
              <span className="school-select-label">{school.name}</span>
              <span className="school-select-arrow">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
