import { useState, useRef, useEffect, Fragment } from 'react'
import { C, I, A } from '../atoms.jsx'
import { StatusBar, HomeIndicator } from '../Phone.jsx'
import { BottomNav } from './Screens.jsx'

// ── Chat inbox data ───────────────────────────────────────────────────────────
const THREADS = [
  { id: 1, name: 'Kimberly Revilla', avatar: 'avatars/mentor-kimberly.jpg',
    last: "Looking forward to our session on Thursday!", time: '2m', unread: 2, online: true, pinned: true },
  { id: 2, name: 'Justin White', avatar: 'avatars/mentor-justin.jpg',
    last: "Shared the portfolio feedback doc — take a look", time: '1h', unread: 0, online: true },
  { id: 3, name: 'Alexander Ng', avatar: 'avatars/mentor-alex.jpg',
    last: "Here's that article I mentioned on spatial UI", time: 'Yesterday', unread: 0, online: false },
  { id: 4, name: 'Priya Patel', avatar: 'avatars/mentor-a.jpg',
    last: "Happy to reschedule — just let me know", time: 'Wed', unread: 0, online: false },
  { id: 5, name: 'Noah Brooks', avatar: 'avatars/mentor-b.jpg',
    last: "Great session. Next one same time?", time: 'Apr 12', unread: 0, online: false },
]

