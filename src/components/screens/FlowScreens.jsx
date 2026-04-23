import { useState, useEffect } from 'react'
import { C, I, Btn, A } from '../atoms.jsx'
import { StatusBar, HomeIndicator } from '../Phone.jsx'

// ── Landing mentors data ──────────────────────────────────────────────────────
const LANDING_MENTORS = [
  { src: A('avatars/mentor-kimberly.jpg'), tag: 'Design · Apple' },
  { src: A('avatars/mentor-justin.jpg'),   tag: 'UX · Meta' },
  { src: A('avatars/mentor-alex.jpg'),     tag: 'Product · Amazon' },
  { src: A('avatars/mentor-a.jpg'),        tag: 'Eng · Stripe' },
  { src: A('avatars/mentor-b.jpg'),        tag: 'Staff · Notion' },
]

// ── Simple plant SVG (for landing hero) ──────────────────────────────────────
export function Plant({ stage, size = 64 }) {
  const s = Math.max(0, Math.min(1, stage))
  const stem = 6 + s * 36
  const leafA = s > 0.2 ? 1 : 0
  const leafB = s > 0.45 ? 1 : 0
  const leafC = s > 0.7 ? 1 : 0
  const bloom = s > 0.88 ? 1 : 0
  const green = C.green
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: 'block' }}>
      <ellipse cx="32" cy="56" rx="16" ry="3" fill="#3b2a1a"/>
      <path d="M16 55 Q32 50 48 55 Q44 59 32 59 Q20 59 16 55Z" fill="#5c3f24"/>
      <rect x="31" y={55 - stem} width="2" height={stem} rx="1" fill={green} style={{ transition: 'all .8s ease-out' }}/>
      <path d="M32 44 Q22 41 18 33 Q28 32 32 40 Z" fill={green} opacity={leafA} style={{ transition: 'opacity .6s' }}/>
      <path d="M32 38 Q42 35 46 27 Q36 26 32 34 Z" fill={green} opacity={leafB * 0.9} style={{ transition: 'opacity .6s' }}/>
      <path d="M32 28 Q24 24 22 15 Q30 16 32 24 Z" fill={green} opacity={leafC} style={{ transition: 'opacity .6s' }}/>
      <g opacity={bloom} style={{ transition: 'opacity .6s' }}>
        <circle cx="32" cy={55 - stem - 2} r="5" fill={C.cream}/>
        <circle cx="32" cy={55 - stem - 2} r="2" fill={green}/>
      </g>
    </svg>
  )
}

function MentorPlant({ avatar, progress, size = 64, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <img src={avatar} width={size} height={size}
           style={{ borderRadius: 999, objectFit: 'cover',
                    border: `2px solid ${C.green}`,
                    boxShadow: '0 10px 24px rgba(0,0,0,.45)' }}/>
      <div style={{ marginTop: 8, width: size + 10, height: 4, borderRadius: 999, background: 'rgba(255,249,230,.14)', overflow: 'hidden' }}>
        <div style={{ width: `${progress * 100}%`, height: '100%', background: C.green, transition: 'width .9s cubic-bezier(.2,.8,.2,1)' }}/>
      </div>
      <div style={{ marginTop: 8, height: 58, display: 'flex', alignItems: 'flex-end' }}>
        <Plant stage={progress} size={58}/>
      </div>
      <div style={{ marginTop: 4, fontFamily: 'Urbanist', fontSize: 10, letterSpacing: '.08em',
                    textTransform: 'uppercase', color: C.cream, opacity: .55 }}>
        {label}
      </div>
    </div>
  )
}

