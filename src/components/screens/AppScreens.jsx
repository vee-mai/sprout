import { useState, useRef, useEffect, Fragment } from 'react'
import { C, T, SP, I, A } from '../atoms.jsx'
import { StatusBar, HomeIndicator } from '../Phone.jsx'
import { BottomNav } from './Screens.jsx'

const shortName = (full) => {
  const parts = full.trim().split(' ')
  return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0]
}

const THREADS = [
  { id: 1, name: 'Kimberly Revilla', avatar: 'avatars/mentor-kimberly.jpg',
    last: 'Looking forward to our session on Thursday!', time: '2m', unread: 2, online: true, pinned: true },
  { id: 2, name: 'Justin White', avatar: 'avatars/mentor-justin.jpg',
    last: 'Shared the portfolio feedback doc — take a look', time: '1h', unread: 0, online: true },
  { id: 3, name: 'Alexander Ng', avatar: 'avatars/mentor-alex.jpg',
    last: "Here's that article I mentioned on spatial UI", time: 'Yesterday', unread: 0, online: false },
  { id: 4, name: 'Priya Patel', avatar: 'avatars/mentor-a.jpg',
    last: 'Happy to reschedule — just let me know', time: 'Wed', unread: 0, online: false },
  { id: 5, name: 'Noah Brooks', avatar: 'avatars/mentor-b.jpg',
    last: 'Great session. Next one same time?', time: 'Apr 12', unread: 0, online: false },
]

