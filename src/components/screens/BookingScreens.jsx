import { useState, useRef } from 'react'
import { C, T, SP, I, Btn, A } from '../atoms.jsx'
import { StatusBar, HomeIndicator } from '../Phone.jsx'

const G = C.green

const SEARCH_SEED = [
  {
    name: 'Justin White', role: 'UIUX Designer', company: 'Meta',
    avatar: A('avatars/mentor-justin.jpg'),
    rating: 4.9, sessions: 67, match: 96,
    tags: ['Portfolio critique', 'Career advice'],
    tier: 'FAANG', level: 'Mid',
    specialty: ['Portfolio Review', 'Career Growth'],
  },
  {
    name: 'Alexander Ng', role: 'Product Designer', company: 'Amazon',
    avatar: A('avatars/mentor-alex.jpg'),
    rating: 4.8, sessions: 34, match: 91,
    tags: ['FAANG prep', 'Resume review'],
    tier: 'FAANG', level: 'Mid',
    specialty: ['FAANG Prep', 'Portfolio Review'],
  },
  {
    name: 'Kimberly Revilla', role: 'Sr Product Designer', company: 'Apple',
    avatar: A('avatars/mentor-kimberly.jpg'),
    rating: 4.8, sessions: 42, match: 88,
    tags: ['Long-term mentorship', 'Portfolio critique'],
    tier: 'FAANG', level: 'Senior',
    specialty: ['Portfolio Review', 'Career Growth'],
  },
  {
    name: 'Priya Patel', role: 'Design Lead', company: 'Stripe',
    avatar: A('avatars/mentor-a.jpg'),
    rating: 4.7, sessions: 29, match: 85,
    tags: ['Career switch', 'System design'],
    tier: 'Scaleup', level: 'Lead',
    specialty: ['System Design', 'Career Growth'],
  },
  {
    name: 'Noah Brooks', role: 'Staff Designer', company: 'Notion',
    avatar: A('avatars/mentor-b.jpg'),
    rating: 4.9, sessions: 51, match: 82,
    tags: ['Leadership', 'IC to manager'],
    tier: 'Scaleup', level: 'Lead',
    specialty: ['Leadership', 'Career Growth'],
  },
]

const FILTER_DIMS = [
  { key: 'specialty', label: 'Specialty',    opts: ['Portfolio Review', 'FAANG Prep', 'Leadership', 'System Design', 'Career Growth', 'UX Research'] },
  { key: 'tier',      label: 'Company type', opts: ['FAANG', 'Scaleup', 'Startup'] },
  { key: 'level',     label: 'Level',        opts: ['Mid', 'Senior', 'Lead'] },
  { key: 'rating',    label: 'Min rating',   opts: ['4.9+', '4.7+', '4.5+'] },
]

const EMPTY_FILTERS = { specialty: [], tier: [], level: [], rating: [] }

const TRENDING = [
  { term: 'Resume review',        count: '847' },
  { term: 'Portfolio critique',   count: '632' },
  { term: 'FAANG interviews',     count: '521' },
  { term: 'Career pivot',         count: '418' },
  { term: 'Long-term mentorship', count: '304' },
]

const SEARCH_CSS = `
  @keyframes searchFadeUp   { from { opacity: 0; transform: translateY(8px) }  to { opacity: 1; transform: translateY(0) } }
  @keyframes filterSheetUp  { from { transform: translateY(100%) }              to { transform: translateY(0) } }
  @keyframes filterBackdrop { from { opacity: 0 }                               to { opacity: 1 } }
  .search-card { transition: background 120ms; }
  .search-card:active { background: rgba(255,249,230,.07) !important; }
  .filter-chip { transition: background 120ms, border-color 120ms, color 120ms; }
  .filter-chip:active { transform: scale(0.96); }
  input::placeholder { color: rgba(255,249,230,.3); }
`

