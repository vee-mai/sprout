import { useState, useEffect, useId } from 'react'
import { C, Btn, A } from '../atoms.jsx'
import { StatusBar, HomeIndicator } from '../Phone.jsx'
import { BottomNav } from './Screens.jsx'

// ── Stage metadata ────────────────────────────────────────────────────────────
export const STAGE_LABEL = ['Seed', 'Sprouting', 'Sapling', 'Leafy', 'Flowering', 'Full bloom']
export const STAGE_PCT   = [5, 20, 45, 65, 85, 100]

// ── Plant SVG (pot + species-specific foliage) ────────────────────────────────
export function Plant({ species = 'fiddle', stage = 2, size = 120, wind = 0, glow = false, animated = false, animDelay = 0 }) {
  const s   = Math.max(0, Math.min(5, stage))
  const G   = C.green
  const Gm  = '#99E860'
  const Gd  = '#6BAE3E'
  const stem = '#3E7A2A'
  const dirt = '#5A3B24'
  const glowId = useId()

  const sway = `rotate(${wind}deg)`
  const animDur = 2.4 + (animDelay % 4) * 0.35
  const foliageStyle = animated
    ? { transformOrigin: '60px 78px', animation: `plantSway ${animDur}s ease-in-out ${animDelay}s infinite` }
    : { transformOrigin: '60px 78px', transform: sway, transition: 'transform .6s ease' }

  const Pot = (
    <g>
      <path d="M 22 78 L 26 98 Q 30 104 60 104 Q 90 104 94 98 L 98 78 Z"
            fill="#C9825A" stroke="#8A4E2E" strokeWidth="1.5" />
      <ellipse cx="60" cy="78" rx="38" ry="6" fill="#A05E3A"/>
      <ellipse cx="60" cy="78" rx="36" ry="4" fill={dirt}/>
      <path d="M 22 78 L 98 78" stroke="rgba(255,255,255,.25)" strokeWidth="1"/>
    </g>
  )

  let foliage = null

  if (s === 0) {
    foliage = (
      <g style={foliageStyle}>
        <circle cx="60" cy="75" r="2.5" fill="#2C1A0B"/>
      </g>
    )
  } else if (s === 1) {
    foliage = (
      <g style={foliageStyle}>
        <path d="M60 78 Q60 68 60 60" stroke={stem} strokeWidth="2" fill="none" strokeLinecap="round"/>
        <ellipse cx="54" cy="64" rx="5" ry="3" fill={G}   transform="rotate(-25 54 64)"/>
        <ellipse cx="66" cy="64" rx="5" ry="3" fill={Gm}  transform="rotate(25 66 64)"/>
      </g>
    )
  } else if (species === 'fiddle') {
    const leaves = s === 2 ? 3 : s === 3 ? 5 : s === 4 ? 7 : 9
    const topY   = s === 2 ? 38 : s === 3 ? 24 : s === 4 ? 14 : 8
    foliage = (
      <g style={foliageStyle}>
        <path d={`M60 78 Q60 ${60} 60 ${topY}`} stroke={stem} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        {Array.from({ length: leaves }).map((_, i) => {
          const y    = 78 - (i + 1) * ((78 - topY) / (leaves + 1))
          const left = i % 2 === 0
          const sz   = 6 + (i / leaves) * 4
          return (
            <g key={i} transform={`translate(60 ${y}) rotate(${left ? -40 : 40})`}>
              <ellipse cx={left ? -sz : sz} cy="0" rx={sz} ry={sz * 0.6} fill={i % 2 === 0 ? G : Gm}/>
            </g>
          )
        })}
        {s >= 4 && <circle cx="60" cy={topY - 2} r="3" fill={G}/>}
      </g>
    )
  } else if (species === 'monstera') {
    const leaves = s === 2 ? 2 : s === 3 ? 3 : s === 4 ? 4 : 5
    foliage = (
      <g style={foliageStyle}>
        <path d="M60 78 Q58 56 54 42" stroke={stem} strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M60 78 Q64 58 72 48" stroke={stem} strokeWidth="2" fill="none" strokeLinecap="round"/>
        {Array.from({ length: leaves }).map((_, i) => {
          const cx = 60 + (i - leaves / 2 + 0.5) * 14
          const cy = 40 + (i % 2 === 0 ? 0 : 6) - (s >= 4 ? 4 : 0)
          return (
            <g key={i} transform={`translate(${cx} ${cy})`}>
              <ellipse cx="0" cy="0" rx="14" ry="10" fill={i % 2 === 0 ? G : Gd}/>
              <path d="M -14 0 L -4 0 M 4 0 L 14 0 M -6 -10 L -2 -4 M 6 -10 L 2 -4" stroke="#2B2A27" strokeWidth="1" opacity=".2"/>
            </g>
          )
        })}
        {s >= 5 && <path d="M60 78 Q60 20 60 10" stroke={stem} strokeWidth="2" fill="none"/>}
      </g>
    )
  } else if (species === 'bonsai') {
    const canopyR = s === 2 ? 12 : s === 3 ? 18 : s === 4 ? 22 : 26
    foliage = (
      <g style={foliageStyle}>
        <path d="M60 78 Q55 60 48 48 Q62 44 72 38" stroke="#6B4423" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <circle cx="48" cy="48" r={canopyR * 0.6} fill={Gd}/>
        <circle cx="72" cy="38" r={canopyR * 0.7} fill={G}/>
        <circle cx="58" cy="34" r={canopyR * 0.5} fill={Gm}/>
        {s >= 4 && <>
          <circle cx="46" cy="46" r="1.6" fill="#FF6FA0"/>
          <circle cx="74" cy="36" r="1.6" fill="#FF6FA0"/>
          <circle cx="58" cy="32" r="1.6" fill="#FFE066"/>
        </>}
      </g>
    )
  } else if (species === 'succulent') {
    const rings = s === 2 ? 2 : s === 3 ? 3 : s === 4 ? 4 : 5
    foliage = (
      <g style={foliageStyle}>
        {Array.from({ length: rings }).map((_, r) => {
          const petals = 6 + r * 2
          const radius = 6 + r * 5
          return Array.from({ length: petals }).map((__, i) => {
            const ang = (i / petals) * Math.PI * 2
            const x   = 60 + Math.cos(ang) * radius
            const y   = 70 - r * 3 + Math.sin(ang) * radius * 0.5
            return (
              <ellipse key={`${r}-${i}`} cx={x} cy={y} rx="5" ry="8"
                       fill={r % 2 === 0 ? G : Gm}
                       transform={`rotate(${(ang * 180) / Math.PI + 90} ${x} ${y})`}/>
            )
          })
        })}
        {s >= 4 && <circle cx="60" cy={70 - rings * 3} r="3" fill="#FFE066"/>}
      </g>
    )
  } else if (species === 'sunflower') {
    const petalCount = s === 2 ? 8 : s === 3 ? 10 : s === 4 ? 12 : 14
    const petalLen   = s === 2 ? 8 : s === 3 ? 11 : s === 4 ? 14 : 16
    const stemH      = s === 2 ? 52 : s === 3 ? 42 : s === 4 ? 32 : 24
    foliage = (
      <g style={foliageStyle}>
        <path d={`M60 78 Q60 ${65} 60 ${stemH}`} stroke={stem} strokeWidth="3" fill="none" strokeLinecap="round"/>
        {s >= 2 && Array.from({ length: petalCount }).map((_, i) => {
          const ang = (i / petalCount) * Math.PI * 2
          const cx  = 60 + Math.cos(ang) * petalLen
          const cy  = stemH + Math.sin(ang) * petalLen
          return (
            <ellipse key={i} cx={cx} cy={cy} rx="5" ry="8"
                     fill={i % 3 === 0 ? '#FFD060' : '#FFE580'}
                     transform={`rotate(${(ang * 180) / Math.PI} ${cx} ${cy})`}/>
          )
        })}
        <circle cx="60" cy={stemH} r={s === 2 ? 6 : s === 3 ? 8 : 10} fill="#8B5E3C"/>
        <circle cx="60" cy={stemH} r={s === 2 ? 4 : s === 3 ? 5 : 7}  fill="#5A3B24"/>
      </g>
    )
  } else if (species === 'pothos') {
    const leafCount = s === 2 ? 4 : s === 3 ? 6 : s === 4 ? 8 : 10
    foliage = (
      <g style={foliageStyle}>
        <path d="M60 78 Q60 68 60 60" stroke={stem} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        {Array.from({ length: leafCount }).map((_, i) => {
          const side = i % 2 === 0 ? -1 : 1
          const y    = 72 - i * 7
          const x    = 60 + side * (10 + (i % 3) * 5)
          const col  = i % 2 === 0 ? G : Gm
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <path d="M 0 -7 C -6 -9 -7 -1 0 4 C 7 -1 6 -9 0 -7 Z" fill={col}/>
              <path d="M 0 -6 L 0 3" stroke={stem} strokeWidth="0.7" fill="none" opacity=".5"/>
            </g>
          )
        })}
      </g>
    )
  } else {
    // fern
    const fronds = s === 2 ? 5 : s === 3 ? 7 : s === 4 ? 10 : 14
    foliage = (
      <g style={foliageStyle}>
        {Array.from({ length: fronds }).map((_, i) => {
          const ang = -70 + (i / (fronds - 1)) * 140
          const len = 30 + (i % 3) * 6 + (s - 2) * 4
          return (
            <g key={i} transform={`translate(60 76) rotate(${ang})`}>
              <path d={`M 0 0 Q ${len * 0.4} -${len * 0.2} ${len} -${len * 0.15}`} stroke={i % 2 === 0 ? G : Gm} strokeWidth="3" fill="none" strokeLinecap="round"/>
              {Array.from({ length: 5 }).map((__, j) => (
                <ellipse key={j} cx={len * 0.2 + j * len * 0.15} cy={-j * 2 - 4} rx="3" ry="5"
                         fill={i % 2 === 0 ? G : Gd}/>
              ))}
            </g>
          )
        })}
      </g>
    )
  }

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ overflow: 'visible' }}>
      {glow && (
        <defs>
          <radialGradient id={`glow-${glowId}`}>
            <stop offset="0%" stopColor={G} stopOpacity=".5"/>
            <stop offset="100%" stopColor={G} stopOpacity="0"/>
          </radialGradient>
        </defs>
      )}
      {glow && <circle cx="60" cy="60" r="55" fill={`url(#glow-${glowId})`}/>}
      {foliage}
      {Pot}
    </svg>
  )
}