// ── Landing screen (animated garden hero) ────────────────────────────────────
export function LandingScreenDynamic({ onNext }) {
  const [t, setT] = useState(0)
  useEffect(() => {
    let raf, start = performance.now()
    const tick = (now) => {
      const elapsed = ((now - start) / 9000) % 1
      setT(elapsed)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const stage = (offset) => {
    const v = (t + offset) % 1
    return v < 0.85 ? v / 0.85 : 1 - (v - 0.85) / 0.15
  }

  return (
    <div style={{ width: '100%', height: '100%', background: C.ink, color: C.cream, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <StatusBar dark />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(520px 380px at 50% 30%, rgba(185,255,111,.14), transparent 65%)' }}/>
      <div style={{ marginTop: 90, padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <MentorPlant avatar={LANDING_MENTORS[0]?.src} progress={stage(0.05)}  size={56} label="2 weeks"/>
        <MentorPlant avatar={LANDING_MENTORS[2]?.src} progress={stage(0.35)}  size={72} label="3 months"/>
        <MentorPlant avatar={LANDING_MENTORS[1]?.src} progress={stage(0.70)}  size={56} label="1 year"/>
      </div>
      <div style={{ marginTop: 36, padding: '0 32px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 64, lineHeight: 1,
                      letterSpacing: -2, color: C.green }}>Sprout</div>
        <div style={{ marginTop: 14, fontFamily: 'Urbanist', fontWeight: 600, fontSize: 22, letterSpacing: -.3,
                      color: C.cream, lineHeight: 1.3 }}>
          Mentorships that grow with you.
        </div>
        <div style={{ marginTop: 10, fontFamily: 'Urbanist', fontSize: 14, color: C.cream, opacity: .6, lineHeight: 1.5 }}>
          The more you meet, the more your garden blooms.
        </div>
      </div>
      <div style={{ marginTop: 'auto', padding: '0 24px 48px' }}>
        <button onClick={onNext} style={{
          width: '100%', height: 56, border: 'none', cursor: 'pointer',
          background: C.green, color: C.ink, borderRadius: 14,
          fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, letterSpacing: -.2,
          boxShadow: '0 10px 28px rgba(185,255,111,.20)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          Plant your first seed
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </button>
        <div style={{ marginTop: 18, textAlign: 'center', fontFamily: 'Urbanist', fontSize: 14,
                      color: C.cream, opacity: .7 }}>
          Already have an account? <span onClick={onNext} style={{ color: C.green, fontWeight: 600, cursor: 'pointer' }}>Log in</span>
        </div>
      </div>
      <HomeIndicator dark />
    </div>
  )
}

// ── Splash screen ─────────────────────────────────────────────────────────────
export function SplashScreen({ onNext }) {
  return (
    <div style={{ width: '100%', height: '100%', background: C.black, color: C.cream, position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <StatusBar dark />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(520px 400px at 50% 30%, rgba(185,255,111,.14), transparent 65%)' }}/>
      <div style={{ marginTop: 110, display: 'flex', justifyContent: 'center' }}>
        <svg width="160" height="160" viewBox="0 0 110 110" fill="none">
          <ellipse cx="55" cy="88" rx="42" ry="10" fill="#3b2a1a"/>
          <path d="M15 88 Q55 68 95 88 Q85 96 55 96 Q25 96 15 88Z" fill="#5c3f24"/>
          <path d="M55 88 Q55 72 55 58" stroke={C.green} strokeWidth="3" strokeLinecap="round"/>
          <path d="M55 68 Q40 62 36 50 Q48 52 55 62Z" fill={C.green}/>
          <path d="M55 64 Q70 58 74 46 Q62 48 55 58Z" fill={C.green} opacity=".85"/>
        </svg>
      </div>
      <div style={{ marginTop: 36, padding: '0 32px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Urbanist', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase',
                      fontWeight: 600, color: C.green, opacity: .9 }}>Welcome to Sprout</div>
        <div style={{ marginTop: 14, fontFamily: 'Urbanist', fontWeight: 700, fontSize: 32, letterSpacing: -.6,
                      lineHeight: 1.1, color: C.cream }}>Let's get you started</div>
        <div style={{ marginTop: 14, fontFamily: 'Urbanist', fontSize: 15, color: C.cream, opacity: .65,
                      lineHeight: 1.55, maxWidth: 300, margin: '14px auto 0' }}>
          Four quick questions so we can match you with the right mentors. Takes about a minute.
        </div>
      </div>
      <div style={{ marginTop: 'auto', padding: '0 24px 48px' }}>
        <Btn variant="primary" onClick={onNext} style={{ width: '100%' }}>Get started</Btn>
        <div style={{ marginTop: 16, textAlign: 'center', fontFamily: 'Urbanist', fontSize: 13, color: C.cream, opacity: .7 }}>
          Have an account? <span onClick={onNext} style={{ color: C.green, fontWeight: 600, cursor: 'pointer' }}>Log in</span>
        </div>
      </div>
      <HomeIndicator dark />
    </div>
  )
}

// ── Onboarding illustrations ──────────────────────────────────────────────────
const IL = {
  growth: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="22" r="7" stroke="#3a2a1a" strokeWidth="1.5"/>
      <path d="M14 48c2-8 8-12 14-12s12 4 14 12" stroke="#3a2a1a" strokeWidth="1.5" fill="none"/>
      <path d="M40 10l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#B9FF6F" stroke="#3a2a1a" strokeWidth="1"/>
    </svg>
  ),
  briefcase: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect x="10" y="20" width="36" height="26" rx="3" stroke="#3a2a1a" strokeWidth="1.5" fill="#FFF9E6"/>
      <path d="M22 20v-4a3 3 0 013-3h6a3 3 0 013 3v4" stroke="#3a2a1a" strokeWidth="1.5"/>
      <path d="M10 32h36" stroke="#3a2a1a" strokeWidth="1.5"/>
      <circle cx="28" cy="32" r="2" fill="#B9FF6F" stroke="#3a2a1a" strokeWidth="1"/>
    </svg>
  ),
  transition: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <path d="M8 28h32M34 22l8 6-8 6" stroke="#3a2a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="14" cy="16" r="4" fill="#B9FF6F" stroke="#3a2a1a" strokeWidth="1"/>
      <circle cx="44" cy="42" r="4" fill="#B9FF6F" stroke="#3a2a1a" strokeWidth="1"/>
    </svg>
  ),
  interview: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect x="8" y="12" width="40" height="24" rx="3" stroke="#3a2a1a" strokeWidth="1.5" fill="#FFF9E6"/>
      <path d="M16 36v4l6-4" stroke="#3a2a1a" strokeWidth="1.5" fill="#FFF9E6"/>
      <circle cx="20" cy="22" r="2" fill="#3a2a1a"/>
      <circle cx="28" cy="22" r="2" fill="#3a2a1a"/>
      <circle cx="36" cy="22" r="2" fill="#3a2a1a"/>
    </svg>
  ),
  college: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <path d="M8 22l20-8 20 8-20 8z" fill="#B9FF6F" stroke="#3a2a1a" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M16 26v8c0 3 6 6 12 6s12-3 12-6v-8" stroke="#3a2a1a" strokeWidth="1.5" fill="none"/>
      <path d="M48 22v10" stroke="#3a2a1a" strokeWidth="1.5"/>
    </svg>
  ),
  grad: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="20" r="6" stroke="#3a2a1a" strokeWidth="1.5" fill="#FFF9E6"/>
      <path d="M14 46c2-8 7-12 14-12s12 4 14 12" stroke="#3a2a1a" strokeWidth="1.5" fill="none"/>
      <rect x="22" y="32" width="12" height="4" fill="#B9FF6F" stroke="#3a2a1a" strokeWidth="1"/>
    </svg>
  ),
  early: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect x="12" y="16" width="32" height="28" rx="3" stroke="#3a2a1a" strokeWidth="1.5" fill="#FFF9E6"/>
      <path d="M18 26h20M18 32h14M18 38h16" stroke="#3a2a1a" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="42" cy="14" r="5" fill="#B9FF6F" stroke="#3a2a1a" strokeWidth="1"/>
    </svg>
  ),
  hired: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="22" r="7" stroke="#3a2a1a" strokeWidth="1.5" fill="#FFF9E6"/>
      <path d="M14 46c2-8 7-12 14-12s12 4 14 12" stroke="#3a2a1a" strokeWidth="1.5" fill="none"/>
      <circle cx="42" cy="14" r="7" fill="#B9FF6F" stroke="#3a2a1a" strokeWidth="1"/>
      <path d="M38 14l3 3 5-5" stroke="#3a2a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  mid: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <path d="M10 44h36" stroke="#3a2a1a" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="14" y="30" width="8" height="14" fill="#B9FF6F" stroke="#3a2a1a" strokeWidth="1.2"/>
      <rect x="24" y="22" width="8" height="22" fill="#B9FF6F" stroke="#3a2a1a" strokeWidth="1.2"/>
      <rect x="34" y="14" width="8" height="30" fill="#B9FF6F" stroke="#3a2a1a" strokeWidth="1.2"/>
    </svg>
  ),
  senior: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="18" stroke="#3a2a1a" strokeWidth="1.5" fill="#FFF9E6"/>
      <path d="M28 16v12l8 5" stroke="#3a2a1a" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="28" cy="28" r="2" fill="#3a2a1a"/>
    </svg>
  ),
}

export const ONBOARD_STEPS = [
  {
    eyebrow: 'Step 1: Define Your Goal',
    question: 'What are you looking for on this platform?',
    body: 'This helps us match you with mentors whose experience aligns with what you want to achieve.',
    dropdown: 'Long-term mentorship?',
    options: [
      { title: 'Personal growth',          desc: 'Building confidence, improving soft skills', il: IL.growth },
      { title: 'Professional development', desc: 'Networking skills',                          il: IL.briefcase },
      { title: 'Career Transition',        desc: 'Coming from different background',           il: IL.transition },
      { title: 'Interview Prep',           desc: 'Building confidence, improving soft skills', il: IL.interview },
    ],
  },
  {
    eyebrow: 'Step 2: Background',
    question: 'Are you currently a…',
    body: 'Tell us where you are in your journey — we'll tailor the mentor recommendations.',
    options: [
      { title: 'College student',  desc: 'Enrolled in a university or college pursuing an undergraduate or associate degree.', il: IL.college },
      { title: 'Graduate student', desc: "Enrolled in graduate school pursuing a master's or doctoral degree.",               il: IL.grad },
      { title: 'Early-career',     desc: 'Professionals with 1–3 years of work experience.',                                 il: IL.early },
    ],
  },
  {
    eyebrow: 'Step 3: Your preferred connection',
    question: 'Who are you looking to connect with?',
    body: 'Choose the seniority level that feels most useful to you right now.',
    options: [
      { title: 'Recently Hired',   desc: 'Tap into the experience of new professionals.',    il: IL.hired },
      { title: 'Early-Career',     desc: 'Connect with early-career professionals.',         il: IL.early },
      { title: 'Mid-Senior Level', desc: 'Tap into the insights of seasoned professionals.', il: IL.mid },
      { title: 'Senior Level',     desc: 'Learn from industry veterans.',                    il: IL.senior },
    ],
  },
  {
    eyebrow: 'Step 4: Target companies',
    question: 'Any companies you have your eye on?',
    body: "Search or tap to see how many Sprout mentors work there. This shapes who we surface — you can skip if you're keeping it open.",
    skippable: true,
    companies: true,
  },
]

const COMPANIES = [
  { name: 'Google',    mentors: 48, tier: 'hot',  tag: 'FAANG'  },
  { name: 'Apple',     mentors: 34, tier: 'hot',  tag: 'FAANG'  },
  { name: 'Meta',      mentors: 41, tier: 'hot',  tag: 'FAANG'  },
  { name: 'Amazon',    mentors: 29, tier: 'warm', tag: 'FAANG'  },
  { name: 'Netflix',   mentors: 12, tier: 'cool', tag: 'FAANG'  },
  { name: 'Stripe',    mentors: 22, tier: 'warm', tag: 'Fintech'},
  { name: 'Notion',    mentors: 18, tier: 'warm', tag: 'SaaS'   },
  { name: 'Figma',     mentors: 26, tier: 'hot',  tag: 'SaaS'   },
  { name: 'Linear',    mentors: 9,  tier: 'cool', tag: 'SaaS'   },
  { name: 'Airbnb',    mentors: 19, tier: 'warm', tag: 'Travel' },
  { name: 'Shopify',   mentors: 15, tier: 'warm', tag: 'Ecom'   },
  { name: 'Uber',      mentors: 14, tier: 'cool', tag: 'Mobility'},
  { name: 'Pinterest', mentors: 8,  tier: 'cool', tag: 'Social' },
  { name: 'Coinbase',  mentors: 11, tier: 'cool', tag: 'Fintech'},
]
const TIER_DOT = { hot: '#B9FF6F', warm: '#FFF9E6', cool: '#8F8B80' }

function CompanyMonogram({ name }) {
  const letters = name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffff
  const hue = h % 360
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: `hsl(${hue} 60% 88%)`,
      color: `hsl(${hue} 35% 28%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Urbanist', fontWeight: 700, fontSize: 12, letterSpacing: '.02em',
      flex: '0 0 32px',
    }}>{letters}</div>
  )
}

// ── Onboarding flow ───────────────────────────────────────────────────────────
export function OnboardingFlowScreen({ step = 0, onNext, onBack }) {
  const s = ONBOARD_STEPS[step]
  const [sel, setSel] = useState(null)
  useEffect(() => { setSel(null) }, [step])
  const total = ONBOARD_STEPS.length
  return (
    <div style={{ width: '100%', height: '100%', background: C.black, color: C.cream, position: 'relative' }}>
      <StatusBar dark />
      <div style={{ position: 'absolute', left: 20, right: 20, top: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div onClick={onBack} style={{ color: C.green, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                       width: 36, height: 36, borderRadius: 999, border: `1.5px solid ${C.green}` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </div>
        {s.skippable && (
          <div onClick={onNext} style={{ fontFamily: 'Urbanist', fontWeight: 600, fontSize: 14, color: C.cream, cursor: 'pointer' }}>Skip</div>
        )}
      </div>

      <div style={{ position: 'absolute', left: 20, right: 20, top: 138 }}>
        <div style={{ fontFamily: 'Urbanist', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase',
                      fontWeight: 600, color: C.green, opacity: .85 }}>{s.eyebrow}</div>
        <div style={{ marginTop: 10, fontFamily: 'Urbanist', fontWeight: 700, fontSize: 26, color: C.cream,
                      letterSpacing: -.4, lineHeight: 1.2 }}>{s.question}</div>
        <div style={{ marginTop: 8, fontFamily: 'Urbanist', fontWeight: 400, fontSize: 14, color: C.cream,
                      opacity: .6, lineHeight: 1.5 }}>
          {s.body || 'Pick the one that feels most like you — you can always change this later.'}
        </div>
      </div>

      <div style={{ position: 'absolute', left: 20, right: 20, top: 260, bottom: 110, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {s.dropdown && (
          <div style={{ marginBottom: 4, padding: '14px 16px', borderRadius: 10, background: C.ink2,
                        border: '1px solid rgba(255,249,230,.12)', color: C.cream,
                        fontFamily: 'Urbanist', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span style={{ opacity: .9 }}>{s.dropdown}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        )}

        {s.companies && (
          <>
            <div style={{ padding: '12px 14px', borderRadius: 10, background: C.ink2,
                          border: '1px solid rgba(255,249,230,.12)', color: C.cream,
                          fontFamily: 'Urbanist', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span style={{ opacity: .6 }}>Search companies</span>
            </div>
            {COMPANIES.map((c, i) => {
              const active = Array.isArray(sel) && sel.includes(i)
              return (
                <div key={c.name} onClick={() => setSel(prev => {
                  const arr = Array.isArray(prev) ? prev : []
                  return arr.includes(i) ? arr.filter(x => x !== i) : [...arr, i]
                })} style={{
                  padding: '12px', borderRadius: 12, background: C.creamSoft,
                  border: active ? `2px solid ${C.green}` : '1px solid rgba(0,0,0,.06)',
                  boxShadow: active ? '0 0 0 3px rgba(185,255,111,.25)' : '0 1px 2px rgba(0,0,0,.05)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                  transition: 'border-color .12s, box-shadow .12s',
                }}>
                  <CompanyMonogram name={c.name}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 14, color: C.ink }}>{c.name}</div>
                    <div style={{ marginTop: 2, fontFamily: 'Urbanist', fontSize: 11, color: '#6b6658', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: TIER_DOT[c.tier] }}/>
                      {c.mentors} mentors · {c.tag}
                    </div>
                  </div>
                  <div style={{ width: 20, height: 20, borderRadius: 6, border: active ? 'none' : '1.5px solid rgba(0,0,0,.2)',
                                background: active ? C.green : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 20px' }}>
                    {active && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5 11-11"/></svg>}
                  </div>
                </div>
              )
            })}
          </>
        )}

        {Array.isArray(s.options) && s.options.map((o, i) => {
          const active = sel === i
          return (
            <div key={i} onClick={() => setSel(i)} style={{
              padding: '14px', borderRadius: 12, background: C.creamSoft,
              border: active ? `2px solid ${C.green}` : '1px solid rgba(0,0,0,.06)',
              boxShadow: active ? '0 0 0 3px rgba(185,255,111,.25)' : '0 1px 2px rgba(0,0,0,.05)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
              transition: 'border-color .12s, box-shadow .12s',
            }}>
              <div style={{ width: 56, height: 56, flex: '0 0 56px', borderRadius: 8, background: '#F3EFDF',
                            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {o.il}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 14, color: C.ink }}>{o.title}</div>
                <div style={{ marginTop: 2, fontFamily: 'Urbanist', fontSize: 11, color: '#6b6658', lineHeight: 1.35 }}>{o.desc}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 40 }}>
        <Btn variant="primary" onClick={onNext} style={{ width: '100%' }}>
          {step === total - 1 ? 'Find my mentors' : 'Next'}
        </Btn>
      </div>
      <HomeIndicator dark />
    </div>
  )
}

// ── Matching loading screen ───────────────────────────────────────────────────
export function MatchingScreen({ onNext }) {
  useEffect(() => {
    const t = setTimeout(() => onNext?.(), 2100)
    return () => clearTimeout(t)
  }, [onNext])
  return (
    <div style={{ width: '100%', height: '100%', background: C.ink, color: C.cream, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar dark />
      <div style={{ position: 'relative', width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute', width: '100%', height: '100%', borderRadius: '50%',
            border: `1.5px solid ${C.green}`, opacity: .7 - i * .2,
            animation: `sproutRing 2s ease-out ${i * 0.4}s infinite`,
          }}/>
        ))}
        <div style={{ width: 84, height: 84, borderRadius: '50%', background: C.green, color: C.ink,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Urbanist', fontWeight: 700, fontSize: 40, letterSpacing: -1 }}>S</div>
      </div>
      <div style={{ marginTop: 52, fontFamily: 'Urbanist', fontWeight: 700, fontSize: 22 }}>Finding your matches</div>
      <div style={{ marginTop: 6, fontFamily: 'Urbanist', fontSize: 14, color: C.cream, opacity: .6 }}>Cross-referencing 2,300 mentors…</div>
      <style>{`
        @keyframes sproutRing {
          0% { transform: scale(.4); opacity: .9 }
          100% { transform: scale(1.4); opacity: 0 }
        }
      `}</style>
      <HomeIndicator dark />
    </div>
  )
}

// ── Search screen ─────────────────────────────────────────────────────────────
const SEARCH_SEED = [
  { name: 'Justin White',     title: 'UIUX Designer · Meta',        avatar: A('avatars/mentor-justin.jpg')    },
  { name: 'Alexander Ng',     title: 'Product Designer · Amazon',   avatar: A('avatars/mentor-alex.jpg')      },
  { name: 'Kimberly Revilla', title: 'Sr Product Designer · Apple', avatar: A('avatars/mentor-kimberly.jpg')  },
  { name: 'Priya Patel',      title: 'Design Lead · Stripe',        avatar: A('avatars/mentor-a.jpg')         },
  { name: 'Noah Brooks',      title: 'Staff Designer · Notion',     avatar: A('avatars/mentor-b.jpg')         },
]

export function SearchScreen({ onPick, onBack }) {
  const [q, setQ] = useState('')
  const results = q.trim().length
    ? SEARCH_SEED.filter(p => (p.name + p.title).toLowerCase().includes(q.toLowerCase()))
    : SEARCH_SEED.slice(0, 3)
  return (
    <div style={{ width: '100%', height: '100%', background: C.ink, color: C.cream, position: 'relative' }}>
      <StatusBar dark />
      <div style={{ paddingTop: 60, paddingLeft: 20, paddingRight: 20 }}>
        <div onClick={onBack} style={{ color: C.green, cursor: 'pointer', marginBottom: 12 }}>{I.back}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10,
                      height: 48, padding: '0 16px', borderRadius: 12, background: C.ink2,
                      color: C.gray500 }}>
          <span style={{ display: 'flex', color: C.green }}>{I.search}</span>
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search mentors, skills, companies"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent',
                     color: C.cream, fontFamily: 'Urbanist', fontWeight: 500, fontSize: 14 }}
          />
          {q && <span onClick={() => setQ('')} style={{ cursor: 'pointer', color: C.cream }}>{I.x}</span>}
        </div>
        {!q && (
          <div style={{ marginTop: 22 }}>
            <div style={{ fontFamily: 'Urbanist', fontSize: 12, color: C.cream, opacity: .55, letterSpacing: '.08em', textTransform: 'uppercase' }}>Trending searches</div>
            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Resume review', 'Long-term mentorship', 'FAANG interviews', 'Portfolio critique', 'Career switch'].map(c => (
                <div key={c} onClick={() => setQ(c)} style={{
                  padding: '8px 14px', borderRadius: 999, border: '1px solid rgba(255,249,230,.15)',
                  fontFamily: 'Urbanist', fontWeight: 500, fontSize: 13, cursor: 'pointer',
                }}>{c}</div>
              ))}
            </div>
          </div>
        )}
        <div style={{ marginTop: 22, fontFamily: 'Urbanist', fontSize: 12, color: C.cream, opacity: .55, letterSpacing: '.08em', textTransform: 'uppercase' }}>
          {q ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Recommended'}
        </div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column' }}>
          {results.map((r, i) => (
            <div key={r.name} onClick={() => onPick(r)} style={{
              padding: '12px 0', display: 'flex', gap: 12, alignItems: 'center',
              borderBottom: i < results.length - 1 ? '1px solid rgba(255,249,230,.06)' : 'none',
              cursor: 'pointer',
            }}>
              <img src={r.avatar} width="42" height="42" style={{ borderRadius: 999, objectFit: 'cover' }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 15, color: C.cream }}>{r.name}</div>
                <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: C.cream, opacity: .7 }}>{r.title}</div>
              </div>
              <span style={{ color: C.green, transform: 'rotate(180deg)' }}>{I.back}</span>
            </div>
          ))}
        </div>
      </div>
      <HomeIndicator dark />
    </div>
  )
}

// ── Schedule screen ───────────────────────────────────────────────────────────
const DAYS  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const SLOTS = ['9:00 am', '9:30 am', '10:00 am', '11:00 am', '1:30 pm', '2:30 pm', '3:00 pm', '4:30 pm']

export function ScheduleScreen({ mentor, onBack, onConfirm }) {
  const [day,   setDay]   = useState(3)
  const [slot,  setSlot]  = useState(5)
  const [topic, setTopic] = useState('Resume Review')
  if (!mentor) return null
  const topics = ['Resume Review', 'Portfolio Critique', 'Career Advice', 'Interview Prep']
  return (
    <div style={{ width: '100%', height: '100%', background: C.ink, color: C.cream, position: 'relative' }}>
      <StatusBar dark />
      <div style={{ paddingTop: 60, paddingLeft: 20, paddingRight: 20, height: '100%', overflow: 'hidden' }}>
        <div onClick={onBack} style={{ color: C.green, cursor: 'pointer' }}>{I.back}</div>
        <div style={{ marginTop: 16, fontFamily: 'Urbanist', fontWeight: 700, fontSize: 22 }}>Pick a time</div>
        <div style={{ marginTop: 2, fontFamily: 'Urbanist', fontSize: 13, color: C.cream, opacity: .6 }}>with {mentor.name}</div>

        <div style={{ marginTop: 20, display: 'flex', gap: 6 }}>
          {DAYS.map((d, i) => {
            const on = i === day
            return (
              <div key={d} onClick={() => setDay(i)} style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 0',
                background: on ? C.green : 'rgba(255,249,230,.06)',
                color: on ? C.ink : C.cream, borderRadius: 12, cursor: 'pointer',
                border: on ? 'none' : '1px solid rgba(255,249,230,.08)',
              }}>
                <div style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 11, opacity: .75 }}>{d}</div>
                <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 17 }}>{18 + i}</div>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: 24, fontFamily: 'Urbanist', fontSize: 12, color: C.cream, opacity: .55, letterSpacing: '.08em', textTransform: 'uppercase' }}>Available times</div>
        <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {SLOTS.map((t, i) => {
            const on = i === slot
            return (
              <div key={t} onClick={() => setSlot(i)} style={{
                padding: '12px 14px', borderRadius: 10,
                background: on ? C.green : 'rgba(255,249,230,.06)',
                color: on ? C.ink : C.cream,
                border: on ? 'none' : '1px solid rgba(255,249,230,.1)',
                fontFamily: 'Urbanist', fontWeight: on ? 700 : 500, fontSize: 14,
                textAlign: 'center', cursor: 'pointer',
              }}>{t}</div>
            )
          })}
        </div>

        <div style={{ marginTop: 24, fontFamily: 'Urbanist', fontSize: 12, color: C.cream, opacity: .55, letterSpacing: '.08em', textTransform: 'uppercase' }}>Topic</div>
        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {topics.map(t => (
            <div key={t} onClick={() => setTopic(t)} style={{
              padding: '8px 14px', borderRadius: 999,
              background: topic === t ? C.cream : 'transparent',
              color: topic === t ? C.ink : C.cream,
              border: `1px solid ${topic === t ? C.cream : 'rgba(255,249,230,.2)'}`,
              fontFamily: 'Urbanist', fontWeight: 500, fontSize: 13, cursor: 'pointer',
            }}>{t}</div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 70 }}>
        <Btn variant="primaryInter" style={{ width: '100%' }} onClick={() => onConfirm({ day: DAYS[day], date: 18 + day, slot: SLOTS[slot], topic })}>
          Confirm booking · {SLOTS[slot]}
        </Btn>
      </div>
      <HomeIndicator dark />
    </div>
  )
}

// ── Booking confirmation ──────────────────────────────────────────────────────
export function BookedScreen({ mentor, booking, onHome, onSeeBookings, onCompleteSession }) {
  if (!mentor || !booking) return null
  return (
    <div style={{ width: '100%', height: '100%', background: C.ink, color: C.cream, position: 'relative' }}>
      <StatusBar dark />
      <div style={{ paddingTop: 72, paddingLeft: 20, paddingRight: 20, textAlign: 'center' }}>
        <div style={{ margin: '0 auto', width: 96, height: 96, borderRadius: '50%', background: C.green, color: C.ink,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      animation: 'sproutPop .5s cubic-bezier(.2,1.3,.3,1)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5 11-11"/></svg>
        </div>
        <div style={{ marginTop: 24, fontFamily: 'Urbanist', fontWeight: 700, fontSize: 26, letterSpacing: -.5 }}>You're booked!</div>
        <div style={{ marginTop: 6, fontFamily: 'Urbanist', fontSize: 14, color: C.cream, opacity: .65, lineHeight: 1.5, maxWidth: 300, margin: '6px auto 0' }}>
          We sent the invite to your inbox and added it to your calendar.
        </div>

        <div style={{ marginTop: 28, textAlign: 'left', background: 'rgba(255,249,230,.08)', borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <img src={mentor.avatar} width="46" height="46" style={{ borderRadius: 999, objectFit: 'cover' }}/>
            <div>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16 }}>{mentor.name}</div>
              <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: C.cream, opacity: .7 }}>{mentor.title}</div>
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 12 }}>
            <div>
              <div style={{ fontFamily: 'Urbanist', fontSize: 11, color: C.cream, opacity: .5, letterSpacing: '.08em', textTransform: 'uppercase' }}>When</div>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 15, marginTop: 2 }}>{booking.day} Apr {booking.date}</div>
              <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: C.cream, opacity: .8 }}>{booking.slot}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'Urbanist', fontSize: 11, color: C.cream, opacity: .5, letterSpacing: '.08em', textTransform: 'uppercase' }}>Topic</div>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 15, marginTop: 2 }}>{booking.topic}</div>
              <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: C.cream, opacity: .8 }}>30 min · Video</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18, marginLeft: 20, marginRight: 20, padding: 14, borderRadius: 14, background: 'rgba(185,255,111,.08)', border: '1px solid rgba(185,255,111,.2)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flexShrink: 0, animation: 'sproutLeaf 2.4s ease-in-out infinite' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#B9FF6F">
            <path d="M12 2 C 8 6 8 12 12 14 C 16 12 16 6 12 2 Z"/>
            <path d="M12 14 Q 10 19 5 20 Q 9 22 12 22 Q 15 22 19 20 Q 14 19 12 14 Z" opacity=".7"/>
          </svg>
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 13, color: '#B9FF6F' }}>Your plant will grow after this session</div>
          <div style={{ marginTop: 2, fontFamily: 'Urbanist', fontSize: 12, color: C.cream, opacity: .65, lineHeight: 1.4 }}>Watch it sprout in your garden when you complete the meeting.</div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 70, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {onCompleteSession && (
          <Btn variant="primaryInter" style={{ width: '100%' }} onClick={onCompleteSession}>
            ✨ Complete session (demo)
          </Btn>
        )}
        <Btn variant={onCompleteSession ? 'ghost' : 'primaryInter'} style={{ width: '100%', color: onCompleteSession ? C.cream : undefined }} onClick={onSeeBookings}>See my bookings</Btn>
        <Btn variant="ghost" style={{ width: '100%', color: C.cream }} onClick={onHome}>Back to home</Btn>
      </div>
      <style>{`
        @keyframes sproutPop  { 0%{transform:scale(0)} 100%{transform:scale(1)} }
        @keyframes sproutLeaf { 0%,100% { transform: rotate(-4deg) translateY(0) } 50% { transform: rotate(4deg) translateY(-2px) } }
      `}</style>
      <HomeIndicator dark />
    </div>
  )
}