function FilterSheet({ filters, onApply, onClose }) {
  const [draft, setDraft] = useState(filters)

  function toggle(dim, opt) {
    if (dim === 'rating') {
      setDraft(d => ({ ...d, rating: d.rating[0] === opt ? [] : [opt] }))
    } else {
      setDraft(d => {
        const curr = d[dim]
        return { ...d, [dim]: curr.includes(opt) ? curr.filter(x => x !== opt) : [...curr, opt] }
      })
    }
  }

  const totalActive = Object.values(draft).flat().length

  const previewCount = (() => {
    let list = SEARCH_SEED
    const { specialty, tier, level, rating } = draft
    if (specialty.length) list = list.filter(p => specialty.some(s => p.specialty.includes(s)))
    if (tier.length)      list = list.filter(p => tier.includes(p.tier))
    if (level.length)     list = list.filter(p => level.includes(p.level))
    if (rating.length)    list = list.filter(p => p.rating >= parseFloat(rating[0]))
    return list.length
  })()

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20 }}>
      {/* Backdrop */}
      <div onClick={onClose}
           style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.55)',
                    animation: 'filterBackdrop 200ms ease-out' }} />
      {/* Sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: '#1c1c1c', borderRadius: '22px 22px 0 0',
        padding: '0 20px 36px',
        animation: 'filterSheetUp 260ms cubic-bezier(.2,.8,.2,1)',
        maxHeight: '82%', overflowY: 'auto',
      }}>
        {/* Handle — tappable to close */}
        <div onClick={onClose} style={{ padding: '12px 0 4px', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: 'rgba(255,249,230,.2)' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 0 16px' }}>
          <span style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 20,
                         color: '#FFF9E6', letterSpacing: -.3 }}>Filters</span>
          {totalActive > 0 && (
            <span onClick={() => setDraft({ specialty: [], tier: [], level: [], rating: [] })}
                  style={{ fontFamily: 'Urbanist', fontWeight: 600, fontSize: 13,
                           color: G, cursor: 'pointer' }}>
              Clear all
            </span>
          )}
        </div>

        {/* Dimensions */}
        {FILTER_DIMS.map(dim => (
          <div key={dim.key} style={{ marginBottom: 22 }}>
            <div style={{ ...T.label, marginBottom: 10 }}>{dim.label}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {dim.opts.map(opt => {
                const on = draft[dim.key].includes(opt)
                return (
                  <div key={opt} onClick={() => toggle(dim.key, opt)}
                       className="filter-chip"
                       style={{
                         padding: '8px 15px', borderRadius: 999, cursor: 'pointer',
                         background: on ? G : 'rgba(255,249,230,.07)',
                         border: `1px solid ${on ? 'transparent' : 'rgba(255,249,230,.12)'}`,
                         fontFamily: 'Urbanist', fontWeight: on ? 700 : 500, fontSize: 13,
                         color: on ? '#121212' : 'rgba(255,249,230,.65)',
                       }}>
                    {opt}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,249,230,.07)', margin: '4px 0 16px' }} />

        {/* Apply */}
        <button onClick={() => onApply(draft)} style={{
          width: '100%', height: 54, border: 'none', borderRadius: 14, cursor: 'pointer',
          background: G, color: '#121212',
          fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16,
          boxShadow: '0 8px 24px rgba(185,255,111,.22)',
          letterSpacing: -.2,
        }}>
          Show {previewCount} mentor{previewCount !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  )
}

function StarRow({ rating, sessions }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill={G}>
        <path d="M12 2l3 7 7 .8-5.3 4.8 1.6 7.4L12 18l-6.3 4 1.6-7.4L2 9.8 9 9z"/>
      </svg>
      <span style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 12, color: G }}>{rating}</span>
      <span style={{ fontFamily: 'Urbanist', fontSize: 11, color: 'rgba(255,249,230,.35)' }}>· {sessions} sessions</span>
    </div>
  )
}

function MentorCard({ r, onPick, delay = 0 }) {
  return (
    <div
      className="search-card"
      onClick={() => onPick(r)}
      style={{
        display: 'flex', gap: 14, padding: '14px 0',
        borderBottom: '1px solid rgba(255,249,230,.05)',
        cursor: 'pointer',
        animation: `searchFadeUp 220ms ${delay}ms ease-out both`,
      }}
    >
      <img src={r.avatar} width="46" height="46" style={{
        borderRadius: 999, objectFit: 'cover', flexShrink: 0, display: 'block',
      }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, color: C.cream }}>
          {r.name}
        </div>
        <div style={{ fontFamily: 'Urbanist', fontSize: 12, color: 'rgba(255,249,230,.4)', marginTop: 2 }}>
          {r.role} · {r.company}
        </div>
        <div style={{ marginTop: 6 }}>
          <StarRow rating={r.rating} sessions={r.sessions} />
        </div>
      </div>
      <span style={{ color: 'rgba(255,249,230,.2)', display: 'flex', alignSelf: 'center', transform: 'rotate(180deg)' }}>{I.back}</span>
    </div>
  )
}

export function SearchScreen({ onPick, onBack }) {
  const [q,           setQ]           = useState('')
  const [filters,     setFilters]     = useState({ specialty: [], tier: [], level: [], rating: [] })
  const [showFilters, setShowFilters] = useState(false)
  const inputRef = useRef(null)

  const activeFilters = Object.entries(filters).flatMap(([dim, vals]) => vals.map(v => ({ dim, v })))
  const activeCount   = activeFilters.length

  const results = (() => {
    let list = SEARCH_SEED
    if (q.trim()) {
      const lq = q.toLowerCase()
      list = list.filter(p => (p.name + p.role + p.company + p.tags.join('')).toLowerCase().includes(lq))
    }
    const { specialty, tier, level, rating } = filters
    if (specialty.length) list = list.filter(p => specialty.some(s => p.specialty.includes(s)))
    if (tier.length)      list = list.filter(p => tier.includes(p.tier))
    if (level.length)     list = list.filter(p => level.includes(p.level))
    if (rating.length)    list = list.filter(p => p.rating >= parseFloat(rating[0]))
    return list
  })()

  function removeFilter(dim, val) {
    setFilters(f => ({ ...f, [dim]: f[dim].filter(x => x !== val) }))
  }

  return (
    <div style={{ width: '100%', height: '100%', background: C.ink, color: C.cream, position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <style>{SEARCH_CSS}</style>
      <StatusBar dark />

      {/* ── Search header ── */}
      <div style={{ paddingTop: SP.screenTop, paddingLeft: SP.screenH, paddingRight: SP.screenH, paddingBottom: 12, flexShrink: 0 }}>
        {/* Search bar row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div onClick={onBack} style={{ color: G, cursor: 'pointer', display: 'flex', flexShrink: 0 }}>{I.back}</div>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 10,
            height: 46, padding: '0 14px', borderRadius: 14,
            background: 'rgba(255,249,230,.07)', border: '1px solid rgba(255,249,230,.09)',
          }}>
            <span style={{ display: 'flex', color: G, flexShrink: 0 }}>{I.search}</span>
            <input
              ref={inputRef}
              autoFocus
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Mentors, skills, companies"
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                color: C.cream, fontFamily: 'Urbanist', fontWeight: 500, fontSize: 14,
              }}
            />
            {q && (
              <span onClick={() => { setQ(''); inputRef.current?.focus() }}
                    style={{ cursor: 'pointer', color: 'rgba(255,249,230,.4)', display: 'flex' }}>
                {I.x}
              </span>
            )}
          </div>
          {/* Filter button */}
          <div onClick={() => setShowFilters(true)} style={{
            position: 'relative', flexShrink: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 5, height: 46, padding: '0 14px',
            borderRadius: 14, cursor: 'pointer',
            background: activeCount ? 'rgba(185,255,111,.12)' : 'rgba(255,249,230,.07)',
            border: `1px solid ${activeCount ? 'rgba(185,255,111,.3)' : 'rgba(255,249,230,.09)'}`,
            transition: 'background 150ms, border-color 150ms',
          }}>
            {/* Sliders icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke={activeCount ? G : 'rgba(255,249,230,.55)'} strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="4" y1="12" x2="20" y2="12"/>
              <line x1="4" y1="18" x2="20" y2="18"/>
              <circle cx="8"  cy="6"  r="2" fill={activeCount ? G : 'rgba(255,249,230,.55)'} stroke="none"/>
              <circle cx="16" cy="12" r="2" fill={activeCount ? G : 'rgba(255,249,230,.55)'} stroke="none"/>
              <circle cx="10" cy="18" r="2" fill={activeCount ? G : 'rgba(255,249,230,.55)'} stroke="none"/>
            </svg>
            {activeCount > 0 && (
              <div style={{
                position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: '50%',
                background: G, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Urbanist', fontWeight: 800, fontSize: 10, color: '#121212',
              }}>{activeCount}</div>
            )}
          </div>
        </div>

        {/* Active filter pills */}
        {activeCount > 0 && (
          <div style={{ marginTop: 10, display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {activeFilters.map(({ dim, v }) => (
              <div key={dim + v} onClick={() => removeFilter(dim, v)} style={{
                flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 10px 5px 12px', borderRadius: 999, cursor: 'pointer',
                background: 'rgba(185,255,111,.1)', border: '1px solid rgba(185,255,111,.22)',
                fontFamily: 'Urbanist', fontWeight: 600, fontSize: 12, color: G,
              }}>
                {v}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                     stroke={G} strokeWidth="2.8" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: `4px ${SP.screenH}px 40px` }}>

        {/* Trending (only when no query) */}
        {!q && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ ...T.label, marginBottom: 14 }}>Trending</div>
            {TRENDING.map((item, i) => (
              <div key={item.term} onClick={() => setQ(item.term)} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0',
                borderBottom: i < TRENDING.length - 1 ? '1px solid rgba(255,249,230,.05)' : 'none',
                cursor: 'pointer',
              }}>
                <span style={{
                  fontFamily: 'Urbanist', fontWeight: 700, fontSize: 11,
                  color: i === 0 ? G : 'rgba(255,249,230,.2)',
                  minWidth: 16,
                }}>{i + 1}</span>
                <span style={{ flex: 1, fontFamily: 'Urbanist', fontSize: 14, color: 'rgba(255,249,230,.8)' }}>
                  {item.term}
                </span>
                <span style={{ fontFamily: 'Urbanist', fontSize: 11, color: 'rgba(255,249,230,.25)' }}>
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Results header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ ...T.label }}>
            {q ? `${results.length} result${results.length !== 1 ? 's' : ''}` : 'Recommended for you'}
          </div>
          {!q && (
            <div style={{ fontFamily: 'Urbanist', fontSize: 11, fontWeight: 600, color: 'rgba(255,249,230,.35)' }}>
              By match
            </div>
          )}
        </div>

        {/* Mentor cards */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {results.length > 0
            ? results.map((r, i) => <MentorCard key={r.name} r={r} onPick={onPick} delay={i * 40} />)
            : (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, color: 'rgba(255,249,230,.5)' }}>No results found</div>
                <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: 'rgba(255,249,230,.3)', marginTop: 6 }}>
                  Try a different name or skill
                </div>
              </div>
            )
          }
        </div>
      </div>

      <HomeIndicator dark />

      {/* Filter sheet */}
      {showFilters && (
        <FilterSheet
          filters={filters}
          onApply={(f) => { setFilters(f); setShowFilters(false) }}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  )
}

const AVAIL_DAYS = [
  { day: 'Tue', date: 29, month: 'Apr', slots: ['10:00 am', '2:00 pm', '4:30 pm'] },
  { day: 'Wed', date: 30, month: 'Apr', slots: ['9:00 am', '11:00 am'] },
  { day: 'Fri', date:  2, month: 'May', slots: ['10:00 am', '1:30 pm', '3:00 pm'] },
  { day: 'Tue', date:  6, month: 'May', slots: ['9:30 am', '2:30 pm'] },
  { day: 'Wed', date:  7, month: 'May', slots: ['11:00 am', '4:00 pm'] },
]
const DAYS  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const SLOTS = ['9:00 am', '9:30 am', '10:00 am', '11:00 am', '1:30 pm', '2:30 pm', '3:00 pm', '4:30 pm']

export function ScheduleScreen({ mentor, onBack, onConfirm, isRebook = false, lastSession = null }) {
  const [day,   setDay]   = useState(3)
  const [slot,  setSlot]  = useState(null)
  const [topic, setTopic] = useState('Resume Review')
  const [goal,  setGoal]  = useState('')
  if (!mentor) return null
  const G = '#B9FF6F'
  const topics = ['Resume Review', 'Portfolio Critique', 'Career Advice', 'Interview Prep']
  const canConfirm = slot !== null
  return (
    <div style={{ width: '100%', height: '100%', background: C.ink, color: C.cream, position: 'relative', overflow: 'hidden' }}>
      <StatusBar dark />
      <div style={{ paddingTop: 56, paddingLeft: 22, paddingRight: 22, overflowY: 'auto', height: 'calc(100% - 80px)' }}>

        {/* Back */}
        <div onClick={onBack} style={{ color: G, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
          fontFamily: 'Urbanist', fontWeight: 600, fontSize: 14 }}>
          {I.back}
        </div>

        {/* Header with avatar */}
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src={mentor.avatar} width="44" height="44"
               style={{ borderRadius: 999, objectFit: 'cover', flexShrink: 0, border: '2px solid rgba(185,255,111,.2)' }}/>
          <div>
            <div style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 20, letterSpacing: -.3 }}>
              {isRebook ? 'Book again' : 'Pick a time'}
            </div>
            <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: 'rgba(255,249,230,.5)', marginTop: 1 }}>with {mentor.name}</div>
          </div>
        </div>

        {/* Last session context — rebook only */}
        {isRebook && lastSession && (
          <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 12,
            background: 'rgba(255,249,230,.04)', border: '1px solid rgba(255,249,230,.07)',
            display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,249,230,.3)"
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
            </svg>
            <span style={{ fontFamily: 'Urbanist', fontSize: 12, color: 'rgba(255,249,230,.32)' }}>
              Last session · {lastSession.date} · {lastSession.topic} · {lastSession.duration}
            </span>
          </div>
        )}

        {/* Day strip — sparse real availability */}
        <div style={{ marginTop: 24, display: 'flex', gap: 7, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {AVAIL_DAYS.map((d, i) => {
            const on = i === day
            return (
              <div key={i} onClick={() => { setDay(i); setSlot(null) }} style={{
                flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 2, padding: '10px 14px',
                background: on ? G : 'rgba(255,249,230,.05)',
                color: on ? C.ink : C.cream, borderRadius: 12, cursor: 'pointer',
                border: on ? 'none' : '1px solid rgba(255,249,230,.07)',
                minWidth: 56,
              }}>
                <div style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 10, opacity: on ? .65 : .4 }}>{d.day}</div>
                <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 18 }}>{d.date}</div>
                <div style={{ fontFamily: 'Urbanist', fontWeight: 500, fontSize: 10, opacity: on ? .65 : .35 }}>{d.month}</div>
              </div>
            )
          })}
        </div>

        {/* Times — from selected day */}
        <div style={{ marginTop: 22 }}>
          <div style={{ fontFamily: 'Urbanist', fontSize: 11, fontWeight: 700,
            color: 'rgba(255,249,230,.3)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 10 }}>
            Available times
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {AVAIL_DAYS[day].slots.map((t, i) => {
              const on = slot === i
              return (
                <div key={t} onClick={() => setSlot(i)} style={{
                  padding: '9px 16px', borderRadius: 10,
                  background: on ? G : 'rgba(255,249,230,.05)',
                  color: on ? C.ink : C.cream,
                  border: on ? 'none' : '1px solid rgba(255,249,230,.08)',
                  fontFamily: 'Urbanist', fontWeight: on ? 700 : 500, fontSize: 13,
                  cursor: 'pointer',
                }}>{t}</div>
              )
            })}
          </div>
        </div>

        {/* Topic */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontFamily: 'Urbanist', fontSize: 11, fontWeight: 700,
            color: 'rgba(255,249,230,.3)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 10 }}>
            Topic
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {topics.map(t => {
              const on = topic === t
              return (
                <div key={t} onClick={() => setTopic(t)} style={{
                  padding: '8px 14px', borderRadius: 999,
                  background: on ? 'rgba(185,255,111,.15)' : 'transparent',
                  color: on ? G : 'rgba(255,249,230,.55)',
                  border: `1px solid ${on ? 'rgba(185,255,111,.5)' : 'rgba(255,249,230,.09)'}`,
                  fontFamily: 'Urbanist', fontWeight: on ? 700 : 500, fontSize: 13, cursor: 'pointer',
                }}>{t}</div>
              )
            })}
          </div>
        </div>

        {/* Goal — only shown for rebook */}
        {isRebook && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontFamily: 'Urbanist', fontSize: 11, fontWeight: 700,
              color: 'rgba(255,249,230,.3)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6 }}>
              Goal for this session
            </div>
            <div style={{ fontFamily: 'Urbanist', fontSize: 12, color: 'rgba(255,249,230,.3)', marginBottom: 10 }}>
              What do you want to walk away with?
            </div>
            <textarea
              value={goal} onChange={e => setGoal(e.target.value)}
              placeholder="e.g. Get honest feedback on my top 2 case studies and a clear next step"
              rows={3}
              style={{
                width: '100%', boxSizing: 'border-box', padding: '13px 15px',
                borderRadius: 13, resize: 'none', outline: 'none',
                background: 'rgba(255,249,230,.05)',
                border: goal ? '1.5px solid rgba(185,255,111,.3)' : '1px solid rgba(255,249,230,.1)',
                color: '#FFF9E6', fontFamily: 'Urbanist', fontSize: 13, lineHeight: 1.55,
                transition: 'border-color 150ms',
              }}
            />
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 70 }}>
        <Btn variant="primaryInter" style={{ width: '100%', opacity: canConfirm ? 1 : 0.4 }}
             onClick={() => canConfirm && onConfirm({ day: AVAIL_DAYS[day].day, date: `${AVAIL_DAYS[day].date} ${AVAIL_DAYS[day].month}`, slot: AVAIL_DAYS[day].slots[slot], topic, goal })}>
          {canConfirm ? `Confirm · ${AVAIL_DAYS[day].slots[slot]}` : 'Pick a time to continue'}
        </Btn>
      </div>
      <HomeIndicator dark />
    </div>
  )
}

