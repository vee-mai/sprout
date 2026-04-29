import { useState, useRef, useEffect } from 'react'
import { C, I, Btn, Chip, Input, A } from '../atoms.jsx'
import { StatusBar, HomeIndicator } from '../Phone.jsx'

// ── Mentor data ──────────────────────────────────────────────────────────────
export const MENTORS = [
  { id: 1, name: 'Justin Levesque',  title: 'UIUX Designer at Meta',        seniority: 'Senior', industry: 'AI',      years: 6,  longterm: true,  rating: 4.9, count: 29, avatar: A('avatars/mentor-justin.jpg'),
    bio: '6 years designing AI products at Meta means I\'ve shipped features used by billions and learned which design decisions actually move the needle. I focus on helping designers think in systems, not screens. Bring your portfolio, your roadblocks, or just the question you\'re afraid to ask.' },
  { id: 2, name: 'Alex Chen',        title: 'Product Designer at Amazon',   seniority: 'Senior', industry: 'AI',      years: 3,  longterm: true,  rating: 4.9, count: 9,  avatar: A('avatars/mentor-alex.jpg'),
    bio: 'I\'m early in my own journey, which means I remember exactly what it felt like to be where you are. At Amazon I design at scale under real constraints. I\'m best for designers who want honest, peer-level feedback. No ivory tower, just what actually works.' },
  { id: 3, name: 'Kimberly Revilla', title: 'Sr Product Designer at Apple', seniority: 'Senior', industry: 'Hardware', years: 8,  longterm: false, rating: 4.8, count: 42, avatar: A('avatars/mentor-kimberly.jpg'),
    bio: '8 years at Apple in hardware taught me that great design is 20% craft and 80% conviction. I work with designers who are ready to stop second-guessing themselves: whether that\'s a portfolio that finally lands interviews, or knowing exactly what to say in the room. Direct feedback. No fluff.' },
  { id: 4, name: 'Priya Patel',      title: 'Design Lead at Stripe',         seniority: 'Lead',   industry: 'Fintech', years: 11, longterm: true,  rating: 5.0, count: 18, avatar: A('avatars/mentor-a.jpg'),
    bio: 'Leading design at Stripe means making complex financial systems feel effortless. I care deeply about craft and career. I\'ve helped a dozen designers make the jump to senior and lead. If you want someone who will hold you to a high bar and help you clear it, let\'s talk.' },
  { id: 5, name: 'Marcus B.',        title: 'Senior Designer at Google',     seniority: 'Senior', industry: 'Tech',    years: 7,  longterm: true,  rating: 4.7, count: 31, avatar: A('avatars/mentor-b.jpg'),
    bio: '7 years at Google across Search, Maps, and Material Design. I\'ve reviewed hundreds of portfolios and interviewed candidates at all levels. I know what hiring managers are actually looking for. It\'s not what most designers think. Let me save you months of guessing.' },
]

// ── Bottom nav ────────────────────────────────────────────────────────────────
const plantNavIcon = (a) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
       stroke={a ? C.green : '#FFF9E6'} strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22V13"/>
    <path d="M12 17C12 17 7 15 6 9c3 .5 6 3 6 8z" fill={a ? C.green : 'none'}/>
    <path d="M12 14C12 14 17 12 18 6c-3 .5-6 3-6 8z" fill={a ? C.green : 'none'}/>
    <path d="M5 22h14"/>
  </svg>
)

