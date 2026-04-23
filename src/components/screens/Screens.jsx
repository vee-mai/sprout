import { useState } from 'react'
import { C, I, Btn, Chip, Input, A } from '../atoms.jsx'
import { StatusBar, HomeIndicator } from '../Phone.jsx'

// ── Mentor data ──────────────────────────────────────────────────────────────
export const MENTORS = [
  { id: 1, name: 'Justin Levesque',    title: 'UIUX Designer at Meta',           seniority: 'Senior', industry: 'AI',      years: 6,  longterm: true,  rating: 4.9, count: 29, avatar: A('avatars/mentor-justin.jpg') },
  { id: 2, name: 'Alex Chen',          title: 'Product Designer at Amazon',      seniority: 'Senior', industry: 'AI',      years: 3,  longterm: true,  rating: 4.9, count: 9,  avatar: A('avatars/mentor-alex.jpg') },
  { id: 3, name: 'Kimberly Revilla',   title: 'Sr Product Designer at Apple',    seniority: 'Senior', industry: 'Hardware', years: 8,  longterm: false, rating: 4.8, count: 42, avatar: A('avatars/mentor-kimberly.jpg') },
  { id: 4, name: 'Priya Patel',        title: 'Design Lead at Stripe',            seniority: 'Lead',   industry: 'Fintech', years: 11, longterm: true,  rating: 5.0, count: 18, avatar: A('avatars/mentor-a.jpg') },
  { id: 5, name: 'Marcus B.',          title: 'Senior Designer at Google',        seniority: 'Senior', industry: 'Tech',    years: 7,  longterm: true,  rating: 4.7, count: 31, avatar: A('avatars/mentor-b.jpg') },
]

// ── Bottom nav ────────────────────────────────────────────────────────────────
export function BottomNav({ active = 'home', onTab }) {
  const leafIcon = (a) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? C.green : C.cream} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8 6 8 12 12 14C16 12 16 6 12 2Z" fill={a ? C.green : 'none'}/>
      <path d="M12 14Q10 19 5 20Q9 22 12 22Q15 22 19 20Q14 19 12 14Z"/>
    </svg>
  )
  const items = [
    { id: 'home',   icon: I.home,  label: 'Home' },
    { id: 'chat',   icon: I.chat,  label: 'Chat' },
    { id: 'garden', icon: leafIcon, label: 'Garden' },
    { id: 'cal',    icon: I.cal,   label: 'Bookings' },
    { id: 'me',     icon: I.user,  label: 'Me' },
  ]
  return (
    <div style={{ position: 'absolute', left: 24, right: 24, bottom: 28, height: 56, background: C.ink2, borderRadius: 999, padding: 6, display: 'flex', alignItems: 'center' }}>
      {items.map(it => {
        const a = active === it.id
        return (
          <div key={it.id} onClick={() => onTab?.(it.id)} style={{
            flex: 1, height: '100%', borderRadius: 999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: a ? 'rgba(185,255,111,.1)' : 'transparent',
            color: a ? C.green : C.cream, cursor: 'pointer',
          }}>
            {it.icon(a)}
            {a && <span style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 13 }}>{it.label}</span>}
          </div>
        )
      })}
    </div>
  )
}

