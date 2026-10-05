import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { PHASE_TWO_TIME_LIMIT } from '../data/schools'
import {
  ensurePhaseTwoAudio, startPhaseTwoMusic, stopPhaseTwoMusic, urgeMusicUp,
  playPhaseTwoStartSound, playPhaseTwoHitSound, playPhaseTwoMissSound,
  playPhaseTwoTickSound, playPhaseTwoWinSound, playPhaseTwoLoseSound,
} from '../audio/audio'

export default function PhaseTwo({ school, onComplete, onHome }) {
  const targets = school.hotspots
  const N = targets.length

  const [foundIds, setFoundIds] = useState([])
  const [misses, setMisses] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(PHASE_TWO_TIME_LIMIT)
  const [review, setReview] = useState(false)
  const [reviewTimedOut, setReviewTimedOut] = useState(false)
  const [selectedId, setSelectedId] = useState(targets[0].id)
  const [shake, setShake] = useState(false)
  const [status, setStatus] = useState('Study the image carefully and tap only the manipulated areas.')
  const [refNote, setRefNote] = useState(`Tap every changed region you can spot. There are exactly ${N} AI-generated edits hidden here.`)
  const [deltas, setDeltas] = useState([])
  const [overlay, setOverlay] = useState(null)

  const boardRef = useRef(null)
  const imgRef = useRef(null)
  const intervalRef = useRef(null)
  const timeRef = useRef(PHASE_TWO_TIME_LIMIT)
  const foundRef = useRef([])
  const missRef = useRef(0)
  const completeRef = useRef(false)
  const reviewRef = useRef(false)
  const deltaKey = useRef(0)

  // Match the hotspot overlay to the letterboxed (object-fit:contain) image rect.
  function measureOverlay() {
    const board = boardRef.current
    const img = imgRef.current
    if (!board) return
    const bw = board.clientWidth, bh = board.clientHeight
    const nw = img && img.naturalWidth > 0 ? img.naturalWidth : 1096
    const nh = img && img.naturalHeight > 0 ? img.naturalHeight : 778
    const boardRatio = bw / bh, imgRatio = nw / nh
    let rw, rh, ox, oy
    if (imgRatio > boardRatio) { rw = bw; rh = bw / imgRatio; ox = 0; oy = (bh - rh) / 2 }
    else { rh = bh; rw = bh * imgRatio; ox = (bw - rw) / 2; oy = 0 }
    setOverlay({ left: ox, top: oy, width: rw, height: rh })
  }

  useLayoutEffect(() => {
    measureOverlay()
    const board = boardRef.current
    if (board && typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => measureOverlay())
      ro.observe(board)
      return () => ro.disconnect()
    }
  }, [])

  // Start the round once; tear everything down on unmount.
  useEffect(() => {
    ensurePhaseTwoAudio()
    playPhaseTwoStartSound()
    startPhaseTwoMusic()

    intervalRef.current = setInterval(() => {
      timeRef.current -= 1
      setTimeRemaining(timeRef.current)
      if (timeRef.current > 0 && timeRef.current <= 8) {
        playPhaseTwoTickSound()
        if (timeRef.current === 8) urgeMusicUp()
      }
      if (timeRef.current <= 0) {
        timeRef.current = 0
        setTimeRemaining(0)
        playPhaseTwoLoseSound()
        enterReview(true)
      }
    }, 1000)

    return () => { clearInterval(intervalRef.current); stopPhaseTwoMusic() }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function enterReview(timedOut) {
    if (reviewRef.current) return
    reviewRef.current = true
    completeRef.current = true
    clearInterval(intervalRef.current)
    stopPhaseTwoMusic()
    setReview(true)
    setReviewTimedOut(timedOut)
    const firstUnfound = targets.find(t => !foundRef.current.includes(t.id)) || targets[0]
    setSelectedId(firstUnfound.id)
    setRefNote('Correct answer shown. Green markers were found during play; highlighted markers were revealed afterward.')
    setStatus(timedOut
      ? 'Time is up. Review the highlighted edits, then tap Done.'
      : `All ${N} manipulated regions found. Review the final board, then tap Done.`)
  }

  function showDelta(seconds, clientX, clientY) {
    const board = boardRef.current
    let left = 50, top = 45
    if (board && clientX !== undefined) {
      const rect = board.getBoundingClientRect()
      left = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 15), 85)
      top = Math.min(Math.max(((clientY - rect.top) / rect.height) * 100, 15), 75)
    }
    const key = deltaKey.current++
    setDeltas([{ key, seconds, left, top }])
    setTimeout(() => setDeltas(ds => ds.filter(d => d.key !== key)), 1200)
  }

  function registerHit(id, e) {
    foundRef.current = [...foundRef.current, id]
    setFoundIds(foundRef.current)
    playPhaseTwoHitSound()
    timeRef.current = Math.min(timeRef.current + 2, 99)
    setTimeRemaining(timeRef.current)
    showDelta(2, e.clientX, e.clientY)
    setStatus(`+2s! ${foundRef.current.length} of ${N} altered regions found.`)
    if (foundRef.current.length >= N) { playPhaseTwoWinSound(); enterReview(false) }
  }

  function miss() {
    if (completeRef.current) return
    missRef.current += 1
    setMisses(missRef.current)
    playPhaseTwoMissSound()
    timeRef.current = Math.max(timeRef.current - 3, 0)
    setTimeRemaining(timeRef.current)
    showDelta(-3)
    setStatus('-3s! No edit there. Scan the image again.')
    setShake(false)
    requestAnimationFrame(() => setShake(true))
    setTimeout(() => setShake(false), 400)
    if (timeRef.current <= 0) { playPhaseTwoLoseSound(); enterReview(true) }
  }

  // All clicks funnel through the board; hotspots are decorative (pointer-events:none).
  function handleBoardClick(e) {
    const img = imgRef.current
    if (!img) return
    const r = img.getBoundingClientRect()
    const natW = img.naturalWidth || r.width
    const natH = img.naturalHeight || r.height
    const scale = Math.min(r.width / natW, r.height / natH)
    const rendW = natW * scale, rendH = natH * scale
    const offsetX = (r.width - rendW) / 2, offsetY = (r.height - rendH) / 2
    const clickX = ((e.clientX - r.left - offsetX) / rendW) * 100
    const clickY = ((e.clientY - r.top - offsetY) / rendH) * 100

    if (clickX < 0 || clickX > 100 || clickY < 0 || clickY > 100) { miss(); return }

    const hits = targets.filter(t => {
      const hw = t.w / 2, hh = t.h / 2
      return clickX >= t.left - hw && clickX <= t.left + hw &&
             clickY >= t.top - hh && clickY <= t.top + hh
    })

    if (review) {
      if (hits.length) {
        const pick = hits.reduce((a, b) => (a.w * a.h) <= (b.w * b.h) ? a : b)
        setSelectedId(pick.id)
      }
      return
    }

    if (completeRef.current) return
    if (hits.length === 0) { miss(); return }
    const unfound = hits.filter(t => !foundRef.current.includes(t.id))
    const pick = (unfound.length ? unfound : hits).reduce((a, b) => (a.w * a.h) <= (b.w * b.h) ? a : b)
    if (foundRef.current.includes(pick.id)) return
    registerHit(pick.id, e)
  }

  function done() {
    onComplete({ foundIds: foundRef.current, misses: missRef.current, timeRemaining: timeRef.current, timedOut: reviewTimedOut })
  }

  const selected = targets.find(t => t.id === selectedId) || targets[0]
  const markerNumber = targets.findIndex(t => t.id === selected.id) + 1
  const wasFound = foundIds.includes(selected.id)

  return (
    <div className="screen active" id="screen-phase-two">
      <div className={`phase-two-shell${review ? ' review-mode' : ''}`}>
        <div className="phase-two-header">
          <div className="phase-two-topbar">
            <div className="section-label" style={{ marginBottom: 0 }}>Phase Two.</div>
            <button className="home-btn" onClick={onHome}>⌂ HOME</button>
          </div>
          <div className="title-main phase-two-title">SPOT THE DEEPFAKE</div>
          <div className="phase-two-briefing">
            <div className="phase-two-stats">
              <div className="phase-two-metric">
                <span className="phase-two-metric-label">Found</span>
                <span className="phase-two-metric-value">{foundIds.length} / {N}</span>
              </div>
              <div className={`phase-two-metric${timeRemaining <= 8 ? ' danger' : ''}`}>
                <span className="phase-two-metric-label">Time Left</span>
                <span className="phase-two-metric-value">{timeRemaining}s</span>
              </div>
              <div className="phase-two-metric">
                <span className="phase-two-metric-label">Misses</span>
                <span className="phase-two-metric-value">{misses}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="phase-two-status-line">{status}</div>

        <div className="phase-two-card">
          <div className="section-label">Challenge Image</div>
          <div className="phase-two-school">{school.name}</div>
          <div
            className={`phase-two-image-wrap${shake ? ' miss' : ''}`}
            ref={boardRef}
            onClick={handleBoardClick}
          >
            <img className="phase-two-image" ref={imgRef} src={school.image} alt={`${school.name} challenge image with hidden AI edits`} onLoad={measureOverlay} />
            <div className="phase-two-overlay" style={overlay ? { position: 'absolute', ...overlay, width: overlay.width, height: overlay.height } : undefined}>
              {targets.map((t, index) => {
                const isFound = foundIds.includes(t.id)
                const cls = [
                  'phase-two-hotspot',
                  isFound ? 'found' : '',
                  review && !isFound ? 'revealed' : '',
                  review ? 'review-visible' : '',
                  review && selectedId === t.id ? 'selected' : '',
                  (t.id === 't4' || t.id === 't5') ? 'label-top' : '',
                ].filter(Boolean).join(' ')
                return (
                  <button
                    type="button"
                    key={t.id}
                    className={cls}
                    style={{ left: `${t.left}%`, top: `${t.top}%`, width: `${t.w}%`, height: `${t.h}%`, transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}
                    data-id={t.id}
                    data-label={index + 1}
                    aria-label={`Deepfake hotspot ${index + 1}: ${t.title}`}
                  />
                )
              })}
            </div>
            {deltas.map(d => (
              <div key={d.key}>
                <div className={`board-flash ${d.seconds > 0 ? 'green' : 'red'}`} />
                <div
                  className={`board-delta ${d.seconds > 0 ? 'plus' : 'minus'}`}
                  style={{ left: `${d.left}%`, top: `${d.top}%`, transform: 'translate(-50%, -50%)' }}
                >
                  {d.seconds > 0 ? `+${d.seconds}s` : `${d.seconds}s`}
                </div>
              </div>
            ))}
          </div>
          <div className="phase-two-reference-note">{refNote}</div>
        </div>

        <div className="phase-two-review-panel" hidden={!review}>
          <div className="phase-two-review-copy">
            <div className="section-label" style={{ marginBottom: 0 }}>Answer Review</div>
            <div className="phase-two-review-hint">
              {reviewTimedOut
                ? 'Time is up. The correct answer is shown below. Tap any numbered marker to review why that region looks AI-generated.'
                : 'You finished the challenge. The correct answer remains on screen until you tap Done. Tap any numbered marker to review the clue.'}
            </div>
            <div className="phase-two-review-card">
              <div className="phase-two-review-kicker">Marker {markerNumber} - {wasFound ? 'Found during play' : 'Revealed at end'}</div>
              <div className="phase-two-review-title">{selected.title}</div>
              <div className="phase-two-review-reason">{selected.reason}</div>
            </div>
          </div>
          <button className="btn-primary btn-cyan phase-two-done-btn" type="button" onClick={done}>DONE</button>
        </div>
      </div>
    </div>
  )
}