// ── Garden state hook ─────────────────────────────────────────────────────────
const DEFAULT_PLANTS = [
  { id: 1, mentor: 'Kimberly Revilla', species: 'fiddle',   stage: 5, sessions: 8, startedAt: 'Feb 2026', nextSession: 'Thu 2:30 PM', dormantDays: 0  },
  { id: 2, mentor: 'Justin Levesque',  species: 'monstera', stage: 2, sessions: 3, startedAt: 'Mar 2026', nextSession: 'Next week',    dormantDays: 20 },
  { id: 3, mentor: 'Alex Chen',        species: 'bonsai',   stage: 1, sessions: 1, startedAt: 'Apr 2026', nextSession: 'Scheduling',   dormantDays: 0  },
]

export function addPlantToGarden(mentorName, species) {
  try {
    const existing = JSON.parse(localStorage.getItem('sprout.garden') || 'null') || DEFAULT_PLANTS
    if (existing.some(p => p.mentor === mentorName)) return // already has a plant for this mentor
    const month = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    const newPlant = {
      id: Date.now(),
      mentor: mentorName,
      species,
      stage: 1,
      sessions: 0,
      startedAt: month,
      nextSession: 'Scheduled',
      dormantDays: 0,
    }
    localStorage.setItem('sprout.garden', JSON.stringify([...existing, newPlant]))
  } catch {}
}

function useGarden() {
  const [plants, setPlants] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('sprout.garden') || 'null') || DEFAULT_PLANTS
      const seen = new Set()
      const deduped = raw.filter(p => { if (seen.has(p.mentor)) return false; seen.add(p.mentor); return true })
      if (deduped.length !== raw.length) localStorage.setItem('sprout.garden', JSON.stringify(deduped))
      return deduped
    } catch { return DEFAULT_PLANTS }
  })
  useEffect(() => {
    try { localStorage.setItem('sprout.garden', JSON.stringify(plants)) } catch {}
  }, [plants])
  return [plants, setPlants]
}