// ── Sign In ───────────────────────────────────────────────────────────────────
export function SignInScreen({ onNext, onBack }) {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden' }}>
      <StatusBar dark={false} />
      <div style={{ position: 'absolute', left: 20, top: 76, right: 20 }}>
        <div onClick={onBack} style={{ color: C.ink, cursor: 'pointer' }}>{I.back}</div>
        <div style={{ marginTop: 16, fontFamily: 'Urbanist', fontWeight: 400, fontSize: 14, color: C.ink }}>Go ahead and set up your account</div>
        <div style={{ marginTop: 2, fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, color: C.ink }}>Register to start your journey</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 196, bottom: 0, background: C.black, borderRadius: 40, padding: '60px 26px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
        <div style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 72, color: C.green, letterSpacing: -2, lineHeight: 1 }}>Sprout</div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input icon={I.mail} placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
          <Input icon={I.lock} placeholder="Password" type="password" value={pass} onChange={e => setPass(e.target.value)} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: C.cream, fontFamily: 'Urbanist', fontWeight: 500, fontSize: 14 }}>
            <label style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}>
              <span style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${C.cream}` }} />
              Remember me
            </label>
            <span style={{ cursor: 'pointer' }}>Forget Password?</span>
          </div>
          <Btn variant="primaryInter" style={{ width: '100%' }} onClick={onNext}>Login</Btn>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.cream, fontFamily: 'Urbanist', fontSize: 12 }}>
            <div style={{ flex: 1, height: 1, background: C.cream, opacity: .4 }} />
            <span>Or login with</span>
            <div style={{ flex: 1, height: 1, background: C.cream, opacity: .4 }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, background: C.cream, borderRadius: 12, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
              <img src={A('icons/google.png')} width="20" height="20" style={{ objectFit: 'contain' }} />
              <span style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 14, color: C.ink }}>Google</span>
            </div>
            <div style={{ flex: 1, background: C.cream, borderRadius: 12, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
              <img src={A('icons/linkedin.png')} width="20" height="20" style={{ objectFit: 'contain' }} />
              <span style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 14, color: C.ink }}>LinkedIn</span>
            </div>
          </div>
        </div>
      </div>
      <HomeIndicator dark />
    </div>
  )
}

// ── Home ──────────────────────────────────────────────────────────────────────
function MentorCard({ m, onOpen }) {
  return (
    <div style={{ flex: '0 0 239px', background: C.creamSoft, borderRadius: 12, padding: 20, color: C.ink, position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: 51, height: 51, borderRadius: 999, background: `url(${m.avatar}) center/cover, #D9D9D9` }} />
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 16 }}>{m.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', fontFamily: 'Urbanist', fontSize: 12 }}>
            <span style={{ color: C.black }}>{I.star}</span>
            {m.rating} ({m.count})
          </div>
        </div>
      </div>
      <div style={{ marginTop: 12, fontFamily: 'Urbanist', fontWeight: 300, fontSize: 12 }}>{m.seniority}</div>
      <div style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 14 }}>{m.title}</div>
      <div style={{ marginTop: 12, background: C.greenDim, borderRadius: 6, padding: '8px 12px', display: 'flex', justifyContent: 'space-between' }}>
        {[['Industry', m.industry], ['Years', m.years], ['Long-term', m.longterm ? '✓' : '—']].map(([label, val], idx) => (
          <>
            {idx > 0 && <div key={`div-${idx}`} style={{ width: 1, background: C.gray500, opacity: .5 }} />}
            <div key={label} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 10, color: C.gray800, letterSpacing: '.01em' }}>{label}</div>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 14, color: C.gray800 }}>{val}</div>
            </div>
          </>
        ))}
      </div>
      <div style={{ display: 'flex', marginTop: 14, alignItems: 'center' }}>
        <div onClick={onOpen} style={{ background: C.black, color: C.white, fontFamily: 'Urbanist', fontWeight: 500, fontSize: 12, padding: '8px 14px', borderRadius: 12, cursor: 'pointer' }}>Book now</div>
        <div onClick={onOpen} style={{ color: C.ink, fontFamily: 'Urbanist', fontWeight: 500, fontSize: 12, padding: '8px 14px', cursor: 'pointer' }}>See details</div>
      </div>
    </div>
  )
}

