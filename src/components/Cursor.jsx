import { useEffect, useRef, useState } from 'react'

const CSS = `
  * { cursor: none !important; }

  @keyframes tapRipple {
    0%   { transform: translate(-50%, -50%) scale(0.4); opacity: 0.55; }
    100% { transform: translate(-50%, -50%) scale(2.6); opacity: 0; }
  }
`

export function CustomCursor() {
  const ringRef  = useRef(null)
  const [pressed, setPressed] = useState(false)
  const [ripples, setRipples] = useState([])

  useEffect(() => {
    function onMove(e) {
      if (!ringRef.current) return
      ringRef.current.style.left = e.clientX + 'px'
      ringRef.current.style.top  = e.clientY + 'px'
    }

    function onDown(e) {
      setPressed(true)
      const id = Date.now() + Math.random()
      setRipples(r => [...r, { id, x: e.clientX, y: e.clientY }])
      setTimeout(() => setRipples(r => r.filter(r2 => r2.id !== id)), 600)
    }

    function onUp() { setPressed(false) }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup',   onUp)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup',   onUp)
    }
  }, [])

  return (
    <>
      <style>{CSS}</style>

      {/* Cursor ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          left: -100, top: -100,
          width: 20, height: 20,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          border: '1.5px solid rgba(255,255,255,0.28)',
          transform: `translate(-50%, -50%) scale(${pressed ? 0.75 : 1})`,
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'transform 110ms cubic-bezier(0.23,1,0.32,1)',
        }}
      />

      {/* Tap ripples */}
      {ripples.map(r => (
        <div
          key={r.id}
          style={{
            position: 'fixed',
            left: r.x, top: r.y,
            width: 20, height: 20,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.18)',
            pointerEvents: 'none',
            zIndex: 99998,
            animation: 'tapRipple 560ms cubic-bezier(0.23,1,0.32,1) forwards',
          }}
        />
      ))}
    </>
  )
}