export function BottomNav({ active = 'home', onTab }) {
  const items = [
    { id: 'home',   label: 'Home',     icon: (a) => I.home(a)  },
    { id: 'chat',   label: 'Messages', icon: (a) => I.chat(a)  },
    { id: 'garden', label: 'Garden',   icon: plantNavIcon       },
    { id: 'cal',    label: 'Sessions', icon: (a) => I.cal(a)   },
    { id: 'me',     label: 'Me',       icon: (a) => I.user(a)  },
  ]
  return (
    <div style={{
      position: 'absolute', left: 16, right: 16, bottom: 24,
      background: 'rgba(16,16,16,.95)', backdropFilter: 'blur(20px)',
      borderRadius: 20, padding: '0 6px',
      border: '1px solid rgba(255,249,230,.07)',
      boxShadow: '0 -1px 0 rgba(255,249,230,.04), 0 8px 32px rgba(0,0,0,.5)',
      display: 'flex', alignItems: 'center', height: 62,
    }}>
      <style>{`.nav-tab{transition:opacity 160ms,transform 110ms cubic-bezier(.23,1,.32,1)}.nav-tab:active{transform:scale(.87)}`}</style>
      {items.map(it => {
        const a = active === it.id
        return (
          <div key={it.id} className="nav-tab" onClick={() => onTab?.(it.id)} style={{
            flex: 1, height: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 4,
            cursor: 'pointer',
          }}>
            <div style={{ opacity: a ? 1 : 0.35, transition: 'opacity 160ms' }}>
              {it.icon(a)}
            </div>
            <span style={{
              fontFamily: 'Urbanist', fontSize: 11, fontWeight: a ? 700 : 400,
              letterSpacing: '.02em',
              color: a ? C.green : 'rgba(255,249,230,.35)',
              transition: 'color 160ms',
            }}>{it.label}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── Sign In ───────────────────────────────────────────────────────────────────
const SIGNIN_CSS = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .signin-social {
    transition: transform 140ms cubic-bezier(0.23,1,0.32,1), background 140ms;
  }
  .signin-social:active { transform: scale(0.97); }
  .signin-cta {
    transition: transform 160ms cubic-bezier(0.23,1,0.32,1);
  }
  .signin-cta:active { transform: scale(0.97); }
`

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFF9E6">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.29.07 2.18.71 2.93.74.96-.19 1.88-.76 2.88-.7 1.22.06 2.14.54 2.74 1.4-2.52 1.54-1.85 4.73.35 5.82-.42 1.16-.94 2.3-1.9 3.62zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
)

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const FIELD = {
  display: 'flex', alignItems: 'center', gap: 12,
  height: 54, padding: '0 18px', borderRadius: 14,
  background: 'rgba(255,249,230,.06)', border: '1px solid rgba(255,249,230,.1)',
}
const INPUT = {
  flex: 1, border: 'none', outline: 'none', background: 'transparent',
  fontFamily: 'Urbanist', fontWeight: 500, fontSize: 16,
  color: '#FFF9E6', letterSpacing: '-.02em',
}
const ICON_COL = { color: 'rgba(255,249,230,.4)', display: 'flex' }

function BackChevron({ onClick }) {
  return (
    <div style={{ padding: '62px 22px 0' }}>
      <div onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center',
        cursor: 'pointer', opacity: .55, padding: '4px 2px' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </div>
    </div>
  )
}

function StepLabel({ n, total = 2 }) {
  return (
    <div style={{ fontFamily: 'Urbanist', fontSize: 11, fontWeight: 700,
                  letterSpacing: '.14em', textTransform: 'uppercase',
                  color: C.green, marginBottom: 10 }}>
      Step {n} of {total}
    </div>
  )
}

export function SignInScreen({ onNext, onBack }) {
  const [step,     setStep]     = useState(1)
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [otp,      setOtp]      = useState(Array(6).fill(''))

  // OTP refs — always declared, never conditional
  const r0=useRef(),r1=useRef(),r2=useRef(),r3=useRef(),r4=useRef(),r5=useRef()
  const otpRefs = [r0,r1,r2,r3,r4,r5]

  function handleOtp(i, val) {
    const v = val.replace(/\D/g,'').slice(-1)
    const next = [...otp]; next[i] = v; setOtp(next)
    if (v && i < 5) otpRefs[i+1].current?.focus()
  }
  function handleOtpKey(i, e) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs[i-1].current?.focus()
  }

  const glow = { position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'radial-gradient(480px 400px at 50% 65%, rgba(185,255,111,.06), transparent 70%)' }
  const base = { width:'100%', height:'100%', background:'#0d0d0d', color:'#FFF9E6',
                 position:'relative', display:'flex', flexDirection:'column' }
  const socialBtn = {
    width:'100%', height:54, border:'1px solid rgba(255,249,230,.12)', cursor:'pointer',
    background:'rgba(255,249,230,.05)', borderRadius:14,
    display:'flex', alignItems:'center', justifyContent:'center', gap:10,
    fontFamily:'Urbanist', fontWeight:600, fontSize:15, color:'#FFF9E6',
  }

  // ── Step 2: Verify email ────────────────────────────────────────────────────
  if (step === 2) {
    const allFilled = otp.every(d => d !== '')
    return (
      <div style={base}>
        <style>{SIGNIN_CSS}</style>
        <StatusBar dark />
        <div style={glow}/>
        <BackChevron onClick={() => setStep(1)} />
        <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'20px 24px 0',
                      animation:'fadeUp .35s ease-out both' }}>
          <StepLabel n={2} />
          <div style={{ fontFamily:'Urbanist', fontWeight:700, fontSize:28,
                        letterSpacing:-.6, lineHeight:1.1, marginBottom:12 }}>
            Check your email
          </div>
          <div style={{ fontFamily:'Urbanist', fontSize:14, color:'rgba(255,249,230,.55)', lineHeight:1.6 }}>
            We sent a 6-digit code to{' '}
            <span style={{ color:'#FFF9E6', fontWeight:600 }}>{email || 'your email'}</span>.
            {' '}Enter it below.
          </div>

          {/* OTP boxes */}
          <div style={{ display:'flex', gap:8, marginTop:32 }}>
            {otp.map((digit, i) => (
              <input key={i} ref={otpRefs[i]}
                type="text" inputMode="numeric" maxLength={1} value={digit}
                onChange={e => handleOtp(i, e.target.value)}
                onKeyDown={e => handleOtpKey(i, e)}
                style={{
                  flex:'1 1 0', minWidth:0, height:58, borderRadius:12, outline:'none', cursor:'text',
                  border: `1px solid ${digit ? C.green : 'rgba(255,249,230,.12)'}`,
                  background: digit ? 'rgba(185,255,111,.08)' : 'rgba(255,249,230,.05)',
                  textAlign:'center', fontFamily:'Urbanist', fontWeight:700,
                  fontSize:22, color:'#FFF9E6',
                  transition:'border-color 150ms, background 150ms',
                }}
              />
            ))}
          </div>

          <div style={{ marginTop:36, textAlign:'center', fontFamily:'Urbanist',
                        display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:13, color:'rgba(255,249,230,.42)' }}>Didn't get it?</span>
            <span style={{ fontSize:14, color:C.green, fontWeight:600, cursor:'pointer' }}>Resend code</span>
          </div>
        </div>

        <div style={{ padding:'16px 24px 44px' }}>
          <button className="signin-cta" onClick={() => onNext(name)} style={{
            width:'100%', height:56, border:'none', cursor:'pointer', borderRadius:14,
            background: allFilled ? C.green : 'rgba(185,255,111,.3)',
            color:'#121212', fontFamily:'Urbanist', fontWeight:700, fontSize:16, letterSpacing:-.2,
            transition:'background 200ms',
          }}>
            Verify &amp; continue
          </button>
        </div>
        <HomeIndicator dark />
      </div>
    )
  }

  // ── Step 1: Create account ──────────────────────────────────────────────────
  return (
    <div style={base}>
      <style>{SIGNIN_CSS}</style>
      <StatusBar dark />
      <div style={glow}/>
      <BackChevron onClick={onBack} />

      <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'20px 24px 0',
                    animation:'fadeUp .35s ease-out both' }}>
        <StepLabel n={1} />
        <div style={{ marginBottom:28 }}>
          <div style={{ fontFamily:'Urbanist', fontWeight:700, fontSize:28,
                        letterSpacing:-.6, lineHeight:1.1 }}>
            Create your account
          </div>
          <div style={{ marginTop:8, fontFamily:'Urbanist', fontSize:14,
                        color:'rgba(255,249,230,.5)', lineHeight:1.5 }}>
            We'll use this to save your progress.
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {/* Name */}
          <label style={FIELD}>
            <span style={ICON_COL}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </span>
            <input type="text" placeholder="Your name" value={name}
              onChange={e => setName(e.target.value)} style={INPUT}/>
          </label>
          {/* Email */}
          <label style={FIELD}>
            <span style={ICON_COL}>{I.mail}</span>
            <input type="email" placeholder="Email address" value={email}
              onChange={e => setEmail(e.target.value)} style={INPUT}/>
          </label>
          {/* Password */}
          <label style={FIELD}>
            <span style={ICON_COL}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </span>
            <input type="password" placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)} style={INPUT}/>
          </label>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:14, margin:'4px 0' }}>
            <div style={{ flex:1, height:1, background:'rgba(255,249,230,.1)' }}/>
            <span style={{ fontFamily:'Urbanist', fontSize:13, color:'rgba(255,249,230,.4)' }}>or</span>
            <div style={{ flex:1, height:1, background:'rgba(255,249,230,.1)' }}/>
          </div>

          {/* Google */}
          <button className="signin-social" onClick={() => onNext(name || 'User')} style={socialBtn}>
            <GoogleIcon /> Continue with Google
          </button>
          {/* LinkedIn */}
          <button className="signin-social" onClick={() => onNext(name || 'User')} style={socialBtn}>
            <LinkedInIcon /> Continue with LinkedIn
          </button>
        </div>
      </div>

      {/* Bottom CTA + Terms */}
      <div style={{ padding:'16px 24px 40px' }}>
        <button className="signin-cta" onClick={() => setStep(2)} style={{
          width:'100%', height:56, border:'none', cursor:'pointer',
          background:C.green, color:'#121212', borderRadius:14,
          fontFamily:'Urbanist', fontWeight:700, fontSize:16, letterSpacing:-.2,
          boxShadow:'0 10px 28px rgba(185,255,111,.2)',
        }}>
          Continue
        </button>
        <div style={{ marginTop:14, textAlign:'center', fontFamily:'Urbanist',
                      fontSize:12, color:'rgba(255,249,230,.28)', lineHeight:1.6 }}>
          By continuing you agree to our{' '}
          <span style={{ color:'rgba(255,249,230,.5)', textDecoration:'underline', cursor:'pointer' }}>Terms</span>
          {' & '}
          <span style={{ color:'rgba(255,249,230,.5)', textDecoration:'underline', cursor:'pointer' }}>Privacy Policy</span>.
        </div>
      </div>
      <HomeIndicator dark />
    </div>
  )
}

// ── Home ──────────────────────────────────────────────────────────────────────
const HOME_CSS = `
  .mc { transition: transform 160ms cubic-bezier(0.23,1,0.32,1); cursor: pointer;
        user-select: none; -webkit-user-select: none; }
  .mc:active { transform: scale(0.97); }
  .home-scroll::-webkit-scrollbar { display: none; }
  @keyframes homeIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes sparklePulse {
    0%, 100% { transform: scale(1)    rotate(0deg);    opacity: 0.75; }
    50%      { transform: scale(1.28) rotate(22.5deg); opacity: 1;    }
  }
  .sparkle { display: inline-block; animation: sparklePulse 2.6s ease-in-out infinite; }
  @keyframes plantFloat {
    0%, 100% { transform: translateY(0px); }
    50%      { transform: translateY(-5px); }
  }
  @keyframes gardenGlow {
    0%, 100% { border-color: rgba(185,255,111,.22); box-shadow: none; }
    50%      { border-color: rgba(185,255,111,.55); box-shadow: 0 0 18px rgba(185,255,111,.08); }
  }
  @keyframes seedRise {
    0%   { transform: translateY(0);    opacity: 0; }
    15%  { opacity: 0.85; }
    100% { transform: translateY(-18px); opacity: 0; }
  }
  .plant-float   { animation: plantFloat 2.8s ease-in-out infinite; }
  .garden-nudge  { animation: gardenGlow 2.8s ease-in-out infinite; }
  .sp            { animation: seedRise 2.4s ease-out infinite; }
  .sp1           { animation-delay: 0s; }
  .sp2           { animation-delay: 0.8s; }
  .sp3           { animation-delay: 1.6s; }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .skel {
    background: linear-gradient(90deg, rgba(255,249,230,.04) 25%, rgba(255,249,230,.09) 50%, rgba(255,249,230,.04) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.6s ease-in-out infinite;
    border-radius: 8px;
  }
`

const TOP_MATCHES = [
  { id: 3, pct: 94, slot: 'Today 5pm',    reasons: ['Matches your goal', 'Works at Apple',  'Long-term fit'],
    insight: 'Kimberly\'s 8 years at Apple hardware maps directly to your goal of landing at a top-tier company. Her direct feedback style and long-term track record make her your strongest match this season.' },
  { id: 1, pct: 87, slot: 'Thu 2pm',      reasons: ['Career guidance',   'Design background','Exploratory style'],
    insight: 'Justin\'s AI product work at Meta aligns with your skill-building focus. He\'s helped designers at your level make the leap to senior, and his open-ended style matches how you learn best.' },
  { id: 2, pct: 81, slot: 'Tomorrow 3pm', reasons: ['Skill building',    'Amazon insider',  'Mid-level fit'],
    insight: 'Alex is early enough in her career to give you grounded, practical feedback without the ivory tower filter. Great fit for honest portfolio critiques and real-talk career advice.' },
]

function ReasonChip({ label }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 11px', borderRadius: 999,
      background: 'rgba(185,255,111,.08)',
      border: '1px solid rgba(185,255,111,.2)',
      fontFamily: 'Urbanist', fontSize: 12, fontWeight: 600,
      color: C.green,
    }}>
      <span style={{ fontSize: 11 }}>✓</span> {label}
    </div>
  )
}

function TopMatchCard({ tm, mentor, onOpen }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="mc" onClick={onOpen} style={{
      borderRadius: 20,
      background: 'rgba(255,249,230,.04)',
      border: '1px solid rgba(255,249,230,.07)',
      display: 'flex', flexDirection: 'column',
      animation: 'homeIn 250ms cubic-bezier(0.23,1,0.32,1) 80ms both',
      overflow: 'hidden',
      padding: '18px 18px 18px',
      gap: 16,
    }}>
      {/* Avatar + identity row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img src={mentor.avatar} width="60" height="60"
               style={{ display: 'block', borderRadius: 999, objectFit: 'cover',
                        border: '2px solid rgba(185,255,111,.35)' }}/>
          <div style={{ position: 'absolute', bottom: 2, right: 2,
                        width: 10, height: 10, borderRadius: 999,
                        background: C.green }}/>
        </div>

        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 18,
                          color: '#FFF9E6', letterSpacing: -.3, lineHeight: 1.2,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {mentor.name}
            </div>
            <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 11,
                          letterSpacing: '.07em', textTransform: 'uppercase',
                          color: C.green, flexShrink: 0 }}>
              Top rated
            </div>
          </div>
          <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: 'rgba(255,249,230,.45)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {mentor.title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2, fontFamily: 'Urbanist' }}>
            <span style={{ color: C.green, fontSize: 12 }}>★</span>
            <span style={{ fontWeight: 700, fontSize: 13, color: '#FFF9E6' }}>
              {mentor.rating}
            </span>
            <span style={{ color: 'rgba(255,249,230,.25)', fontSize: 12 }}>·</span>
            <span style={{ fontSize: 12, color: 'rgba(255,249,230,.45)' }}>
              {mentor.count} sessions
            </span>
          </div>
        </div>
      </div>

      {/* Reason chips */}
      <div style={{ display: 'flex', gap: 7 }}>
        {tm.reasons.slice(0, 2).map((r, i) => <ReasonChip key={r} label={r} primary={i === 0} />)}
      </div>

      {/* AI insight — no box, just text */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <span style={{ color: C.green, fontSize: 11, flexShrink: 0, marginTop: 2 }}>✦</span>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontFamily: 'Urbanist', fontSize: 14,
                      color: 'rgba(255,249,230,.65)', lineHeight: 1.6, letterSpacing: -.1,
                      overflow: 'hidden', display: '-webkit-box',
                      WebkitLineClamp: expanded ? 999 : 2,
                      WebkitBoxOrient: 'vertical' }}>
            {tm.insight}
          </p>
          {!expanded && (
            <span onClick={e => { e.stopPropagation(); setExpanded(true) }}
                  style={{ fontFamily: 'Urbanist', fontSize: 13, fontWeight: 600,
                           color: C.green, cursor: 'pointer', marginTop: 2, display: 'inline-block' }}>
              Read more
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <button onClick={e => { e.stopPropagation(); onOpen() }} style={{
        width: '100%', height: 50, border: 'none', cursor: 'pointer',
        borderRadius: 14, background: C.green, color: '#121212',
        fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, letterSpacing: -.2,
        boxShadow: '0 8px 24px rgba(185,255,111,.22)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        Book your first session
      </button>
    </div>
  )
}

function SmallMatchCard({ tm, mentor, rank, onOpen }) {
  const company   = mentor.title.split(' at ')[1] || mentor.title
  const firstName = mentor.name.split(' ')[0]
  return (
    <div className="mc" onClick={onOpen} style={{
      flex: 1, borderRadius: 18,
      background: 'rgba(255,249,230,.04)',
      border: '1px solid rgba(255,249,230,.08)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '16px 12px',
      animation: `homeIn 250ms cubic-bezier(0.23,1,0.32,1) ${80 + rank * 60}ms both`,
    }}>
      {/* Avatar with online dot */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img src={mentor.avatar} width="52" height="52"
             style={{ display: 'block', borderRadius: 999, objectFit: 'cover',
                      border: '2px solid rgba(185,255,111,.25)' }}/>
        <div style={{ position: 'absolute', bottom: 1, right: 1,
                      width: 9, height: 9, borderRadius: 999,
                      background: C.green }}/>
      </div>

      {/* Name */}
      <div style={{ marginTop: 10, fontFamily: 'Urbanist', fontWeight: 700, fontSize: 14,
                    color: '#FFF9E6', textAlign: 'center', lineHeight: 1.1 }}>
        {firstName}
      </div>

      {/* Company */}
      <div style={{ marginTop: 3, fontFamily: 'Urbanist', fontSize: 11,
                    color: 'rgba(255,249,230,.38)', textAlign: 'center',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    maxWidth: '100%' }}>
        {company}
      </div>

      {/* Stats */}
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Urbanist' }}>
        <span style={{ color: C.green, fontSize: 11 }}>★</span>
        <span style={{ fontWeight: 700, fontSize: 11, color: '#FFF9E6' }}>
          {mentor.rating}
        </span>
        <span style={{ color: 'rgba(255,249,230,.25)', fontSize: 11 }}>·</span>
        <span style={{ fontWeight: 600, fontSize: 11, color: C.green }}>
          {tm.pct}%
        </span>
      </div>

      {/* Spacer pushes CTA to bottom */}
      <div style={{ flex: 1 }} />

      {/* CTA */}
      <div style={{
        marginTop: 12, width: '100%', height: 34, borderRadius: 10,
        border: '1px solid rgba(255,249,230,.12)',
        background: 'rgba(255,249,230,.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Urbanist', fontWeight: 600, fontSize: 12,
        color: 'rgba(255,249,230,.55)',
      }}>
        View profile
      </div>
    </div>
  )
}

function HomeSkeletons() {
  return (
    <div style={{ padding: '66px 24px 0', paddingBottom: 100 }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div className="skel" style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }}/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
          <div className="skel" style={{ height: 14, width: '52%', borderRadius: 7 }}/>
          <div className="skel" style={{ height: 11, width: '36%', borderRadius: 6 }}/>
        </div>
        <div className="skel" style={{ width: 22, height: 22, borderRadius: '50%' }}/>
      </div>
      {/* Cal nudge */}
      <div className="skel" style={{ height: 64, borderRadius: 14, marginBottom: 24 }}/>
      {/* Section heading */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="skel" style={{ height: 24, width: '54%', borderRadius: 10 }}/>
        <div className="skel" style={{ height: 13, width: '16%', borderRadius: 7 }}/>
      </div>
      {/* Top match card */}
      <div style={{ borderRadius: 20, border: '1px solid rgba(255,249,230,.05)',
                    padding: '18px 18px 18px', marginBottom: 12,
                    display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div className="skel" style={{ width: 56, height: 56, borderRadius: '50%', flexShrink: 0 }}/>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div className="skel" style={{ height: 16, width: '55%', borderRadius: 7 }}/>
            <div className="skel" style={{ height: 12, width: '70%', borderRadius: 6 }}/>
            <div className="skel" style={{ height: 12, width: '40%', borderRadius: 6 }}/>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          <div className="skel" style={{ height: 28, width: 130, borderRadius: 999 }}/>
          <div className="skel" style={{ height: 28, width: 110, borderRadius: 999 }}/>
        </div>
        <div className="skel" style={{ height: 72, borderRadius: 12 }}/>
        <div className="skel" style={{ height: 50, borderRadius: 14 }}/>
      </div>
      {/* Two small cards */}
      <div style={{ display: 'flex', gap: 12 }}>
        <div className="skel" style={{ flex: 1, height: 188, borderRadius: 18 }}/>
        <div className="skel" style={{ flex: 1, height: 188, borderRadius: 18 }}/>
      </div>
      {/* Garden nudge */}
      <div className="skel" style={{ height: 82, borderRadius: 18, marginTop: 12 }}/>
    </div>
  )
}

export function HomeScreen({ onOpenMentor, onTab, tab = 'home', onOpenSearch, userName = '' }) {
  const firstName = (userName || 'there').trim().split(' ')[0]
  const initials  = (userName || '').trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || null
  const topMentor   = MENTORS.find(m => m.id === TOP_MATCHES[0].id)
  const otherMentors = TOP_MATCHES.slice(1).map(tm => ({ tm, mentor: MENTORS.find(m => m.id === tm.id) }))
  const [calDismissed, setCalDismissed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 1400); return () => clearTimeout(t) }, [])

  return (
    <div style={{ width: '100%', height: '100%', background: '#0d0d0d',
                  color: '#FFF9E6', position: 'relative', overflow: 'hidden' }}>
      <style>{HOME_CSS}</style>
      <StatusBar dark />

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(500px 380px at 50% 15%, rgba(185,255,111,.06), transparent 65%)' }}/>

      {!loaded ? (
        <div className="home-scroll" style={{ height: '100%', overflowY: 'auto' }}>
          <HomeSkeletons />
        </div>
      ) : (
      <div className="home-scroll" style={{ height: '100%', overflowY: 'auto', paddingBottom: 100 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* ── Header ── */}
          <div style={{ padding: '66px 24px 0',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 999, flexShrink: 0,
                background: 'rgba(185,255,111,.12)',
                border: '1.5px solid rgba(185,255,111,.32)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Urbanist', fontWeight: 700, fontSize: 13, color: '#B9FF6F',
              }}>
                {initials || (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                       stroke="#B9FF6F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 18, color: '#FFF9E6' }}>
                  Welcome, {firstName}
                </div>
                <div style={{ fontFamily: 'Urbanist', fontSize: 12, color: 'rgba(255,249,230,.4)' }}>
                  Your matches are ready
                </div>
              </div>
            </div>
          </div>

          {/* ── Search bar ── */}
          <div onClick={onOpenSearch} style={{
            margin: '16px 24px 0', padding: '11px 16px', borderRadius: 14,
            background: 'rgba(255,249,230,.05)', border: '1px solid rgba(255,249,230,.08)',
            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
            animation: 'homeIn 250ms cubic-bezier(0.23,1,0.32,1) 20ms both',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="rgba(255,249,230,.35)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/>
            </svg>
            <span style={{ fontFamily: 'Urbanist', fontSize: 14, color: 'rgba(255,249,230,.3)' }}>
              Search mentors by skill, company…
            </span>
          </div>

          {/* ── Calendar sync nudge ── */}
          {!calDismissed && (
            <div style={{
              margin: '16px 24px 0', padding: '11px 14px', borderRadius: 12,
              background: 'rgba(255,249,230,.03)', border: 'none',
              borderLeft: '2px solid rgba(185,255,111,.3)',
              display: 'flex', alignItems: 'center', gap: 12,
              animation: 'homeIn 250ms cubic-bezier(0.23,1,0.32,1) 40ms both',
            }}>
              <svg width="36" height="36" viewBox="0 0 36 36" style={{ flexShrink: 0, borderRadius: 8, overflow: 'hidden' }}>
                {/* Blue background (top-left quadrant color fills entire bg) */}
                <rect width="36" height="36" fill="#4285F4"/>
                {/* Top-right quadrant: dark blue */}
                <path d="M19 0 H36 V18 H19 Z" fill="#1A73E8"/>
                {/* Bottom-left quadrant: green */}
                <path d="M0 19 H18 V36 H0 Z" fill="#188038"/>
                {/* Bottom-right quadrant: red */}
                <path d="M19 19 H36 V36 H19 Z" fill="#EA4335"/>
                {/* Yellow bridge strip (right side center) */}
                <path d="M19 17 H36 V20 H19 Z" fill="#FBBC04"/>
                {/* White inner card */}
                <rect x="7" y="7" width="22" height="22" rx="2" fill="white"/>
                {/* "31" date text */}
                <text x="18" y="23.5" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="11" fill="#1A73E8">31</text>
              </svg>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 13, color: '#FFF9E6' }}>
                  Connect your calendar
                </div>
                <div style={{ fontFamily: 'Urbanist', fontSize: 12, color: 'rgba(255,249,230,.4)', marginTop: 1 }}>
                  Share your availability so mentors can book time that works for both of you.
                </div>
              </div>
              <div
                onClick={() => setCalDismissed(true)}
                style={{ padding: 6, cursor: 'pointer', opacity: .35, flexShrink: 0 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </div>
            </div>
          )}

          {/* ── Section heading ── */}
          <div style={{ padding: '20px 24px 0',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8,
                          fontFamily: 'Urbanist', fontWeight: 800, fontSize: 22,
                          letterSpacing: -.4, color: '#FFF9E6' }}>
              <span className="sparkle" style={{ color: C.green, fontSize: 16 }}>✦</span>
              Your top 3 matches
            </div>
            <div onClick={onOpenSearch} style={{
              fontFamily: 'Urbanist', fontWeight: 700, fontSize: 12,
              color: C.green, cursor: 'pointer', flexShrink: 0, padding: '4px 0',
            }}>
              View all
            </div>
          </div>

          {/* ── Top match card ── */}
          <div style={{ padding: '16px 24px 0' }}>
            <TopMatchCard tm={TOP_MATCHES[0]} mentor={topMentor}
                          onOpen={() => onOpenMentor(topMentor)} />
          </div>

          {/* ── #2 and #3 side by side ── */}
          <div style={{ padding: '12px 24px 0', display: 'flex', gap: 12, alignItems: 'stretch' }}>
            {otherMentors.map(({ tm, mentor }, i) => (
              <SmallMatchCard key={tm.id} tm={tm} mentor={mentor} rank={i + 2}
                              onOpen={() => onOpenMentor(mentor)} />
            ))}
          </div>


          {/* ── Garden nudge ── */}
          <div onClick={() => onTab?.('garden')} style={{
            margin: '8px 24px 0',
            padding: '16px 18px', borderRadius: 18,
            background: 'rgba(255,249,230,.03)',
            border: '1px solid rgba(255,249,230,.07)',
            display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer',
          }}>
            <div style={{ flexShrink: 0 }}>
              <svg width="40" height="44" viewBox="0 0 40 44" fill="none">
                <ellipse cx="20" cy="38" rx="15" ry="5"  fill="#3d2b18"/>
                <ellipse cx="20" cy="35" rx="11" ry="3.5" fill="#5a3f25"/>
                <circle cx="20" cy="32" r="5" fill="#6b4a28"/>
                <path d="M20 31 Q19 24 20 17" stroke="rgba(185,255,111,.5)" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M20 24 Q13 20 11 13 Q17 15 19 23Z" fill="rgba(185,255,111,.4)"/>
                <path d="M20 24 Q27 20 29 13 Q23 15 21 23Z" fill="rgba(185,255,111,.3)"/>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 14, color: '#FFF9E6' }}>
                Your garden is empty
              </div>
              <div style={{ fontFamily: 'Urbanist', fontSize: 13,
                            color: 'rgba(255,249,230,.45)', lineHeight: 1.55 }}>
                Book your first session to plant a seed. Each meeting helps it grow.
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="rgba(255,249,230,.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>

        </div>
      </div>
      )}

      <BottomNav active={tab} onTab={onTab} />
      <HomeIndicator dark />
    </div>
  )
}

// ── Mini plant for mentor garden ──────────────────────────────────────────────
function GardenMiniPlant({ variant = 0, stage = 3 }) {
  const G = '#B9FF6F', Gm = '#99E860', Gd = '#6BAE3E', stem = '#3E7A2A'
  const Pot = (
    <g>
      <path d="M11 56 L14 68 Q20 73 30 73 Q40 73 46 68 L49 56 Z" fill="#C9825A" stroke="#8A4E2E" strokeWidth="1"/>
      <ellipse cx="30" cy="56" rx="19" ry="3"   fill="#A05E3A"/>
      <ellipse cx="30" cy="56" rx="18" ry="2.2" fill="#5A3B24"/>
    </g>
  )
  let foliage
  if (variant === 0) {
    const top = stage >= 4 ? 12 : stage >= 3 ? 20 : 30
    const n = stage >= 4 ? 6 : stage >= 3 ? 4 : 3
    foliage = (
      <g>
        <path d={`M30 56 Q30 ${(top+56)/2} 30 ${top}`} stroke={stem} strokeWidth="1.6" strokeLinecap="round" fill="none"/>
        {Array.from({length: n}).map((_,i) => {
          const y = top + (i+0.8)*((56-top)/(n+1))
          const l = i%2===0; const sz = 5+(i/n)*4
          return <ellipse key={i} cx={l?30-sz-3:30+sz+3} cy={y} rx={sz} ry={sz*0.65}
                          fill={i%2===0?G:Gm} transform={`rotate(${l?-32:30} ${l?30-sz-3:30+sz+3} ${y})`}/>
        })}
      </g>
    )
  } else if (variant === 1) {
    const r1 = stage>=4?12:stage>=3?9:7, r2 = stage>=4?13:stage>=3?11:9, r3 = stage>=4?9:stage>=3?7:5
    foliage = (
      <g>
        <path d="M30 56 Q26 44 21 36 Q29 32 38 25" stroke="#6B4423" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <circle cx="21" cy="36" r={r1} fill={Gd}/>
        <circle cx="38" cy="25" r={r2} fill={G}/>
        <circle cx="28" cy="21" r={r3} fill={Gm}/>
        {stage>=4 && <><circle cx="20" cy="34" r="1.5" fill="#FF6FA0"/><circle cx="39" cy="23" r="1.5" fill="#FFE066"/></>}
      </g>
    )
  } else if (variant === 2) {
    const sh = stage>=4?14:stage>=3?22:32
    foliage = (
      <g>
        <path d={`M30 56 Q30 48 30 ${sh}`} stroke={stem} strokeWidth="1.6" strokeLinecap="round" fill="none"/>
        {Array.from({length:8}).map((_,k) => {
          const a=(k/8)*Math.PI*2, cx=30+Math.cos(a)*8, cy=sh+Math.sin(a)*8
          return <ellipse key={k} cx={cx} cy={cy} rx="3.5" ry="5.5" fill={k%2?'#FFD060':'#FFE580'} transform={`rotate(${a*180/Math.PI} ${cx} ${cy})`}/>
        })}
        <circle cx="30" cy={sh} r={stage>=4?6:4.5} fill="#5A3B24"/>
      </g>
    )
  } else {
    foliage = (
      <g>
        <path d="M30 56 Q30 46 29 34" stroke={stem} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <ellipse cx="21" cy="44" rx="10" ry="7" fill={G}  transform="rotate(-22 21 44)"/>
        <ellipse cx="37" cy="38" rx="10" ry="7" fill={Gm} transform="rotate(22 37 38)"/>
        {stage>=3 && <><ellipse cx="18" cy="32" rx="11" ry="7.5" fill={G}  transform="rotate(-28 18 32)"/><ellipse cx="40" cy="26" rx="11" ry="7.5" fill={Gm} transform="rotate(28 40 26)"/></>}
        {stage>=4 && <ellipse cx="29" cy="18" rx="9" ry="6" fill={Gd}/>}
      </g>
    )
  }
  return (
    <svg width="60" height="76" viewBox="0 0 60 76" fill="none" style={{display:'block'}}>
      {Pot}{foliage}
    </svg>
  )
}

// ── Mentor Bio ────────────────────────────────────────────────────────────────
const GARDEN_PEOPLE = [
  { init: 'AS', color: '#7FDBFF', stage: 4 },
  { init: 'MJ', color: '#FF6FA0', stage: 3 },
  { init: 'LP', color: '#FFD060', stage: 2 },
  { init: 'KR', color: '#B9FF6F', stage: 5 },
  { init: 'SD', color: '#FF9F1C', stage: 3 },
  { init: 'TN', color: '#A78BFA', stage: 2 },
  { init: 'BW', color: '#7FDBFF', stage: 4 },
]

const BOOK_TOPICS = ['Portfolio Review', 'Career Advice', 'Interview Prep', 'Design Systems', 'Resume Review']

const MENTOR_AVAIL = {
  1: [ // Justin
    { label: 'Thu, May 1',  slots: ['2:00 pm', '5:00 pm'] },
    { label: 'Mon, May 5',  slots: ['11:00 am', '4:00 pm'] },
    { label: 'Wed, May 7',  slots: ['9:30 am'] },
    { label: 'Thu, May 8',  slots: ['3:00 pm'] },
  ],
  2: [ // Alex
    { label: 'Tue, Apr 29', slots: ['10:00 am', '2:00 pm'] },
    { label: 'Fri, May 2',  slots: ['9:00 am', '11:00 am'] },
    { label: 'Mon, May 5',  slots: ['3:30 pm'] },
    { label: 'Tue, May 6',  slots: ['10:00 am', '4:00 pm'] },
  ],
  3: [ // Kimberly — sparse, realistic
    { label: 'Thu, May 1',  slots: ['10:00 am', '2:30 pm'] },
    { label: 'Mon, May 5',  slots: ['9:00 am'] },
    { label: 'Wed, May 7',  slots: ['11:00 am', '3:00 pm'] },
    { label: 'Fri, May 9',  slots: ['4:30 pm'] },
    { label: 'Mon, May 12', slots: ['2:00 pm', '5:00 pm'] },
  ],
  4: [ // Priya
    { label: 'Wed, Apr 30', slots: ['11:00 am', '3:00 pm'] },
    { label: 'Thu, May 1',  slots: ['9:30 am'] },
    { label: 'Tue, May 6',  slots: ['2:00 pm', '4:30 pm'] },
    { label: 'Thu, May 8',  slots: ['10:00 am'] },
  ],
  5: [ // Marcus
    { label: 'Mon, Apr 28', slots: ['9:00 am', '11:00 am'] },
    { label: 'Wed, Apr 30', slots: ['2:30 pm'] },
    { label: 'Mon, May 5',  slots: ['10:00 am', '3:00 pm'] },
    { label: 'Fri, May 9',  slots: ['1:30 pm', '4:00 pm'] },
  ],
}

const MENTOR_REVIEWS = {
  1: { dist: [72, 20, 6, 1, 1], items: [
    { name: 'Leila',  init: 'L', color: '#A78BFA', stars: 5, topic: 'Portfolio Review',
      quote: 'Justin spotted three issues in my portfolio in 5 minutes that I\'d been blind to for months.' },
    { name: 'Omar',   init: 'O', color: '#7FDBFF', stars: 5, topic: 'Career Advice',
      quote: 'One session was worth more than six months of job searching alone.' },
    { name: 'Rachel', init: 'R', color: '#FFD060', stars: 4, topic: 'Interview Prep',
      quote: 'Really solid feedback. Appreciated the directness. No sugarcoating.' },
  ]},
  2: { dist: [68, 24, 6, 2, 0], items: [
    { name: 'Tomas', init: 'T', color: '#FF6FA0', stars: 5, topic: 'Portfolio Review',
      quote: 'Alex gets it. She remembers exactly what it feels like to be a junior designer.' },
    { name: 'Yuna',  init: 'Y', color: '#B9FF6F', stars: 5, topic: 'Career Advice',
      quote: 'Super honest and practical. Helped me re-frame how I think about my career arc.' },
    { name: 'Ben',   init: 'B', color: '#FF9F1C', stars: 4, topic: 'Design Systems',
      quote: 'Good session, learned a lot about how Amazon approaches design at scale.' },
  ]},
  3: { dist: [60, 30, 7, 2, 1], items: [
    { name: 'Priya', init: 'P', color: '#A78BFA', stars: 5, topic: 'Portfolio Review',
      quote: 'Really thoughtful and specific feedback. Walked away with three concrete next steps.' },
    { name: 'Dan',   init: 'D', color: '#7FDBFF', stars: 5, topic: 'Career Advice',
      quote: 'Straight-talking and generous with time. Would book again.' },
    { name: 'Mia',   init: 'M', color: '#FF6FA0', stars: 4, topic: 'Interview Prep',
      quote: 'Pushed me to think bigger about my work. Super helpful on the system design side.' },
    { name: 'Sam',   init: 'S', color: '#FFD060', stars: 5, topic: 'Portfolio Review',
      quote: 'The most useful 30 minutes I\'ve had in my job search. Direct, no fluff.' },
  ]},
  4: { dist: [85, 12, 2, 1, 0], items: [
    { name: 'Jin',   init: 'J', color: '#B9FF6F', stars: 5, topic: 'Career Advice',
      quote: 'Priya helped me understand what it actually takes to go from senior to lead. Changed how I present my work.' },
    { name: 'Sofia', init: 'S', color: '#FF6FA0', stars: 5, topic: 'Portfolio Review',
      quote: 'She sees the business logic behind every design decision. That perspective is rare.' },
    { name: 'Andre', init: 'A', color: '#7FDBFF', stars: 5, topic: 'Interview Prep',
      quote: 'Best mentor I\'ve had, full stop.' },
  ]},
  5: { dist: [55, 30, 10, 3, 2], items: [
    { name: 'Kim',   init: 'K', color: '#FF9F1C', stars: 5, topic: 'Interview Prep',
      quote: 'Marcus knows exactly what Google hiring managers look for. Saved me months of prep.' },
    { name: 'Diego', init: 'D', color: '#A78BFA', stars: 4, topic: 'Portfolio Review',
      quote: 'Honest feedback, no sugarcoating. My portfolio is way stronger now.' },
  ]},
}

const StarRow = ({ count, size = 11, filled = '#B9FF6F' }) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {[1,2,3,4,5].map(s => (
      <svg key={s} width={size} height={size} viewBox="0 0 24 24"
           fill={s <= count ? filled : 'rgba(255,249,230,.14)'}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ))}
  </div>
)

const MENTOR_META = {
  1: {
    quote: 'Most designers are one honest critique away from landing their next role.',
    tags: ['AI Products', 'Systems Thinking', 'Meta Scale'],
    fit: ['You want to level up from screen-maker to systems thinker', 'You\'re navigating AI product design for the first time', 'You need someone who ships features at billions of users scale'],
  },
  2: {
    quote: 'I\'ll tell you what\'s actually holding your portfolio back — not what you want to hear.',
    tags: ['Peer-level Feedback', 'Amazon', 'Mid-level Growth'],
    fit: ['You want honest feedback without the ivory tower filter', 'You\'re early-to-mid career and need grounded, real-world advice', 'You design under real constraints and want someone who gets it'],
  },
  3: {
    quote: 'Stop second-guessing your work. Let\'s figure out what\'s actually strong and run with it.',
    tags: ['Apple Hardware', 'Portfolio', 'Senior Level'],
    fit: ['You\'re ready to stop second-guessing every decision', 'You\'re preparing for senior roles or FAANG interviews', 'You need direct, no-fluff feedback that actually moves things forward'],
  },
  4: {
    quote: 'Getting to lead isn\'t about doing more. It\'s about thinking differently. That\'s what I teach.',
    tags: ['Fintech', 'Career Growth', 'Lead Level'],
    fit: ['You\'re making the move from senior to lead or staff', 'You want craft and career strategy in the same conversation', 'You thrive with a high bar and someone who holds you to it'],
  },
  5: {
    quote: 'I\'ve reviewed hundreds of portfolios. I\'ll show you exactly what\'s costing you interviews.',
    tags: ['Google', 'Interview Prep', 'FAANG Portfolios'],
    fit: ['You\'re targeting FAANG or top-tier product companies', 'Your portfolio feels strong but interviews aren\'t converting', 'You want someone who\'s sat on both sides of the table'],
  },
}

const BIO_CSS = `
  @keyframes sheetUp {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }
  @keyframes sheetOverlay {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes shimmer {
    from { background-position: -400px 0; }
    to   { background-position:  400px 0; }
  }
  @keyframes bioFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`

function SkeletonBlock({ w = '100%', h = 14, r = 8, style = {} }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: 'linear-gradient(90deg, rgba(255,249,230,.05) 25%, rgba(255,249,230,.1) 50%, rgba(255,249,230,.05) 75%)',
      backgroundSize: '800px 100%',
      animation: 'shimmer 1.4s ease-in-out infinite',
      ...style,
    }}/>
  )
}

function BioSkeleton({ onBack }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#0d0d0d', position: 'relative', overflow: 'hidden' }}>
      <style>{BIO_CSS}</style>
      <StatusBar dark />
      {/* Back button */}
      <div style={{ position: 'absolute', top: 52, left: 20, zIndex: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 999, background: 'rgba(255,249,230,.06)' }}/>
      </div>
      {/* Hero area */}
      <div style={{ height: 260, background: 'rgba(255,249,230,.03)' }}/>
      {/* Avatar */}
      <div style={{ position: 'absolute', top: 210, left: 24 }}>
        <div style={{ width: 72, height: 72, borderRadius: 999, background: 'rgba(255,249,230,.08)',
          animation: 'shimmer 1.4s ease-in-out infinite',
          backgroundImage: 'linear-gradient(90deg, rgba(255,249,230,.05) 25%, rgba(255,249,230,.1) 50%, rgba(255,249,230,.05) 75%)',
          backgroundSize: '800px 100%' }}/>
      </div>
      {/* Content */}
      <div style={{ marginTop: 56, padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SkeletonBlock w="55%" h={22} r={6}/>
        <SkeletonBlock w="40%" h={14} r={6}/>
        <SkeletonBlock w="30%" h={12} r={6}/>
        <div style={{ height: 8 }}/>
        <SkeletonBlock w="100%" h={12} r={6}/>
        <SkeletonBlock w="90%" h={12} r={6}/>
        <SkeletonBlock w="70%" h={12} r={6}/>
      </div>
    </div>
  )
}

export function MentorBioScreen({ mentor, onBack, onBook, onMessage }) {
  const [loading,  setLoading]  = useState(true)
  const [tab,      setTab]      = useState('overview')
  const [showBook, setShowBook] = useState(false)
  const [selSlot,  setSelSlot]  = useState(null)
  const [selTopic, setSelTopic] = useState(null)
  const [saved,    setSaved]    = useState(() => {
    const s = JSON.parse(localStorage.getItem('sprout.saved') || '[]')
    return s.includes(mentor?.id)
  })

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(t)
  }, [mentor?.id])

  if (loading) return <BioSkeleton onBack={onBack} />

  function toggleSave(e) {
    e.stopPropagation()
    const prev = JSON.parse(localStorage.getItem('sprout.saved') || '[]')
    const next = prev.includes(mentor.id) ? prev.filter(x => x !== mentor.id) : [...prev, mentor.id]
    localStorage.setItem('sprout.saved', JSON.stringify(next))
    setSaved(next.includes(mentor.id))
  }

  const G = '#B9FF6F'
  const firstName = mentor?.name.split(' ')[0] ?? ''
  const canConfirm = selSlot !== null && selTopic !== null

  if (!mentor) return null

  const avail = MENTOR_AVAIL[mentor.id] ?? MENTOR_AVAIL[3]
  const totalSlots = avail.reduce((s, d) => s + d.slots.length, 0)

  function handleConfirm() {
    if (!canConfirm) return
    setShowBook(false)
    onBook?.({ day: selSlot.date.split(', ')[0], date: selSlot.date.split(' ').slice(1).join(' '), slot: selSlot.time, topic: selTopic })
  }

  return (
    <div style={{ width: '100%', height: '100%', background: '#0d0d0d',
                  color: '#FFF9E6', position: 'relative', overflow: 'hidden',
                  animation: 'bioFadeIn 220ms ease-out' }}>
      <style>{BIO_CSS}</style>
      <StatusBar dark />

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 260, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 50% 18%, rgba(185,255,111,.07), transparent 70%)' }}/>

      {/* Scrollable body */}
      <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 148 }}>

        {/* Back + Save */}
        <div style={{ padding: '60px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div onClick={onBack} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            color: G, cursor: 'pointer',
            fontFamily: 'Urbanist', fontWeight: 600, fontSize: 14,
          }}>
            {I.back}
          </div>
          <div onClick={toggleSave} style={{
            width: 36, height: 36, borderRadius: 999, cursor: 'pointer',
            background: saved ? 'rgba(185,255,111,.12)' : 'rgba(255,249,230,.06)',
            border: `1px solid ${saved ? 'rgba(185,255,111,.3)' : 'rgba(255,249,230,.1)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 160ms, border-color 160ms',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? G : 'none'}
                 stroke={saved ? G : 'rgba(255,249,230,.5)'} strokeWidth="1.8" strokeLinecap="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
        </div>

        {/* Avatar + identity */}
        <div style={{ padding: '20px 24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <img src={mentor.avatar} width="96" height="96"
                 style={{ display: 'block', borderRadius: '50%', objectFit: 'cover',
                          border: '2.5px solid rgba(185,255,111,.45)',
                          boxShadow: '0 0 0 7px rgba(185,255,111,.07)' }}/>
            <div style={{ position: 'absolute', bottom: 7, right: 7,
                          width: 12, height: 12, borderRadius: '50%',
                          background: G }}/>
          </div>
          <div style={{ marginTop: 14, fontFamily: 'Urbanist', fontWeight: 800,
                        fontSize: 22, color: '#FFF9E6', letterSpacing: -.4, textAlign: 'center' }}>
            {mentor.name}
          </div>
          <div style={{ marginTop: 4, fontFamily: 'Urbanist', fontSize: 13,
                        color: 'rgba(255,249,230,.46)', textAlign: 'center' }}>
            {mentor.title}
          </div>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6,
                        fontFamily: 'Urbanist', fontSize: 13 }}>
            <span style={{ color: G }}>★</span>
            <span style={{ color: '#FFF9E6', fontWeight: 700 }}>{mentor.rating}</span>
            <span style={{ color: 'rgba(255,249,230,.22)' }}>·</span>
            <span style={{ color: 'rgba(255,249,230,.44)' }}>{mentor.count} sessions</span>
          </div>
        </div>

        {/* Stat pills */}
        <div style={{ padding: '24px 24px 0', display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            [mentor.industry,                      'Industry'],
            [`${mentor.years} yrs`,                'Experience'],
            [mentor.longterm ? 'Open' : 'Flexible','Long-term'],
          ].map(([val, label]) => (
            <div key={label} style={{
              padding: '8px 16px', borderRadius: 12,
              background: 'rgba(255,249,230,.05)',
              border: '1px solid rgba(255,249,230,.1)',
              textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 13, color: '#FFF9E6' }}>{val}</div>
              <div style={{ marginTop: 1, fontFamily: 'Urbanist', fontWeight: 600, fontSize: 11,
                            textTransform: 'uppercase', letterSpacing: '.07em',
                            color: 'rgba(255,249,230,.3)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ margin: '32px 24px 0', height: 1, background: 'rgba(255,249,230,.06)' }}/>

        {/* Tab nav */}
        <div style={{ margin: '24px 24px 0', display: 'flex',
                      borderBottom: '1px solid rgba(255,249,230,.08)' }}>
          {[['overview', 'Overview'], ['reviews', 'Reviews']].map(([id, label]) => (
            <div key={id} onClick={() => setTab(id)} style={{
              paddingBottom: 12, marginRight: 24, marginBottom: -1,
              cursor: 'pointer', fontFamily: 'Urbanist', fontSize: 14,
              fontWeight: tab === id ? 700 : 500,
              color: tab === id ? '#FFF9E6' : 'rgba(255,249,230,.35)',
              borderBottom: `2px solid ${tab === id ? G : 'transparent'}`,
              transition: 'color 160ms, border-color 160ms',
            }}>{label}</div>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ margin: '20px 24px 0' }}>
          {tab === 'overview' ? (() => {
            const meta = MENTOR_META[mentor.id] ?? { quote: mentor.bio.split('.')[0], tags: [], fit: [] }
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

                {/* Pull quote — editorial style */}
                <div style={{ position: 'relative' }}>
                  {/* SVG quote mark */}
                  <svg width="28" height="22" viewBox="0 0 28 22" fill="none"
                       style={{ marginBottom: 10, opacity: .45 }}>
                    <path d="M0 22V13.6C0 9.87 1.01 6.8 3.04 4.37 5.07 1.93 7.85.37 11.38 0L12.32 1.98C9.87 2.66 8.01 3.73 6.76 5.19 5.5 6.64 4.87 8.35 4.87 10.32H9.67V22H0ZM15.68 22V13.6C15.68 9.87 16.69 6.8 18.72 4.37 20.75 1.93 23.53.37 27.06 0L28 1.98C25.55 2.66 23.69 3.73 22.44 5.19 21.18 6.64 20.55 8.35 20.55 10.32H25.35V22H15.68Z"
                          fill={G}/>
                  </svg>
                  <div style={{
                    fontFamily: 'Urbanist', fontWeight: 800, fontSize: 20,
                    color: '#FFF9E6', lineHeight: 1.5, letterSpacing: -.4,
                  }}>
                    {meta.quote}
                  </div>
                  <div style={{
                    marginTop: 14, display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <div style={{ width: 24, height: 1.5, background: G, opacity: .4, borderRadius: 99 }}/>
                    <span style={{
                      fontFamily: 'Urbanist', fontWeight: 600, fontSize: 12,
                      color: 'rgba(255,249,230,.38)', letterSpacing: .2,
                    }}>{mentor.name.split(' ')[0]} on their approach</span>
                  </div>
                </div>

                {/* Bio */}
                <div style={{ fontFamily: 'Urbanist', fontSize: 14,
                              color: 'rgba(255,249,230,.6)', lineHeight: 1.8 }}>
                  {mentor.bio}
                </div>

                {/* Good fit */}
                <div>
                  <div style={{ fontFamily: 'Urbanist', fontSize: 11, fontWeight: 700,
                                letterSpacing: '.1em', textTransform: 'uppercase',
                                color: 'rgba(255,249,230,.28)', marginBottom: 12 }}>
                    Good fit if…
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {meta.fit.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                             stroke={G} strokeWidth="2.4" strokeLinecap="round"
                             style={{ flexShrink: 0, marginTop: 2 }}>
                          <path d="M4 12l5 5 11-11"/>
                        </svg>
                        <span style={{ fontFamily: 'Urbanist', fontSize: 14,
                                       color: 'rgba(255,249,230,.62)', lineHeight: 1.55 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specialty tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {meta.tags.map(t => (
                    <div key={t} style={{
                      padding: '6px 13px', borderRadius: 999,
                      background: 'rgba(255,249,230,.05)',
                      border: '1px solid rgba(255,249,230,.1)',
                      fontFamily: 'Urbanist', fontWeight: 600, fontSize: 12,
                      color: 'rgba(255,249,230,.45)',
                    }}>{t}</div>
                  ))}
                </div>

              </div>
            )
          })() : (() => {
            const rev = MENTOR_REVIEWS[mentor.id] ?? MENTOR_REVIEWS[3]
            return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* ── Rating summary ── */}
              <div style={{
                padding: '16px', borderRadius: 18,
                background: 'rgba(255,249,230,.04)',
                border: '1px solid rgba(255,249,230,.07)',
                display: 'flex', gap: 18, alignItems: 'center',
              }}>
                {/* Big score */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
                              gap: 5, flexShrink: 0, minWidth: 64 }}>
                  <div style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 44,
                                color: '#FFF9E6', letterSpacing: -2, lineHeight: 1 }}>
                    {mentor.rating}
                  </div>
                  <StarRow count={Math.round(mentor.rating)} size={10} />
                  <div style={{ fontFamily: 'Urbanist', fontSize: 11,
                                color: 'rgba(255,249,230,.3)', marginTop: 2 }}>
                    {mentor.count} sessions
                  </div>
                </div>

                {/* Divider */}
                <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,249,230,.07)' }}/>

                {/* Distribution bars */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {[5,4,3,2,1].map((star, i) => {
                    const pct = rev.dist[i]
                    const barColor = star >= 4 ? '#B9FF6F' : star === 3 ? '#FFD060' : 'rgba(255,249,230,.3)'
                    return (
                      <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: 'Urbanist', fontWeight: 600, fontSize: 11,
                                       color: 'rgba(255,249,230,.38)', width: 7, textAlign: 'right' }}>
                          {star}
                        </span>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="rgba(255,249,230,.22)"
                             style={{ flexShrink: 0 }}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <div style={{ flex: 1, height: 5, borderRadius: 999,
                                      background: 'rgba(255,249,230,.07)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, borderRadius: 999,
                                        background: barColor, transition: 'width 300ms ease-out' }}/>
                        </div>
                        <span style={{ fontFamily: 'Urbanist', fontSize: 11,
                                       color: 'rgba(255,249,230,.28)', width: 26, textAlign: 'right' }}>
                          {pct}%
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ── Review cards ── */}
              {rev.items.map(r => (
                <div key={r.name} style={{
                  padding: '14px 16px', borderRadius: 16,
                  background: 'rgba(255,249,230,.04)',
                  border: '1px solid rgba(255,249,230,.07)',
                }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                      background: r.color + '18', border: `1.5px solid ${r.color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Urbanist', fontWeight: 700, fontSize: 12, color: r.color,
                    }}>{r.init}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 13,
                                    color: '#FFF9E6' }}>{r.name}</div>
                      <div style={{ fontFamily: 'Urbanist', fontSize: 11,
                                    color: 'rgba(255,249,230,.35)', marginTop: 1 }}>{r.topic}</div>
                    </div>
                    <StarRow count={r.stars} size={10} />
                  </div>
                  {/* Quote */}
                  <div style={{ fontFamily: 'Urbanist', fontSize: 14,
                                color: 'rgba(255,249,230,.62)', lineHeight: 1.65,
                                fontStyle: 'italic', letterSpacing: -.1 }}>
                    "{r.quote}"
                  </div>
                </div>
              ))}

            </div>
            )
          })()}
        </div>

        {/* Divider */}
        <div style={{ margin: '32px 24px 0', height: 1, background: 'rgba(255,249,230,.06)' }}/>

        {/* Garden */}
        <div style={{ marginTop: 28, paddingBottom: 160 }}>
          <div style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 22 Q12 14 12 8" stroke={G} strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M12 14 Q7 11 5 6 Q10 7 12 12Z" fill={G}/>
              <path d="M12 11 Q17 8 19 3 Q14 4 12 9Z" fill={G} opacity=".7"/>
            </svg>
            <span style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 13, color: '#FFF9E6' }}>
              {firstName}'s garden
            </span>
            <span style={{ fontFamily: 'Urbanist', fontSize: 12, color: 'rgba(255,249,230,.32)' }}>
              · {GARDEN_PEOPLE.length + (mentor.count % 6)} designers growing
            </span>
          </div>
          <div style={{ marginTop: 14, paddingLeft: 24, paddingRight: 8,
                        display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {GARDEN_PEOPLE.map((p, i) => (
              <div key={i} style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: p.color + '1A', border: `1.5px solid ${p.color}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Urbanist', fontWeight: 700, fontSize: 11, color: p.color,
                  letterSpacing: '.02em',
                }}>{p.init}</div>
                <GardenMiniPlant variant={i % 4} stage={p.stage} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky CTAs */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '32px 24px 36px',
        background: 'linear-gradient(to bottom, transparent 0%, #0d0d0d 40%)',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <button onClick={() => setShowBook(true)} style={{
          width: '100%', height: 52, border: 'none', cursor: 'pointer',
          borderRadius: 14, background: G, color: '#121212',
          fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, letterSpacing: -.2,
          boxShadow: '0 8px 24px rgba(185,255,111,.22)',
        }}>
          Book a session
        </button>
        <button onClick={onMessage} style={{
          width: '100%', height: 44, cursor: 'pointer', borderRadius: 14,
          background: 'transparent', border: '1px solid rgba(255,249,230,.1)',
          color: 'rgba(255,249,230,.55)',
          fontFamily: 'Urbanist', fontWeight: 600, fontSize: 14,
        }}>
          Message first
        </button>
      </div>

      {/* ── Booking sheet ── */}
      {showBook && (
        <>
          <div onClick={() => setShowBook(false)} style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)',
            animation: 'sheetOverlay 220ms ease-out both', zIndex: 10,
          }}/>
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, height: '80%',
            borderRadius: '24px 24px 0 0', background: '#161616',
            borderTop: '1px solid rgba(255,249,230,.08)',
            animation: 'sheetUp 250ms cubic-bezier(0.32, 0.72, 0, 1) both',
            overflowY: 'auto', scrollbarWidth: 'none', zIndex: 11,
          }}>

            {/* Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 0' }}>
              <div style={{ width: 36, height: 4, borderRadius: 999, background: 'rgba(255,249,230,.15)' }}/>
            </div>

            {/* Sheet header */}
            <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={mentor.avatar} width="38" height="38"
                   style={{ borderRadius: '50%', objectFit: 'cover',
                            border: '1.5px solid rgba(185,255,111,.3)', flexShrink: 0 }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 16,
                              color: '#FFF9E6', letterSpacing: -.3 }}>
                  Book with {firstName}
                </div>
                <div style={{ fontFamily: 'Urbanist', fontSize: 12,
                              color: 'rgba(255,249,230,.38)', marginTop: 1 }}>
                  30 min · Video call
                </div>
              </div>
              <div onClick={() => setShowBook(false)} style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'rgba(255,249,230,.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                     stroke="rgba(255,249,230,.5)" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </div>
            </div>

            {/* Availability — grouped by date */}
            <div style={{ padding: '20px 20px 0' }}>
              <div style={{ display: 'flex', alignItems: 'baseline',
                            justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ fontFamily: 'Urbanist', fontSize: 11, fontWeight: 700,
                              letterSpacing: '.1em', textTransform: 'uppercase',
                              color: 'rgba(255,249,230,.3)' }}>Availability</div>
                <div style={{ fontFamily: 'Urbanist', fontSize: 12,
                              color: 'rgba(255,249,230,.28)' }}>
                  {totalSlots} open slots
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {avail.map(({ label, slots }) => (
                  <div key={label}>
                    {/* Date header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 13,
                                    color: '#FFF9E6' }}>{label}</div>
                      <div style={{ flex: 1, height: 1, background: 'rgba(255,249,230,.06)' }}/>
                    </div>
                    {/* Time pills */}
                    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                      {slots.map(t => {
                        const on = selSlot?.date === label && selSlot?.time === t
                        return (
                          <div key={t}
                               onClick={() => setSelSlot(on ? null : { date: label, time: t })}
                               style={{
                                 padding: '9px 16px', borderRadius: 10,
                                 background: on ? G : 'rgba(255,249,230,.06)',
                                 border: on ? 'none' : '1px solid rgba(255,249,230,.1)',
                                 fontFamily: 'Urbanist', fontWeight: on ? 700 : 500, fontSize: 14,
                                 color: on ? '#121212' : 'rgba(255,249,230,.75)',
                                 cursor: 'pointer', transition: 'background 130ms, color 130ms',
                               }}>{t}</div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div style={{ padding: '18px 20px 0' }}>
              <div style={{ fontFamily: 'Urbanist', fontSize: 11, fontWeight: 700,
                            letterSpacing: '.1em', textTransform: 'uppercase',
                            color: 'rgba(255,249,230,.3)', marginBottom: 10 }}>Topic</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {BOOK_TOPICS.map(t => {
                  const on = t === selTopic
                  return (
                    <div key={t} onClick={() => setSelTopic(on ? null : t)} style={{
                      padding: '8px 14px', borderRadius: 999,
                      background: on ? G : 'rgba(255,249,230,.05)',
                      border: on ? `1px solid ${G}` : '1px solid rgba(255,249,230,.12)',
                      fontFamily: 'Urbanist', fontWeight: on ? 700 : 500, fontSize: 13,
                      color: on ? '#121212' : 'rgba(255,249,230,.65)',
                      cursor: 'pointer', transition: 'background 130ms, color 130ms',
                    }}>{t}</div>
                  )
                })}
              </div>
            </div>

            {/* Confirm */}
            <div style={{ padding: '22px 20px 44px' }}>
              <button onClick={handleConfirm} style={{
                width: '100%', height: 52, border: 'none',
                cursor: canConfirm ? 'pointer' : 'default', borderRadius: 14,
                background: canConfirm ? G : 'rgba(185,255,111,.2)',
                color: canConfirm ? '#121212' : 'rgba(18,18,18,.4)',
                fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, letterSpacing: -.2,
                transition: 'background 200ms, box-shadow 200ms',
                boxShadow: canConfirm ? '0 8px 24px rgba(185,255,111,.2)' : 'none',
              }}>
                {selSlot ? `Confirm · ${selSlot.date} · ${selSlot.time}` : 'Select a time to continue'}
              </button>
            </div>

          </div>
        </>
      )}

      <HomeIndicator dark />
    </div>
  )
}

// ── Bookings ──────────────────────────────────────────────────────────────────
export function BookingsScreen({ onTab, onBack, onBookAgain, onSearch, tab = 'cal' }) {
  const G = '#B9FF6F'
  const userName   = localStorage.getItem('sprout.userName') || ''
  const selfName   = userName.trim().split(' ')[0] || 'You'
  const selfInitials = userName.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'Y'
  const [sheet,          setSheet]          = useState(null)
  const [reschedDay,     setReschedDay]     = useState(null)
  const [reschedSlot,    setReschedSlot]    = useState(null)
  const [confirmed,      setConfirmed]      = useState(false)
  const [bookAgainMentor,setBookAgainMentor]= useState(null)
  const [bookAgainDay,   setBookAgainDay]   = useState(null)
  const [bookAgainSlot,  setBookAgainSlot]  = useState(null)
  const [bookAgainTopic, setBookAgainTopic] = useState('Portfolio Review')
  const [bookAgainGoal,  setBookAgainGoal]  = useState('')
  const [bookAgainDone,  setBookAgainDone]  = useState(false)
  const [msgSent,     setMsgSent]     = useState(false)
  const [msgText,     setMsgText]     = useState('')
  const [zoomCopied,  setZoomCopied]  = useState(false)
  const [meetCopied,  setMeetCopied]  = useState(false)
  const [callState,     setCallState]     = useState(null) // null | 'lobby' | 'connecting' | 'live' | 'summary'
  const [callSecs,      setCallSecs]      = useState(0)
  const [newStage,      setNewStage]      = useState(null)
  const [actionChecked, setActionChecked] = useState([])
  const [muted,         setMuted]         = useState(false)
  const [camOff,        setCamOff]        = useState(false)
  const [showNotes,     setShowNotes]     = useState(false)
  const [aiNotes,       setAiNotes]       = useState(true)
  const [selectedBg,    setSelectedBg]    = useState('none')
  const [nudge,         setNudge]         = useState(null)
  const [bookmarks,     setBookmarks]     = useState([])
  const [bookmarkFlash, setBookmarkFlash] = useState(false)
  const nudgeTimer = useRef(null)

  const SEGMENTS = [
    { at: 8,  label: 'Portfolio Review',   desc: 'Diving deep: bring your examples', color: '#B9FF6F' },
    { at: 18, label: 'Tackle your blockers', desc: 'Focus on what\'s holding you back',  color: '#FFD060' },
    { at: 25, label: 'Action items',        desc: 'Wrap up: nail down next steps',      color: '#7FDBFF' },
  ]

  useEffect(() => {
    if (callState === 'connecting') {
      const t = setTimeout(() => setCallState('live'), 2000)
      return () => clearTimeout(t)
    }
  }, [callState])

  useEffect(() => {
    if (callState !== 'live') return
    const t = setInterval(() => setCallSecs(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [callState])

  useEffect(() => {
    if (callState !== 'live') return
    const seg = SEGMENTS.find(s => s.at === callSecs)
    if (seg) {
      setNudge(seg)
      clearTimeout(nudgeTimer.current)
      nudgeTimer.current = setTimeout(() => setNudge(null), 5000)
    }
  }, [callSecs, callState])

  function addBookmark() {
    setBookmarks(b => [...b, { time: fmtTime(callSecs), id: callSecs }])
    setBookmarkFlash(true)
    setTimeout(() => setBookmarkFlash(false), 1800)
  }

  const STAGE_LABELS = ['Seed', 'Sprouting', 'Sapling', 'Leafy', 'Flowering', 'Full bloom']

  function endCall() {
    let updatedStage = null
    try {
      const plants = JSON.parse(localStorage.getItem('sprout.garden') || 'null')
      if (plants) {
        const updated = plants.map(p => {
          if (p.mentor === 'Kimberly Revilla' && p.stage < 5) {
            updatedStage = p.stage + 1
            return { ...p, stage: updatedStage, sessions: p.sessions + 1 }
          }
          return p
        })
        localStorage.setItem('sprout.garden', JSON.stringify(updated))
      }
    } catch {}
    setNewStage(updatedStage)
    setCallState('summary')
    setCallSecs(0)
  }

  function fmtTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  const AVAIL = [
    { label: 'Mon, Apr 28', slots: ['10:00 am', '2:00 pm'] },
    { label: 'Tue, Apr 29', slots: ['11:00 am', '4:30 pm'] },
    { label: 'Thu, May 1',  slots: ['9:30 am', '1:00 pm', '3:30 pm'] },
    { label: 'Fri, May 2',  slots: ['10:00 am'] },
  ]

  const [expandedSession, setExpandedSession] = useState(null)

  const PAST = [
    {
      id: 1, name: 'Justin Levesque', title: 'UIUX Designer · Meta',
      avatar: A('avatars/mentor-justin.jpg'), date: 'Apr 14', topic: 'Portfolio Review', duration: '45 min',
      summary: 'Justin identified the gap between your work quality and how it\'s presented. Lead with outcomes, not process steps.',
      notes: [
        'Restructure case studies to lead with impact metrics, not process',
        'Move the Figma DS project to the top. It\'s your strongest work',
        'Cut the student project entirely. It anchors you to junior roles',
        'Add a "what I\'d do differently" reflection to every case study',
      ],
    },
    {
      id: 2, name: 'Alex Chen', title: 'Product Designer · Amazon',
      avatar: A('avatars/mentor-alex.jpg'), date: 'Apr 07', topic: 'Interview Prep', duration: '30 min',
      summary: 'Alex gave you a repeatable interview framework. Lead with business outcomes, not craft details.',
      notes: [
        'Your "why design" story is too long. Practice a 90-second version',
        'Use STAR format for behavioral questions with a concrete action',
        'Research the team\'s recent product launches before every interview',
        'Close every interview by asking what success looks like in 90 days',
      ],
    },
  ]

  function closeSheet() { setSheet(null); setConfirmed(false); setMsgSent(false); setMsgText(''); setZoomCopied(false); setMeetCopied(false) }

  const CalIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,249,230,.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )

  return (
    <div style={{ width: '100%', height: '100%', background: '#0d0d0d', color: '#FFF9E6', position: 'relative', overflow: 'hidden' }}>
      <style>{`@keyframes calSheetUp { from{transform:translateY(100%)} to{transform:translateY(0)} }`}</style>
      <StatusBar dark />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(400px 280px at 50% 8%, rgba(185,255,111,.06), transparent 65%)' }}/>

      <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 100, boxSizing: 'border-box' }}>

        {/* Header */}
        <div style={{ paddingTop: 60, paddingLeft: 24, paddingRight: 24 }}>
          <div onClick={onBack} style={{ color: G, cursor: 'pointer', marginBottom: 22 }}>{I.back}</div>
          <div style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 32, letterSpacing: -.8, color: '#FFF9E6' }}>Sessions</div>
          <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: 'rgba(255,249,230,.38)', marginTop: 5 }}>
            1 upcoming · {PAST.length} completed
          </div>
        </div>

        {/* ── Upcoming ── */}
        <div style={{ marginTop: 28, paddingLeft: 24, paddingRight: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontFamily: 'Urbanist', fontSize: 11, fontWeight: 700,
                           color: 'rgba(255,249,230,.3)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Upcoming</span>
            <span style={{ fontFamily: 'Urbanist', fontSize: 12, fontWeight: 700, color: G }}>In 3 days</span>
          </div>

          <div style={{ borderRadius: 18, background: 'rgba(255,249,230,.04)', border: '1px solid rgba(255,249,230,.08)', padding: '18px 18px 16px' }}>

            {/* Mentor row + Join button inline */}
            <div style={{ display: 'flex', gap: 13, alignItems: 'center' }}>
              <img src={A('avatars/mentor-kimberly.jpg')} width="44" height="44"
                   style={{ borderRadius: 999, objectFit: 'cover', flexShrink: 0 }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, color: '#FFF9E6' }}>Kimberly Revilla</div>
                <div style={{ fontFamily: 'Urbanist', fontSize: 12, color: 'rgba(255,249,230,.38)', marginTop: 2 }}>Sr Product Designer · Apple</div>
              </div>
              <button onClick={() => setSheet('join')} style={{
                flexShrink: 0, height: 34, padding: '0 14px', border: 'none', borderRadius: 10, cursor: 'pointer',
                background: G, color: '#121212', fontFamily: 'Urbanist', fontWeight: 700, fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
                </svg>
                Join
              </button>
            </div>

            {/* Date / time */}
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
              <CalIcon />
              <span style={{ fontFamily: 'Urbanist', fontWeight: 600, fontSize: 13, color: 'rgba(255,249,230,.65)' }}>Thu, Apr 23</span>
              <span style={{ color: 'rgba(255,249,230,.18)', fontSize: 10, margin: '0 1px' }}>·</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,249,230,.4)" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span style={{ fontFamily: 'Urbanist', fontWeight: 600, fontSize: 13, color: 'rgba(255,249,230,.65)' }}>2:30 – 3:00 PM</span>
              <span style={{ fontFamily: 'Urbanist', fontSize: 13, fontWeight: 400, color: 'rgba(255,249,230,.35)', marginLeft: 3 }}>· 30 min</span>
            </div>

            {/* Secondary text links */}
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,249,230,.06)',
              display: 'flex', gap: 20 }}>
              <span onClick={() => setSheet('reschedule')} style={{ fontFamily: 'Urbanist', fontSize: 12,
                fontWeight: 600, color: 'rgba(255,249,230,.35)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Reschedule
              </span>
              <span onClick={() => setSheet('message')} style={{ fontFamily: 'Urbanist', fontSize: 12,
                fontWeight: 600, color: 'rgba(255,249,230,.35)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Message
              </span>
            </div>
          </div>
        </div>

        {/* ── Completed ── */}
        <div style={{ marginTop: 32, paddingLeft: 24, paddingRight: 24 }}>
          <span style={{ fontFamily: 'Urbanist', fontSize: 11, fontWeight: 700,
                         color: 'rgba(255,249,230,.3)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Completed</span>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PAST.map(b => {
              const open = expandedSession === b.name
              return (
                <div key={b.name} onClick={() => setExpandedSession(open ? null : b.name)}
                  style={{ borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
                    background: open ? 'rgba(185,255,111,.04)' : 'rgba(255,249,230,.03)',
                    border: `1px solid ${open ? 'rgba(185,255,111,.2)' : 'rgba(255,249,230,.07)'}`,
                    transition: 'border-color 200ms, background 200ms' }}>

                  {/* Session row */}
                  <div style={{ padding: '14px 16px', display: 'flex', gap: 13, alignItems: 'center' }}>
                    <img src={b.avatar} width="44" height="44"
                         style={{ borderRadius: 999, objectFit: 'cover', flexShrink: 0 }}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Primary: mentor name */}
                      <div style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 16,
                        color: '#FFF9E6', letterSpacing: -.2 }}>{b.name}</div>
                      {/* Secondary: topic · duration · date */}
                      <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: 'Urbanist', fontSize: 12, fontWeight: 600,
                          color: 'rgba(255,249,230,.5)' }}>{b.topic}</span>
                        <span style={{ width: 2, height: 2, borderRadius: '50%',
                          background: 'rgba(255,249,230,.2)', display: 'inline-block', flexShrink: 0 }}/>
                        <span style={{ fontFamily: 'Urbanist', fontSize: 12, fontWeight: 400,
                          color: 'rgba(255,249,230,.3)' }}>{b.duration}</span>
                        <span style={{ width: 2, height: 2, borderRadius: '50%',
                          background: 'rgba(255,249,230,.2)', display: 'inline-block', flexShrink: 0 }}/>
                        <span style={{ fontFamily: 'Urbanist', fontSize: 12, fontWeight: 400,
                          color: 'rgba(255,249,230,.25)' }}>{b.date}</span>
                      </div>
                    </div>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                         stroke="rgba(255,249,230,.2)" strokeWidth="2" strokeLinecap="round"
                         style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms', flexShrink: 0 }}>
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>

                  {/* AI Notes expanded */}
                  {open && (
                    <div onClick={e => e.stopPropagation()} style={{
                      borderTop: '1px solid rgba(185,255,111,.1)',
                      padding: '14px 16px 16px',
                    }}>
                      {/* Sprout AI summary */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                        <svg width="11" height="11" viewBox="0 0 20 20" fill="none">
                          <circle cx="10" cy="10" r="4" fill={G}/>
                          <path d="M10 6C10 6 8 4 5 5c1 3 3 4 5 4" stroke={G} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity=".7"/>
                          <path d="M10 6C10 6 12 4 15 5c-1 3-3 4-5 4" stroke={G} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity=".7"/>
                        </svg>
                        <span style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 11,
                          color: G, letterSpacing: '.04em', textTransform: 'uppercase' }}>AI Notes</span>
                      </div>
                      <p style={{ fontFamily: 'Urbanist', fontSize: 12, color: 'rgba(255,249,230,.5)',
                        lineHeight: 1.55, margin: '0 0 10px' }}>{b.summary}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {b.notes.map((note, ni) => (
                          <div key={ni} style={{ display: 'flex', gap: 9, alignItems: 'flex-start',
                            padding: '7px 0', borderTop: ni > 0 ? '1px solid rgba(255,249,230,.04)' : 'none' }}>
                            <div style={{ width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                              marginTop: 5, background: 'rgba(185,255,111,.5)' }}/>
                            <span style={{ fontFamily: 'Urbanist', fontSize: 12,
                              color: 'rgba(255,249,230,.6)', lineHeight: 1.45 }}>{note}</span>
                          </div>
                        ))}
                      </div>
                      {/* Book again */}
                      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,249,230,.06)',
                        display: 'flex', justifyContent: 'flex-end' }}>
                        <span onClick={() => onBookAgain?.(b.id, { date: b.date, topic: b.topic, duration: b.duration })} style={{
                          fontFamily: 'Urbanist', fontWeight: 700, fontSize: 13,
                          color: G, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 5,
                        }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                               stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          Book again
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <BottomNav active={tab} onTab={onTab} />
      <HomeIndicator dark />

      {/* ── Sheet backdrop ── */}
      {sheet && (
        <div onClick={closeSheet} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.65)',
                                           backdropFilter: 'blur(6px)', zIndex: 10 }}/>
      )}

      {/* ── Join Meeting sheet ── */}
      {sheet === 'join' && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 11,
                      background: '#161616', borderRadius: '22px 22px 0 0',
                      padding: '28px 24px 48px',
                      animation: 'calSheetUp 250ms cubic-bezier(0.32, 0.72, 0, 1)' }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: 'rgba(255,249,230,.12)', margin: '0 auto 24px' }}/>
          {/* Avatar + countdown */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 22 }}>
            <img src={A('avatars/mentor-kimberly.jpg')} width="52" height="52"
                 style={{ borderRadius: 999, objectFit: 'cover', border: '2px solid rgba(185,255,111,.3)' }}/>
            <div>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 18, color: '#FFF9E6' }}>Kimberly Revilla</div>
              <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: 'rgba(255,249,230,.4)', marginTop: 2 }}>Portfolio Review · 30 min</div>
            </div>
          </div>
          {/* Countdown pill */}
          <div style={{ padding: '14px 18px', borderRadius: 14, background: 'rgba(185,255,111,.06)',
                        border: '1px solid rgba(185,255,111,.18)', marginBottom: 20,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, color: '#FFF9E6' }}>Thu, Apr 23 · 2:30 PM</div>
              <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: 'rgba(255,249,230,.4)', marginTop: 3 }}>
                Session links activate 5 min before
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 22, color: G, letterSpacing: -1 }}>3</div>
              <div style={{ fontFamily: 'Urbanist', fontSize: 11, color: 'rgba(255,249,230,.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>days</div>
            </div>
          </div>

          {/* How to join label */}
          <div style={{ fontFamily: 'Urbanist', fontSize: 11, fontWeight: 700,
                        color: 'rgba(255,249,230,.3)', letterSpacing: '.07em', textTransform: 'uppercase',
                        marginBottom: 12 }}>How to join</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Join on this device */}
            <button onClick={() => { setSheet(null); setCallState('lobby') }} style={{
              width: '100%', height: 56, border: 'none', borderRadius: 14, cursor: 'pointer',
              background: G, color: '#121212',
              fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, letterSpacing: -.2,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: '0 6px 20px rgba(185,255,111,.25)',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l1.64-1.64a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92z"/>
              </svg>
              Join Meeting
            </button>

            {/* Copy portal link */}
            <button onClick={() => setZoomCopied(true)} style={{
              width: '100%', height: 50, borderRadius: 14, cursor: 'pointer',
              background: zoomCopied ? 'rgba(185,255,111,.08)' : 'rgba(255,249,230,.04)',
              border: `1px solid ${zoomCopied ? 'rgba(185,255,111,.3)' : 'rgba(255,249,230,.1)'}`,
              fontFamily: 'Urbanist', fontWeight: 600, fontSize: 14,
              color: zoomCopied ? G : 'rgba(255,249,230,.55)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              transition: 'background 200ms, border-color 200ms, color 200ms',
            }}>
              {zoomCopied ? (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 12l5 5 11-11"/></svg> Portal link copied</>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                  </svg>
                  Copy Sprout portal link
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', fontFamily: 'Urbanist', fontSize: 12,
                          color: 'rgba(255,249,230,.22)', lineHeight: 1.5 }}>
              Open portal link on desktop to join from your browser
            </div>

            {/* Add to calendar */}
            <button style={{ marginTop: 4, width: '100%', height: 46, border: '1px solid rgba(255,249,230,.08)',
                             borderRadius: 12, cursor: 'pointer', background: 'transparent',
                             fontFamily: 'Urbanist', fontWeight: 600, fontSize: 13,
                             color: 'rgba(255,249,230,.38)',
                             display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Add to calendar
            </button>

          </div>
        </div>
      )}

      {/* ── Reschedule sheet ── */}
      {sheet === 'reschedule' && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 11,
                      background: '#161616', borderRadius: '22px 22px 0 0',
                      padding: '28px 24px 48px',
                      animation: 'calSheetUp 250ms cubic-bezier(0.32, 0.72, 0, 1)' }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: 'rgba(255,249,230,.12)', margin: '0 auto 22px' }}/>
          <div style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 22, color: '#FFF9E6', marginBottom: 4 }}>Reschedule</div>
          <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: 'rgba(255,249,230,.38)', marginBottom: 20 }}>
            Pick a new time with Kimberly
          </div>
          {confirmed ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(185,255,111,.1)',
                            border: '1.5px solid rgba(185,255,111,.35)', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', margin: '0 auto 14px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2.2" strokeLinecap="round"><path d="M4 12l5 5 11-11"/></svg>
              </div>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 18, color: '#FFF9E6' }}>Rescheduled!</div>
              <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: 'rgba(255,249,230,.4)', marginTop: 6 }}>
                {reschedDay} · {reschedSlot}
              </div>
              <button onClick={closeSheet} style={{ marginTop: 22, width: '100%', height: 46, border: 'none', borderRadius: 12,
                                                     cursor: 'pointer', background: G, color: '#121212',
                                                     fontFamily: 'Urbanist', fontWeight: 700, fontSize: 14 }}>Done</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto' }}>
              {AVAIL.map(day => (
                <div key={day.label}>
                  <div style={{ fontFamily: 'Urbanist', fontSize: 11, fontWeight: 700,
                                color: 'rgba(255,249,230,.3)', letterSpacing: '.06em', textTransform: 'uppercase',
                                marginBottom: 8 }}>{day.label}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {day.slots.map(slot => {
                      const on = reschedDay === day.label && reschedSlot === slot
                      return (
                        <div key={slot} onClick={() => { setReschedDay(day.label); setReschedSlot(slot) }} style={{
                          padding: '9px 16px', borderRadius: 10, cursor: 'pointer',
                          background: on ? 'rgba(185,255,111,.12)' : 'rgba(255,249,230,.05)',
                          border: `1px solid ${on ? 'rgba(185,255,111,.4)' : 'rgba(255,249,230,.1)'}`,
                          fontFamily: 'Urbanist', fontWeight: on ? 700 : 500, fontSize: 13,
                          color: on ? G : 'rgba(255,249,230,.6)', transition: 'background 150ms, border-color 150ms, color 150ms',
                        }}>{slot}</div>
                      )
                    })}
                  </div>
                </div>
              ))}
              <button onClick={() => reschedDay && setConfirmed(true)} style={{
                marginTop: 8, width: '100%', height: 46, border: 'none', borderRadius: 12, cursor: 'pointer',
                background: reschedDay ? G : 'rgba(255,249,230,.07)',
                color: reschedDay ? '#121212' : 'rgba(255,249,230,.25)',
                fontFamily: 'Urbanist', fontWeight: 700, fontSize: 14,
                transition: 'background 200ms, color 200ms',
              }}>Confirm new time</button>
            </div>
          )}
        </div>
      )}

      {/* ── Message sheet ── */}
      {sheet === 'message' && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 11,
                      background: '#161616', borderRadius: '22px 22px 0 0',
                      padding: '28px 24px 48px',
                      animation: 'calSheetUp 250ms cubic-bezier(0.32, 0.72, 0, 1)' }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: 'rgba(255,249,230,.12)', margin: '0 auto 22px' }}/>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
            <img src={A('avatars/mentor-kimberly.jpg')} width="44" height="44"
                 style={{ borderRadius: 999, objectFit: 'cover', border: '2px solid rgba(185,255,111,.25)' }}/>
            <div>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, color: '#FFF9E6' }}>Message Kimberly</div>
              <div style={{ fontFamily: 'Urbanist', fontSize: 12, color: 'rgba(255,249,230,.35)', marginTop: 2 }}>Usually replies within an hour</div>
            </div>
          </div>
          {msgSent ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(185,255,111,.1)',
                            border: '1.5px solid rgba(185,255,111,.35)', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', margin: '0 auto 14px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2.2" strokeLinecap="round"><path d="M4 12l5 5 11-11"/></svg>
              </div>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, color: '#FFF9E6' }}>Message sent!</div>
              <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: 'rgba(255,249,230,.4)', marginTop: 6 }}>
                Kimberly will see it before your session.
              </div>
              <button onClick={closeSheet} style={{ marginTop: 22, width: '100%', height: 46, border: 'none', borderRadius: 12,
                                                     cursor: 'pointer', background: G, color: '#121212',
                                                     fontFamily: 'Urbanist', fontWeight: 700, fontSize: 14 }}>Done</button>
            </div>
          ) : (
            <>
              {/* Quick starters */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
                {['Running a bit late', 'Can we adjust the focus?', 'Looking forward to it!'].map(t => (
                  <div key={t} onClick={() => setMsgText(t)} style={{
                    padding: '7px 13px', borderRadius: 999, cursor: 'pointer',
                    background: msgText === t ? 'rgba(185,255,111,.1)' : 'rgba(255,249,230,.05)',
                    border: `1px solid ${msgText === t ? 'rgba(185,255,111,.35)' : 'rgba(255,249,230,.1)'}`,
                    fontFamily: 'Urbanist', fontSize: 12, fontWeight: 600,
                    color: msgText === t ? G : 'rgba(255,249,230,.5)',
                    transition: 'background 150ms, border-color 150ms, color 150ms',
                  }}>{t}</div>
                ))}
              </div>
              <textarea
                value={msgText} onChange={e => setMsgText(e.target.value)}
                placeholder="Write something to Kimberly…"
                rows={3}
                style={{
                  width: '100%', boxSizing: 'border-box', padding: '13px 15px', borderRadius: 13,
                  background: 'rgba(255,249,230,.05)', border: '1px solid rgba(255,249,230,.1)',
                  color: '#FFF9E6', fontFamily: 'Urbanist', fontSize: 14, resize: 'none',
                  outline: 'none', lineHeight: 1.5, marginBottom: 12,
                }}
              />
              <button onClick={() => msgText.trim() && setMsgSent(true)} style={{
                width: '100%', height: 46, border: 'none', borderRadius: 12, cursor: 'pointer',
                background: msgText.trim() ? G : 'rgba(255,249,230,.07)',
                color: msgText.trim() ? '#121212' : 'rgba(255,249,230,.25)',
                fontFamily: 'Urbanist', fontWeight: 700, fontSize: 14,
                transition: 'background 200ms, color 200ms',
              }}>Send message</button>
            </>
          )}
        </div>
      )}

      {/* ── Book again sheet ── */}
      {sheet === 'bookAgain' && bookAgainMentor && (
        <>
          <div onClick={closeSheet} style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(0,0,0,.5)' }}/>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 11,
                        background: '#161616', borderRadius: '22px 22px 0 0',
                        maxHeight: '88%', display: 'flex', flexDirection: 'column',
                        animation: 'calSheetUp 250ms cubic-bezier(0.32, 0.72, 0, 1)' }}>
            <div style={{ padding: '20px 24px 0', flexShrink: 0 }}>
              <div style={{ width: 36, height: 4, borderRadius: 99, background: 'rgba(255,249,230,.12)', margin: '0 auto 20px' }}/>
            </div>
            {bookAgainDone ? (
              <div style={{ padding: '0 24px 48px', textAlign: 'center', paddingTop: '24px' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(185,255,111,.1)',
                              border: '1.5px solid rgba(185,255,111,.35)', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', margin: '0 auto 14px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2.2" strokeLinecap="round"><path d="M4 12l5 5 11-11"/></svg>
                </div>
                <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 18, color: '#FFF9E6' }}>Session booked!</div>
                <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: 'rgba(255,249,230,.4)', marginTop: 6 }}>
                  {bookAgainDay} · {bookAgainSlot}
                </div>
                <button onClick={() => { closeSheet(); onBookAgain?.(bookAgainMentor?.id, { day: bookAgainDay, slot: bookAgainSlot, topic: bookAgainTopic, goal: bookAgainGoal }) }}
                  style={{ marginTop: 22, width: '100%', height: 46, border: 'none', borderRadius: 12,
                  cursor: 'pointer', background: G, color: '#121212',
                  fontFamily: 'Urbanist', fontWeight: 700, fontSize: 14 }}>Done</button>
              </div>
            ) : (
              <div style={{ overflowY: 'auto', padding: '0 24px 48px', flex: 1 }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                  <img src={bookAgainMentor.avatar} width="42" height="42"
                       style={{ borderRadius: 999, objectFit: 'cover', flexShrink: 0 }}/>
                  <div>
                    <div style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 18, color: '#FFF9E6' }}>
                      Book again
                    </div>
                    <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: 'rgba(255,249,230,.4)', marginTop: 1 }}>
                      with {bookAgainMentor.name}
                    </div>
                  </div>
                </div>

                {/* Date/time */}
                <div style={{ fontFamily: 'Urbanist', fontSize: 11, fontWeight: 700,
                  color: 'rgba(255,249,230,.3)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Pick a time
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {AVAIL.map(day => (
                    <div key={day.label}>
                      <div style={{ fontFamily: 'Urbanist', fontSize: 12, fontWeight: 600,
                                    color: 'rgba(255,249,230,.45)', marginBottom: 8 }}>{day.label}</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {day.slots.map(slot => {
                          const on = bookAgainDay === day.label && bookAgainSlot === slot
                          return (
                            <div key={slot} onClick={() => { setBookAgainDay(day.label); setBookAgainSlot(slot) }} style={{
                              padding: '9px 16px', borderRadius: 10, cursor: 'pointer',
                              background: on ? 'rgba(185,255,111,.12)' : 'rgba(255,249,230,.05)',
                              border: `1px solid ${on ? 'rgba(185,255,111,.4)' : 'rgba(255,249,230,.1)'}`,
                              fontFamily: 'Urbanist', fontWeight: on ? 700 : 500, fontSize: 13,
                              color: on ? G : 'rgba(255,249,230,.6)',
                            }}>{slot}</div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Topic */}
                <div style={{ marginTop: 22 }}>
                  <div style={{ fontFamily: 'Urbanist', fontSize: 11, fontWeight: 700,
                    color: 'rgba(255,249,230,.3)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 10 }}>Topic</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {['Portfolio Review', 'Resume Review', 'Career Advice', 'Interview Prep'].map(t => {
                      const on = bookAgainTopic === t
                      return (
                        <div key={t} onClick={() => setBookAgainTopic(t)} style={{
                          padding: '7px 14px', borderRadius: 999, cursor: 'pointer',
                          background: on ? 'rgba(185,255,111,.12)' : 'transparent',
                          border: `1.5px solid ${on ? G : 'rgba(255,249,230,.12)'}`,
                          fontFamily: 'Urbanist', fontWeight: on ? 700 : 500, fontSize: 13,
                          color: on ? G : 'rgba(255,249,230,.5)',
                        }}>{t}</div>
                      )
                    })}
                  </div>
                </div>

                {/* Goal */}
                <div style={{ marginTop: 22 }}>
                  <div style={{ fontFamily: 'Urbanist', fontSize: 11, fontWeight: 700,
                    color: 'rgba(255,249,230,.3)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 6 }}>
                    Goal for this session
                  </div>
                  <div style={{ fontFamily: 'Urbanist', fontSize: 12, color: 'rgba(255,249,230,.3)', marginBottom: 10 }}>
                    What do you want to walk away with?
                  </div>
                  <textarea
                    value={bookAgainGoal}
                    onChange={e => setBookAgainGoal(e.target.value)}
                    placeholder={`e.g. Get honest feedback on my top 2 case studies and a clear next step`}
                    rows={3}
                    style={{
                      width: '100%', boxSizing: 'border-box', padding: '13px 15px',
                      borderRadius: 13, resize: 'none', outline: 'none',
                      background: 'rgba(255,249,230,.05)',
                      border: bookAgainGoal ? '1.5px solid rgba(185,255,111,.3)' : '1px solid rgba(255,249,230,.1)',
                      color: '#FFF9E6', fontFamily: 'Urbanist', fontSize: 13, lineHeight: 1.55,
                      transition: 'border-color 150ms',
                    }}
                  />
                </div>

                <button onClick={() => bookAgainDay && setBookAgainDone(true)} style={{
                  marginTop: 20, width: '100%', height: 48, border: 'none', borderRadius: 13, cursor: 'pointer',
                  background: bookAgainDay ? G : 'rgba(255,249,230,.07)',
                  color: bookAgainDay ? '#121212' : 'rgba(255,249,230,.25)',
                  fontFamily: 'Urbanist', fontWeight: 700, fontSize: 15,
                  transition: 'background 200ms, color 200ms',
                }}>
                  {bookAgainDay ? `Confirm · ${bookAgainSlot}` : 'Pick a time first'}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Sprout Call overlay ── */}
      {callState && (() => {
        const CALL_CSS = `
          @keyframes callFadeIn { from{opacity:0} to{opacity:1} }
          @keyframes callRing   { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.18);opacity:.15} }
          @keyframes callSlideUp{ from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes callPulse  { 0%,100%{opacity:.6} 50%{opacity:1} }
          @keyframes vidBreath  { 0%,100%{transform:scale(1.04) translate(0px,0px)} 30%{transform:scale(1.05) translate(-2px,-1px)} 70%{transform:scale(1.045) translate(1px,1px)} }
        `
        return (
          <div style={{ position: 'absolute', inset: 0, zIndex: 20, background: '#0a0a0a',
                        animation: 'callFadeIn 300ms ease-out' }}>
            <style>{CALL_CSS}</style>

            {/* ── Lobby ── */}
            {callState === 'lobby' && (() => {
              const BACKGROUNDS = [
                { id: 'none',   label: 'None' },
                { id: 'blur',   label: 'Blur',   img: 'https://picsum.photos/seed/sproutblur/400/260',   layerStyle: { filter: 'blur(10px)', transform: 'scale(1.08)' } },
                { id: 'sprout', label: 'Sprout', img: 'https://picsum.photos/seed/sproutgreen/400/260' },
                { id: 'studio', label: 'Studio', img: 'https://picsum.photos/seed/sproutstudio/400/260' },
                { id: 'warm',   label: 'Warm',   img: 'https://picsum.photos/seed/sproutwarm/400/260'   },
              ]
              return (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column',
                              background: '#0d0d0d', animation: 'callFadeIn 250ms ease-out' }}>

                  {/* Back */}
                  <div style={{ padding: '54px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div onClick={() => setCallState(null)} style={{ color: G, cursor: 'pointer', fontFamily: 'Urbanist', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {I.back} Back
                    </div>
                    <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, color: '#FFF9E6' }}>Ready to join?</div>
                    <div style={{ width: 60 }}/>
                  </div>

                  {/* Self preview */}
                  <div style={{ margin: '20px 24px 0', borderRadius: 20, overflow: 'hidden',
                                height: 200, position: 'relative', flexShrink: 0, background: '#1a1a1a' }}>
                    {/* Background layer — filter isolated here so content stays sharp */}
                    {(() => {
                      const ab = BACKGROUNDS.find(b => b.id === selectedBg)
                      if (ab?.img) return <img src={ab.img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, ...(ab.layerStyle ?? {}) }} />
                      return <div style={{ position: 'absolute', inset: 0, background: '#1a1a1a', zIndex: 0 }} />
                    })()}
                    {/* avatar placeholder */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                      {camOff ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,249,230,.08)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,249,230,.3)" strokeWidth="1.5" strokeLinecap="round">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                            </svg>
                          </div>
                          <span style={{ fontFamily: 'Urbanist', fontSize: 12, color: 'rgba(255,249,230,.3)' }}>Camera is off</span>
                        </div>
                      ) : (
                        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(185,255,111,.15)',
                                      border: '2px solid rgba(185,255,111,.3)',
                                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 28, color: G }}>Y</span>
                        </div>
                      )}
                    </div>
                    {/* Mute/cam toggles overlay */}
                    <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
                                  display: 'flex', gap: 10, zIndex: 1 }}>
                      {[
                        { icon: muted ? <><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>, active: muted, toggle: () => setMuted(m => !m) },
                        { icon: camOff ? <><line x1="1" y1="1" x2="23" y2="23"/><path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h1a2 2 0 0 1 2 2v9.34"/></> : <><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></>, active: camOff, toggle: () => setCamOff(c => !c) },
                      ].map((btn, i) => (
                        <div key={i} onClick={btn.toggle} style={{
                          width: 40, height: 40, borderRadius: '50%', cursor: 'pointer',
                          background: btn.active ? 'rgba(255,69,69,.85)' : 'rgba(0,0,0,.55)',
                          backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'background 200ms',
                        }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">{btn.icon}</svg>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scrollable settings area */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 0' }}>

                    {/* Background picker */}
                    <div style={{ marginBottom: 28 }}>
                      <div style={{ fontFamily: 'Urbanist', fontSize: 11, fontWeight: 700,
                                    color: 'rgba(255,249,230,.35)', letterSpacing: '.08em', textTransform: 'uppercase',
                                    marginBottom: 14 }}>Background</div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        {BACKGROUNDS.map(bg => (
                          <div key={bg.id} onClick={() => setSelectedBg(bg.id)} style={{ flex: 1, cursor: 'pointer' }}>
                            <div style={{
                              height: 52, borderRadius: 12, overflow: 'hidden', position: 'relative',
                              border: `2px solid ${selectedBg === bg.id ? G : 'transparent'}`,
                              outline: `1px solid ${selectedBg === bg.id ? 'transparent' : 'rgba(255,249,230,.08)'}`,
                              transition: 'border-color 150ms',
                              background: '#1a1a1a',
                            }}>
                              {bg.img ? (
                                <img src={bg.img} alt="" style={{
                                  width: '100%', height: '100%', objectFit: 'cover',
                                  filter: bg.id === 'blur' ? 'blur(4px)' : 'none',
                                  transform: bg.id === 'blur' ? 'scale(1.15)' : 'none',
                                }} />
                              ) : (
                                <div style={{ width: '100%', height: '100%', background: '#1a1a1a',
                                              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,249,230,.2)" strokeWidth="2" strokeLinecap="round">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div style={{ marginTop: 5, fontFamily: 'Urbanist', fontSize: 11, fontWeight: 600,
                                          color: selectedBg === bg.id ? G : 'rgba(255,249,230,.35)',
                                          textAlign: 'center', transition: 'color 150ms' }}>{bg.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI notes toggle */}
                    <div style={{ fontFamily: 'Urbanist', fontSize: 11, fontWeight: 700,
                                  color: 'rgba(255,249,230,.35)', letterSpacing: '.08em', textTransform: 'uppercase',
                                  marginBottom: 14 }}>AI Notes</div>
                    <div style={{ padding: '16px 18px', borderRadius: 16,
                                  background: aiNotes ? 'rgba(185,255,111,.05)' : 'rgba(255,249,230,.03)',
                                  border: `1px solid ${aiNotes ? 'rgba(185,255,111,.2)' : 'rgba(255,249,230,.08)'}`,
                                  transition: 'background 250ms, border-color 250ms', marginBottom: 24 }}>
                      {/* Header row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                          <circle cx="10" cy="10" r="4" fill={G}/>
                          <path d="M10 6C10 6 8 4 5 5c1 3 3 4 5 4" stroke={G} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity=".7"/>
                          <path d="M10 6C10 6 12 4 15 5c-1 3-3 4-5 4" stroke={G} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity=".7"/>
                        </svg>
                        <span style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 14, color: '#FFF9E6', flex: 1 }}>
                          Sprout AI notes
                        </span>
                        <div onClick={() => setAiNotes(a => !a)} style={{
                          width: 42, height: 24, borderRadius: 999, cursor: 'pointer', flexShrink: 0,
                          background: aiNotes ? G : 'rgba(255,249,230,.12)',
                          position: 'relative', transition: 'background 250ms',
                        }}>
                          <div style={{
                            position: 'absolute', top: 3, borderRadius: '50%', width: 18, height: 18,
                            background: aiNotes ? '#121212' : 'rgba(255,249,230,.4)',
                            left: aiNotes ? 21 : 3, transition: 'left 250ms',
                            boxShadow: '0 1px 4px rgba(0,0,0,.3)',
                          }}/>
                        </div>
                      </div>
                      <p style={{ fontFamily: 'Urbanist', fontSize: 12, color: 'rgba(255,249,230,.4)',
                                  margin: '0 0 14px', lineHeight: 1.4 }}>
                        AI will quietly capture your session so you can focus on the conversation.
                      </p>

                      {/* Feature indicators */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 0,
                        opacity: aiNotes ? 1 : 0.3, transition: 'opacity 250ms',
                      }}>
                        {[
                          { icon: <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></>, label: 'Transcribe' },
                          { icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>, label: 'Summary' },
                          { icon: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>, label: 'Key moments' },
                        ].map((f, i) => (
                          <div key={f.label} style={{ display: 'flex', alignItems: 'center' }}>
                            {i > 0 && <div style={{ width: 1, height: 12, background: 'rgba(255,249,230,.12)', margin: '0 10px' }}/>}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                   stroke={aiNotes ? G : 'rgba(255,249,230,.3)'}
                                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {f.icon}
                              </svg>
                              <span style={{
                                fontFamily: 'Urbanist', fontWeight: 600, fontSize: 12,
                                color: aiNotes ? 'rgba(255,249,230,.55)' : 'rgba(255,249,230,.25)',
                              }}>{f.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Join button */}
                  <div style={{ padding: '12px 24px 44px', flexShrink: 0 }}>
                    <button onClick={() => setCallState('connecting')} style={{
                      width: '100%', height: 54, border: 'none', borderRadius: 14, cursor: 'pointer',
                      background: G, color: '#121212',
                      fontFamily: 'Urbanist', fontWeight: 800, fontSize: 16, letterSpacing: -.3,
                      boxShadow: '0 6px 22px rgba(185,255,111,.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l1.64-1.64a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      Join Meeting
                    </button>
                  </div>
                </div>
              )
            })()}

            {/* ── Connecting state ── */}
            {callState === 'connecting' && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', gap: 0 }}>
                {/* Pulsing rings */}
                <div style={{ position: 'relative', width: 120, height: 120,
                              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {[1,2,3].map(i => (
                    <div key={i} style={{
                      position: 'absolute', borderRadius: '50%',
                      width: 72 + i * 24, height: 72 + i * 24,
                      border: '1px solid rgba(185,255,111,.25)',
                      animation: `callRing 2s ${i * 0.35}s ease-in-out infinite`,
                    }}/>
                  ))}
                  <img src={A('avatars/mentor-kimberly.jpg')} width="72" height="72"
                       style={{ borderRadius: '50%', objectFit: 'cover',
                                border: '2.5px solid rgba(185,255,111,.5)', zIndex: 1 }}/>
                </div>
                <div style={{ marginTop: 28, fontFamily: 'Urbanist', fontWeight: 800,
                              fontSize: 22, color: '#FFF9E6', letterSpacing: -.5 }}>
                  Kimberly Revilla
                </div>
                <div style={{ marginTop: 8, fontFamily: 'Urbanist', fontSize: 14,
                              color: 'rgba(255,249,230,.4)',
                              animation: 'callPulse 1.4s ease-in-out infinite' }}>
                  Connecting…
                </div>
                <button onClick={() => setCallState(null)} style={{
                  marginTop: 64, width: 60, height: 60, borderRadius: '50%', border: 'none',
                  cursor: 'pointer', background: '#FF4545',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(255,69,69,.35)',
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45c.97.4 2 .62 3.03.62A1 1 0 0 1 21 16v3a1 1 0 0 1-1 1 18 18 0 0 1-18-18 1 1 0 0 1 1-1h3a1 1 0 0 1 1 1c0 1.03.22 2.06.62 3.03a2 2 0 0 1-.45 2.11z"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
            )}

            {/* ── Live call state ── */}
            {callState === 'live' && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column',
                            overflow: 'hidden', animation: 'callFadeIn 250ms ease-out' }}>

                {/* ── Video area ── */}
                <div style={{ flex: 1, minHeight: 0, background: '#111', position: 'relative', overflow: 'hidden' }}>
                  {/* Mentor video feed */}
                  <video
                    src={A('avatars/mentor-kimberly-call.mp4')}
                    autoPlay muted loop playsInline
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                             objectFit: 'cover', objectPosition: 'center top',
                             filter: 'contrast(1.05) saturate(0.9) brightness(0.93)' }}
                  />

                  {/* Edge vignette */}
                  <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
                                background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.45) 100%)' }}/>

                  {/* Top gradient + info bar */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2,
                                padding: '48px 18px 20px',
                                background: 'linear-gradient(to bottom, rgba(0,0,0,.75) 0%, transparent 100%)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      {/* Left: name + live status */}
                      <div>
                        <div style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 18,
                                      color: '#FFF9E6', letterSpacing: -.3 }}>
                          Kimberly Revilla
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: G,
                                        animation: 'callPulse 1.4s ease-in-out infinite' }}/>
                          <span style={{ fontFamily: 'Urbanist', fontSize: 11, color: G, fontWeight: 700,
                                         letterSpacing: '.02em' }}>Live</span>
                        </div>
                      </div>
                      {/* Right: AI notes (subtle) + timer (primary) */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                        <div style={{ padding: '4px 10px', borderRadius: 999,
                                      background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(8px)',
                                      fontFamily: 'Urbanist', fontWeight: 500, fontSize: 13,
                                      color: 'rgba(255,249,230,.45)', letterSpacing: '.04em' }}>
                          {fmtTime(callSecs)}
                        </div>
                        {aiNotes && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px',
                                        borderRadius: 999, background: 'rgba(185,255,111,.12)',
                                        border: '1px solid rgba(185,255,111,.2)' }}>
                            <div style={{ width: 4, height: 4, borderRadius: '50%', background: G,
                                          animation: 'callPulse 1.4s ease-in-out infinite' }}/>
                            <span style={{ fontFamily: 'Urbanist', fontSize: 11, fontWeight: 700,
                                           color: G, letterSpacing: '.04em' }}>AI notes on</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* AI agenda nudge banner */}
                  {nudge && (
                    <div style={{ position: 'absolute', top: 120, left: 18, right: 18, zIndex: 3,
                                  padding: '10px 14px', borderRadius: 12,
                                  background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(12px)',
                                  border: `1px solid ${nudge.color}40`,
                                  display: 'flex', alignItems: 'center', gap: 10,
                                  animation: 'callSlideUp 300ms ease-out' }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: nudge.color, flexShrink: 0 }}/>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 12,
                                      color: nudge.color }}>{nudge.label}</div>
                        <div style={{ fontFamily: 'Urbanist', fontSize: 11, color: 'rgba(255,249,230,.5)', marginTop: 1 }}>
                          {nudge.desc}
                        </div>
                      </div>
                      <div style={{ fontFamily: 'Urbanist', fontSize: 11, color: 'rgba(255,249,230,.3)', flexShrink: 0 }}>
                        Sprout AI
                      </div>
                    </div>
                  )}

                  {/* Bookmark flash toast */}
                  {bookmarkFlash && (
                    <div style={{ position: 'absolute', top: 120, left: '50%', transform: 'translateX(-50%)', zIndex: 4,
                                  padding: '8px 16px', borderRadius: 999, whiteSpace: 'nowrap',
                                  background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(10px)',
                                  border: '1px solid rgba(185,255,111,.3)',
                                  display: 'flex', alignItems: 'center', gap: 7,
                                  animation: 'callSlideUp 220ms ease-out' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill={G}>
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                      </svg>
                      <span style={{ fontFamily: 'Urbanist', fontSize: 12, fontWeight: 700, color: G }}>
                        Moment bookmarked
                      </span>
                    </div>
                  )}

                  {/* Self PiP — fixed bottom-right of video */}
                  <div style={{ position: 'absolute', bottom: 14, right: 14, zIndex: 2,
                                width: 72, height: 96, borderRadius: 12, overflow: 'hidden',
                                border: '1.5px solid rgba(255,255,255,.18)',
                                boxShadow: '0 4px 16px rgba(0,0,0,.7)',
                                background: '#1a1a1a',
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%',
                                  background: 'rgba(185,255,111,.15)', border: '1px solid rgba(185,255,111,.3)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontFamily: 'Urbanist', fontWeight: 800, fontSize: 13, color: G }}>
                      {selfInitials}
                    </div>
                    <span style={{ fontFamily: 'Urbanist', fontWeight: 600, fontSize: 11,
                                   color: 'rgba(255,249,230,.6)', letterSpacing: '.01em' }}>
                      {selfName}
                    </span>
                    {camOff && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                      </svg>
                    )}
                  </div>
                </div>

                {/* ── Control bar ── */}
                <div style={{ background: '#0d0d0d', padding: '16px 20px 38px', flexShrink: 0,
                              animation: 'callSlideUp 350ms ease-out' }}>

                  {/* Session plan strip */}
                  {!showNotes ? (
                    <div onClick={() => setShowNotes(true)} style={{
                      marginBottom: 14, padding: '10px 14px', borderRadius: 12,
                      background: 'rgba(185,255,111,.05)', border: '1px solid rgba(185,255,111,.13)',
                      display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer',
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2" strokeLinecap="round">
                        <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 14l-4.8 2.6.9-5.3L4.3 7.6l5.3-.8z"/>
                      </svg>
                      <span style={{ fontFamily: 'Urbanist', fontSize: 12, fontWeight: 600, color: 'rgba(255,249,230,.55)', flex: 1 }}>
                        View session plan
                      </span>
                      {bookmarks.length > 0 && (
                        <span style={{ fontFamily: 'Urbanist', fontSize: 11, fontWeight: 700, color: G,
                                       padding: '2px 8px', borderRadius: 999, background: 'rgba(185,255,111,.12)' }}>
                          {bookmarks.length} bookmarks
                        </span>
                      )}
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,249,230,.2)" strokeWidth="2" strokeLinecap="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </div>
                  ) : (
                    <div style={{ marginBottom: 14, padding: '11px 14px', borderRadius: 12,
                                  background: 'rgba(185,255,111,.05)', border: '1px solid rgba(185,255,111,.13)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontFamily: 'Urbanist', fontSize: 12, fontWeight: 700, color: G }}>Session plan</span>
                        <span onClick={() => setShowNotes(false)} style={{
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                          fontFamily: 'Urbanist', fontSize: 11, fontWeight: 600,
                          color: 'rgba(255,249,230,.55)',
                          background: 'rgba(255,249,230,.08)', borderRadius: 6,
                          padding: '3px 8px',
                        }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                          hide
                        </span>
                      </div>
                      {[
                        { time:'0–5 min',   label:'Set the scene',    color: G },
                        { time:'5–18 min',  label:'Portfolio Review',  color: G },
                        { time:'18–25 min', label:'Tackle blockers',   color:'#FFD060' },
                        { time:'25–30 min', label:'Action items',      color:'#7FDBFF' },
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'center',
                                              padding: '4px 0', borderBottom: i < 3 ? '1px solid rgba(255,249,230,.05)' : 'none' }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.color, flexShrink: 0 }}/>
                          <span style={{ fontFamily: 'Urbanist', fontSize: 12, color: 'rgba(255,249,230,.65)', flex: 1 }}>{item.label}</span>
                          <span style={{ fontFamily: 'Urbanist', fontSize: 11, color: 'rgba(255,249,230,.28)' }}>{item.time}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Buttons — all same vertical centre-line */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>

                    {[
                      {
                        label: muted ? 'Unmute' : 'Mute',
                        onClick: () => setMuted(m => !m),
                        size: 54,
                        bg: muted ? 'rgba(255,249,230,.85)' : 'rgba(255,249,230,.12)',
                        iconColor: muted ? '#111' : 'white',
                        icon: (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="2" width="6" height="12" rx="3"/>
                            <path d="M5 10a7 7 0 0 0 14 0"/>
                            <line x1="12" y1="19" x2="12" y2="22"/>
                            <line x1="9" y1="22" x2="15" y2="22"/>
                            {muted && <line x1="3" y1="3" x2="21" y2="21"/>}
                          </svg>
                        ),
                      },
                      {
                        label: camOff ? 'Start cam' : 'Camera',
                        onClick: () => setCamOff(c => !c),
                        size: 54,
                        bg: camOff ? 'rgba(255,249,230,.85)' : 'rgba(255,249,230,.12)',
                        iconColor: camOff ? '#111' : 'white',
                        icon: (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.882v6.236a1 1 0 0 1-1.447.894L15 14"/>
                            <rect x="2" y="7" width="13" height="10" rx="2"/>
                            {camOff && <line x1="2" y1="2" x2="22" y2="22"/>}
                          </svg>
                        ),
                      },
                      {
                        label: 'End',
                        onClick: endCall,
                        size: 62,
                        bg: '#E8453C',
                        iconColor: 'white',
                        shadow: '0 6px 22px rgba(232,69,60,.5)',
                        icon: (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                               stroke="white" strokeWidth="2.8" strokeLinecap="round">
                            <path d="M18 6L6 18M6 6l12 12"/>
                          </svg>
                        ),
                      },
                      {
                        label: 'Chat',
                        onClick: () => {},
                        size: 54,
                        bg: 'rgba(255,249,230,.12)',
                        iconColor: 'white',
                        icon: (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                          </svg>
                        ),
                      },
                      {
                        label: 'Bookmark',
                        onClick: addBookmark,
                        size: 54,
                        bg: 'rgba(255,249,230,.12)',
                        iconColor: 'white',
                        icon: (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                          </svg>
                        ),
                      },
                    ].map((btn) => (
                      <div key={btn.label} onClick={btn.onClick}
                           style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
                        <div style={{
                          width: btn.size, height: btn.size, borderRadius: '50%',
                          background: btn.bg,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: btn.shadow || 'none',
                          color: btn.iconColor,
                          transition: 'background 200ms',
                        }}>
                          {btn.icon}
                        </div>
                        <span style={{ fontFamily: 'Urbanist', fontSize: 11,
                                       color: 'rgba(255,249,230,.38)', textAlign: 'center' }}>{btn.label}</span>
                      </div>
                    ))}

                  </div>
                </div>
              </div>
            )}

            {/* ── Post-call summary ── */}
            {callState === 'summary' && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column',
                            background: '#0d0d0d', animation: 'callFadeIn 250ms ease-out', overflow: 'hidden' }}>
                <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 40 }}>

                  {/* ── Header ── */}
                  <div style={{ padding: '52px 24px 0', textAlign: 'center' }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', margin: '0 auto 14px',
                                  background: 'rgba(185,255,111,.1)', border: '1.5px solid rgba(185,255,111,.25)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2.5" strokeLinecap="round">
                        <path d="M4 12l5 5 11-11"/>
                      </svg>
                    </div>
                    <div style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 22, color: '#FFF9E6', letterSpacing: -.4 }}>
                      Session complete
                    </div>
                    <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: 'rgba(255,249,230,.32)', marginTop: 4 }}>
                      with Kimberly Revilla
                    </div>
                  </div>

                  <style>{`
                    @keyframes aiPulse {
                      0%,100% { opacity: .55; transform: scale(1); }
                      50%     { opacity: 1;   transform: scale(1.15); }
                    }
                    @keyframes taskCheck {
                      0%   { transform: scale(0.5); opacity: 0; }
                      60%  { transform: scale(1.2); }
                      100% { transform: scale(1);   opacity: 1; }
                    }
                  `}</style>

                  {/* ── 1. Plant grew — right after confirmation ── */}
                  <div style={{ margin: '20px 24px 0', display: 'flex', alignItems: 'center', gap: 10,
                                padding: '12px 0', borderBottom: '1px solid rgba(255,249,230,.06)' }}>
                    <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>🌱</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 14, color: G }}>
                        Your plant grew!
                      </div>
                      <div style={{ fontFamily: 'Urbanist', fontSize: 12, color: 'rgba(255,249,230,.38)', marginTop: 1 }}>
                        +1 stage · {newStage !== null ? STAGE_LABELS[newStage] : 'New stage'} · Kimberly's plant
                      </div>
                    </div>
                    <div style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 18, color: G, opacity: .5 }}>+1</div>
                  </div>

                  {/* ── 2. Action items — primary "what to do next" ── */}
                  {(() => {
                    const items = [
                      'Add a metric to the Figma DS case study headline',
                      'Cut the freelance project. It dilutes your story.',
                      'Add a what-I\'d-do-differently note to each case study',
                    ]
                    const doneCount = actionChecked.length
                    return (
                      <div style={{ margin: '24px 24px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 18,
                                         color: '#FFF9E6', letterSpacing: -.3 }}>
                            Next steps
                          </span>
                          <span style={{ fontFamily: 'Urbanist', fontSize: 12, fontWeight: 600,
                            color: doneCount === items.length ? G : 'rgba(255,249,230,.28)' }}>
                            {doneCount}/{items.length} done
                          </span>
                        </div>
                        <div style={{ fontFamily: 'Urbanist', fontSize: 12, color: 'rgba(255,249,230,.3)', marginBottom: 14 }}>
                          From your session with Kimberly
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {items.map((item, i) => {
                            const done = actionChecked.includes(i)
                            return (
                              <div key={i} onClick={() => setActionChecked(prev =>
                                  prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
                                )}
                                style={{ display: 'flex', gap: 14, alignItems: 'flex-start',
                                  padding: '13px 0', cursor: 'pointer',
                                  borderBottom: i < items.length - 1 ? '1px solid rgba(255,249,230,.06)' : 'none' }}>
                                <div style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 1,
                                  border: `1.5px solid ${done ? G : 'rgba(255,249,230,.18)'}`,
                                  background: done ? G : 'transparent',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  transition: 'background 200ms, border-color 200ms' }}>
                                  {done && (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                      stroke="#121212" strokeWidth="3" strokeLinecap="round"
                                      style={{ animation: 'taskCheck 200ms cubic-bezier(0.23,1,0.32,1)' }}>
                                      <path d="M4 12l5 5 11-11"/>
                                    </svg>
                                  )}
                                </div>
                                <span style={{ fontFamily: 'Urbanist', fontSize: 14, fontWeight: done ? 400 : 500,
                                  lineHeight: 1.55, flex: 1,
                                  color: done ? 'rgba(255,249,230,.28)' : 'rgba(255,249,230,.8)',
                                  textDecoration: done ? 'line-through' : 'none',
                                  transition: 'color 200ms' }}>
                                  {item}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })()}

                  {/* ── 3. AI Summary — secondary / reflective ── */}
                  <div style={{ margin: '24px 24px 0', paddingTop: 20, borderTop: '1px solid rgba(255,249,230,.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <svg style={{ animation: 'aiPulse 2.2s ease-in-out infinite', flexShrink: 0 }}
                           width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2 L13.5 9 L20 10 L13.5 11.5 L12 18 L10.5 11.5 L4 10 L10.5 9 Z"
                              fill={G} opacity=".8"/>
                      </svg>
                      <span style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 11,
                        letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,249,230,.3)' }}>
                        Session recap
                      </span>
                    </div>
                    <p style={{ fontFamily: 'Urbanist', fontSize: 13, fontWeight: 400,
                                color: 'rgba(255,249,230,.5)', lineHeight: 1.7, margin: 0 }}>
                      Kimberly helped you identify two case studies to cut and reframe your lead project around measurable impact. Your portfolio narrative should target senior IC roles, not management.
                    </p>
                  </div>

                  {/* Bookmarked moments */}
                  {bookmarks.length > 0 && (
                    <div style={{ margin: '14px 24px 0', padding: '16px 18px', borderRadius: 18,
                                  background: 'rgba(255,249,230,.03)', border: '1px solid rgba(255,249,230,.08)' }}>
                      <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 13, color: '#FFF9E6', marginBottom: 12 }}>
                        Bookmarked moments
                      </div>
                      {bookmarks.map((b, i) => (
                        <div key={b.id} style={{ display: 'flex', gap: 10, alignItems: 'center',
                                                  padding: '6px 0', borderBottom: i < bookmarks.length - 1 ? '1px solid rgba(255,249,230,.06)' : 'none' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill={G} opacity=".7">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                          </svg>
                          <span style={{ fontFamily: 'Urbanist', fontSize: 13, color: 'rgba(255,249,230,.55)', flex: 1 }}>Moment at {b.time}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTAs */}
                  <div style={{ margin: '20px 24px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <button onClick={() => { setCallState(null); setBookmarks([]); setMuted(false); setCamOff(false); setShowNotes(false); onTab?.('garden') }}
                            style={{ width: '100%', height: 52, border: 'none', borderRadius: 13, cursor: 'pointer',
                                     background: G, color: '#121212', fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16,
                                     boxShadow: '0 6px 20px rgba(185,255,111,.25)',
                                     display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22V13"/>
                        <path d="M12 17C12 17 7 15 6 9c3 .5 6 3 6 8z" fill="#121212"/>
                        <path d="M12 14C12 14 17 12 18 6c-3 .5-6 3-6 8z" fill="#121212"/>
                        <path d="M5 22h14"/>
                      </svg>
                      View my garden
                    </button>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => {
                          setCallState(null); setBookmarks([]); setMuted(false); setCamOff(false); setShowNotes(false)
                          onBookAgain?.()
                        }}
                        style={{ flex: 1, height: 44, border: '1px solid rgba(185,255,111,.2)',
                                 borderRadius: 13, cursor: 'pointer', background: 'rgba(185,255,111,.06)',
                                 fontFamily: 'Urbanist', fontWeight: 700, fontSize: 13,
                                 color: G }}>
                        Book again
                      </button>
                      <button
                        onClick={() => {
                          setCallState(null); setBookmarks([]); setMuted(false); setCamOff(false); setShowNotes(false)
                          onSearch?.()
                        }}
                        style={{ flex: 1, height: 44, border: '1px solid rgba(255,249,230,.1)',
                                 borderRadius: 13, cursor: 'pointer', background: 'transparent',
                                 fontFamily: 'Urbanist', fontWeight: 600, fontSize: 13,
                                 color: 'rgba(255,249,230,.45)' }}>
                        Find a mentor
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })()}
    </div>
  )
}