// ── Chat inbox ────────────────────────────────────────────────────────────────
export function ChatInboxScreen({ onOpenThread, onTab, tab = 'chat' }) {
  return (
    <div style={{ width: '100%', height: '100%', background: C.ink, color: C.cream, position: 'relative' }}>
      <StatusBar dark />
      <div style={{ paddingTop: 60, paddingLeft: 20, paddingRight: 20, paddingBottom: 100, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 28, letterSpacing: -.5 }}>Messages</div>
          <div style={{ width: 38, height: 38, borderRadius: 999, background: 'rgba(255,249,230,.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.cream, cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L8 18l-4 1 1-4z"/></svg>
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 10,
                      height: 44, padding: '0 14px', borderRadius: 12,
                      background: 'rgba(255,249,230,.06)', border: '1px solid rgba(255,249,230,.08)' }}>
          <span style={{ color: C.cream, opacity: .5, display: 'flex' }}>{I.search}</span>
          <input placeholder="Search conversations" style={{ flex: 1, border: 0, background: 'transparent', outline: 'none', color: C.cream, fontFamily: 'Urbanist', fontSize: 14 }}/>
        </div>

        <div style={{ marginTop: 8 }}>
          {THREADS.map((t, i) => (
            <div key={t.id} onClick={() => onOpenThread(t)} style={{
              display: 'flex', gap: 12, alignItems: 'center', padding: '14px 4px',
              borderBottom: i < THREADS.length - 1 ? '1px solid rgba(255,249,230,.06)' : 'none',
              cursor: 'pointer',
            }}>
              <div style={{ position: 'relative' }}>
                <img src={A(t.avatar)} width="48" height="48" style={{ borderRadius: 999, objectFit: 'cover' }}/>
                {t.online && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 999, background: C.green, border: `2px solid ${C.ink}` }}/>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontFamily: 'Urbanist', fontWeight: t.unread ? 700 : 500, fontSize: 15 }}>
                    {t.name}
                    {t.pinned && <span style={{ marginLeft: 6, color: C.green, fontSize: 11 }}>● upcoming</span>}
                  </div>
                  <div style={{ fontFamily: 'Urbanist', fontSize: 11, color: t.unread ? C.green : C.cream, opacity: t.unread ? 1 : .5 }}>{t.time}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                  <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: C.cream, opacity: t.unread ? .85 : .55, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{t.last}</div>
                  {t.unread > 0 && (
                    <div style={{ marginLeft: 8, minWidth: 18, height: 18, padding: '0 6px', borderRadius: 999,
                                  background: C.green, color: C.ink, fontFamily: 'Urbanist', fontWeight: 700, fontSize: 11,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t.unread}</div>
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

// ── Chat thread ───────────────────────────────────────────────────────────────
const SEED_MSGS = (mentorName) => ([
  { id: 1, from: 'them', t: "Hey! So glad we connected on Sprout 🌱", time: 'Mon 10:02' },
  { id: 2, from: 'them', t: `I took a look at your portfolio — lots to unpack.`, time: 'Mon 10:02' },
  { id: 3, from: 'me',   t: "Thank you so much for making time!", time: 'Mon 10:14' },
  { id: 4, from: 'me',   t: "The onboarding case study is the one I'm least sure about — would love your take.", time: 'Mon 10:15' },
  { id: 5, from: 'them', t: "Let's dig into that on Thursday. I'll bring a couple of examples from work that rhyme.", time: 'Tue 9:40' },
  { id: 6, from: 'them', t: `Looking forward to our session on Thursday!`, time: '2m' },
])

export function ChatThreadScreen({ thread, onBack }) {
  const t = thread || THREADS[0]
  const [msgs, setMsgs] = useState(() => SEED_MSGS(t.name))
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
      setMsgs(m => [...m, { id: Date.now() + 1, from: 'them', t: "Got it — let's talk about this Thursday.", time: 'Now' }])
    }, 900)
  }
  return (
    <div style={{ width: '100%', height: '100%', background: C.ink, color: C.cream, position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <StatusBar dark />
      <div style={{ paddingTop: 60, paddingLeft: 20, paddingRight: 20, paddingBottom: 16,
                    display: 'flex', alignItems: 'center', gap: 12,
                    borderBottom: '1px solid rgba(255,249,230,.06)' }}>
        <div onClick={onBack} style={{ color: C.green, cursor: 'pointer' }}>{I.back}</div>
        <img src={A(t.avatar)} width="36" height="36" style={{ borderRadius: 999, objectFit: 'cover' }}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 15 }}>{t.name}</div>
          <div style={{ fontFamily: 'Urbanist', fontSize: 11, color: t.online ? C.green : C.cream, opacity: t.online ? .9 : .5 }}>
            {t.online ? 'Online now' : 'Last seen today'}
          </div>
        </div>
        <div style={{ width: 34, height: 34, borderRadius: 999, background: 'rgba(255,249,230,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.cream }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3.1a2 2 0 01-2.2 2A19.8 19.8 0 012 4.2 2 2 0 014 2h3.1a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1l-1.3 1.3a16 16 0 006.1 6.1l1.3-1.3a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z"/></svg>
        </div>
      </div>

      {t.pinned && (
        <div style={{ margin: '12px 20px 0', padding: '10px 14px', borderRadius: 12,
                      background: 'rgba(185,255,111,.12)', border: '1px solid rgba(185,255,111,.3)',
                      display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: C.green, color: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {I.cal(true)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 13, color: C.cream }}>Thu Apr 24 · 2:30 pm</div>
            <div style={{ fontFamily: 'Urbanist', fontSize: 12, color: C.cream, opacity: .7 }}>Resume review · 30 min</div>
          </div>
          <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 12, color: C.green, cursor: 'pointer' }}>Join →</div>
        </div>
      )}

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 20px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {msgs.map((m, i) => {
          const prev = msgs[i - 1]
          const showTime = !prev || prev.time !== m.time
          return (
            <Fragment key={m.id}>
              {showTime && (
                <div style={{ alignSelf: 'center', fontFamily: 'Urbanist', fontSize: 11, color: C.cream, opacity: .4, margin: '8px 0' }}>
                  {m.time}
                </div>
              )}
              <div style={{
                maxWidth: '78%', padding: '10px 14px', borderRadius: 16,
                alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start',
                background: m.from === 'me' ? C.green : 'rgba(255,249,230,.08)',
                color: m.from === 'me' ? C.ink : C.cream,
                borderBottomRightRadius: m.from === 'me' ? 4 : 16,
                borderBottomLeftRadius:  m.from === 'them' ? 4 : 16,
                fontFamily: 'Urbanist', fontSize: 14, lineHeight: 1.35,
              }}>{m.t}</div>
            </Fragment>
          )
        })}
      </div>

      <div style={{ padding: '10px 16px 24px', borderTop: '1px solid rgba(255,249,230,.06)',
                    display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ width: 36, height: 36, borderRadius: 999, background: 'rgba(255,249,230,.08)', color: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          {I.plus}
        </div>
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send() }}
          placeholder="Message…"
          style={{ flex: 1, height: 40, padding: '0 16px', borderRadius: 999,
                   background: 'rgba(255,249,230,.08)', border: '1px solid rgba(255,249,230,.08)',
                   color: C.cream, fontFamily: 'Urbanist', fontSize: 14, outline: 'none' }}/>
        <div onClick={send} style={{
          width: 40, height: 40, borderRadius: 999, background: draft.trim() ? C.green : 'rgba(255,249,230,.14)',
          color: draft.trim() ? C.ink : C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          transition: 'background .15s',
        }}>{I.plane}</div>
      </div>
      <HomeIndicator dark />
    </div>
  )
}

// ── Me / Profile ──────────────────────────────────────────────────────────────
export function MeScreen({ onTab, tab = 'me', onEditPrefs }) {
  const [theme, setTheme] = useState('Dark')
  return (
    <div style={{ width: '100%', height: '100%', background: C.ink, color: C.cream, position: 'relative' }}>
      <StatusBar dark />
      <div style={{ paddingTop: 60, paddingBottom: 100, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
        <div style={{ paddingLeft: 20, paddingRight: 20 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <img src={A('avatars/user-lisa.png')} width="72" height="72" style={{ borderRadius: 999, objectFit: 'cover', border: `3px solid ${C.green}` }}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 22, letterSpacing: -.3 }}>Lisa Wong</div>
              <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: C.cream, opacity: .6 }}>Product designer · SF</div>
              <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: 'rgba(185,255,111,.14)', color: C.green, fontFamily: 'Urbanist', fontWeight: 700, fontSize: 11 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: C.green }}/> MENTEE · Sprout member since 2026
              </div>
            </div>
          </div>

          <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { n: '12', l: 'Sessions' },
              { n: '4',  l: 'Mentors'  },
              { n: '94%', l: 'Show-up' },
            ].map(s => (
              <div key={s.l} style={{ padding: '14px 12px', borderRadius: 12, background: 'rgba(255,249,230,.06)', border: '1px solid rgba(255,249,230,.08)' }}>
                <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 22, color: C.green }}>{s.n}</div>
                <div style={{ fontFamily: 'Urbanist', fontSize: 12, color: C.cream, opacity: .6, marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 22 }}>
            <div style={{ fontFamily: 'Urbanist', fontSize: 11, color: C.cream, opacity: .5, letterSpacing: '.1em', textTransform: 'uppercase' }}>My focus</div>
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Career guidance', 'Portfolio critique', 'FAANG interviews', 'Long-term mentorship'].map(g => (
                <div key={g} style={{ padding: '6px 12px', borderRadius: 999,
                                      background: C.cream, color: C.ink,
                                      fontFamily: 'Urbanist', fontWeight: 500, fontSize: 12 }}>{g}</div>
              ))}
              <div onClick={onEditPrefs} style={{ padding: '6px 12px', borderRadius: 999, border: '1px dashed rgba(255,249,230,.3)', color: C.cream, opacity: .7, fontFamily: 'Urbanist', fontSize: 12, cursor: 'pointer' }}>+ Edit focus</div>
            </div>
          </div>

          <div style={{ marginTop: 26 }}>
            <div style={{ fontFamily: 'Urbanist', fontSize: 11, color: C.cream, opacity: .5, letterSpacing: '.1em', textTransform: 'uppercase' }}>Settings</div>
            <div style={{ marginTop: 10, borderRadius: 14, overflow: 'hidden', background: 'rgba(255,249,230,.04)', border: '1px solid rgba(255,249,230,.06)' }}>
              {[
                { l: 'Notifications', r: 'Session reminders' },
                { l: 'Availability',  r: 'Weekday evenings' },
                { l: 'Payment',       r: '•••• 4242' },
                { l: 'Appearance',    r: theme, toggle: () => setTheme(t => t === 'Dark' ? 'System' : 'Dark') },
                { l: 'Privacy & data' },
                { l: 'Help & support' },
              ].map((row, i, arr) => (
                <div key={row.l} onClick={row.toggle} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', cursor: row.toggle ? 'pointer' : 'default',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(255,249,230,.05)' : 'none',
                }}>
                  <div style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 14 }}>{row.l}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.cream, opacity: .6, fontFamily: 'Urbanist', fontSize: 13 }}>
                    {row.r && <span>{row.r}</span>}
                    <span style={{ transform: 'rotate(180deg)', display: 'flex' }}>{I.back}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 14, border: '1px solid rgba(255,249,230,.08)', color: C.cream, opacity: .7, fontFamily: 'Urbanist', fontSize: 14, textAlign: 'center', cursor: 'pointer' }}>
            Log out
          </div>

          <div style={{ marginTop: 14, textAlign: 'center', fontFamily: 'Urbanist', fontSize: 11, color: C.cream, opacity: .3 }}>
            Sprout v1.0.0
          </div>
        </div>
      </div>
      <BottomNav active={tab} onTab={onTab} />
      <HomeIndicator dark />
    </div>
  )
}
