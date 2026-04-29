import { useState, useEffect, useRef } from 'react'
import { C, Btn, A } from '../atoms.jsx'
import { StatusBar, HomeIndicator } from '../Phone.jsx'

const MENTORS = [
  { src: A('avatars/mentor-kimberly.jpg'), label: '2 weeks'  },
  { src: A('avatars/mentor-alex.jpg'),     label: '3 months' },
  { src: A('avatars/mentor-justin.jpg'),   label: '1 year'   },
]

const G  = '#B9FF6F'
const Gm = '#99E860'
const Gl = '#D4FF9F'
const CX = 90   // stem center-x in the 180-wide viewBox

const CSS = `
  @keyframes stemDraw {
    from { stroke-dashoffset: 280; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes leafIn {
    from { transform: scale(0.12) rotate(-35deg); opacity: 0; }
    to   { transform: scale(1)    rotate(0deg);   opacity: 1; }
  }
  @keyframes leafInR {
    from { transform: scale(0.12) rotate(35deg); opacity: 0; }
    to   { transform: scale(1)    rotate(0deg);  opacity: 1; }
  }
  @keyframes bloomIn {
    0%   { transform: scale(0.2)  rotate(-80deg); opacity: 0; }
    70%  { transform: scale(1.12) rotate(6deg);   opacity: 1; }
    100% { transform: scale(1)    rotate(0deg);   opacity: 1; }
  }
  .sprout-cta {
    transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1);
  }
  .sprout-cta:active {
    transform: scale(0.97);
  }
  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
  @keyframes ctaShimmer {
    0%   { transform: translateX(-120%) skewX(-15deg); }
    100% { transform: translateX(260%) skewX(-15deg); }
  }
  @keyframes ctaGlow {
    0%, 100% { box-shadow: 0 10px 28px rgba(185,255,111,.22); }
    50%       { box-shadow: 0 10px 36px rgba(185,255,111,.42); }
  }
  @keyframes ctaFloat {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }
  @keyframes sway {
    0%   { transform: rotate(0deg);    }
    25%  { transform: rotate(2.5deg);  }
    75%  { transform: rotate(-2.5deg); }
    100% { transform: rotate(0deg);    }
  }
  @keyframes glowPulse {
    0%, 100% { opacity: .18; }
    50%      { opacity: .34; }
  }
  @keyframes avatarIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`

// [ly, w, h, leftColor, rightColor, delay]
const LEAVES = [
  [226, 16, 12, G,  Gm, 0.85],
  [204, 24, 17, Gm, G,  1.28],
  [176, 29, 21, G,  Gl, 1.70],
  [148, 33, 24, Gm, G,  2.12],
]

// .48 (vs .36 before) makes the leaf wider at its midpoint — rounder, cuter shape
function lL(ly, w, h) {
  return `M${CX},${ly} Q${CX-6},${ly-h} ${CX-w},${ly-h*.48} Q${CX-w+1},${ly+2} ${CX},${ly}Z`
}
function lR(ly, w, h) {
  return `M${CX},${ly} Q${CX+6},${ly-h} ${CX+w},${ly-h*.48} Q${CX+w-1},${ly+2} ${CX},${ly}Z`
}

const GROWTH_STORY = [
  { stage: 0.0,  label: 'A seed is planted',   delay: 900  },
  { stage: 0.18, label: 'Session 1',            delay: 1000 },
  { stage: 0.40, label: 'Session 2',            delay: 1000 },
  { stage: 0.62, label: 'Session 3',            delay: 1000 },
  { stage: 0.82, label: 'Session 4',            delay: 900  },
  { stage: 0.96, label: '1 year together',      delay: 99999 },
]