export function HomeScreen({ onOpenMentor, onTab, tab = 'home', onOpenSearch }) {
  const [filters, setFilters] = useState(['Remote', 'Senior positions'])
  return (
    <div style={{ width: '100%', height: '100%', background: C.ink, color: C.cream, position: 'relative' }}>
      <StatusBar dark />
      <div style={{ paddingTop: 60, paddingLeft: 20, paddingRight: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 34, color: C.green, letterSpacing: -1 }}>Sprout</div>
        </div>
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
            <img src={A('avatars/user-lisa.png')} width="36" height="36" style={{ borderRadius: 999, objectFit: 'cover' }} />
            <div style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 16, color: C.cream }}>Welcome Lisa</div>
          </div>
          <div>
            <div style={{ fontFamily: 'Urbanist', fontSize: 14, color: C.white }}>Location</div>
            <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 14, color: C.white }}>New York City</div>
          </div>
        </div>
        {/* Search bar (tappable overlay handles the push in App) */}
        <div onClick={onOpenSearch} style={{ marginTop: 16, background: 'rgba(255,249,230,.08)', borderRadius: 12, height: 52, display: 'flex', alignItems: 'center', paddingLeft: 16, gap: 10, cursor: 'pointer' }}>
          <span style={{ color: 'rgba(255,249,230,.5)' }}>{I.search}</span>
          <span style={{ fontFamily: 'Urbanist', fontSize: 14, color: 'rgba(255,249,230,.5)' }}>Search mentors…</span>
        </div>
        {/* Ideal mentor filter card */}
        <div style={{ marginTop: 16, background: 'rgba(255,255,255,.10)', borderRadius: 12, padding: '19px 15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 22, color: C.cream }}>My Ideal Mentor</div>
            <div style={{ width: 31, height: 31, borderRadius: 8, background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.green, cursor: 'pointer' }}>{I.sliders}</div>
          </div>
          <div style={{ marginTop: 6, display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {filters.map((f, i) => (
              <Chip key={f}>
                {f}
                <span onClick={() => setFilters(filters.filter((_, j) => j !== i))} style={{ display: 'flex', marginLeft: 4, cursor: 'pointer' }}>{I.x}</span>
              </Chip>
            ))}
            <Chip bordered={false}>{I.plus}</Chip>
          </div>
        </div>
        {/* Top matches */}
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 20, color: C.cream }}>Top matches</div>
          <div style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 14, color: C.green, cursor: 'pointer' }}>Refresh</div>
        </div>
        <div style={{ fontFamily: 'Urbanist', fontSize: 12, color: 'rgba(255,249,230,.6)' }}>6 matches found</div>
      </div>
      <div style={{ marginTop: 12, paddingLeft: 20, display: 'flex', gap: 12, overflowX: 'auto', overflowY: 'hidden', paddingBottom: 80, scrollbarWidth: 'none' }}>
        {MENTORS.map(m => <MentorCard key={m.id} m={m} onOpen={() => onOpenMentor(m)} />)}
        <div style={{ flex: '0 0 8px' }} />
      </div>
      <BottomNav active={tab} onTab={onTab} />
      <HomeIndicator dark />
    </div>
  )
}

// ── Mentor Bio ────────────────────────────────────────────────────────────────
export function MentorBioScreen({ mentor, onBack, onBook, onMessage }) {
  const [tab, setTab] = useState('overview')
  if (!mentor) return null
  return (
    <div style={{ width: '100%', height: '100%', background: C.ink, color: C.cream, position: 'relative' }}>
      <StatusBar dark />
      <div style={{ paddingTop: 60, paddingLeft: 20, paddingRight: 20 }}>
        <div onClick={onBack} style={{ color: C.green, cursor: 'pointer' }}>{I.back}</div>
        <div style={{ marginTop: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
          <img src={mentor.avatar} width="80" height="80" style={{ borderRadius: 999, objectFit: 'cover' }} />
          <div>
            <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 22, color: C.cream }}>{mentor.name}</div>
            <div style={{ fontFamily: 'Urbanist', fontSize: 14, color: C.cream, opacity: .8 }}>{mentor.title}</div>
            <div style={{ marginTop: 4, display: 'flex', gap: 6, alignItems: 'center', fontFamily: 'Urbanist', fontSize: 13, color: C.green }}>
              {I.star} {mentor.rating} <span style={{ color: C.cream, opacity: .6 }}>({mentor.count} sessions)</span>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 20, background: C.greenDim, borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', color: C.gray800 }}>
          {[['INDUSTRY', mentor.industry], ['YEARS', mentor.years], ['LONG-TERM', mentor.longterm ? '✓' : '—']].map(([label, val], idx) => (
            <>
              {idx > 0 && <div key={`d-${idx}`} style={{ width: 1, background: C.gray500, opacity: .5 }} />}
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 500, fontSize: 10, letterSpacing: '.01em' }}>{label}</div>
                <div style={{ fontWeight: 500, fontSize: 16 }}>{val}</div>
              </div>
            </>
          ))}
        </div>
        <div style={{ marginTop: 22, background: 'rgba(255,255,255,.17)', borderRadius: 12, padding: 5, display: 'flex', gap: 6 }}>
          {[['overview', 'Overview'], ['reviews', 'Reviews']].map(([id, l]) => (
            <div key={id} onClick={() => setTab(id)} style={{
              flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 12,
              background: tab === id ? C.cream : 'transparent',
              color: tab === id ? C.ink : C.cream,
              fontFamily: 'Urbanist', fontWeight: 500, fontSize: 14, cursor: 'pointer',
            }}>{l}</div>
          ))}
        </div>
        <div style={{ marginTop: 20, fontFamily: 'Urbanist', fontSize: 15, color: C.cream, lineHeight: 1.6, opacity: .9 }}>
          {tab === 'overview' ? (
            <>I've spent {mentor.years} years in {mentor.industry?.toLowerCase?.()}, helping teams ship products people actually use. Happy to dig into portfolio critiques, interview prep, or bigger career questions — whichever feels most useful for where you are.</>
          ) : (
            <>
              <div style={{ opacity: .7, fontSize: 13 }}>{mentor.count} total sessions · avg {mentor.rating}/5</div>
              <div style={{ marginTop: 10 }}>"Really thoughtful and specific feedback on my portfolio. Walked away with three concrete next steps." — Priya</div>
              <div style={{ marginTop: 10 }}>"Straight-talking and generous with time. Would book again." — Dan</div>
            </>
          )}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 70, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Btn variant="primaryInter" onClick={onBook} style={{ width: '100%' }}>Book now</Btn>
        <div onClick={onMessage} style={{ textAlign: 'center', color: C.cream, fontFamily: 'Urbanist', fontWeight: 500, fontSize: 14, display: 'flex', justifyContent: 'center', gap: 6, alignItems: 'center', cursor: 'pointer' }}>
          {I.plane} Message First
        </div>
      </div>
      <HomeIndicator dark />
    </div>
  )
}