export function ChatInboxScreen({ onOpenThread, onTab, tab = 'chat' }) {
  return (
    <div style={{ width: '100%', height: '100%', background: C.ink, color: C.cream, position: 'relative' }}>
      <StatusBar dark />

      <div style={{
        paddingTop: SP.screenTop, paddingLeft: SP.screenH, paddingRight: SP.screenH,
        paddingBottom: SP.navBottom, height: '100%', overflowY: 'auto', boxSizing: 'border-box',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ ...T.screenTitle }}>Messages</div>
        </div>

        {/* Search bar */}
        <div style={{
          marginTop: SP.xl, display: 'flex', alignItems: 'center', gap: SP.sm,
          height: 44, padding: '0 14px', borderRadius: SP.md,
          background: 'rgba(255,249,230,.06)', border: '1px solid rgba(255,249,230,.08)',
        }}>
          <span style={{ color: C.cream, opacity: .45, display: 'flex' }}>{I.search}</span>
          <input
            placeholder="Search conversations"
            style={{
              flex: 1, border: 0, background: 'transparent', outline: 'none',
              color: C.cream, ...T.body,
            }}
          />
        </div>

        {/* Thread list */}
        <div style={{ marginTop: SP.sm }}>
          {THREADS.map((t, i) => (
            <div key={t.id} onClick={() => onOpenThread(t)} style={{
              display: 'flex', gap: SP.md, alignItems: 'center', padding: `14px 0`,
              borderBottom: i < THREADS.length - 1 ? '1px solid rgba(255,249,230,.06)' : 'none',
              cursor: 'pointer',
            }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img src={A(t.avatar)} width="48" height="48" style={{ borderRadius: 999, objectFit: 'cover', display: 'block' }}/>
                {t.online && (
                  <div style={{
                    position: 'absolute', bottom: 1, right: 1,
                    width: 11, height: 11, borderRadius: 999,
                    background: C.green, border: `2px solid ${C.ink}`,
                  }}/>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: SP.sm }}>
                  <div style={{
                    ...T.cardTitle,
                    fontWeight: t.unread ? 700 : 500,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    {shortName(t.name)}
                    {t.pinned && <span style={{ ...T.micro, color: C.green, opacity: 1 }}>● upcoming</span>}
                  </div>
                  <div style={{
                    ...T.micro, flexShrink: 0,
                    color: t.unread ? C.green : 'rgba(255,249,230,.45)',
                    opacity: 1,
                  }}>{t.time}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 3, gap: SP.sm }}>
                  <div style={{
                    ...T.caption, opacity: t.unread ? .8 : .5,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1,
                  }}>{t.last}</div>
                  {t.unread > 0 && (
                    <div style={{
                      minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999, flexShrink: 0,
                      background: C.green, color: C.ink,
                      fontFamily: 'Urbanist', fontWeight: 700, fontSize: 11,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{t.unread}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active={tab} onTab={onTab} />
      <HomeIndicator dark />
    </div>
  )
}

const SEED_MSGS = () => ([
  { id: 1, from: 'them', t: 'Hey! So glad we connected on Sprout.', time: 'Mon 10:02' },
  { id: 2, from: 'them', t: 'I took a look at your portfolio. Lots to unpack.', time: 'Mon 10:02' },
  { id: 3, from: 'me',   t: 'Thank you so much for making time!', time: 'Mon 10:14' },
  { id: 4, from: 'me',   t: "The onboarding case study is the one I'm least confident about. Would love your take.", time: 'Mon 10:15' },
  { id: 5, from: 'them', t: "Let's dig into that on Thursday. I'll bring a few examples from work that are similar.", time: 'Tue 9:40' },
  { id: 6, from: 'them', t: 'Looking forward to our session!', time: '2m' },
])

const NEW_THREAD_MSGS = () => ([
  { id: 1, from: 'them', t: 'Hi! I saw you found me through Sprout. Excited to connect.', time: 'Just now' },
  { id: 2, from: 'them', t: 'Feel free to introduce yourself and share what you are working on. No pressure to have it all figured out.', time: 'Just now' },
])

export function ChatThreadScreen({ thread, onBack }) {
  const t = thread || THREADS[0]
  const [msgs, setMsgs] = useState(() => t.isNew ? NEW_THREAD_MSGS() : SEED_MSGS())
  const [draft, setDraft] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [msgs])

  const send = () => {
    const v = draft.trim()
    if (!v) return
    setMsgs(m => [...m, { id: Date.now(), from: 'me', t: v, time: 'Now' }])
    setDraft('')
    setTimeout(() => {
      setMsgs(m => [...m, { id: Date.now() + 1, from: 'them', t: "Got it. Let's talk about this Thursday.", time: 'Now' }])
    }, 900)
  }

  return (
    <div style={{ width: '100%', height: '100%', background: C.ink, color: C.cream, position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <StatusBar dark />

      {/* Nav bar */}
      <div style={{
        paddingTop: SP.screenTop, paddingLeft: SP.screenH, paddingRight: SP.screenH, paddingBottom: SP.lg,
        display: 'flex', alignItems: 'center', gap: SP.md,
        borderBottom: '1px solid rgba(255,249,230,.06)', flexShrink: 0,
      }}>
        <div onClick={onBack} style={{ color: C.green, cursor: 'pointer', display: 'flex' }}>{I.back}</div>
        <img src={A(t.avatar)} width="36" height="36" style={{ borderRadius: 999, objectFit: 'cover', display: 'block' }}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...T.cardTitle }}>{shortName(t.name)}</div>
          <div style={{ ...T.micro, color: t.online ? C.green : 'rgba(255,249,230,.45)', opacity: 1, marginTop: 2 }}>
            {t.online ? 'Online now' : 'Last seen today'}
          </div>
        </div>
        <button style={{
          width: 34, height: 34, borderRadius: 999, border: 'none', cursor: 'pointer',
          background: 'rgba(255,249,230,.06)', color: C.cream,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.9v3.1a2 2 0 01-2.2 2A19.8 19.8 0 012 4.2 2 2 0 014 2h3.1a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1l-1.3 1.3a16 16 0 006.1 6.1l1.3-1.3a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z"/>
          </svg>
        </button>
      </div>

      {/* Upcoming session banner */}
      {t.pinned && !t.isNew && (
        <div style={{
          margin: `${SP.md}px ${SP.screenH}px 0`, padding: `${SP.sm}px ${SP.md}px`,
          borderRadius: SP.md, flexShrink: 0,
          background: 'rgba(185,255,111,.1)', border: '1px solid rgba(185,255,111,.25)',
          display: 'flex', alignItems: 'center', gap: SP.sm,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: SP.sm, flexShrink: 0,
            background: C.green, color: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {I.cal(true)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 13, color: C.cream }}>Thu Apr 24 · 2:30 pm</div>
            <div style={{ ...T.caption, marginTop: 1 }}>Resume review · 30 min</div>
          </div>
          <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 12, color: C.green, cursor: 'pointer', flexShrink: 0 }}>Join →</div>
        </div>
      )}

      {/* Message list */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: `${SP.md}px ${SP.screenH}px ${SP.sm}px`, display: 'flex', flexDirection: 'column', gap: SP.sm }}>
        {msgs.map((m, i) => {
          const prev = msgs[i - 1]
          const showTime = !prev || prev.time !== m.time
          return (
            <Fragment key={m.id}>
              {showTime && (
                <div style={{ alignSelf: 'center', ...T.micro, opacity: .5, margin: `${SP.sm}px 0` }}>
                  {m.time}
                </div>
              )}
              <div style={{
                maxWidth: '78%', padding: `${SP.sm}px ${SP.md}px`, borderRadius: SP.lg,
                alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start',
                background: m.from === 'me' ? C.green : 'rgba(255,249,230,.08)',
                color: m.from === 'me' ? C.ink : C.cream,
                borderBottomRightRadius: m.from === 'me' ? SP.xs : SP.lg,
                borderBottomLeftRadius:  m.from === 'them' ? SP.xs : SP.lg,
                fontFamily: 'Urbanist', fontSize: 14, lineHeight: 1.45,
              }}>{m.t}</div>
            </Fragment>
          )
        })}
      </div>

      {/* Input bar */}
      <div style={{
        padding: `${SP.sm}px ${SP.screenH}px 24px`, flexShrink: 0,
        borderTop: '1px solid rgba(255,249,230,.06)',
        display: 'flex', gap: SP.sm, alignItems: 'center',
      }}>
        <button style={{
          width: 36, height: 36, borderRadius: 999, border: 'none', cursor: 'pointer', flexShrink: 0,
          background: 'rgba(255,249,230,.08)', color: C.cream,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{I.plus}</button>
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send() }}
          placeholder="Message"
          style={{
            flex: 1, height: 40, padding: '0 16px', borderRadius: 999,
            background: 'rgba(255,249,230,.08)', border: '1px solid rgba(255,249,230,.08)',
            color: C.cream, fontFamily: 'Urbanist', fontSize: 14, outline: 'none',
          }}
        />
        <button onClick={send} style={{
          width: 40, height: 40, borderRadius: 999, border: 'none', cursor: 'pointer', flexShrink: 0,
          background: draft.trim() ? C.green : 'rgba(255,249,230,.12)',
          color: draft.trim() ? C.ink : C.cream,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .15s',
        }}>{I.plane}</button>
      </div>

      <HomeIndicator dark />
    </div>
  )
}

export function MeScreen({ onTab, tab = 'me', onEditPrefs, onRematch }) {
  const [theme,        setTheme]        = useState('Dark')
  const [portfolioUrl, setPortfolioUrl] = useState(() => {
    try { return localStorage.getItem('sprout.portfolioUrl') || '' } catch { return '' }
  })
  const [resumeName,   setResumeName]   = useState(() => {
    try { return localStorage.getItem('sprout.resumeName') || '' } catch { return '' }
  })
  const [userName,     setUserName]     = useState(() => {
    try { return localStorage.getItem('sprout.userName') || '' } catch { return '' }
  })
  const [userRole,     setUserRole]     = useState(() => {
    try { return localStorage.getItem('sprout.userRole') || '' } catch { return '' }
  })
  const [avatarSrc,    setAvatarSrc]    = useState(() => {
    try { return localStorage.getItem('sprout.avatarSrc') || '' } catch { return '' }
  })
  const resumeInputRef = useRef(null)
  const avatarInputRef = useRef(null)

  const handlePortfolioChange = e => {
    setPortfolioUrl(e.target.value)
    try { localStorage.setItem('sprout.portfolioUrl', e.target.value) } catch {}
  }
  const handleResumeChange = e => {
    const file = e.target.files?.[0]
    if (!file) return
    setResumeName(file.name)
    try { localStorage.setItem('sprout.resumeName', file.name) } catch {}
  }
  const handleNameChange = e => {
    setUserName(e.target.value)
    try { localStorage.setItem('sprout.userName', e.target.value) } catch {}
  }
  const handleRoleChange = e => {
    setUserRole(e.target.value)
    try { localStorage.setItem('sprout.userRole', e.target.value) } catch {}
  }
  const handleAvatarChange = e => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setAvatarSrc(ev.target.result)
      try { localStorage.setItem('sprout.avatarSrc', ev.target.result) } catch {}
    }
    reader.readAsDataURL(file)
  }

  const [activeSheet,    setActiveSheet]    = useState(null)
  const [notifToggles,   setNotifToggles]   = useState({ sessionReminders: true, messages: true, gardenUpdates: false, weeklyDigest: true })
  const [availDays,      setAvailDays]      = useState(['Mon', 'Tue', 'Thu'])
  const [availTime,      setAvailTime]      = useState('Evenings')
  const [availStart,     setAvailStart]     = useState('9:00 AM')
  const [availEnd,       setAvailEnd]       = useState('11:00 AM')

  const toggleNotif = key => setNotifToggles(p => ({ ...p, [key]: !p[key] }))
  const toggleDay   = d   => setAvailDays(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d])

  const TIME_SLOTS = (() => {
    const slots = []
    for (let h = 6; h <= 22; h++) {
      ['00', '30'].forEach(m => {
        if (h === 22 && m === '30') return
        const ampm = h < 12 ? 'AM' : 'PM'
        const h12  = h === 0 ? 12 : h > 12 ? h - 12 : h
        slots.push(`${h12}:${m} ${ampm}`)
      })
    }
    return slots
  })()

  const notifSummary  = Object.values(notifToggles).filter(Boolean).length === 0 ? 'None' : 'On'
  const availSummary  = availDays.length ? `${availDays.slice(0,2).join(', ')}${availDays.length > 2 ? ' +' + (availDays.length - 2) : ''} · ${availStart}–${availEnd}` : 'Not set'

  const initials = userName.trim().split(' ').filter(Boolean).map(w => w[0].toUpperCase()).slice(0, 2).join('')

  const STATS = [
    { n: '12', l: 'Sessions' },
    { n: '4',  l: 'Mentors'  },
    { n: '94%', l: 'Show-up' },
  ]
  const SETTINGS = [
    { l: 'Notifications', r: 'Session reminders' },
    { l: 'Availability',  r: 'Weekday evenings' },
    { l: 'Payment',       r: '•••• 4242' },
    { l: 'Appearance',    r: theme, toggle: () => setTheme(t => t === 'Dark' ? 'System' : 'Dark') },
    { l: 'Privacy and data' },
    { l: 'Help and support' },
  ]

  return (
    <div style={{ width: '100%', height: '100%', background: C.ink, color: C.cream, position: 'relative' }}>
      <StatusBar dark />

      <div style={{
        paddingTop: SP.screenTop, paddingBottom: SP.navBottom,
        height: '100%', overflowY: 'auto', boxSizing: 'border-box',
      }}>
        <div style={{ paddingLeft: SP.screenH, paddingRight: SP.screenH }}>

          {/* Profile header */}
          <div style={{ display: 'flex', gap: SP.lg, alignItems: 'center' }}>
            {/* Avatar — tap to change */}
            <div onClick={() => avatarInputRef.current?.click()}
              style={{ width: 72, height: 72, borderRadius: 999, flexShrink: 0,
                border: `1px solid ${avatarSrc ? C.green : 'rgba(255,249,230,.15)'}`,
                background: 'rgba(255,249,230,.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
              {avatarSrc
                ? <img src={avatarSrc} width="72" height="72" style={{ objectFit: 'cover', display: 'block' }}/>
                : initials
                  ? <span style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 22, color: C.cream }}>{initials}</span>
                  : <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                         stroke="rgba(255,249,230,.25)" strokeWidth="1.6" strokeLinecap="round">
                      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/>
                    </svg>
              }
              {/* Camera overlay hint */}
              <div style={{ position: 'absolute', inset: 0, borderRadius: 999,
                background: 'rgba(0,0,0,.35)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', opacity: 0, transition: 'opacity 150ms' }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                     stroke="#fff" strokeWidth="2" strokeLinecap="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <input ref={avatarInputRef} type="file" accept="image/*"
                onChange={handleAvatarChange} style={{ display: 'none' }}/>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Editable name */}
              <input value={userName} onChange={handleNameChange} placeholder="Add your name"
                style={{ ...T.sectionTitle, background: 'transparent', border: 'none', outline: 'none',
                  width: '100%', padding: 0,
                  color: userName ? C.cream : 'rgba(255,249,230,.25)' }}/>
              {/* Editable role */}
              <input value={userRole} onChange={handleRoleChange} placeholder="Role · Location"
                style={{ ...T.caption, background: 'transparent', border: 'none', outline: 'none',
                  width: '100%', padding: 0, marginTop: 3,
                  color: userRole ? 'rgba(255,249,230,.5)' : 'rgba(255,249,230,.2)' }}/>
              <div style={{
                marginTop: SP.sm, display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 999,
                background: 'rgba(185,255,111,.12)', color: C.green,
                fontFamily: 'Urbanist', fontWeight: 700, fontSize: 11,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: 999, background: C.green, flexShrink: 0 }}/>
                MENTEE · Sprout member since 2026
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div style={{ marginTop: SP.lg, display: 'flex', borderRadius: SP.md, overflow: 'hidden',
            background: 'rgba(255,249,230,.04)', border: '1px solid rgba(255,249,230,.07)' }}>
            {STATS.map((s, i) => (
              <div key={s.l} style={{ flex: 1, padding: '10px 0', textAlign: 'center',
                borderRight: i < 2 ? '1px solid rgba(255,249,230,.06)' : 'none' }}>
                <div style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 22, color: C.green }}>{s.n}</div>
                <div style={{ ...T.micro, marginTop: 2, letterSpacing: '.04em', textTransform: 'uppercase' }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* ── My Profile ── */}
          <div style={{ marginTop: SP.xxl }}>
            <div style={{ ...T.label, marginBottom: SP.sm }}>My profile</div>
            <div style={{ borderRadius: SP.lg, overflow: 'hidden',
              background: 'rgba(255,249,230,.04)', border: '1px solid rgba(255,249,230,.07)' }}>

              {/* Focus areas */}
              <div style={{ padding: `${SP.md}px ${SP.lg}px`,
                borderBottom: '1px solid rgba(255,249,230,.05)' }}>
                <div style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 14,
                  color: C.cream, marginBottom: SP.sm }}>Focus areas</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.xs }}>
                  {['Career guidance', 'Portfolio critique', 'FAANG interviews', 'Long-term mentorship'].map(g => (
                    <div key={g} style={{ padding: '4px 10px', borderRadius: 999,
                      background: 'rgba(255,249,230,.08)', border: '1px solid rgba(255,249,230,.1)',
                      fontFamily: 'Urbanist', fontWeight: 600, fontSize: 11, color: C.cream }}>
                      {g}
                    </div>
                  ))}
                  <div onClick={onEditPrefs} style={{ padding: '4px 10px', borderRadius: 999,
                    border: '1px dashed rgba(255,249,230,.2)', cursor: 'pointer',
                    fontFamily: 'Urbanist', fontSize: 11, color: 'rgba(255,249,230,.4)' }}>
                    + Edit
                  </div>
                </div>
              </div>

              {/* Portfolio URL */}
              <label style={{ display: 'flex', alignItems: 'center', gap: SP.md,
                padding: `${SP.md}px ${SP.lg}px`, cursor: 'text',
                borderBottom: '1px solid rgba(255,249,230,.05)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="rgba(255,249,230,.3)" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <input value={portfolioUrl} onChange={handlePortfolioChange}
                  placeholder="Portfolio website"
                  style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent',
                    fontFamily: 'Urbanist', fontWeight: 500, fontSize: 14,
                    color: portfolioUrl ? C.cream : 'rgba(255,249,230,.28)' }}/>
                {portfolioUrl && (
                  <span style={{ ...T.caption, color: C.green, fontWeight: 600, fontSize: 11 }}>Saved</span>
                )}
              </label>

              {/* Resume */}
              <div onClick={() => resumeInputRef.current?.click()}
                style={{ display: 'flex', alignItems: 'center', gap: SP.md,
                  padding: `${SP.md}px ${SP.lg}px`, cursor: 'pointer' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="rgba(255,249,230,.3)" strokeWidth="2" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
                <span style={{ flex: 1, fontFamily: 'Urbanist', fontWeight: 500, fontSize: 14,
                  color: resumeName ? C.cream : 'rgba(255,249,230,.28)' }}>
                  {resumeName || 'Resume / CV'}
                </span>
                <span style={{ fontFamily: 'Urbanist', fontSize: 12, fontWeight: 600,
                  color: resumeName ? 'rgba(255,249,230,.35)' : C.green }}>
                  {resumeName ? 'Replace' : 'Upload'}
                </span>
                <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange} style={{ display: 'none' }}/>
              </div>
            </div>
          </div>

          {/* ── Preferences ── */}
          <div style={{ marginTop: SP.xl }}>
            <div style={{ ...T.label, marginBottom: SP.sm }}>Preferences</div>
            <div style={{ borderRadius: SP.lg, overflow: 'hidden',
              background: 'rgba(255,249,230,.04)', border: '1px solid rgba(255,249,230,.07)' }}>
              {[
                { key: 'notifications', label: 'Notifications', value: notifSummary },
                { key: 'availability',  label: 'Availability',  value: availSummary },
                { key: 'appearance',    label: 'Appearance',    value: theme },
              ].map((row, i, arr) => (
                <div key={row.key} onClick={() => setActiveSheet(row.key)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: `${SP.md}px ${SP.lg}px`, cursor: 'pointer',
                    borderBottom: i < arr.length - 1 ? '1px solid rgba(255,249,230,.05)' : 'none' }}>
                  <div style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 14, color: C.cream }}>{row.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
                    <span style={{ ...T.caption }}>{row.value}</span>
                    <span style={{ transform: 'rotate(180deg)', display: 'flex', color: 'rgba(255,249,230,.3)' }}>{I.back}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Account ── */}
          <div style={{ marginTop: SP.xl }}>
            <div style={{ ...T.label, marginBottom: SP.sm }}>Account</div>
            <div style={{ borderRadius: SP.lg, overflow: 'hidden',
              background: 'rgba(255,249,230,.04)', border: '1px solid rgba(255,249,230,.07)' }}>
              {[
                { key: 'rematch', label: 'Re-match me', value: '' },
                { key: 'privacy', label: 'Privacy and data', value: '' },
                { key: 'help',    label: 'Help and support', value: '' },
              ].map((row, i, arr) => (
                <div key={row.key} onClick={() => row.key === 'rematch' ? onRematch?.() : setActiveSheet(row.key)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: `${SP.md}px ${SP.lg}px`, cursor: 'pointer',
                    borderBottom: i < arr.length - 1 ? '1px solid rgba(255,249,230,.05)' : 'none' }}>
                  <div style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 14,
                    color: row.key === 'rematch' ? C.green : C.cream }}>{row.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
                    {row.value && <span style={{ ...T.caption }}>{row.value}</span>}
                    <span style={{ transform: 'rotate(180deg)', display: 'flex', color: 'rgba(255,249,230,.3)' }}>{I.back}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Log out */}
          <div style={{ marginTop: SP.xl, padding: `${SP.md}px ${SP.lg}px`, borderRadius: SP.lg,
            cursor: 'pointer', border: '1px solid rgba(255,100,100,.15)',
            fontFamily: 'Urbanist', fontSize: 14, fontWeight: 600,
            color: 'rgba(255,100,100,.6)', textAlign: 'center' }}>
            Log out
          </div>

          <div style={{ marginTop: SP.md, textAlign: 'center', ...T.micro }}>Sprout v1.0.0</div>

        </div>
      </div>

      <BottomNav active={tab} onTab={onTab} />
      <HomeIndicator dark />

      {/* ── Settings sheets ── */}
      {activeSheet && (
        <div onClick={() => setActiveSheet(null)} style={{ position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,.65)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
          <style>{`@keyframes meSheetUp { from{transform:translateY(100%)} to{transform:translateY(0)} }`}</style>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: '#161616',
            borderRadius: '22px 22px 0 0', padding: '20px 24px 48px',
            animation: 'meSheetUp 250ms cubic-bezier(0.32, 0.72, 0, 1)' }}>
            <div onClick={() => setActiveSheet(null)} style={{ width: 40, height: 4, borderRadius: 999,
              background: 'rgba(255,249,230,.2)', margin: '0 auto 20px', cursor: 'pointer' }}/>

            {/* NOTIFICATIONS */}
            {activeSheet === 'notifications' && (<>
              <div style={{ ...T.sectionTitle, marginBottom: 18 }}>Notifications</div>
              {[
                { key: 'sessionReminders', label: 'Session reminders',   sub: '24h before each session' },
                { key: 'messages',         label: 'New messages',         sub: 'When a mentor replies' },
                { key: 'gardenUpdates',    label: 'Garden milestones',    sub: 'When your plant grows' },
                { key: 'weeklyDigest',     label: 'Weekly digest',        sub: 'Progress summary every Monday' },
              ].map((n, i, arr) => (
                <div key={n.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '13px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,249,230,.06)' : 'none' }}>
                  <div>
                    <div style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 14, color: C.cream }}>{n.label}</div>
                    <div style={{ ...T.caption, marginTop: 2 }}>{n.sub}</div>
                  </div>
                  <div onClick={() => toggleNotif(n.key)} style={{ width: 44, height: 26, borderRadius: 999, cursor: 'pointer',
                    background: notifToggles[n.key] ? C.green : 'rgba(255,249,230,.12)',
                    position: 'relative', flexShrink: 0, transition: 'background 200ms' }}>
                    <div style={{ position: 'absolute', top: 3, borderRadius: '50%', width: 20, height: 20,
                      background: notifToggles[n.key] ? '#121212' : 'rgba(255,249,230,.5)',
                      left: notifToggles[n.key] ? 21 : 3, transition: 'left 200ms, background 200ms' }}/>
                  </div>
                </div>
              ))}
            </>)}

            {/* AVAILABILITY */}
            {activeSheet === 'availability' && (<>
              <div style={{ ...T.sectionTitle, marginBottom: 6 }}>Availability</div>
              <div style={{ ...T.bodyMuted, marginBottom: 18 }}>When are you free for sessions?</div>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 11,
                letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,249,230,.4)', marginBottom: 10 }}>Days</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                  <div key={d} onClick={() => toggleDay(d)} style={{ padding: '7px 14px', borderRadius: 10, cursor: 'pointer',
                    background: availDays.includes(d) ? C.green : 'rgba(255,249,230,.06)',
                    border: `1px solid ${availDays.includes(d) ? 'transparent' : 'rgba(255,249,230,.1)'}`,
                    fontFamily: 'Urbanist', fontWeight: 700, fontSize: 13,
                    color: availDays.includes(d) ? '#121212' : 'rgba(255,249,230,.55)',
                    transition: 'background 150ms, border-color 150ms, color 150ms' }}>{d}</div>
                ))}
              </div>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 11,
                letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,249,230,.4)', marginBottom: 10 }}>Time of day</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Mornings','Afternoons','Evenings'].map(t => (
                  <div key={t} onClick={() => setAvailTime(t)} style={{ flex: 1, padding: '10px 0', borderRadius: 10,
                    textAlign: 'center', cursor: 'pointer',
                    background: availTime === t ? C.green : 'rgba(255,249,230,.06)',
                    border: `1px solid ${availTime === t ? 'transparent' : 'rgba(255,249,230,.1)'}`,
                    fontFamily: 'Urbanist', fontWeight: 700, fontSize: 12,
                    color: availTime === t ? '#121212' : 'rgba(255,249,230,.55)',
                    transition: 'background 150ms, border-color 150ms, color 150ms' }}>{t}</div>
                ))}
              </div>

              <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 11,
                letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,249,230,.4)',
                marginTop: 22, marginBottom: 10 }}>Time frame</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {[['From', availStart, setAvailStart], ['To', availEnd, setAvailEnd]].map(([lbl, val, setter]) => (
                  <label key={lbl} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <span style={{ fontFamily: 'Urbanist', fontWeight: 600, fontSize: 11,
                      color: 'rgba(255,249,230,.4)', letterSpacing: '.05em' }}>{lbl}</span>
                    <div style={{ position: 'relative' }}>
                      <select value={val} onChange={e => setter(e.target.value)} style={{
                        width: '100%', height: 42, padding: '0 32px 0 14px', borderRadius: 10,
                        background: 'rgba(255,249,230,.06)', border: '1px solid rgba(255,249,230,.1)',
                        fontFamily: 'Urbanist', fontWeight: 600, fontSize: 13,
                        color: C.cream, cursor: 'pointer', appearance: 'none', outline: 'none',
                      }}>
                        {TIME_SLOTS.map(s => <option key={s} value={s} style={{ background: '#1a1a1a' }}>{s}</option>)}
                      </select>
                      <svg style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                        width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,249,230,.4)" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </div>
                  </label>
                ))}
              </div>
              <div style={{ ...T.caption, marginTop: 8, color: 'rgba(255,249,230,.3)' }}>Sessions are 30 min each</div>

              <button onClick={() => setActiveSheet(null)} style={{ marginTop: 24, width: '100%', height: 48,
                border: 'none', borderRadius: 13, background: C.green, color: '#121212',
                fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Save</button>
            </>)}

            {/* APPEARANCE */}
            {activeSheet === 'appearance' && (<>
              <div style={{ ...T.sectionTitle, marginBottom: 18 }}>Appearance</div>
              {['Dark','Light','System'].map((opt, i, arr) => (
                <div key={opt} onClick={() => setTheme(opt)} style={{ display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', padding: '14px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(255,249,230,.06)' : 'none', cursor: 'pointer' }}>
                  <span style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 16,
                    color: theme === opt ? C.green : C.cream }}>{opt}</span>
                  {theme === opt && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                         stroke={C.green} strokeWidth="2.5" strokeLinecap="round"><path d="M4 12l5 5 11-11"/></svg>
                  )}
                </div>
              ))}
            </>)}

            {/* PRIVACY */}
            {activeSheet === 'privacy' && (<>
              <div style={{ ...T.sectionTitle, marginBottom: 18 }}>Privacy and data</div>
              {[
                { label: 'Profile visibility', value: 'Mentors only' },
                { label: 'Session recordings', value: 'Auto-delete 30d' },
                { label: 'AI note access',      value: 'Me only' },
                { label: 'Download my data',    value: '' },
                { label: 'Delete account',      value: '', danger: true },
              ].map((row, i, arr) => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', padding: '13px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(255,249,230,.06)' : 'none', cursor: 'pointer' }}>
                  <span style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 14,
                    color: row.danger ? '#FF6B6B' : C.cream }}>{row.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {row.value && <span style={{ ...T.caption }}>{row.value}</span>}
                    {!row.danger && <span style={{ transform: 'rotate(180deg)', display: 'flex', color: 'rgba(255,249,230,.3)' }}>{I.back}</span>}
                  </div>
                </div>
              ))}
            </>)}

            {/* HELP */}
            {activeSheet === 'help' && (<>
              <div style={{ ...T.sectionTitle, marginBottom: 18 }}>Help and support</div>
              {[
                { label: 'How Sprout works', icon: '📖' },
                { label: 'Contact support',  icon: '💬' },
                { label: 'Report a bug',     icon: '🐞' },
                { label: 'Terms of service', icon: '📄' },
                { label: 'Privacy policy',   icon: '🔒' },
              ].map((row, i, arr) => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 14,
                  padding: '13px 0', cursor: 'pointer',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(255,249,230,.06)' : 'none' }}>
                  <span style={{ fontSize: 18 }}>{row.icon}</span>
                  <span style={{ flex: 1, fontFamily: 'Urbanist', fontWeight: 500, fontSize: 14, color: C.cream }}>{row.label}</span>
                  <span style={{ transform: 'rotate(180deg)', display: 'flex', color: 'rgba(255,249,230,.3)' }}>{I.back}</span>
                </div>
              ))}
            </>)}

          </div>
        </div>
      )}
    </div>
  )
}
