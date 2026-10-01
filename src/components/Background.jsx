import { useMemo } from 'react'

// Fixed decorative layers shared by every screen: starfield, grid floor,
// floating hexagons. (The danger overlay was dropped in the latest design.)
export default function Background() {
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, () => {
        const size = Math.random() * 2.5 + 0.5
        return {
          width: `${size}px`,
          height: `${size}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          '--d': `${Math.random() * 4 + 2}s`,
          '--delay': `-${Math.random() * 5}s`,
        }
      }),
    []
  )

  return (
    <>
      <div className="stars" id="stars">
        {stars.map((style, i) => (
          <div key={i} className="star" style={style} />
        ))}
      </div>
      <div className="grid-floor" />
      <div className="hex-deco" style={{ top: '10%', left: '5%', '--d': '8s' }}>⬡</div>
      <div className="hex-deco" style={{ top: '60%', right: '4%', '--d': '11s', animationDelay: '-3s' }}>⬡</div>
    </>
  )
}