function HeroPlant() {
  const [storyIdx, setStoryIdx] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    const advance = (i) => {
      if (i >= GROWTH_STORY.length - 1) return
      timerRef.current = setTimeout(() => {
        setStoryIdx(i + 1)
        advance(i + 1)
      }, GROWTH_STORY[i].delay)
    }
    advance(0)
    return () => clearTimeout(timerRef.current)
  }, [])

  const current  = GROWTH_STORY[storyIdx]
  const isFinal  = storyIdx === GROWTH_STORY.length - 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* Fixed-height container — no layout shift as plant grows */}
      <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                    animation: 'sway 4s ease-in-out 6s infinite', transformOrigin: 'center bottom' }}>
        <div style={{ transform: 'scale(1.9)', transformOrigin: 'center bottom' }}>
          <Plant stage={current.stage} />
        </div>
      </div>

      {/* Growth label — key remounts on each stage for fade-up */}
      <div key={storyIdx} style={{ marginTop: 14, textAlign: 'center',
                                    animation: 'avatarIn .35s cubic-bezier(0.23,1,0.32,1) both' }}>
        <div style={{ fontFamily: 'Urbanist', fontWeight: 600, fontSize: 12,
                      letterSpacing: '.12em', textTransform: 'uppercase',
                      color: G, opacity: isFinal ? .9 : .55 }}>
          {current.label}
        </div>
      </div>

      {/* Mentor avatar — fades in on final stage */}
      <div style={{
        marginTop: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        opacity: isFinal ? 1 : 0, transition: 'opacity 300ms ease-out',
      }}>
        <img src={MENTORS[0].src} width="52" height="52" style={{
          borderRadius: 999, objectFit: 'cover',
          border: `2.5px solid ${G}`,
          boxShadow: `0 0 0 5px rgba(185,255,111,.16), 0 8px 22px rgba(0,0,0,.6)`,
        }}/>
        <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 13, color: '#FFF9E6' }}>
          Kimberly R.
        </div>
      </div>
    </div>
  )
}

export function LandingScreenDynamic({ onNext }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#0d0d0d', color: '#FFF9E6',
                  position: 'relative', overflow: 'hidden',
                  display: 'flex', flexDirection: 'column' }}>
      <style>{CSS}</style>
      <StatusBar dark />

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(500px 400px at 50% 70%, rgba(185,255,111,.07), transparent 70%)' }}/>

      {/* Logo + heading */}
      <div style={{ marginTop: 120, padding: '0 28px', textAlign: 'center' }}>
        <img src={A('logos/sprout-logo.png')} alt="Sprout" style={{ height: 48, width: 'auto' }}/>
        <div style={{ marginTop: 6, fontFamily: 'Urbanist', fontWeight: 500, fontSize: 18,
                      letterSpacing: -.1, color: '#FFF9E6', opacity: .6, lineHeight: 1.4 }}>
          Mentorships that grow with you
        </div>
      </div>

      {/* Hero — plant + mentor row, centered in remaining space */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <HeroPlant />
      </div>

      {/* CTA */}
      <div style={{ padding: '0 24px 48px', animation: 'ctaFloat 2.8s ease-in-out 3.8s infinite' }}>
        <button className="sprout-cta" onClick={onNext} style={{
          width: '100%', height: 56, border: 'none', cursor: 'pointer',
          background: G, color: '#121212', borderRadius: 14,
          fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, letterSpacing: -.2,
          animation: 'ctaGlow 2.8s ease-in-out 3.8s infinite',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, bottom: 0, width: '40%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.28), transparent)',
            animation: 'ctaShimmer 3.2s ease-in-out 4s infinite',
            pointerEvents: 'none',
          }}/>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
               style={{ animation: 'sway 4s ease-in-out 4s infinite', transformOrigin: 'center bottom' }}>
            <path d="M12 22V12M12 12C12 12 6 10 5 4c4 1 7 5 7 8zM12 12c0 0 6-2 7-8-4 1-7 5-7 8z"/>
          </svg>
          Sign up
        </button>
        <div style={{ marginTop: 18, textAlign: 'center', fontFamily: 'Urbanist', fontSize: 14,
                      color: '#FFF9E6', opacity: .7 }}>
          Already have an account?{' '}
          <span onClick={onNext} style={{ color: G, fontWeight: 600, cursor: 'pointer' }}>Log in</span>
        </div>
      </div>
      <HomeIndicator dark />
    </div>
  )
}

