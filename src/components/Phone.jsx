// iPhone 15 Pro frame — 393×852px, 36px radius, Dynamic Island

function StatusBar({ dark = true }) {
  const c = dark ? '#fff' : '#000'
  return (
    <>
      <div style={{
        position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
        width: 126, height: 37, borderRadius: 999,
        background: '#000', zIndex: 11, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 54, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '17px 33px 0',
        fontFamily: '-apple-system, "SF Pro Text", "SF Pro Display", BlinkMacSystemFont, system-ui, sans-serif',
        color: c, fontWeight: 600, fontSize: 17, letterSpacing: -0.3,
        fontVariantNumeric: 'tabular-nums',
      }}>
        <span style={{ minWidth: 54 }}>9:41</span>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <svg width="17" height="11" viewBox="0 0 17 11" aria-hidden>
            <rect x="0"  y="7"   width="3" height="4"   rx=".9" fill={c}/>
            <rect x="4"  y="4.5" width="3" height="6.5" rx=".9" fill={c}/>
            <rect x="8"  y="2"   width="3" height="9"   rx=".9" fill={c}/>
            <rect x="12" y="0"   width="3" height="11"  rx=".9" fill={c}/>
          </svg>
          <svg width="16" height="11" viewBox="0 0 16 11" aria-hidden>
            <path d="M8 2.2c2.3 0 4.4.9 6 2.4l-1.2 1.2C11.5 4.6 9.8 4 8 4S4.5 4.6 3.2 5.8L2 4.6C3.6 3.1 5.7 2.2 8 2.2z" fill={c}/>
            <path d="M8 5.4c1.5 0 2.9.6 3.9 1.6L10.7 8.2C10 7.5 9 7.1 8 7.1S6 7.5 5.3 8.2L4.1 7c1-1 2.4-1.6 3.9-1.6z" fill={c}/>
            <circle cx="8" cy="9.8" r="1.2" fill={c}/>
          </svg>
          <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden>
            <rect x=".5" y=".5" width="22" height="12" rx="3.5" stroke={c} strokeOpacity=".4" fill="none"/>
            <rect x="23.5" y="4.5" width="1.8" height="4" rx=".6" fill={c} opacity=".5"/>
            <rect x="2"   y="2"   width="19" height="9"  rx="2"   fill={c}/>
          </svg>
        </div>
      </div>
    </>
  )
}

export function PhoneScreen({ children, bg = '#121212' }) {
  return (
    <div style={{
      position: 'relative', width: 393, height: 852,
      borderRadius: 36, overflow: 'hidden', background: bg,
      fontFamily: 'Urbanist, -apple-system, system-ui',
      WebkitFontSmoothing: 'antialiased',
      boxShadow: '0 30px 70px rgba(0,0,0,.35), 0 0 0 10px #1a1a1a, 0 0 0 12px #333',
    }}>
      {children}
    </div>
  )
}

export function HomeIndicator({ dark = true }) {
  return (
    <div style={{
      position: 'absolute', bottom: 8, left: 0, right: 0, height: 6,
      display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 60,
    }}>
      <div style={{ width: 134, height: 5, borderRadius: 999, background: dark ? 'rgba(255,255,255,.7)' : 'rgba(0,0,0,.3)' }} />
    </div>
  )
}

export { StatusBar }