const GARDEN_CSS = `
  @keyframes taskCheck   { 0%{transform:scale(.8);opacity:0} 60%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
  @keyframes leafSway    { 0%,100%{transform:rotate(-6deg)} 50%{transform:rotate(6deg)} }
  @keyframes sunSpin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes sunPulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.7;transform:scale(.9)} }
  @keyframes pencilWig   { 0%,100%{transform:rotate(0deg)} 20%{transform:rotate(-12deg)} 40%{transform:rotate(10deg)} 60%{transform:rotate(-6deg)} 80%{transform:rotate(4deg)} }
  @keyframes twinkle     { 0%,100%{opacity:.06} 50%{opacity:.55} }
  @keyframes moonGlow    { 0%,100%{box-shadow:0 0 8px 2px rgba(255,249,230,.18)} 50%{box-shadow:0 0 18px 5px rgba(255,249,230,.35)} }
  @keyframes fireflyDrift {
    0%  { transform:translate(0px, 0px); opacity:0; }
    15% { opacity:.9; }
    50% { transform:translate(var(--fx), var(--fy)); opacity:.6; }
    85% { opacity:.3; }
    100%{ transform:translate(var(--fx2),var(--fy2)); opacity:0; }
  }
  @keyframes groundPulse { 0%,100%{opacity:.55} 50%{opacity:.9} }
  @keyframes dewDrop     { 0%{transform:translateY(-8px);opacity:0} 60%{opacity:.7} 100%{transform:translateY(30px);opacity:0} }
  @keyframes plantSway   { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }
  @keyframes floatUp     { 0%{transform:translate(0,0);opacity:0} 8%{opacity:.65} 92%{opacity:.2} 100%{transform:translate(var(--dx),-68px);opacity:0} }
  @keyframes driftFog    { 0%,100%{transform:translateX(0);opacity:.7} 50%{transform:translateX(16px);opacity:1} }
  .task-done-icon { animation: taskCheck 220ms cubic-bezier(0.23,1,0.32,1) both; }
  .icon-leaf      { transform-origin:50% 90%; animation: leafSway 2.8s ease-in-out infinite; }
  .icon-sun-rays  { animation: sunSpin 8s linear infinite; transform-origin:50% 50%; }
  .icon-sun-core  { animation: sunPulse 2s ease-in-out infinite; transform-origin:50% 50%; }
  .icon-pencil    { transform-origin:80% 80%; animation: pencilWig 2.4s ease-in-out infinite; }
`

const FIREFLIES = [
  { top: '28%', left: '18%', delay: 0,    dur: 4.2, fx: '28px', fy: '-18px', fx2: '48px', fy2: '8px'  },
  { top: '45%', left: '42%', delay: 1.1,  dur: 3.8, fx: '-20px',fy: '-24px', fx2: '-10px',fy2: '10px' },
  { top: '22%', left: '62%', delay: 0.6,  dur: 5.1, fx: '16px', fy: '20px',  fx2: '30px', fy2: '-5px' },
  { top: '38%', left: '78%', delay: 2.0,  dur: 3.5, fx: '-25px',fy: '-12px', fx2: '-40px',fy2: '6px'  },
  { top: '55%', left: '30%', delay: 1.7,  dur: 4.6, fx: '22px', fy: '-28px', fx2: '10px', fy2: '-8px' },
]

const SPORES = Array.from({ length: 10 }, (_, i) => ({
  left:   `${10 + (i * 23 + i * 7) % 80}%`,
  bottom: `${30 + (i % 4) * 7}%`,
  size:   i % 3 === 0 ? 2 : 1.5,
  delay:  (i * 0.55) % 5.5,
  dur:    4 + (i % 3) * 1.1,
  dx:     `${-12 + (i % 5) * 6}px`,
}))

const SPARKLE_STARS = [
  { top: '10%', left: '20%', size: 7, delay: 0   },
  { top: '18%', left: '54%', size: 5, delay: 1.4 },
  { top: '8%',  left: '62%', size: 8, delay: 0.7 },
  { top: '27%', left: '36%', size: 5, delay: 2.2 },
  { top: '34%', left: '78%', size: 6, delay: 1.0 },
]

const TaskIcon1 = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="icon-leaf">
    <path d="M12 22V13" stroke={C.green} strokeWidth="1.7" strokeLinecap="round"/>
    <path d="M12 17C12 17 7 15 6 9c3 .5 6 3 6 8z"
          fill="rgba(185,255,111,.18)" stroke={C.green} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 14C12 14 17 12 18 6c-3 .5-6 3-6 8z"
          fill="rgba(185,255,111,.12)" stroke={C.green} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 22h14" stroke={C.green} strokeWidth="1.7" strokeLinecap="round" opacity=".4"/>
  </svg>
)

const TaskIcon2 = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <g className="icon-sun-rays">
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            stroke="#FBBC04" strokeWidth="1.7" strokeLinecap="round"/>
    </g>
    <circle cx="12" cy="12" r="4" fill="rgba(251,188,4,.15)" stroke="#FBBC04" strokeWidth="1.7" className="icon-sun-core"/>
  </svg>
)

const TaskIcon3 = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="icon-pencil">
    <path d="M12 20h9" stroke="rgba(255,249,230,.45)" strokeWidth="1.7" strokeLinecap="round"/>
    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
          fill="rgba(255,249,230,.06)" stroke="rgba(255,249,230,.45)" strokeWidth="1.7"
          strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const TASKS = [
  { id: 't1', icon: <TaskIcon1/>, title: 'Book next session with Kimberly', sub: 'Waters the fiddle · 1 from full bloom', reward: '+1 STAGE',    rewardGreen: true  },
  { id: 't2', icon: <TaskIcon2/>, title: 'Reconnect with Justin',           sub: 'Monstera dormant 20d · send a message', reward: 'REVIVE PLANT', rewardGreen: false },
  { id: 't3', icon: <TaskIcon3/>, title: 'Log takeaway from Apr 18',        sub: '2 min · feeds the portfolio rewrite',   reward: '+1 INSIGHT',   rewardGreen: true  },
]

const STARS = Array.from({ length: 24 }, (_, i) => ({
  top:     `${(i * 31 + 7) % 56}%`,
  left:    `${(i * 47 + 13) % 94}%`,
  size:    `${i % 4 === 0 ? 2 : 1.5}px`,
  opacity: 0.06 + (i % 5) * 0.07,
}))