export function SplashScreen({ onNext }) {
  useEffect(() => {
    const t = setTimeout(onNext, 2200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', background: '#0d0d0d', color: '#FFF9E6',
                  position: 'relative', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar dark />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(480px 480px at 50% 46%, rgba(185,255,111,.13), transparent 65%)' }}/>
      <svg width="120" height="120" viewBox="0 0 110 110" fill="none">
        <ellipse cx="55" cy="88" rx="42" ry="10" fill="#3b2a1a"/>
        <path d="M15 88 Q55 68 95 88 Q85 96 55 96 Q25 96 15 88Z" fill="#5c3f24"/>
        <path d="M55 88 Q55 72 55 58" stroke={G} strokeWidth="3" strokeLinecap="round"/>
        <path d="M55 68 Q40 62 36 50 Q48 52 55 62Z" fill={G}/>
        <path d="M55 64 Q70 58 74 46 Q62 48 55 58Z" fill={G} opacity=".85"/>
      </svg>
      <div style={{ marginTop: 20, fontFamily: 'Urbanist', fontWeight: 800, fontSize: 28,
                    letterSpacing: -.5, color: '#FFF9E6' }}>Sprout</div>
      <div style={{ position: 'absolute', bottom: 48, display: 'flex', gap: 6 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: i === 0 ? 20 : 6, height: 6, borderRadius: 999,
            background: i === 0 ? G : 'rgba(185,255,111,.25)',
          }}/>
        ))}
      </div>
      <HomeIndicator dark />
    </div>
  )
}

