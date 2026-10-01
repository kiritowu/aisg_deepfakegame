export default function Welcome({ onPlay }) {
  return (
    <div className="screen active welcome-screen" id="screen-welcome">
      <div className="section-label welcome-label">WELCOME TO</div>
      <div className="welcome-title-wrap">
        <div className="title-main glitch welcome-title-cyan">DEEPFAKE</div>
        <div className="title-main welcome-title-gold">DETECTIVE</div>
      </div>
      <p className="welcome-hero-text">
        Videos can lie.<br />
        Can you spot what's real?
      </p>
      <div className="welcome-card">
        <p className="welcome-mini-text">3 quick verdicts. 1 photo challenge.</p>
        <button className="btn-primary btn-cyan" onClick={onPlay} style={{ width: '100%' }}>PLAY NOW</button>
      </div>
    </div>
  )
}