// ── My Garden screen ──────────────────────────────────────────────────────────
export function MyGardenScreen({ onTab, tab = 'garden', onShare, onOpenPlant, highlightId }) {
  const [plants]  = useGarden()
  const [checked,    setChecked]    = useState({})
  const [plantsOpen, setPlantsOpen] = useState(true)

  const toggle        = (id) => setChecked(c => ({ ...c, [id]: !c[id] }))
  const checkedCount  = Object.values(checked).filter(Boolean).length
  const bloomed       = plants.filter(p => p.stage >= 5).length
  const totalSessions = plants.reduce((a, p) => a + p.sessions, 0)

  return (
    <div style={{ width: '100%', height: '100%', background: '#0d0d0d',
                  color: '#FFF9E6', position: 'relative', overflow: 'hidden' }}>
      <style>{GARDEN_CSS}</style>
      <StatusBar dark />

      <div style={{ position: 'relative', height: '100%', overflowY: 'auto',
                    paddingBottom: 100, boxSizing: 'border-box' }}>

        {/* ── Header ── */}
        <div style={{ padding: '76px 24px 0', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Urbanist', fontWeight: 800,
                          fontSize: 28, letterSpacing: -.5, color: '#FFF9E6' }}>
              My Garden
            </div>
          </div>
          <div style={{ textAlign: 'right', paddingBottom: 4 }}>
            <div style={{ fontFamily: 'Urbanist', fontSize: 11, color: 'rgba(255,249,230,.28)',
                          letterSpacing: '.06em', textTransform: 'uppercase' }}>Season ends</div>
            <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 14,
                          color: 'rgba(255,249,230,.55)', marginTop: 2 }}>in 47 days</div>
          </div>
        </div>

        {/* ── Garden Scene ── */}
        <div style={{
          margin: '16px 24px 0', borderRadius: 20, overflow: 'hidden',
          height: 224, position: 'relative',
          border: '1px solid rgba(185,255,111,.14)',
        }}>
          {/* Night sky */}
          <div style={{ position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, #030A05 0%, #071009 35%, #0D1C0A 65%, #152514 100%)' }}/>

          {/* Small twinkling stars */}
          {STARS.map((s, i) => (
            <div key={i} style={{
              position: 'absolute', borderRadius: '50%',
              width: s.size, height: s.size, background: '#FFF9E6',
              top: s.top, left: s.left,
              animation: `twinkle ${2 + (i % 5) * 0.6}s ease-in-out ${((i * 0.37) % 3).toFixed(2)}s infinite`,
            }} />
          ))}

          {/* 4-pointed sparkle stars */}
          {SPARKLE_STARS.map((s, i) => (
            <svg key={`spark-${i}`} style={{
              position: 'absolute', top: s.top, left: s.left,
              animation: `twinkle ${2.4 + i * 0.45}s ease-in-out ${s.delay}s infinite`,
            }} width={s.size} height={s.size} viewBox="0 0 10 10">
              <path d="M5 0 L5.7 4.3 L10 5 L5.7 5.7 L5 10 L4.3 5.7 L0 5 L4.3 4.3 Z" fill="#FFF9E6"/>
            </svg>
          ))}

          {/* Fireflies */}
          {FIREFLIES.map((f, i) => (
            <div key={`ff-${i}`} style={{
              position: 'absolute', top: f.top, left: f.left,
              width: 6, height: 6, borderRadius: '50%',
              background: C.green,
              boxShadow: '0 0 8px 3px rgba(185,255,111,.8), 0 0 16px 5px rgba(185,255,111,.35)',
              '--fx': f.fx, '--fy': f.fy, '--fx2': f.fx2, '--fy2': f.fy2,
              animationName: 'fireflyDrift',
              animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s`,
              animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite',
            }} />
          ))}

          {/* Moon — SVG mask crescent, no background bleed */}
          <svg width="58" height="58" viewBox="0 0 58 58"
               style={{ position: 'absolute', top: 4, right: 6, overflow: 'visible' }}>
            <defs>
              <mask id="moon-mask">
                <circle cx="32" cy="24" r="12" fill="white"/>
                <circle cx="38" cy="18" r="10" fill="black"/>
              </mask>
              <radialGradient id="moon-glow-g" cx="55%" cy="42%" r="50%">
                <stop offset="0%" stopColor="rgba(255,249,230,.16)"/>
                <stop offset="55%" stopColor="rgba(255,249,230,.05)"/>
                <stop offset="100%" stopColor="rgba(255,249,230,0)"/>
              </radialGradient>
            </defs>
            {/* Soft ambient glow */}
            <circle cx="32" cy="24" r="28" fill="url(#moon-glow-g)"
                    style={{ animation: 'moonGlow 4s ease-in-out infinite' }}/>
            {/* Crescent — mask cuts away shadow side cleanly */}
            <circle cx="32" cy="24" r="12" fill="rgba(255,249,230,.8)" mask="url(#moon-mask)"/>
          </svg>

          {/* Spore particles */}
          {SPORES.map((sp, i) => (
            <div key={`sp-${i}`} style={{
              position: 'absolute', bottom: sp.bottom, left: sp.left,
              width: `${sp.size}px`, height: `${sp.size}px`, borderRadius: '50%',
              background: 'rgba(255,249,230,.65)', '--dx': sp.dx,
              animation: `floatUp ${sp.dur}s ease-out ${sp.delay}s infinite`,
              pointerEvents: 'none',
            }}/>
          ))}

          {/* Ambient glow */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 140,
            background: 'radial-gradient(ellipse at 50% 100%, rgba(185,255,111,.18), transparent 60%)',
            pointerEvents: 'none', animation: 'groundPulse 3.5s ease-in-out infinite' }}/>

          {/* Layered ground */}
          <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}
               height="60" viewBox="0 0 360 60" preserveAspectRatio="none">
            <path d="M0 16 Q90 4 180 14 Q270 24 360 12 L360 60 L0 60 Z" fill="#0F2A08"/>
            <path d="M0 24 Q90 12 180 22 Q270 32 360 20 L360 60 L0 60 Z" fill="#163710"/>
            <path d="M0 32 Q90 20 180 30 Q270 40 360 28 L360 60 L0 60 Z" fill="#1D4614"/>
            <path d="M0 40 Q90 30 180 38 Q270 46 360 36 L360 60 L0 60 Z" fill="#24521A"/>
          </svg>

          {/* Grass blades */}
          <svg style={{ position: 'absolute', bottom: 55, left: 0, width: '100%' }}
               height="18" viewBox="0 0 360 18">
            {Array.from({ length: 30 }, (_, i) => {
              const x    = 4 + i * 12 + (i % 3) * 2
              const h    = 5 + (i % 5) * 2.5
              const lean = (i % 2 === 0 ? -1.5 : 1.5) + (i % 4) * 0.5
              return (
                <path key={i}
                  d={`M${x} 18 Q${x+lean} ${18-h*.55} ${x+lean*1.8} ${18-h}`}
                  stroke={i % 3 === 0 ? '#2A5C1A' : '#1E4A12'} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
              )
            })}
          </svg>

          {/* Ground mist */}
          <div style={{
            position: 'absolute', bottom: 50, left: -15, right: -15, height: 22,
            background: 'linear-gradient(to top, rgba(185,255,111,.05) 0%, transparent 100%)',
            filter: 'blur(7px)',
            animation: 'driftFog 7s ease-in-out infinite',
            pointerEvents: 'none',
          }}/>

          {/* Soil shimmer */}
          <div style={{ position: 'absolute', bottom: 56, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent 5%, rgba(185,255,111,.08) 30%, rgba(185,255,111,.14) 50%, rgba(185,255,111,.08) 70%, transparent 95%)',
            pointerEvents: 'none' }}/>

          {/* Plants row */}
          <div style={{ position: 'absolute', bottom: 22, left: 0, right: 0,
            display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
            padding: '0 10px' }}>
            {plants.map((p, i) => {
              const plantSize = Math.min(90, 58 + p.stage * 7)
              return (
                <div key={p.id} onClick={() => onOpenPlant?.(p)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
                           cursor: 'pointer', position: 'relative' }}>
                  <div style={{ position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)',
                    width: 44, height: 10, borderRadius: '50%',
                    background: 'radial-gradient(ellipse, rgba(185,255,111,.22), transparent 70%)',
                    filter: 'blur(3px)',
                    animation: `groundPulse ${3 + i * 0.5}s ease-in-out infinite` }}/>
                  <Plant species={p.species} stage={p.stage} size={plantSize}
                         animated animDelay={i * 0.7} glow={highlightId === p.id}/>
                </div>
              )
            })}
          </div>


          {/* Tap hint */}
          <div style={{ position: 'absolute', bottom: 9, left: '50%', transform: 'translateX(-50%)',
            fontFamily: 'Urbanist', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase',
            color: 'rgba(255,249,230,.22)', whiteSpace: 'nowrap' }}>
            tap a plant to inspect
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{ margin: '14px 24px 0', display: 'flex' }}>
          {[
            { n: plants.length - bloomed, label: 'Growing'  },
            { n: bloomed,                  label: 'Bloomed'  },
            { n: totalSessions,            label: 'Sessions' },
          ].map((s, i) => (
            <div key={s.label} style={{ flex: 1, textAlign: 'center',
              borderRight: i < 2 ? '1px solid rgba(255,249,230,.06)' : 'none' }}>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 20,
                            color: '#FFF9E6', letterSpacing: -.3, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontFamily: 'Urbanist', fontSize: 10, marginTop: 4,
                            color: 'rgba(255,249,230,.3)', letterSpacing: '.06em',
                            textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Plant list ── */}
        <div style={{ padding: '20px 24px 0' }}>
          <div onClick={() => setPlantsOpen(o => !o)}
               style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        marginBottom: plantsOpen ? 10 : 0, cursor: 'pointer' }}>
            <div style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 18,
                          letterSpacing: -.3, color: '#FFF9E6' }}>
              Plants
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="rgba(255,249,230,.35)" strokeWidth="2.2" strokeLinecap="round"
                 style={{ transition: 'transform 200ms ease-out',
                          transform: plantsOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          {plantsOpen && <div style={{ display: 'flex', flexDirection: 'column' }}>
            {plants.map((p, idx) => {
              const pct       = STAGE_PCT[p.stage]
              const isFull    = p.stage >= 5
              const isDormant = p.dormantDays > 0
              return (
                <div key={p.id} onClick={() => onOpenPlant?.(p)} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 0', cursor: 'pointer',
                  borderBottom: idx < plants.length - 1 ? '1px solid rgba(255,249,230,.06)' : 'none',
                }}>
                  {/* Mini plant thumbnail */}
                  <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    background: isFull ? 'rgba(185,255,111,.08)' : 'rgba(255,249,230,.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden' }}>
                    <Plant species={p.species} stage={p.stage} size={44}/>
                  </div>

                  {/* Name + stage + progress */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                      <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 14,
                        color: '#FFF9E6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.mentor}
                      </div>
                      <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 11,
                        flexShrink: 0, marginLeft: 8,
                        color: isFull ? C.green : isDormant ? '#FF7B7B' : 'rgba(255,249,230,.35)' }}>
                        {pct}%
                      </div>
                    </div>
                    <div style={{ fontFamily: 'Urbanist', fontSize: 11, marginTop: 1,
                      color: isFull ? C.green : isDormant ? '#FF7B7B' : 'rgba(255,249,230,.35)' }}>
                      {isFull ? 'Full bloom ✦' : isDormant ? `Dormant · ${p.dormantDays}d` : STAGE_LABEL[p.stage]}
                    </div>
                    <div style={{ marginTop: 5, height: 3, borderRadius: 999,
                      background: 'rgba(255,249,230,.08)', overflow: 'hidden' }}>
                      <div style={{ width: pct + '%', height: '100%', borderRadius: 999,
                        background: isFull ? C.green : isDormant ? 'rgba(255,123,123,.55)' : 'rgba(185,255,111,.65)',
                        transition: 'width 300ms cubic-bezier(0.23,1,0.32,1)' }}/>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>}
        </div>

        {/* ── Today care cards ── */}
        <div style={{ paddingTop: 20 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0 24px', marginBottom: 12 }}>
            <div style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 18,
                          color: '#FFF9E6', letterSpacing: -.3 }}>Agenda</div>
            <span style={{ fontFamily: 'Urbanist', fontSize: 12, color: 'rgba(255,249,230,.3)' }}>
              {checkedCount}/{TASKS.length} done
            </span>
          </div>

          {/* Horizontal scroll strip */}
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', scrollbarWidth: 'none',
                        padding: '0 24px 4px' }}>
            {TASKS.map((task, i) => {
              const done = !!checked[task.id]
              const accentColor = task.rewardGreen ? C.green : '#FF7B7B'
              return (
                <div key={task.id} onClick={() => toggle(task.id)} style={{
                  flexShrink: 0, width: 136, borderRadius: 16, cursor: 'pointer',
                  padding: '13px 12px 12px',
                  background: done ? 'rgba(185,255,111,.04)' : 'rgba(255,249,230,.03)',
                  border: `1px solid ${done ? 'rgba(185,255,111,.12)' : 'rgba(255,249,230,.07)'}`,
                  opacity: done ? 0.45 : 1,
                  transition: 'opacity 220ms, border-color 220ms',
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}>
                  {/* Icon */}
                  <div style={{
                    width: 30, height: 30, borderRadius: 9,
                    background: 'rgba(255,249,230,.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15,
                  }}>
                    {done ? '✓' : task.icon}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Urbanist', fontWeight: 600, fontSize: 12,
                                  color: 'rgba(255,249,230,.85)', lineHeight: 1.45,
                                  textDecoration: done ? 'line-through' : 'none' }}>
                      {task.title}
                    </div>
                    <div style={{ marginTop: 3, fontFamily: 'Urbanist', fontSize: 10,
                                  color: 'rgba(255,249,230,.32)', lineHeight: 1.4 }}>
                      {task.sub}
                    </div>
                  </div>

                  {/* Reward label — inline, no badge */}
                  <div style={{
                    fontFamily: 'Urbanist', fontWeight: 700, fontSize: 10,
                    letterSpacing: '.05em', color: `${accentColor}99`,
                    textTransform: 'uppercase',
                  }}>
                    {task.reward}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Share — ghost secondary CTA ── */}
        <div style={{ padding: '20px 24px 0' }}>
          <Btn variant="ghost" onClick={onShare} style={{ width: '100%', gap: 8, fontWeight: 700 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/>
            </svg>
            Share my garden
          </Btn>
        </div>

      </div>

      <BottomNav active={tab} onTab={onTab}/>
      <HomeIndicator dark />
    </div>
  )
}

// ── Plant detail sheet ────────────────────────────────────────────────────────
export function PlantDetailSheet({ plant, onClose }) {
  if (!plant) return null
  const pct = STAGE_PCT[plant.stage]
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 60,
      display: 'flex', alignItems: 'flex-end',
      animation: 'pdFade .2s ease both',
    }}>
      <style>{`
        @keyframes pdFade  { from {opacity:0} to {opacity:1} }
        @keyframes pdSlide { from {transform: translateY(100%)} to {transform: none} }
      `}</style>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: C.ink, borderRadius: '24px 24px 0 0',
        padding: '24px 20px 40px', animation: 'pdSlide 250ms cubic-bezier(0.32, 0.72, 0, 1) both',
        border: '1px solid rgba(185,255,111,.15)', borderBottom: 'none',
      }}>
        <div onClick={onClose} style={{ width: 40, height: 4, borderRadius: 999, background: 'rgba(255,249,230,.2)', margin: '0 auto 16px', cursor: 'pointer' }}/>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 100, height: 100, borderRadius: 16, background: 'radial-gradient(circle at 50% 40%, rgba(185,255,111,.15), transparent 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Plant species={plant.species} stage={plant.stage} size={100} glow/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Urbanist', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: C.green, opacity: .8 }}>
              {STAGE_LABEL[plant.stage]} · {plant.species}
            </div>
            <div style={{ marginTop: 2, fontFamily: 'Urbanist', fontWeight: 700, fontSize: 22, color: C.cream }}>
              {plant.mentor}
            </div>
            <div style={{ marginTop: 4, fontFamily: 'Urbanist', fontSize: 12, color: C.cream, opacity: .55 }}>
              Growing since {plant.startedAt}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Urbanist', fontSize: 11, color: C.cream, opacity: .6, marginBottom: 6 }}>
            <span>Growth to next stage</span>
            <span>{pct}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,249,230,.1)', overflow: 'hidden' }}>
            <div style={{ width: pct + '%', height: '100%', background: C.green, transition: 'width 300ms cubic-bezier(0.23,1,0.32,1)' }}/>
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ padding: '12px', borderRadius: 12, background: 'rgba(255,249,230,.05)' }}>
            <div style={{ fontFamily: 'Urbanist', fontSize: 11, color: C.cream, opacity: .55 }}>Sessions</div>
            <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 22, color: C.green }}>{plant.sessions}</div>
          </div>
          <div style={{ padding: '12px', borderRadius: 12, background: 'rgba(255,249,230,.05)' }}>
            <div style={{ fontFamily: 'Urbanist', fontSize: 11, color: C.cream, opacity: .55 }}>Next session</div>
            <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 14, color: C.cream, marginTop: 4 }}>{plant.nextSession}</div>
          </div>
        </div>

        <div style={{ marginTop: 16, padding: 12, borderRadius: 12, background: 'rgba(185,255,111,.07)', border: '1px solid rgba(185,255,111,.15)', fontFamily: 'Urbanist', fontSize: 12, color: C.cream, opacity: .85, lineHeight: 1.45 }}>
          <strong style={{ color: C.green }}>Next milestone:</strong> 2 more sessions until {plant.mentor.split(' ')[0]}'s plant reaches <em>{STAGE_LABEL[Math.min(5, plant.stage + 1)]}</em>.
        </div>

        <div onClick={onClose} style={{
          marginTop: 16, padding: '14px', borderRadius: 999, textAlign: 'center',
          background: C.green, color: C.ink, fontFamily: 'Urbanist', fontWeight: 700, fontSize: 14, cursor: 'pointer',
        }}>
          Got it
        </div>
      </div>
    </div>
  )
}

// ── Post-session growth celebration ───────────────────────────────────────────
export function PostSessionGrowth({ mentor, species = 'fiddle', fromStage = 3, toStage = 4, onDone }) {
  const [stage, setStage]       = useState(fromStage)
  const [showBurst, setShowBurst] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setStage(toStage),    700)
    const t2 = setTimeout(() => setShowBurst(true),   900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [toStage])

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 70,
      background: 'radial-gradient(ellipse at 50% 40%, rgba(185,255,111,.18), rgba(0,0,0,.88) 70%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 24, animation: 'pgFade 250ms ease-out both',
    }}>
      <style>{`
        @keyframes pgFade    { from {opacity:0} to {opacity:1} }
        @keyframes pgBurst   { 0% { transform: scale(0.5); opacity: 1 } 100% { transform: scale(2.6); opacity: 0 } }
        @keyframes pgSparkle {
          0%   { transform: translate(0,0) scale(0.3); opacity: 0 }
          20%  { opacity: 1; transform: scale(1) }
          100% { transform: translate(var(--dx), var(--dy)) scale(.4); opacity: 0 }
        }
        @keyframes pgRise { from { transform: translateY(20px); opacity: 0 } to { transform: none; opacity: 1 } }
        @keyframes pgBeat { 0%,100% { transform: scale(1) } 50% { transform: scale(1.05) } }
      `}</style>

      <div style={{ fontFamily: 'Urbanist', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: C.green, opacity: .8, animation: 'pgRise .28s .1s both' }}>
        Session complete
      </div>

      <div style={{ position: 'relative', width: 220, height: 220, marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {showBurst && <>
          <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: 999, border: `2px solid ${C.green}`, animation: 'pgBurst .9s ease-out forwards' }}/>
          <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: 999, border: `2px solid ${C.green}`, animation: 'pgBurst 1.1s .15s ease-out forwards' }}/>
        </>}

        {showBurst && Array.from({ length: 10 }).map((_, i) => {
          const ang  = (i / 10) * Math.PI * 2
          const dist = 90 + (i % 3) * 10
          return (
            <div key={i} style={{
              position: 'absolute', width: 6, height: 6, borderRadius: 999,
              background: i % 2 === 0 ? C.green : '#FFE066',
              '--dx': Math.cos(ang) * dist + 'px',
              '--dy': Math.sin(ang) * dist + 'px',
              animation: `pgSparkle 1s ${i * 0.05}s ease-out forwards`,
            }}/>
          )
        })}

        <div style={{ animation: 'pgBeat 1.6s 1s infinite ease' }}>
          <Plant species={species} stage={stage} size={180} glow/>
        </div>
      </div>

      <div style={{ marginTop: 28, fontFamily: 'Urbanist', fontWeight: 700, fontSize: 28, color: C.cream, textAlign: 'center', animation: 'pgRise .28s .6s both' }}>
        Your plant grew!
      </div>
      <div style={{ marginTop: 6, maxWidth: 280, textAlign: 'center', fontFamily: 'Urbanist', fontSize: 14, color: C.cream, opacity: .7, lineHeight: 1.4, animation: 'pgRise .28s .75s both' }}>
        {mentor ? <>Your mentorship with <strong style={{ color: C.green }}>{mentor.split(' ')[0]}</strong> is now <em>{STAGE_LABEL[toStage]}</em>.</> : null}
      </div>

      <div style={{ marginTop: 32, width: '100%', maxWidth: 280, animation: 'pgRise .28s .9s both' }}>
        <div onClick={onDone} style={{
          padding: '14px', borderRadius: 999, background: C.green, color: C.ink,
          fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, textAlign: 'center', cursor: 'pointer',
        }}>
          See my garden
        </div>
      </div>
    </div>
  )
}

// ── Post-session flow (rating → plant select → growth) ───────────────────────
const V1_SPECIES = [
  { id: 'sunflower', label: 'Sunflower', blurb: 'Bright & driven',     desc: 'Grows toward the light' },
  { id: 'pothos',    label: 'Pothos',    blurb: 'Adaptable',            desc: 'Thrives anywhere'       },
  { id: 'monstera',  label: 'Monstera',  blurb: 'Bold & expressive',    desc: 'Makes a statement'      },
]

const FLOW_CSS = `
  @keyframes flowFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes starPop {
    0%   { transform: scale(0.5); }
    65%  { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
  .flow-star { transition: transform 120ms cubic-bezier(0.23,1,0.32,1); cursor: pointer; }
  .flow-star:hover { transform: scale(1.15); }
  .flow-species {
    transition: border-color 140ms, box-shadow 140ms, transform 120ms cubic-bezier(0.23,1,0.32,1);
    cursor: pointer; user-select: none; -webkit-user-select: none;
  }
  .flow-species:active { transform: scale(0.96); }
  .flow-cta {
    transition: transform 160ms cubic-bezier(0.23,1,0.32,1), background 200ms, box-shadow 200ms;
  }
  .flow-cta:active { transform: scale(0.97); }
`

export function PostSessionFlow({ mentor, onDone }) {
  const [phase,       setPhase]       = useState('rate')
  const [rating,      setRating]      = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [species,     setSpecies]     = useState(null)

  const firstName = mentor?.split(' ')[0] || 'your mentor'

  if (phase === 'grow') {
    return (
      <PostSessionGrowth
        mentor={mentor}
        species={species}
        fromStage={0}
        toStage={1}
        onDone={onDone}
      />
    )
  }

  const displayed = hoveredStar || rating

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 70,
      background: '#0d0d0d', display: 'flex', flexDirection: 'column',
      animation: 'flowFadeUp .3s ease both',
    }}>
      <style>{FLOW_CSS}</style>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(400px 360px at 50% 30%, rgba(185,255,111,.07), transparent 70%)' }}/>

      {/* ── Rating phase ── */}
      {phase === 'rate' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', padding: '0 28px' }}>
          <div style={{ fontFamily: 'Urbanist', fontSize: 11, letterSpacing: '.16em',
                        textTransform: 'uppercase', color: C.green, opacity: .8,
                        animation: 'flowFadeUp .25s .05s both' }}>
            Session complete
          </div>
          <div style={{ marginTop: 12, fontFamily: 'Urbanist', fontWeight: 800, fontSize: 28,
                        letterSpacing: -.5, color: C.cream, textAlign: 'center',
                        animation: 'flowFadeUp .25s .12s both' }}>
            How was your session with {firstName}?
          </div>
          <div style={{ marginTop: 36, display: 'flex', gap: 10,
                        animation: 'flowFadeUp .25s .22s both' }}>
            {[1, 2, 3, 4, 5].map(n => (
              <div
                key={n}
                className="flow-star"
                onMouseEnter={() => setHoveredStar(n)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setRating(n)}
                style={{ fontSize: 38, filter: n <= displayed ? 'none' : 'grayscale(1) opacity(.25)' }}
              >
                ★
              </div>
            ))}
          </div>
          {rating > 0 && (
            <div style={{ marginTop: 10, fontFamily: 'Urbanist', fontSize: 14,
                          color: 'rgba(255,249,230,.45)',
                          animation: 'flowFadeUp .3s ease both' }}>
              {rating === 5 ? 'Incredible!' : rating >= 4 ? 'Great session' : rating >= 3 ? 'Pretty good' : 'Could be better'}
            </div>
          )}
          <div style={{ marginTop: 48, width: '100%', animation: 'flowFadeUp .25s .32s both' }}>
            <button
              className="flow-cta"
              onClick={() => { if (rating > 0) setPhase('plant') }}
              disabled={rating === 0}
              style={{
                width: '100%', height: 56, border: 'none',
                cursor: rating > 0 ? 'pointer' : 'default',
                borderRadius: 14,
                background: rating > 0 ? C.green : 'rgba(185,255,111,.22)',
                color: '#121212',
                fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, letterSpacing: -.2,
                boxShadow: rating > 0 ? '0 10px 28px rgba(185,255,111,.28)' : 'none',
              }}
            >
              {rating > 0 ? 'Next — plant your seed' : 'Tap a star to rate'}
            </button>
          </div>
        </div>
      )}

      {/* ── Plant selection phase ── */}
      {phase === 'plant' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '72px 24px 0' }}>
          <div style={{ fontFamily: 'Urbanist', fontSize: 11, letterSpacing: '.16em',
                        textTransform: 'uppercase', color: C.green, opacity: .8 }}>
            You've earned a seed
          </div>
          <div style={{ marginTop: 10, fontFamily: 'Urbanist', fontWeight: 800, fontSize: 28,
                        letterSpacing: -.5, color: C.cream, lineHeight: 1.15 }}>
            Pick a plant to grow with {firstName}
          </div>
          <div style={{ marginTop: 6, fontFamily: 'Urbanist', fontSize: 14,
                        color: 'rgba(255,249,230,.42)', lineHeight: 1.55 }}>
            It levels up with every session you complete together.
          </div>

          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            {V1_SPECIES.map(sp => {
              const active = species === sp.id
              return (
                <div
                  key={sp.id}
                  className="flow-species"
                  onClick={() => setSpecies(sp.id)}
                  style={{
                    flex: 1, padding: '16px 8px 14px',
                    borderRadius: 18,
                    background: active ? 'rgba(185,255,111,.08)' : 'rgba(255,249,230,.04)',
                    border: `2px solid ${active ? C.green : 'rgba(255,249,230,.08)'}`,
                    boxShadow: active ? '0 0 0 3px rgba(185,255,111,.1)' : 'none',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  }}
                >
                  <Plant species={sp.id} stage={1} size={72} glow={active} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 13,
                                  color: active ? C.cream : 'rgba(255,249,230,.75)' }}>
                      {sp.label}
                    </div>
                    <div style={{ fontFamily: 'Urbanist', fontSize: 11,
                                  color: active ? C.green : 'rgba(255,249,230,.32)', marginTop: 2 }}>
                      {sp.blurb}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ flex: 1 }}/>

          <div style={{ paddingBottom: 48, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              className="flow-cta"
              onClick={() => {
                if (!species) return
                addPlantToGarden(mentor, species)
                setPhase('grow')
              }}
              disabled={!species}
              style={{
                width: '100%', height: 56, border: 'none',
                cursor: species ? 'pointer' : 'default',
                borderRadius: 14,
                background: species ? C.green : 'rgba(185,255,111,.22)',
                color: '#121212',
                fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, letterSpacing: -.2,
                boxShadow: species ? '0 10px 28px rgba(185,255,111,.28)' : 'none',
              }}
            >
              {species ? 'Plant this seed' : 'Pick a plant first'}
            </button>
            <div onClick={onDone} style={{
              textAlign: 'center', fontFamily: 'Urbanist', fontSize: 14,
              color: 'rgba(255,249,230,.3)', cursor: 'pointer', padding: '6px 0',
            }}>
              Skip for now
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Share garden modal ────────────────────────────────────────────────────────
export function ShareGardenModal({ onClose }) {
  const [plants]     = useGarden()
  const sessions     = plants.reduce((a, p) => a + p.sessions, 0)
  const [copied,     setCopied]     = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [name,       setName]       = useState(() => {
    try { return localStorage.getItem('sprout.userName') || '' } catch { return '' }
  })

  const displayName = name.trim()
  const cardTitle   = displayName ? `${displayName}'s` : 'My'
  const slug        = displayName ? displayName.toLowerCase().replace(/\s+/g, '') : 'garden'
  const since       = plants[0]?.startedAt || 'Feb 2026'

  const handleNameChange = e => {
    setName(e.target.value)
    try { localStorage.setItem('sprout.userName', e.target.value) } catch {}
  }
  const handleCopy = () => {
    try { navigator.clipboard.writeText(`https://sprout.app/grow/${slug}`) } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 1600)
  }
  const handleDownload = () => {
    setDownloaded(true); setTimeout(() => setDownloaded(false), 1600)
  }

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 80,
      display: 'flex', alignItems: 'flex-end', animation: 'sgFade 200ms ease-out both',
    }}>
      <style>{`
        @keyframes sgFade  { from{opacity:0} to{opacity:1} }
        @keyframes sgSlide { from{transform:translateY(100%)} to{transform:none} }
      `}</style>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: C.ink, borderRadius: '24px 24px 0 0',
        padding: '16px 20px 40px', animation: 'sgSlide 250ms cubic-bezier(0.32, 0.72, 0, 1) both',
      }}>
        {/* Handle */}
        <div onClick={onClose} style={{ width: 40, height: 4, borderRadius: 999,
          background: 'rgba(255,249,230,.2)', margin: '0 auto 16px', cursor: 'pointer' }}/>

        {/* Header */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: 'Urbanist', fontSize: 11, letterSpacing: '.14em',
            textTransform: 'uppercase', color: C.green, opacity: .8 }}>Preview</div>
          <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 18, color: C.cream, marginTop: 2 }}>
            Share my garden
          </div>
        </div>

        {/* Name input — below title, above card */}
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,249,230,.05)', borderRadius: 11,
          border: '1px solid rgba(255,249,230,.09)', padding: '8px 14px',
          cursor: 'text', marginBottom: 12 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
               stroke="rgba(255,249,230,.35)" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
          </svg>
          <input value={name} onChange={handleNameChange} placeholder="Your name"
            style={{ width: 120, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'Urbanist', fontWeight: 500, fontSize: 13, color: C.cream }} />
        </label>

        {/* Preview card */}
        <div style={{
          borderRadius: 20, overflow: 'hidden',
          background: 'linear-gradient(145deg, #D5FC8E 0%, #B9FF6F 55%, #A4EE6A 100%)',
          color: '#121212', padding: '18px 18px 16px',
          boxShadow: '0 14px 44px rgba(0,0,0,.45)',
        }}>
          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#121212">
                <path d="M12 2 C 8 6 8 12 12 14 C 16 12 16 6 12 2 Z"/>
                <path d="M12 14 Q 10 18 6 18 Q 10 22 12 22 Q 14 22 18 18 Q 14 18 12 14 Z"/>
              </svg>
              <span style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 13, color: '#121212' }}>Sprout</span>
            </div>
            <div style={{ fontFamily: 'Urbanist', fontSize: 11, opacity: .45,
              letterSpacing: '.1em', textTransform: 'uppercase' }}>
              sprout.app/grow/{slug}
            </div>
          </div>

          {/* Title */}
          <div style={{ marginTop: 14, fontFamily: 'Urbanist', lineHeight: 1.1, letterSpacing: -.4 }}>
            <div style={{ fontWeight: 500, fontSize: 22, opacity: .6 }}>{cardTitle}</div>
            <div style={{ fontWeight: 800, fontSize: 22 }}>mentorship garden</div>
          </div>

          {/* Plants */}
          <div style={{
            marginTop: 12, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
            padding: '10px 8px 4px', background: 'rgba(18,18,18,.07)', borderRadius: 14,
          }}>
            {plants.map(p => (
              <div key={p.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Plant species={p.species} stage={p.stage} size={62}/>
                <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 11, marginTop: -4 }}>
                  {p.mentor.split(' ')[0]}
                </div>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-around', padding: '2px 8px' }}>
            {[{ n: plants.length, l: 'mentors' }, { n: sessions, l: 'sessions' }, { n: '3 mo', l: 'growing' }].map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 18 }}>{s.n}</div>
                <div style={{ fontFamily: 'Urbanist', fontSize: 11, opacity: .55, marginTop: 1 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(18,18,18,.1)',
            fontFamily: 'Urbanist', fontWeight: 500, fontSize: 11, opacity: .5, letterSpacing: '.02em' }}>
            Growing since {since}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button style={{ height: 46, border: 'none', borderRadius: 12, background: '#0077B5', color: '#fff',
            fontFamily: 'Urbanist', fontWeight: 600, fontSize: 13, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.78 1.78 0 0 1-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
            Post to LinkedIn
          </button>
          <button style={{ height: 46, border: 'none', borderRadius: 12, background: '#000', color: '#fff',
            fontFamily: 'Urbanist', fontWeight: 600, fontSize: 13, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Post to X
          </button>
        </div>
        <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button onClick={handleDownload} style={{ height: 46, borderRadius: 12,
            border: '1px solid rgba(255,249,230,.1)', background: 'rgba(255,249,230,.05)',
            color: C.cream, fontFamily: 'Urbanist', fontWeight: 600, fontSize: 13, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            {downloaded ? <>✓ Saved</> : <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Save image
            </>}
          </button>
          <button onClick={handleCopy} style={{ height: 46, borderRadius: 12,
            border: '1px solid rgba(255,249,230,.1)', background: 'rgba(255,249,230,.05)',
            color: C.cream, fontFamily: 'Urbanist', fontWeight: 600, fontSize: 13, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            {copied ? <>✓ Copied!</> : <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy link
            </>}
          </button>
        </div>
      </div>
    </div>
  )
}
