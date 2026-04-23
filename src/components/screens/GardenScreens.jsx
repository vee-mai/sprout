import { useState, useEffect, useId } from 'react'
import { C, Btn, A } from '../atoms.jsx'
import { StatusBar, HomeIndicator } from '../Phone.jsx'
import { BottomNav } from './Screens.jsx'

// ── Stage metadata ────────────────────────────────────────────────────────────
export const STAGE_LABEL = ['Seed', 'Sprouting', 'Sapling', 'Leafy', 'Flowering', 'Full bloom']
export const STAGE_PCT   = [5, 20, 45, 65, 85, 100]

// ── Plant SVG (pot + species-specific foliage) ────────────────────────────────
export function Plant({ species = 'fiddle', stage = 2, size = 120, wind = 0, glow = false }) {
  const s   = Math.max(0, Math.min(5, stage))
  const G   = C.green
  const Gm  = '#99E860'
  const Gd  = '#6BAE3E'
  const stem = '#3E7A2A'
  const dirt = '#5A3B24'
  const glowId = useId()

  const Pot = (
    <g>
      <path d="M 22 78 L 26 98 Q 30 104 60 104 Q 90 104 94 98 L 98 78 Z"
            fill="#C9825A" stroke="#8A4E2E" strokeWidth="1.5" />
      <ellipse cx="60" cy="78" rx="38" ry="6" fill="#A05E3A"/>
      <ellipse cx="60" cy="78" rx="36" ry="4" fill={dirt}/>
      <path d="M 22 78 L 98 78" stroke="rgba(255,255,255,.25)" strokeWidth="1"/>
    </g>
  )

  const sway = `rotate(${wind}deg)`
  let foliage = null

  if (s === 0) {
    foliage = (
      <g style={{ transformOrigin: '60px 78px', transform: sway, transition: 'transform .6s ease' }}>
        <circle cx="60" cy="75" r="2.5" fill="#2C1A0B"/>
      </g>
    )
  } else if (s === 1) {
    foliage = (
      <g style={{ transformOrigin: '60px 78px', transform: sway, transition: 'transform .6s ease' }}>
        <path d="M60 78 Q60 68 60 60" stroke={stem} strokeWidth="2" fill="none" strokeLinecap="round"/>
        <ellipse cx="54" cy="64" rx="5" ry="3" fill={G}   transform="rotate(-25 54 64)"/>
        <ellipse cx="66" cy="64" rx="5" ry="3" fill={Gm}  transform="rotate(25 66 64)"/>
      </g>
    )
  } else if (species === 'fiddle') {
    const leaves = s === 2 ? 3 : s === 3 ? 5 : s === 4 ? 7 : 9
    const topY   = s === 2 ? 38 : s === 3 ? 24 : s === 4 ? 14 : 8
    foliage = (
      <g style={{ transformOrigin: '60px 78px', transform: sway, transition: 'transform .6s ease' }}>
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
      <g style={{ transformOrigin: '60px 78px', transform: sway, transition: 'transform .6s ease' }}>
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
      <g style={{ transformOrigin: '60px 78px', transform: sway, transition: 'transform .6s ease' }}>
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
      <g style={{ transformOrigin: '60px 78px', transform: sway, transition: 'transform .6s ease' }}>
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
  } else {
    // fern
    const fronds = s === 2 ? 5 : s === 3 ? 7 : s === 4 ? 10 : 14
    foliage = (
      <g style={{ transformOrigin: '60px 78px', transform: sway, transition: 'transform .6s ease' }}>
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
  { id: 1, mentor: 'Kimberly Revilla', species: 'fiddle',   stage: 4, sessions: 6, startedAt: 'Feb 2026', nextSession: 'Thu 2:30 PM'  },
  { id: 2, mentor: 'Justin Levesque',  species: 'monstera', stage: 2, sessions: 2, startedAt: 'Mar 2026', nextSession: 'Next week'     },
  { id: 3, mentor: 'Alex Chen',        species: 'bonsai',   stage: 1, sessions: 1, startedAt: 'Apr 2026', nextSession: 'Scheduling'    },
]

function useGarden() {
  const [plants, setPlants] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sprout.garden') || 'null') || DEFAULT_PLANTS } catch { return DEFAULT_PLANTS }
  })
  useEffect(() => {
    try { localStorage.setItem('sprout.garden', JSON.stringify(plants)) } catch {}
  }, [plants])
  return [plants, setPlants]
}

// ── My Garden screen ──────────────────────────────────────────────────────────
export function MyGardenScreen({ onTab, tab = 'garden', onShare, onOpenPlant, highlightId }) {
  const [plants]  = useGarden()
  const [windT, setWindT] = useState(0)

  useEffect(() => {
    let raf; let t = 0
    const loop = () => { t += 0.016; setWindT(Math.sin(t * 1.2) * 2.5); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const total    = plants.length
  const sessions = plants.reduce((a, p) => a + p.sessions, 0)
  const months   = 3

  return (
    <div style={{ width: '100%', height: '100%', background: C.ink, color: C.cream, position: 'relative', overflow: 'hidden' }}>
      <StatusBar dark />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #12140E 0%, #1A1E14 35%, #2A2412 80%, #3A2E18 100%)' }}/>
      <div style={{ position: 'absolute', top: 90, right: -20, width: 140, height: 140, borderRadius: 999,
                    background: 'radial-gradient(circle, rgba(185,255,111,.35), rgba(185,255,111,0) 65%)' }}/>

      <div style={{ position: 'relative', paddingTop: 60, paddingBottom: 100, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
        <div style={{ paddingLeft: 20, paddingRight: 20 }}>
          <div style={{ fontFamily: 'Urbanist', fontWeight: 300, fontSize: 13, letterSpacing: '.14em', textTransform: 'uppercase', color: C.green, opacity: .8 }}>Your garden</div>
          <div style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 30, lineHeight: 1.05, letterSpacing: -.5, marginTop: 4 }}>
            3 plants,<br/>growing together.
          </div>
          <div style={{ marginTop: 6, fontFamily: 'Urbanist', fontSize: 13, color: C.cream, opacity: .55 }}>
            Every mentor relationship is a plant. The more you meet, the more it grows.
          </div>
        </div>

        <div style={{ marginTop: 18, paddingLeft: 20, paddingRight: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { n: total,    l: 'Mentors' },
            { n: sessions, l: 'Sessions' },
            { n: months,   l: 'Months growing' },
          ].map(s => (
            <div key={s.l} style={{ padding: '12px 10px', borderRadius: 12, background: 'rgba(185,255,111,.07)', border: '1px solid rgba(185,255,111,.15)' }}>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 22, color: C.green }}>{s.n}</div>
              <div style={{ fontFamily: 'Urbanist', fontSize: 11, color: C.cream, opacity: .6, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 22, paddingLeft: 20, paddingRight: 20 }}>
          <div style={{
            position: 'relative',
            background: 'linear-gradient(180deg, #1F1C10 0%, #2E2412 100%)',
            borderRadius: 20, padding: 16, border: '1px solid rgba(185,255,111,.12)',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 16, borderRadius: 14,
                          background: 'radial-gradient(ellipse at 30% 20%, rgba(185,255,111,.1), transparent 70%), repeating-radial-gradient(circle at 20% 80%, rgba(0,0,0,.12) 0 2px, transparent 2px 6px)' }}/>
            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, paddingTop: 8 }}>
              {plants.map((p, i) => {
                const pct = STAGE_PCT[p.stage]
                const w   = windT * (i % 2 === 0 ? 1 : -1)
                const isHighlight = highlightId === p.id
                return (
                  <div key={p.id} onClick={() => onOpenPlant?.(p)} style={{
                    position: 'relative', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    padding: 8, borderRadius: 12,
                    background: isHighlight ? 'rgba(185,255,111,.1)' : 'transparent',
                    transition: 'background .3s',
                  }}>
                    <Plant species={p.species} stage={p.stage} size={90} wind={w} glow={isHighlight}/>
                    <div style={{ marginTop: 4, fontFamily: 'Urbanist', fontWeight: 700, fontSize: 12, color: C.cream, textAlign: 'center' }}>
                      {p.mentor.split(' ')[0]}
                    </div>
                    <div style={{ fontFamily: 'Urbanist', fontSize: 10, color: C.green, opacity: .85, textAlign: 'center' }}>
                      {STAGE_LABEL[p.stage]}
                    </div>
                    <div style={{ marginTop: 6, width: '80%', height: 3, borderRadius: 999, background: 'rgba(255,249,230,.1)', overflow: 'hidden' }}>
                      <div style={{ width: pct + '%', height: '100%', background: C.green, transition: 'width .6s cubic-bezier(.2,.8,.2,1)' }}/>
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ position: 'relative', marginTop: 6, height: 1, background: 'linear-gradient(90deg, transparent, rgba(185,255,111,.25), transparent)' }}/>
          </div>
        </div>

        <div style={{ marginTop: 14, marginLeft: 20, marginRight: 20, padding: 14, borderRadius: 14, background: 'rgba(255,249,230,.04)', border: '1px solid rgba(255,249,230,.06)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(185,255,111,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L12 22 M5 9 L12 2 L19 9"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 13, color: C.cream }}>Grow faster</div>
            <div style={{ marginTop: 2, fontFamily: 'Urbanist', fontSize: 12, color: C.cream, opacity: .65, lineHeight: 1.4 }}>
              Meeting weekly grows plants faster than monthly. Your next session with Kimberly is Thursday — keep the momentum.
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18, paddingLeft: 20, paddingRight: 20 }}>
          <div onClick={onShare} style={{
            background: C.green, color: C.ink, borderRadius: 999, padding: '16px 20px',
            fontFamily: 'Urbanist', fontWeight: 700, fontSize: 15, textAlign: 'center',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: '0 8px 24px rgba(185,255,111,.2)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <path d="M16 6l-4-4-4 4"/>
              <path d="M12 2v13"/>
            </svg>
            Share my garden
          </div>
          <div style={{ marginTop: 8, textAlign: 'center', fontFamily: 'Urbanist', fontSize: 11, color: C.cream, opacity: .5 }}>
            Post to LinkedIn, X, or save as image
          </div>
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
        padding: '24px 20px 40px', animation: 'pdSlide .28s cubic-bezier(.2,.8,.2,1) both',
        border: '1px solid rgba(185,255,111,.15)', borderBottom: 'none',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 999, background: 'rgba(255,249,230,.2)', margin: '0 auto 16px' }}/>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 100, height: 100, borderRadius: 16, background: 'radial-gradient(circle at 50% 40%, rgba(185,255,111,.15), transparent 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Plant species={plant.species} stage={plant.stage} size={100} glow/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Urbanist', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: C.green, opacity: .8 }}>
              {STAGE_LABEL[plant.stage]} · {plant.species}
            </div>
            <div style={{ marginTop: 2, fontFamily: 'Urbanist', fontWeight: 700, fontSize: 20, color: C.cream }}>
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
            <div style={{ width: pct + '%', height: '100%', background: C.green, transition: 'width .8s cubic-bezier(.2,.8,.2,1)' }}/>
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ padding: '12px', borderRadius: 12, background: 'rgba(255,249,230,.05)' }}>
            <div style={{ fontFamily: 'Urbanist', fontSize: 11, color: C.cream, opacity: .55 }}>Sessions</div>
            <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 20, color: C.green }}>{plant.sessions}</div>
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
      padding: 24, animation: 'pgFade .3s ease both',
    }}>
      <style>{`
        @keyframes pgFade    { from {opacity:0} to {opacity:1} }
        @keyframes pgBurst   { 0% { transform: scale(0); opacity: 1 } 100% { transform: scale(2.6); opacity: 0 } }
        @keyframes pgSparkle {
          0%   { transform: translate(0,0) scale(0); opacity: 0 }
          20%  { opacity: 1; transform: scale(1) }
          100% { transform: translate(var(--dx), var(--dy)) scale(.4); opacity: 0 }
        }
        @keyframes pgRise { from { transform: translateY(20px); opacity: 0 } to { transform: none; opacity: 1 } }
        @keyframes pgBeat { 0%,100% { transform: scale(1) } 50% { transform: scale(1.05) } }
      `}</style>

      <div style={{ fontFamily: 'Urbanist', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: C.green, opacity: .8, animation: 'pgRise .4s .1s both' }}>
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

      <div style={{ marginTop: 28, fontFamily: 'Urbanist', fontWeight: 700, fontSize: 26, color: C.cream, textAlign: 'center', animation: 'pgRise .5s .8s both' }}>
        Your plant grew!
      </div>
      <div style={{ marginTop: 6, maxWidth: 280, textAlign: 'center', fontFamily: 'Urbanist', fontSize: 14, color: C.cream, opacity: .7, lineHeight: 1.4, animation: 'pgRise .5s 1s both' }}>
        {mentor ? <>Your mentorship with <strong style={{ color: C.green }}>{mentor.split(' ')[0]}</strong> is now <em>{STAGE_LABEL[toStage]}</em>.</> : null}
      </div>

      <div style={{ marginTop: 32, width: '100%', maxWidth: 280, animation: 'pgRise .5s 1.2s both' }}>
        <div onClick={onDone} style={{
          padding: '14px', borderRadius: 999, background: C.green, color: C.ink,
          fontFamily: 'Urbanist', fontWeight: 700, fontSize: 15, textAlign: 'center', cursor: 'pointer',
        }}>
          See my garden
        </div>
      </div>
    </div>
  )
}