// ── Bookings ──────────────────────────────────────────────────────────────────
export function BookingsScreen({ onTab, onBack, tab = 'cal' }) {
  return (
    <div style={{ width: '100%', height: '100%', background: C.ink, color: C.cream, position: 'relative' }}>
      <StatusBar dark />
      <div style={{ paddingTop: 60, paddingLeft: 20, paddingRight: 20 }}>
        <div onClick={onBack} style={{ color: C.green, cursor: 'pointer' }}>{I.back}</div>
        <div style={{ marginTop: 20, fontFamily: 'Urbanist', fontWeight: 500, fontSize: 30, color: C.cream }}>Bookings</div>
        <div style={{ marginTop: 4, fontFamily: 'Urbanist', fontSize: 14, color: C.cream, opacity: .7 }}>Upcoming and past sessions</div>

        <div style={{ marginTop: 24, fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, color: C.cream }}>Upcoming</div>
        <div style={{ marginTop: 12, background: 'rgba(255,249,230,.08)', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <img src={A('avatars/mentor-kimberly.jpg')} width="35" height="35" style={{ borderRadius: 999, objectFit: 'cover' }} />
              <div style={{ marginTop: 6, fontFamily: 'Urbanist', fontWeight: 500, fontSize: 16, color: C.white }}>Kimberly Revilla</div>
            </div>
            <div style={{ textAlign: 'right', color: C.green, fontFamily: 'Urbanist' }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Thu Apr 23</div>
              <div style={{ fontSize: 14, opacity: .9 }}>2:30 – 3:00 PM</div>
            </div>
          </div>
          <div style={{ marginTop: 18, display: 'flex', gap: 4 }}>
            <Btn size="sm" variant="primary">Join Meeting</Btn>
            <Btn size="sm" variant="ghost" style={{ color: C.cream, border: '1px solid rgba(255,249,230,.2)' }}>Reschedule</Btn>
            <Btn size="sm" variant="ghost" style={{ color: C.cream, border: '1px solid rgba(255,249,230,.2)' }}>Message</Btn>
          </div>
        </div>

        <div style={{ marginTop: 28, fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, color: C.cream }}>Past</div>
        {[
          { name: 'Justin Levesque', date: 'Apr 14', topic: 'Portfolio Review' },
          { name: 'Alex Chen',       date: 'Apr 07', topic: 'Interview Prep' },
        ].map(b => (
          <div key={b.name} style={{ marginTop: 10, background: 'rgba(255,249,230,.05)', borderRadius: 12, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 15, color: C.cream }}>{b.name}</div>
              <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: C.cream, opacity: .7 }}>{b.topic}</div>
            </div>
            <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: C.cream, opacity: .7 }}>{b.date}</div>
          </div>
        ))}
      </div>
      <BottomNav active={tab} onTab={onTab} />
      <HomeIndicator dark />
    </div>
  )
}