export function WelcomeScreen({ onNext }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#0d0d0d', color: '#FFF9E6',
                  position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes soilIn {
          from { opacity: 0; transform: scaleX(0.2); }
          to   { opacity: 1; transform: scaleX(1); }
        }
        @keyframes stemDraw {
          from { stroke-dashoffset: 44; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes leafIn {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes ctaShimmer {
          0%   { transform: translateX(-120%) skewX(-15deg); }
          100% { transform: translateX(260%) skewX(-15deg); }
        }
      `}</style>
      <StatusBar dark />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(520px 400px at 50% 30%, rgba(185,255,111,.13), transparent 65%)' }}/>

      {/* Centered content zone */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', padding: '0 32px' }}>

      {/* Animated seedling */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg width="160" height="120" viewBox="0 0 160 120" fill="none">
          {/* Ground glow */}
          <ellipse cx="80" cy="100" rx="56" ry="12" fill="rgba(185,255,111,.07)"
            style={{ animation: 'soilIn .5s cubic-bezier(0.23,1,0.32,1) .05s both',
                     transformOrigin: '80px 100px' }}/>
          {/* Soil shadow */}
          <ellipse cx="80" cy="104" rx="50" ry="11" fill="#1a0d05"
            style={{ animation: 'soilIn .5s cubic-bezier(0.23,1,0.32,1) .1s both',
                     transformOrigin: '80px 104px' }}/>
          {/* Soil surface */}
          <ellipse cx="80" cy="99" rx="44" ry="10" fill="#6b4a28"
            style={{ animation: 'soilIn .5s cubic-bezier(0.23,1,0.32,1) .15s both',
                     transformOrigin: '80px 99px' }}/>
          {/* Stem */}
          <line x1="80" y1="97" x2="80" y2="53"
                stroke={G} strokeWidth="4" strokeLinecap="round"
                strokeDasharray="46" strokeDashoffset="46"
                style={{ animation: 'stemDraw .65s cubic-bezier(0.23,1,0.32,1) .5s both' }}/>
          {/* Left leaf */}
          <path d="M80 63 Q58 54 44 40 Q60 37 78 58 Q79 61 80 63Z"
                fill="#8de042"
                style={{ animation: 'leafIn .5s cubic-bezier(0.23,1,0.32,1) 1.05s both',
                         transformBox: 'fill-box', transformOrigin: 'right bottom' }}/>
          {/* Right leaf */}
          <path d="M80 63 Q102 54 116 40 Q100 37 82 58 Q81 61 80 63Z"
                fill={G}
                style={{ animation: 'leafIn .5s cubic-bezier(0.23,1,0.32,1) 1.15s both',
                         transformBox: 'fill-box', transformOrigin: 'left bottom' }}/>
        </svg>
      </div>

      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <div style={{ fontFamily: 'Urbanist', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase',
                      fontWeight: 600, color: G, opacity: .9 }}>Welcome to Sprout</div>
        <div style={{ marginTop: 14, fontFamily: 'Urbanist', fontWeight: 700, fontSize: 32,
                      letterSpacing: -.6, lineHeight: 1.1, color: '#FFF9E6' }}>Let's get you started</div>
      </div>

      </div>{/* end centered zone */}
      <div style={{ padding: '0 24px 48px' }}>
        <button onClick={onNext} style={{
          width: '100%', height: 56, border: 'none', cursor: 'pointer',
          background: G, color: '#121212', borderRadius: 14,
          fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, letterSpacing: -.2,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 10px 28px rgba(185,255,111,.22)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, bottom: 0, width: '40%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.28), transparent)',
            animation: 'ctaShimmer 3.2s ease-in-out 1.8s infinite',
            pointerEvents: 'none',
          }}/>
          Begin
        </button>
      </div>
      <HomeIndicator dark />
    </div>
  )
}

const HIW_CSS = `
  @keyframes hiwFadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hiw-skip { transition: opacity 120ms ease-out; }
  .hiw-skip:active { opacity: 0.5; }
  .hiw-cta { transition: transform 160ms cubic-bezier(0.23,1,0.32,1); }
  .hiw-cta:active { transform: scale(0.97); }
  .hiw-step { cursor: pointer; border-radius: 12px; transition: background 150ms ease; }
  .hiw-step:hover { background: rgba(185,255,111,.04); }
  .hiw-step:active { background: rgba(185,255,111,.08); }
`

const HIW_STEPS = [
  {
    title: 'Answer 4 quick questions',
    body: 'Tell us your goals and learning style so we can match you with the right mentor.',
  },
  {
    title: 'Book your first session',
    body: 'Booking a session plants a seed in your garden.',
  },
  {
    title: 'Complete sessions to grow',
    body: 'Every session you finish grows your plant. Hit more goals, unlock more growth.',
  },
]

const GROWTH_STAGES = [
  { plantStage: 0.0,  label: 'No garden yet. Find your mentor first.' },
  { plantStage: 0.1,  label: 'Book a session → a seed appears' },
  { plantStage: 0.62, label: 'Complete sessions to grow your plant' },
]

export function HowItWorksScreen({ onNext, onSkip }) {
  const [active, setActive] = useState(0)
  const cycleRef = useRef(null)

  const goToStep = (i) => {
    clearTimeout(cycleRef.current)
    setActive(i)
    const tick = (n) => {
      cycleRef.current = setTimeout(() => {
        const next = (n + 1) % 3
        setActive(next)
        tick(next)
      }, 2800)
    }
    tick(i)
  }

  useEffect(() => {
    goToStep(0)
    return () => clearTimeout(cycleRef.current)
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', background: '#0b0b0b', color: '#FFF9E6',
                  position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <style>{HIW_CSS}</style>
      <StatusBar dark />

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(380px 380px at 18% 28%, rgba(185,255,111,.07), transparent 65%)' }}/>

      {/* Header */}
      <div style={{ padding: '72px 28px 0', zIndex: 1,
                    animation: 'hiwFadeUp .4s cubic-bezier(0.23,1,0.32,1) .04s both' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'rgba(185,255,111,.1)', border: '1px solid rgba(185,255,111,.2)',
                      borderRadius: 999, padding: '4px 10px 4px 8px' }}>
          <div style={{ width: 6, height: 6, borderRadius: 999, background: '#B9FF6F' }}/>
          <span style={{ fontFamily: 'Urbanist', fontSize: 11, fontWeight: 700,
                         color: '#B9FF6F', letterSpacing: '.1em' }}>HOW SPROUT WORKS</span>
        </div>
        <div style={{ marginTop: 14, fontFamily: 'Urbanist', fontWeight: 800, fontSize: 28,
                      letterSpacing: -.5, lineHeight: 1.1, color: '#FFF9E6', whiteSpace: 'nowrap' }}>
          Grow at your own pace
        </div>
        <div style={{ marginTop: 10, fontFamily: 'Urbanist', fontSize: 14,
                      color: '#FFF9E6', opacity: .45, lineHeight: 1.5 }}>
          Three steps to grow your garden.
        </div>
      </div>

      {/* Timeline */}
      <div style={{ padding: '28px 28px 0', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {HIW_STEPS.map((step, i) => {
          const isActive = active === i
          const isPast   = active > i
          const titleOp  = isActive ? 1   : isPast ? 0.6  : 0.28
          const bodyOp   = isActive ? 0.6 : isPast ? 0.35 : 0.18
          const numBg    = isActive ? 'rgba(185,255,111,.18)' : isPast ? 'rgba(185,255,111,.08)' : 'rgba(185,255,111,.04)'
          const numBdr   = isActive ? 'rgba(185,255,111,.7)'  : isPast ? 'rgba(185,255,111,.24)' : 'rgba(185,255,111,.12)'
          const numClr   = isActive ? '#B9FF6F' : isPast ? 'rgba(185,255,111,.55)' : 'rgba(185,255,111,.26)'
          return (
            <div key={i} className="hiw-step" onClick={() => goToStep(i)} style={{
              display: 'flex', gap: 18, padding: '12px',
              animation: `hiwFadeUp .45s cubic-bezier(0.23,1,0.32,1) ${.14 + i * .12}s both`,
            }}>
              {/* Left column: number + connector (absolute so it ignores content height) */}
              <div style={{ position: 'relative', width: 32, display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 999, flexShrink: 0,
                  background: numBg, border: `1.5px solid ${numBdr}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Urbanist', fontWeight: 800, fontSize: 13, color: numClr,
                  transition: 'background 250ms ease-out, border-color 250ms ease-out, color 250ms ease-out',
                }}>
                  {i + 1}
                </div>
                {i < 2 && (
                  <div style={{
                    position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                    top: 38, bottom: -24, width: 1.5,
                    background: 'linear-gradient(to bottom, rgba(185,255,111,.3), rgba(185,255,111,.06))',
                  }}/>
                )}
              </div>
              {/* Right column: content */}
              <div style={{ flex: 1, paddingTop: 5 }}>
                <div style={{
                  fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16,
                  letterSpacing: -.3, color: '#FFF9E6', lineHeight: 1.25,
                  opacity: titleOp, transition: 'opacity 250ms ease-out',
                }}>
                  {step.title}
                </div>
                <div style={{
                  marginTop: 5, fontFamily: 'Urbanist', fontSize: 13,
                  color: '#FFF9E6', opacity: bodyOp, lineHeight: 1.55,
                  transition: 'opacity 250ms ease-out',
                }}>
                  {step.body}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Plant card — same visual language as step circles */}
      <div style={{ padding: '20px 28px 0', zIndex: 1 }}>
        <div style={{
          borderRadius: 20,
          border: '1px solid rgba(185,255,111,.14)',
          background: 'rgba(185,255,111,.04)',
          padding: '20px 16px 16px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <div style={{ height: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <Plant stage={GROWTH_STAGES[active].plantStage} />
          </div>
          <div key={active} style={{ marginTop: 12, textAlign: 'center',
                                      animation: 'hiwFadeUp .32s cubic-bezier(0.23,1,0.32,1) both' }}>
            <div style={{ fontFamily: 'Urbanist', fontWeight: 600, fontSize: 13,
                          color: '#FFF9E6', opacity: .6 }}>
              {GROWTH_STAGES[active].label}
            </div>
          </div>
          {/* Step dots inside the card */}
          <div style={{ display: 'flex', gap: 5, marginTop: 14 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                height: 3, borderRadius: 999,
                width: i === active ? 18 : 6,
                background: i <= active ? '#B9FF6F' : 'rgba(185,255,111,.2)',
                transition: 'width 250ms cubic-bezier(0.23,1,0.32,1), background 250ms ease-out',
              }}/>
            ))}
          </div>
        </div>
      </div>

      {/* CTA + Skip */}
      <div style={{ marginTop: 'auto', padding: '16px 24px 40px', zIndex: 1,
                    animation: 'hiwFadeUp .45s cubic-bezier(0.23,1,0.32,1) .42s both' }}>
        <button className="hiw-cta" onClick={onNext} style={{
          width: '100%', height: 56, border: 'none', cursor: 'pointer',
          background: '#B9FF6F', color: '#121212', borderRadius: 14,
          fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, letterSpacing: -.2,
          boxShadow: '0 10px 28px rgba(185,255,111,.22)',
        }}>
          Get started
        </button>
        <div style={{ marginTop: 18, textAlign: 'center' }}>
          <span className="hiw-skip" onClick={onSkip} style={{
            fontFamily: 'Urbanist', fontSize: 14, fontWeight: 600,
            color: '#FFF9E6', opacity: .38, cursor: 'pointer',
          }}>Skip for now</span>
        </div>
      </div>
      <HomeIndicator dark />
    </div>
  )
}

