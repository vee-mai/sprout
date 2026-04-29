// Design tokens and primitive components

export const C = {
  green: '#B9FF6F', greenDim: '#A6EF72', greenMid: '#99E860',
  ink: '#121212', black: '#000', ink2: '#2B2A27',
  cream: '#FFF9E6', creamSoft: '#FFFCF0',
  white: '#fff', gray800: '#2C2E3D', gray500: '#8F8F8F',
}

// Typography scale
// H1 28 · H2 22 · H3 18 · CTA 16 · Body 14 · BodySm 13 · Caption 12 · Label/Micro 11
export const T = {
  screenTitle: { fontFamily: 'Urbanist', fontWeight: 800, fontSize: 28, letterSpacing: -.5, color: '#FFF9E6' },  // H1
  sectionTitle: { fontFamily: 'Urbanist', fontWeight: 700, fontSize: 22, letterSpacing: -.3, color: '#FFF9E6' }, // H2
  cardTitle:   { fontFamily: 'Urbanist', fontWeight: 700, fontSize: 18, letterSpacing: -.2, color: '#FFF9E6' },  // H3
  cta:         { fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, letterSpacing: -.2 },                    // Primary CTA
  body:        { fontFamily: 'Urbanist', fontSize: 14, color: 'rgba(255,249,230,.8)' },                          // Body
  bodyMuted:   { fontFamily: 'Urbanist', fontSize: 14, color: 'rgba(255,249,230,.5)' },                          // Body muted
  bodySm:      { fontFamily: 'Urbanist', fontSize: 13, color: 'rgba(255,249,230,.7)' },                          // Body small
  caption:     { fontFamily: 'Urbanist', fontSize: 12, color: 'rgba(255,249,230,.5)' },                          // Caption
  label:       { fontFamily: 'Urbanist', fontWeight: 700, fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,249,230,.45)' }, // Tag/Badge
  micro:       { fontFamily: 'Urbanist', fontSize: 11, color: 'rgba(255,249,230,.4)' },                          // Micro
}

// Spacing scale (8-point grid)
export const SP = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32,
  screenH: 24,   // horizontal screen padding
  screenTop: 60, // status bar clearance
  navBottom: 100, // bottom nav clearance
}

// Surface / card styles
export const surface = (strength = 'base') => ({
  base:    { background: 'rgba(255,249,230,.05)', border: '1px solid rgba(255,249,230,.08)' },
  strong:  { background: 'rgba(255,249,230,.08)', border: '1px solid rgba(255,249,230,.1)' },
  accent:  { background: 'rgba(185,255,111,.08)', border: '1px solid rgba(185,255,111,.2)' },
}[strength])

export function Btn({ children, variant = 'primary', onClick, style = {}, size = 'lg' }) {
  const base = {
    border: 'none', cursor: 'pointer', userSelect: 'none',
    borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Urbanist, sans-serif', transition: 'transform .1s, background .15s',
  }
  const sizes = {
    lg: { height: 48, padding: '0 24px', fontSize: 16, fontWeight: 500 },
    md: { height: 40, padding: '0 20px', fontSize: 14, fontWeight: 500 },
    sm: { height: 30, padding: '0 14px', fontSize: 12, fontWeight: 500 },
  }
  const variants = {
    primary:      { background: C.green, color: C.ink, boxShadow: '0 1px 2px rgba(0,0,0,.05)' },
    primaryInter: { background: C.green, color: C.ink, fontFamily: 'Inter, sans-serif', fontWeight: 700, boxShadow: '0 1px 2px rgba(0,0,0,.05)' },
    dark:         { background: C.black, color: C.white },
    darkGreenText:{ background: C.ink, color: C.green },
    ghost:        { background: 'transparent', color: C.cream },
    ghostDark:    { background: 'transparent', color: C.ink },
  }
  return (
    <button
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onClick={onClick}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(.97)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {children}
    </button>
  )
}

export function Chip({ children, selected = false, onClick, bordered = true }) {
  return (
    <div onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '6px 12px', borderRadius: 8,
      background: selected ? C.green : C.greenDim,
      border: bordered ? '1px solid #000' : 'none',
      fontFamily: 'Urbanist', fontWeight: 500, fontSize: 12,
      color: C.ink, cursor: 'pointer', userSelect: 'none',
    }}>
      {children}
    </div>
  )
}

export function Input({ icon, placeholder, value, onChange, onDark = false, type = 'text' }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: 12,
      height: 52, padding: '0 24px', borderRadius: 12,
      background: onDark ? 'rgba(255,249,230,.05)' : C.cream,
      border: onDark ? '1px solid rgba(255,249,230,.1)' : '1px solid rgba(0,0,0,.04)',
      boxShadow: '0 1px 2px rgba(0,0,0,.05)',
    }}>
      {icon && <span style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: onDark ? C.cream : C.ink }}>{icon}</span>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontFamily: 'Urbanist', fontWeight: 500, fontSize: 14,
          color: onDark ? C.cream : C.ink, letterSpacing: '-.022em',
        }}
      />
    </label>
  )
}

export function Card({ children, variant = 'translucent', style = {} }) {
  const variants = {
    translucent: { background: 'rgba(255,249,230,.17)', color: C.cream },
    cream:       { background: C.creamSoft, color: C.ink },
    dark:        { background: C.ink2, color: C.cream },
  }
  return (
    <div style={{ borderRadius: 12, padding: 20, ...variants[variant], ...style }}>
      {children}
    </div>
  )
}

// Line-style icons (Phosphor-ish)
export const I = {
  mail: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 7l10 6 10-6"/></svg>,
  lock: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>,
  search: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></svg>,
  sliders: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2" fill="currentColor"/><circle cx="10" cy="12" r="2" fill="currentColor"/><circle cx="18" cy="18" r="2" fill="currentColor"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5 11-11"/></svg>,
  plane: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
  back: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>,
  star: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7 7 .8-5.3 4.8 1.6 7.4L12 18l-6.3 4 1.6-7.4L2 9.8 9 9z"/></svg>,
  home: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? '#B9FF6F' : 'none'} stroke={a ? '#B9FF6F' : '#FFF9E6'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8v10a2 2 0 01-2 2h-4v-6h-6v6H5a2 2 0 01-2-2z"/></svg>,
  chat: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? '#B9FF6F' : 'none'} stroke={a ? '#B9FF6F' : '#FFF9E6'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16v11H7l-3 3z"/></svg>,
  cal:  (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#B9FF6F' : '#FFF9E6'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>,
  user: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? '#B9FF6F' : 'none'} stroke={a ? '#B9FF6F' : '#FFF9E6'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>,
  leaf: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? '#B9FF6F' : 'none'} stroke={a ? '#B9FF6F' : '#FFF9E6'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.34c-.5.78-1.64.88-2.3.3l-.2-.2A11.25 11.25 0 0117.5 2C18.8 2 20 3.2 20 4.5S18.8 7 17.5 7H17v1z"/><path d="M3 21l2.5-5"/></svg>,
  x: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>,
  plus: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
}

export const ASSET_BASE = '/assets/'
export const A = (path) => ASSET_BASE + path