// ── Share garden modal ────────────────────────────────────────────────────────
export function ShareGardenModal({ onClose }) {
  const [plants]     = useGarden()
  const sessions     = plants.reduce((a, p) => a + p.sessions, 0)
  const [copied,     setCopied]     = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const handleCopy = () => {
    try { navigator.clipboard.writeText('https://sprout.app/grow/lisa') } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }
  const handleDownload = () => {
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 1600)
  }

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 80,
      display: 'flex', alignItems: 'flex-end', animation: 'sgFade .2s ease both',
    }}>
      <style>{`
        @keyframes sgFade  { from {opacity:0} to {opacity:1} }
        @keyframes sgSlide { from {transform: translateY(100%)} to {transform: none} }
      `}</style>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: C.ink, borderRadius: '24px 24px 0 0',
        padding: '16px 20px 32px', animation: 'sgSlide .3s cubic-bezier(.2,.8,.2,1) both',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 999, background: 'rgba(255,249,230,.2)', margin: '0 auto 12px' }}/>
        <div style={{ fontFamily: 'Urbanist', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: C.green, opacity: .8 }}>Preview</div>
        <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 18, color: C.cream, marginTop: 2 }}>Share my garden</div>

        <div style={{
          marginTop: 14, borderRadius: 20, overflow: 'hidden',
          background: 'linear-gradient(160deg, #DCFC9B 0%, #B9FF6F 50%, #A6EF72 100%)',
          color: '#121212', padding: 20, position: 'relative',
          boxShadow: '0 20px 50px rgba(0,0,0,.4)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Urbanist', fontWeight: 700, fontSize: 14 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#121212">
                <path d="M12 2 C 8 6 8 12 12 14 C 16 12 16 6 12 2 Z"/>
                <path d="M12 14 Q 10 18 6 18 Q 10 22 12 22 Q 14 22 18 18 Q 14 18 12 14 Z"/>
              </svg>
              Sprout
            </div>
            <div style={{ fontFamily: 'Urbanist', fontSize: 10, opacity: .6, letterSpacing: '.12em', textTransform: 'uppercase' }}>sprout.app/grow/lisa</div>
          </div>

          <div style={{ marginTop: 20 }}>
            <div style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 28, lineHeight: 1.05, letterSpacing: -.5 }}>
              Lisa Wong's<br/>
              <span style={{ fontWeight: 700 }}>mentorship garden</span>
            </div>
          </div>

          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', padding: '10px 0', background: 'rgba(255,249,230,.3)', borderRadius: 14, border: '1px solid rgba(18,18,18,.1)' }}>
            {plants.map((p) => (
              <div key={p.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Plant species={p.species} stage={p.stage} size={72}/>
                <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 10, marginTop: -4 }}>{p.mentor.split(' ')[0]}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { n: plants.length, l: 'Mentors' },
              { n: sessions,      l: 'Sessions' },
              { n: '3 mo',        l: 'Growing'  },
            ].map(s => (
              <div key={s.l} style={{ background: '#121212', color: C.cream, borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 18, color: C.green }}>{s.n}</div>
                <div style={{ fontFamily: 'Urbanist', fontSize: 10, opacity: .7, marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, fontFamily: 'Urbanist', fontSize: 11, fontWeight: 500 }}>
            Growing with Sprout since Feb 2026 🌱
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ padding: '12px', borderRadius: 12, background: '#0077B5', color: '#fff', fontFamily: 'Urbanist', fontWeight: 600, fontSize: 13, textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.78 1.78 0 0 1-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
            Post to LinkedIn
          </div>
          <div style={{ padding: '12px', borderRadius: 12, background: '#000', color: '#fff', fontFamily: 'Urbanist', fontWeight: 600, fontSize: 13, textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Post to X
          </div>
        </div>

        <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div onClick={handleDownload} style={{ padding: '12px', borderRadius: 12, background: 'rgba(255,249,230,.06)', color: C.cream, border: '1px solid rgba(255,249,230,.1)', fontFamily: 'Urbanist', fontWeight: 600, fontSize: 13, textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {downloaded ? <>✓ Saved</> : <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download image
            </>}
          </div>
          <div onClick={handleCopy} style={{ padding: '12px', borderRadius: 12, background: 'rgba(255,249,230,.06)', color: C.cream, border: '1px solid rgba(255,249,230,.1)', fontFamily: 'Urbanist', fontWeight: 600, fontSize: 13, textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {copied ? <>✓ Copied</> : <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy link
            </>}
          </div>
        </div>
      </div>
    </div>
  )
}