// Exported for GardenScreens and other consumers
export function Plant({ stage = 0.5, wind = 0 }) {
  const s     = Math.max(0, Math.min(1, stage))
  const by    = 96
  const cx    = 32
  const stemH = Math.round(14 + s * 72)
  const ty    = by - stemH
  const lp    = [
    { thr: 0.08, yf: 0.84, lc: G,  rc: Gm },
    { thr: 0.30, yf: 0.62, lc: Gm, rc: G  },
    { thr: 0.50, yf: 0.40, lc: G,  rc: Gl },
    { thr: 0.68, yf: 0.22, lc: Gm, rc: G  },
  ]
  const clipTop = Math.max(0, ty - 14)
  const svgH   = 110 - clipTop
  return (
    <svg width="64" height={svgH} viewBox={`0 ${clipTop} 64 ${svgH}`} style={{ display: 'block' }}>
      <ellipse cx={cx} cy={by+7} rx="20" ry="6"   fill="#3d2b18"/>
      <ellipse cx={cx} cy={by+4} rx="15" ry="3.5" fill="#5a3f25"/>
      <g style={{ transformOrigin: `${cx}px ${by}px`, transform: `rotate(${wind}deg)`, transition: 'transform .3s ease' }}>
        <path d={`M${cx} ${by} C${cx-3} ${by-stemH*.38} ${cx+3} ${by-stemH*.65} ${cx} ${ty}`}
              stroke={G} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {lp.map(({ thr, yf, lc, rc }, i) => {
          const op = s > thr ? Math.min(1, (s - thr) / 0.12) : 0
          if (op <= 0) return null
          const ly = by - stemH * yf
          const w  = 11 + i * 3.5
          const h  = 8  + i * 2
          return (
            <g key={i} opacity={op} style={{ transition: 'opacity .35s' }}>
              <path d={`M${cx} ${ly} Q${cx-6} ${ly-h} ${cx-w} ${ly-h*.35} Q${cx-w+1} ${ly+2} ${cx} ${ly}Z`} fill={lc}/>
              <path d={`M${cx} ${ly} Q${cx+6} ${ly-h} ${cx+w} ${ly-h*.35} Q${cx+w-1} ${ly+2} ${cx} ${ly}Z`} fill={rc}/>
            </g>
          )
        })}
        {s > 0.85 && (
          <g opacity={Math.min(1,(s-.85)/.12)} style={{ transition: 'opacity .4s' }}>
            {[0,60,120,180,240,300].map(deg => {
              const a = deg*Math.PI/180
              return <ellipse key={deg} cx={cx+Math.cos(a)*6} cy={ty-6+Math.sin(a)*5}
                              rx="3.5" ry="2.5" fill="#FFF9E6"
                              transform={`rotate(${deg} ${cx+Math.cos(a)*6} ${ty-6+Math.sin(a)*5})`}/>
            })}
            <circle cx={cx} cy={ty-6} r="3.5" fill={G}/>
          </g>
        )}
      </g>
    </svg>
  )
}