const BOOKED_CSS = `
  @keyframes bookedPop {
    0%   { transform: scale(0.5); opacity: 0; }
    65%  { transform: scale(1.08); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes bookedFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .booked-cta {
    transition: transform 160ms cubic-bezier(0.23,1,0.32,1), background 200ms, color 200ms, box-shadow 200ms;
  }
  .booked-cta:active { transform: scale(0.97); }
  @keyframes planReveal {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes sproutPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: .6; transform: scale(0.85); }
  }
`

export function BookedScreen({ mentor, booking, onHome, onSeeBookings, onGarden, onCompleteSession }) {
  if (!mentor || !booking) return null

  const G          = '#B9FF6F'
  const firstName  = mentor.name.split(' ')[0]
  const [url,      setUrl]      = useState('')
  const [fileName, setFileName] = useState(null)
  const [sent,     setSent]     = useState(false)
  const fileRef = useRef()

  const [planStep,   setPlanStep]  = useState(0)
  const [selectedQs, setSelectedQs] = useState([])
  const [generating, setGenerating] = useState(false)

  const SESSION_QUESTIONS = {
    'Portfolio Review': [
      'Getting honest feedback on my weakest case studies',
      'Figuring out what story my portfolio should tell',
      'Learning to talk through my design decisions confidently',
      'Deciding what to do with feedback I\'m stuck on',
      'Identifying what\'s missing from my portfolio',
      'Narrowing down my target role or company type',
      'Tightening how I walk someone through my process',
    ],
    'Career Advice': [
      'Mapping out what I want my career to look like in 2 years',
      'Understanding what\'s keeping me stuck right now',
      'Figuring out what\'s holding me back from bigger companies',
      'Deciding which skills to prioritize next',
      'Learning how to advocate for myself more effectively',
      'Getting clarity on what success actually means to me',
      'Navigating salary and title conversations',
    ],
    'Interview Prep': [
      'Identifying which part of interviews trips me up most',
      'Structuring a clearer portfolio walkthrough',
      'Practicing the questions I always struggle to answer',
      'Understanding why I\'ve been rejected and what to change',
      'Focusing my target company and role list',
      'Learning to talk about my impact and metrics confidently',
      'Handling design critique under time pressure',
    ],
    'Design Systems': [
      'Diagnosing the biggest pain point in my current system',
      'Understanding where my system breaks down in practice',
      'Getting buy-in from engineers and stakeholders',
      'Improving how I handle versioning and documentation',
      'Balancing consistency with product flexibility',
      'Working through my most complex component challenges',
      'Building a healthier design system culture on my team',
    ],
    'Resume Review': [
      'Targeting the right roles with my resume',
      'Rewriting bullet points that feel weak or vague',
      'Capturing impressive work that\'s missing from my resume',
      'Making sure my resume reflects my actual impact',
      'Understanding why I\'m not getting interviews',
      'Quantifying my design work more effectively',
      'Aligning the story my resume tells with the one I want',
    ],
  }
  const questions = SESSION_QUESTIONS[booking?.topic] ?? SESSION_QUESTIONS['Portfolio Review']

  function toggleQ(q) {
    setSelectedQs(prev =>
      prev.includes(q) ? prev.filter(x => x !== q)
        : prev.length < 5 ? [...prev, q] : prev
    )
  }

  function generatePlan() {
    setGenerating(true)
    setTimeout(() => { setGenerating(false); setPlanStep(2) }, 1400)
  }

  const topic    = booking?.topic ?? 'your session'
  const planItems = [
    { time: '0:00–5:00',   color: G,         label: 'Set the scene',
      desc: selectedQs[0] ? `"${selectedQs[0]}"` : `Quick intro: what brought you here` },
    { time: '5:00–18:00',  color: G,         label: topic,
      desc: `Deep dive with ${firstName}: bring specific examples, not just questions` },
    { time: '18:00–25:00', color: '#FFD060',  label: 'Tackle your blockers',
      desc: selectedQs[1] ? `"${selectedQs[1]}"` : 'What to keep, what to cut, what to do first' },
    { time: '25:00–30:00', color: '#7FDBFF',  label: 'Action items',
      desc: `3 things you'll do before you meet ${firstName} again` },
  ]

  return (
    <div style={{ width: '100%', height: '100%', background: '#0d0d0d',
                  color: '#FFF9E6', position: 'relative', overflow: 'hidden' }}>
      <style>{BOOKED_CSS}</style>
      <StatusBar dark />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(420px 380px at 50% 25%, rgba(185,255,111,.07), transparent 65%)' }}/>

      <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 160, boxSizing: 'border-box' }}>

        {/* ── Confirmation hero ── */}
        <div style={{ paddingTop: 68, paddingLeft: 24, paddingRight: 24, textAlign: 'center',
                      animation: 'bookedFadeUp 250ms ease-out both' }}>
          <div style={{
            margin: '0 auto', width: 76, height: 76, borderRadius: '50%',
            background: 'rgba(185,255,111,.08)',
            border: '1.5px solid rgba(185,255,111,.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 10px rgba(185,255,111,.05)',
            animation: 'bookedPop 300ms cubic-bezier(0.23,1,0.32,1)',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={G}
                 strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12l5 5 11-11"/>
            </svg>
          </div>
          <div style={{ marginTop: 18, fontFamily: 'Urbanist', fontWeight: 800,
                        fontSize: 28, letterSpacing: -.5, color: '#FFF9E6' }}>
            You're booked!
          </div>
          <div style={{ marginTop: 7, fontFamily: 'Urbanist', fontSize: 14,
                        color: 'rgba(255,249,230,.45)', lineHeight: 1.5 }}>
            Invite sent to your inbox and calendar.
          </div>
        </div>

        {/* ── Booking details ── */}
        <div style={{
          margin: '18px 24px 0', padding: '16px 18px', borderRadius: 18,
          background: 'rgba(255,249,230,.04)', border: '1px solid rgba(255,249,230,.09)',
          animation: 'bookedFadeUp 250ms 50ms ease-out both',
        }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <img src={mentor.avatar} width="42" height="42"
                 style={{ borderRadius: 999, objectFit: 'cover', border: '2px solid rgba(185,255,111,.28)' }}/>
            <div>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, color: '#FFF9E6' }}>
                {mentor.name}
              </div>
              <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: 'rgba(255,249,230,.45)' }}>
                {mentor.title}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,249,230,.07)',
                        display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 10 }}>
            <div>
              <div style={{ fontFamily: 'Urbanist', fontSize: 11, color: 'rgba(255,249,230,.32)',
                            letterSpacing: '.08em', textTransform: 'uppercase' }}>When</div>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, color: '#FFF9E6', marginTop: 4 }}>
                {booking.day} Apr {booking.date}
              </div>
              <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: 'rgba(255,249,230,.5)' }}>
                {booking.slot}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'Urbanist', fontSize: 11, color: 'rgba(255,249,230,.32)',
                            letterSpacing: '.08em', textTransform: 'uppercase' }}>Topic</div>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, color: '#FFF9E6', marginTop: 4 }}>
                {booking.topic}
              </div>
              <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: 'rgba(255,249,230,.5)' }}>
                30 min · Video
              </div>
            </div>
          </div>
        </div>

        {/* ── Prep prompt ── */}
        <div style={{
          margin: '14px 24px 0', padding: '16px 18px', borderRadius: 18,
          background: 'rgba(185,255,111,.04)', border: `1px solid ${sent ? 'rgba(185,255,111,.35)' : 'rgba(185,255,111,.12)'}`,
          animation: 'bookedFadeUp 250ms 100ms ease-out both',
          transition: 'border-color 150ms',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 15 }}>🌱</span>
            <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 14, color: '#FFF9E6' }}>
              Share your work with {firstName}
            </div>
          </div>
          <div style={{ fontFamily: 'Urbanist', fontSize: 13, color: 'rgba(255,249,230,.45)',
                        lineHeight: 1.55, marginBottom: 14 }}>
            They prep better when they know what they're walking into. Paste a link or upload a file.
          </div>

          {sent ? (
            /* Sent state */
            <div style={{ display: 'flex', alignItems: 'center', gap: 8,
                          padding: '10px 14px', borderRadius: 12,
                          background: 'rgba(185,255,111,.1)', border: '1px solid rgba(185,255,111,.25)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke={G} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12l5 5 11-11"/>
              </svg>
              <span style={{ fontFamily: 'Urbanist', fontWeight: 600, fontSize: 13, color: G }}>
                Shared. {firstName} will see it before your session.
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* URL input */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                height: 44, padding: '0 14px', borderRadius: 12,
                background: 'rgba(255,249,230,.05)',
                border: `1px solid ${url ? 'rgba(185,255,111,.3)' : 'rgba(255,249,230,.1)'}`,
                transition: 'border-color 150ms',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="rgba(255,249,230,.35)" strokeWidth="2" strokeLinecap="round">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                </svg>
                <input
                  type="url" value={url} onChange={e => setUrl(e.target.value)}
                  placeholder="Portfolio URL or website"
                  style={{
                    flex: 1, border: 'none', outline: 'none', background: 'transparent',
                    fontFamily: 'Urbanist', fontWeight: 500, fontSize: 13,
                    color: '#FFF9E6',
                  }}
                />
                {url && (
                  <div onClick={() => setUrl('')} style={{ cursor: 'pointer', opacity: .45 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,249,230,.08)' }}/>
                <span style={{ fontFamily: 'Urbanist', fontSize: 11,
                               color: 'rgba(255,249,230,.25)' }}>or</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,249,230,.08)' }}/>
              </div>

              {/* File upload */}
              <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.zip"
                     style={{ display: 'none' }}
                     onChange={e => setFileName(e.target.files?.[0]?.name ?? null)} />
              <div onClick={() => fileRef.current?.click()} style={{
                height: 44, borderRadius: 12, cursor: 'pointer',
                background: 'rgba(255,249,230,.04)',
                border: `1px dashed ${fileName ? 'rgba(185,255,111,.35)' : 'rgba(255,249,230,.14)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: 'Urbanist', fontWeight: 600, fontSize: 13,
                color: fileName ? G : 'rgba(255,249,230,.4)',
                transition: 'border-color 150ms, color 150ms',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                {fileName ?? 'Upload PDF or portfolio ZIP'}
              </div>

              {/* Send button — only shown when something is filled */}
              {(url || fileName) && (
                <button onClick={() => setSent(true)} style={{
                  height: 42, border: 'none', cursor: 'pointer', borderRadius: 12,
                  background: G, color: '#121212',
                  fontFamily: 'Urbanist', fontWeight: 700, fontSize: 13,
                  boxShadow: '0 4px 16px rgba(185,255,111,.2)',
                }}>
                  Send to {firstName}
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Session planning ── */}
        <div style={{
          margin: '14px 24px 0', padding: '16px 18px', borderRadius: 18,
          background: 'rgba(255,249,230,.03)',
          border: `1px solid ${planStep === 2 ? 'rgba(185,255,111,.2)' : 'rgba(255,249,230,.08)'}`,
          animation: 'bookedFadeUp 250ms 150ms ease-out both',
          transition: 'border-color 150ms',
        }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: planStep === 0 ? 10 : 14 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 14l-4.8 2.6.9-5.3L4.3 7.6l5.3-.8z"/>
            </svg>
            <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 14, color: '#FFF9E6' }}>
              {planStep === 2 ? 'Your session plan' : 'Plan your 30 min'}
            </div>
            {planStep === 2 && (
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
                            padding: '3px 9px 3px 6px', borderRadius: 999,
                            background: 'rgba(185,255,111,.08)',
                            border: '1px solid rgba(185,255,111,.2)' }}>
                {/* animated sprout dot */}
                <svg width="10" height="10" viewBox="0 0 20 20" fill="none"
                     style={{ animation: 'sproutPulse 2s ease-in-out infinite', flexShrink: 0 }}>
                  <circle cx="10" cy="10" r="4" fill={G}/>
                  <path d="M10 6C10 6 8 4 5 5c1 3 3 4 5 4" stroke={G} strokeWidth="1.2"
                        strokeLinecap="round" fill="none" opacity=".7"/>
                  <path d="M10 6C10 6 12 4 15 5c-1 3-3 4-5 4" stroke={G} strokeWidth="1.2"
                        strokeLinecap="round" fill="none" opacity=".7"/>
                </svg>
                <span style={{ fontFamily: 'Urbanist', fontSize: 11, fontWeight: 700,
                               color: G, letterSpacing: '.01em' }}>Sprout.AI</span>
              </div>
            )}
          </div>

          {/* Step 0 — teaser */}
          {planStep === 0 && (
            <>
              <div style={{ fontFamily: 'Urbanist', fontSize: 13,
                            color: 'rgba(255,249,230,.42)', lineHeight: 1.6, marginBottom: 14 }}>
                No prep stress. Tell us what you need and we'll hand you a clear game plan before you meet.
              </div>
              <button onClick={() => setPlanStep(1)} style={{
                width: '100%', height: 40, border: '1px solid rgba(255,249,230,.15)',
                background: 'transparent', cursor: 'pointer', borderRadius: 10,
                fontFamily: 'Urbanist', fontWeight: 600, fontSize: 13,
                color: 'rgba(255,249,230,.5)',
              }}>
                Start planning
              </button>
            </>
          )}

          {/* Step 1 — multi-select questions */}
          {planStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

              {/* Subtitle */}
              <div style={{ fontFamily: 'Urbanist', fontSize: 13,
                            color: 'rgba(255,249,230,.42)', lineHeight: 1.55, marginBottom: 4 }}>
                Pick 3–5 things you want to cover in your 30 min with {firstName}.
                We'll build a structured plan around your priorities.{' '}
                <span style={{ color: 'rgba(255,249,230,.28)' }}>
                  {firstName} gets a heads-up on your focus areas automatically.
                </span>
              </div>

              {/* Count badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            marginBottom: 2 }}>
                <span style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 11,
                               color: 'rgba(255,249,230,.3)', letterSpacing: '.06em',
                               textTransform: 'uppercase' }}>Your prep checklist</span>
                <span style={{
                  fontFamily: 'Urbanist', fontWeight: 700, fontSize: 11,
                  color: selectedQs.length >= 2 ? G : 'rgba(255,249,230,.3)',
                  transition: 'color 200ms',
                }}>
                  {selectedQs.length} of 5 selected
                </span>
              </div>

              {/* Question list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {questions.map((q, i) => {
                  const on = selectedQs.includes(q)
                  const maxed = !on && selectedQs.length >= 5
                  return (
                    <div key={i} onClick={() => !maxed && toggleQ(q)} style={{
                      padding: '11px 14px', borderRadius: 11, cursor: maxed ? 'default' : 'pointer',
                      background: on ? 'rgba(185,255,111,.08)' : 'rgba(255,249,230,.03)',
                      border: `1px solid ${on ? 'rgba(185,255,111,.35)' : 'rgba(255,249,230,.08)'}`,
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      opacity: maxed ? 0.4 : 1,
                      transition: 'background 120ms, border-color 120ms, opacity 120ms',
                      animation: `planReveal 250ms ${i * 40}ms ease-out both`,
                    }}>
                      {/* Checkbox */}
                      <div style={{
                        width: 17, height: 17, borderRadius: 5, flexShrink: 0, marginTop: 1,
                        border: `1.5px solid ${on ? G : 'rgba(255,249,230,.18)'}`,
                        background: on ? G : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 120ms, border-color 120ms',
                      }}>
                        {on && (
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                               stroke="#121212" strokeWidth="3.5" strokeLinecap="round">
                            <path d="M4 12l5 5 11-11"/>
                          </svg>
                        )}
                      </div>
                      <span style={{
                        fontFamily: 'Urbanist', fontWeight: on ? 600 : 400, fontSize: 13,
                        color: on ? '#FFF9E6' : 'rgba(255,249,230,.55)', lineHeight: 1.45,
                        transition: 'color 120ms',
                      }}>
                        {q}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* CTA */}
              <button
                onClick={() => selectedQs.length >= 2 && generatePlan()}
                style={{
                  marginTop: 4, height: 44, border: 'none', borderRadius: 11,
                  cursor: selectedQs.length >= 2 ? 'pointer' : 'default',
                  background: selectedQs.length >= 2 ? G : 'rgba(255,249,230,.07)',
                  color: selectedQs.length >= 2 ? '#121212' : 'rgba(255,249,230,.25)',
                  fontFamily: 'Urbanist', fontWeight: 700, fontSize: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: selectedQs.length >= 2 ? '0 4px 16px rgba(185,255,111,.18)' : 'none',
                  transition: 'background 200ms, color 200ms, box-shadow 200ms',
                }}
              >
                {generating ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                         style={{ animation: 'spin 700ms linear infinite' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
                    </svg>
                    Building your plan…
                  </>
                ) : 'Build my session plan →'}
              </button>

            </div>
          )}

          {/* Step 2 — plan */}
          {planStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14,
                          animation: 'planReveal 250ms ease-out both' }}>
              {planItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start',
                                      animation: `planReveal 250ms ${i * 60}ms ease-out both` }}>
                  {/* Timeline dot + line */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
                                flexShrink: 0, paddingTop: 3 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%',
                                  background: item.color, flexShrink: 0 }}/>
                    {i < planItems.length - 1 && (
                      <div style={{ width: 1, flex: 1, minHeight: 20,
                                    background: 'rgba(255,249,230,.08)', marginTop: 4 }}/>
                    )}
                  </div>
                  <div style={{ flex: 1, paddingBottom: i < planItems.length - 1 ? 6 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 13,
                                     color: '#FFF9E6' }}>{item.label}</span>
                      <span style={{ fontFamily: 'Urbanist', fontSize: 11, fontWeight: 600,
                                     color: item.color, letterSpacing: '.02em' }}>{item.time}</span>
                    </div>
                    <div style={{ marginTop: 2, fontFamily: 'Urbanist', fontSize: 12,
                                  color: 'rgba(255,249,230,.42)', lineHeight: 1.5 }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* ── Fixed CTAs ── */}
      <div style={{ position: 'absolute', left: 24, right: 24, bottom: 32,
                    display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          className="booked-cta"
          onClick={onSeeBookings}
          style={{
            width: '100%', height: 56, border: 'none', cursor: 'pointer',
            borderRadius: 14, background: G, color: '#121212',
            fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, letterSpacing: -.2,
            boxShadow: '0 10px 28px rgba(185,255,111,.25)',
          }}
        >
          See my bookings
        </button>
        <div onClick={onHome} style={{
          textAlign: 'center', fontFamily: 'Urbanist', fontSize: 14,
          color: 'rgba(255,249,230,.35)', cursor: 'pointer', padding: '8px 0',
        }}>
          Back to home
        </div>
      </div>

      <HomeIndicator dark />
    </div>
  )
}
