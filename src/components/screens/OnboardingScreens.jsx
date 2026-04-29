import { useState, useEffect, useRef } from 'react'
import { C, A } from '../atoms.jsx'
import { StatusBar, HomeIndicator } from '../Phone.jsx'

const G = '#B9FF6F'

const CSS = `
  @keyframes stepIn {
    from { opacity: 0; transform: translateX(22px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes stepBack {
    from { opacity: 0; transform: translateX(-22px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes checkIn {
    from { transform: scale(0.5) rotate(-12deg); opacity: 0; }
    to   { transform: scale(1) rotate(0deg);   opacity: 1; }
  }
  @keyframes matchRing {
    0%   { transform: scale(0.35); opacity: 0.85; }
    100% { transform: scale(1.65); opacity: 0; }
  }
  @keyframes matchFadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes progressFill {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes sproutStem {
    from { stroke-dashoffset: 36; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes sproutLeaf {
    from { opacity: 0; transform: scale(0.5); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes sproutSway {
    0%, 100% { transform: rotate(0deg);  }
    30%      { transform: rotate(6deg);  }
    70%      { transform: rotate(-6deg); }
  }
  @keyframes seedFloat {
    0%   { transform: translateY(0);     opacity: 0.4; }
    60%  { opacity: 0.22; }
    100% { transform: translateY(-44px); opacity: 0; }
  }
  @keyframes orbPulse {
    0%, 100% { box-shadow: 0 0 24px rgba(185,255,111,.16), 0 0 0 0 rgba(185,255,111,.06); }
    50%       { box-shadow: 0 0 48px rgba(185,255,111,.28), 0 0 0 22px rgba(185,255,111,0); }
  }
  @keyframes checkDraw {
    from { stroke-dashoffset: 32; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes ringExpand {
    0%   { transform: scale(1);   opacity: 0.5; }
    100% { transform: scale(2.7); opacity: 0; }
  }
  @keyframes sparkPop {
    0%   { transform: scale(0.5); opacity: 0; }
    55%  { transform: scale(1.25); opacity: 0.75; }
    100% { transform: scale(1); opacity: 0.5; }
  }
  .ob-card {
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    transition: border-color 140ms ease, box-shadow 140ms ease, background 140ms ease, transform 100ms cubic-bezier(0.23,1,0.32,1);
  }
  .ob-btn {
    transition: transform 160ms cubic-bezier(0.23,1,0.32,1);
  }
  .ob-btn:active { transform: scale(0.97); }
  .ob-back {
    transition: transform 140ms cubic-bezier(0.23,1,0.32,1), background 140ms;
  }
  .ob-back:active { transform: scale(0.93); }
  .ob-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    border-radius: 999px;
    background: transparent;
    outline: none;
    cursor: pointer;
  }
  .ob-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #B9FF6F;
    cursor: pointer;
    box-shadow: 0 0 18px rgba(185,255,111,.55);
    transition: transform 120ms cubic-bezier(0.23,1,0.32,1);
  }
  .ob-slider:active::-webkit-slider-thumb { transform: scale(1.18); }
  .ob-search::placeholder { color: rgba(255,249,230,.32); }
`

// Illustrations — strokes use currentColor, set color on wrapper
const IL = {
  growth: (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="28" cy="22" r="7"/>
      <path d="M14 48c2-8 8-12 14-12s12 4 14 12"/>
      <path d="M40 10l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill={G} stroke="none"/>
    </svg>
  ),
  briefcase: (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="20" width="36" height="26" rx="3"/>
      <path d="M22 20v-4a3 3 0 013-3h6a3 3 0 013 3v4"/>
      <path d="M10 32h36"/>
      <circle cx="28" cy="32" r="2" fill={G} stroke="none"/>
    </svg>
  ),
  transition: (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 28h32M34 22l8 6-8 6"/>
      <circle cx="14" cy="16" r="4" fill={G} stroke="none"/>
      <circle cx="44" cy="42" r="4" fill={G} stroke="none"/>
    </svg>
  ),
  interview: (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="12" width="40" height="24" rx="3"/>
      <path d="M16 36v4l6-4"/>
      <circle cx="20" cy="22" r="2" fill="currentColor"/>
      <circle cx="28" cy="22" r="2" fill="currentColor"/>
      <circle cx="36" cy="22" r="2" fill="currentColor"/>
    </svg>
  ),
  college: (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 22l20-8 20 8-20 8z" fill={G} stroke="none"/>
      <path d="M8 22l20-8 20 8-20 8z"/>
      <path d="M16 26v8c0 3 6 6 12 6s12-3 12-6v-8"/>
      <path d="M48 22v10"/>
    </svg>
  ),
  grad: (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="28" cy="20" r="6"/>
      <path d="M14 46c2-8 7-12 14-12s12 4 14 12"/>
      <rect x="22" y="32" width="12" height="4" fill={G} stroke="none"/>
    </svg>
  ),
  early: (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="12" y="16" width="32" height="28" rx="3"/>
      <path d="M18 26h20M18 32h14M18 38h16"/>
      <circle cx="42" cy="14" r="5" fill={G} stroke="none"/>
    </svg>
  ),
  hired: (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="28" cy="22" r="7"/>
      <path d="M14 46c2-8 7-12 14-12s12 4 14 12"/>
      <circle cx="42" cy="14" r="7" fill={G} stroke="none"/>
      <path d="M38 14l3 3 5-5" stroke="#121212" strokeWidth="1.8"/>
    </svg>
  ),
  mid: (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 44h36"/>
      <rect x="14" y="30" width="8" height="14" fill={G} stroke="none"/>
      <rect x="24" y="22" width="8" height="22" fill={G} stroke="none" opacity=".8"/>
      <rect x="34" y="14" width="8" height="30" fill={G} stroke="none" opacity=".6"/>
    </svg>
  ),
  senior: (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="28" cy="28" r="18"/>
      <path d="M28 16v12l8 5"/>
      <circle cx="28" cy="28" r="2" fill="currentColor"/>
    </svg>
  ),
  online: (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="14" width="34" height="22" rx="3"/>
      <path d="M40 22l10-6v24l-10-6V22z" fill={G} stroke="none"/>
      <path d="M14 42h18M23 36v6"/>
    </svg>
  ),
  inperson: (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="20" cy="18" r="6"/>
      <circle cx="36" cy="18" r="6"/>
      <path d="M8 48c2-9 6-13 12-13"/>
      <path d="M48 48c-2-9-6-13-12-13"/>
      <circle cx="28" cy="35" r="5" fill={G} stroke="none"/>
      <path d="M25 35l2 2 4-4" stroke="#121212" strokeWidth="1.8"/>
    </svg>
  ),
  nopref: (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="14" width="26" height="18" rx="3"/>
      <path d="M32 20l8-5v18l-8-5V20z" fill={G} stroke="none" opacity=".6"/>
      <circle cx="18" cy="40" r="5"/>
      <circle cx="38" cy="40" r="5"/>
      <path d="M23 40h10"/>
    </svg>
  ),
  structured: (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="12" width="36" height="32" rx="4"/>
      <path d="M18 22h20M18 30h20M18 38h12"/>
      <circle cx="14" cy="22" r="2" fill={G} stroke="none"/>
      <circle cx="14" cy="30" r="2" fill={G} stroke="none"/>
      <circle cx="14" cy="38" r="2" fill={G} stroke="none"/>
    </svg>
  ),
  exploratory: (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="28" cy="28" r="20"/>
      <path d="M28 8v5M28 43v5M8 28h5M43 28h5"/>
      <path d="M22 22l3.5 3.5-3.5 3.5 11-3.5z" fill={G} stroke="none"/>
      <circle cx="28" cy="28" r="2" fill="currentColor"/>
    </svg>
  ),
  blend: (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="20" cy="28" r="14"/>
      <circle cx="36" cy="28" r="14"/>
      <path d="M28 15 Q24 21 24 28 Q24 35 28 41 Q32 35 32 28 Q32 21 28 15Z" fill={G} stroke="none"/>
    </svg>
  ),
  uxResearch: (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="12"/>
      <circle cx="24" cy="21" r="4" fill={G} stroke="none"/>
      <path d="M32 32l10 10"/>
      <path d="M20 27c0 3 2 4.5 4 4.5"/>
    </svg>
  ),
  uiVisual: (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="7" width="18" height="18" rx="3"/>
      <rect x="31" y="7" width="18" height="18" rx="3" fill={G} stroke="none" opacity=".8"/>
      <rect x="7" y="31" width="18" height="18" rx="3" fill={G} stroke="none" opacity=".5"/>
      <rect x="31" y="31" width="18" height="18" rx="3"/>
    </svg>
  ),
  product: (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="8" width="36" height="28" rx="3"/>
      <path d="M22 36l-5 10h22l-5-10"/>
      <path d="M20 47h16"/>
      <path d="M23 20h10M28 15v10"/>
      <circle cx="42" cy="10" r="5" fill={G} stroke="none"/>
    </svg>
  ),
  systems: (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="20" y="5"  width="16" height="11" rx="2" fill={G} stroke="none"/>
      <rect x="5"  y="40" width="14" height="11" rx="2"/>
      <rect x="37" y="40" width="14" height="11" rx="2"/>
      <path d="M28 16v8M28 24l-14 10M28 24l14 10"/>
    </svg>
  ),
  brand: (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M28 8l2.5 8 8 2.5-8 2.5-2.5 8-2.5-8-8-2.5 8-2.5z" fill={G} stroke="none"/>
      <circle cx="28" cy="34" r="10"/>
      <path d="M42 40l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>
    </svg>
  ),
}

export const ONBOARD_STEPS = [
  {
    question: 'Where are you in your career?',
    hint: 'Pick one.',
    options: [
      { title: 'Student',       desc: 'In school or a bootcamp',     il: IL.college   },
      { title: 'Early (0–2y)', desc: 'Just getting started',         il: IL.early     },
      { title: 'Mid (3–6y)',   desc: 'Building momentum',            il: IL.mid       },
      { title: 'Senior (7+y)', desc: 'Deep experience',              il: IL.senior    },
      { title: 'Lead / Expert', desc: '12+ years in',               il: IL.briefcase },
    ],
  },
  {
    question: 'What\'s your design focus?',
    hint: 'Pick all that apply.',
    multi: true,
    options: [
      { title: 'UX Research',    desc: 'Interviews, usability, insights',      il: IL.uxResearch },
      { title: 'UI / Visual',    desc: 'Interfaces, components, visual craft',  il: IL.uiVisual   },
      { title: 'Product Design', desc: 'End-to-end, 0→1, cross-functional',    il: IL.product    },
      { title: 'Design Systems', desc: 'Tokens, components, documentation',     il: IL.systems    },
      { title: 'Brand & Motion', desc: 'Identity, animation, visual stories',  il: IL.brand      },
    ],
  },
  {
    question: 'What do you want help with?',
    hint: 'Pick all that apply.',
    multi: true,
    options: [
      { title: 'Career direction',     desc: 'Where to go next',            il: IL.growth     },
      { title: 'Portfolio & craft',    desc: 'Reviews and real feedback',    il: IL.briefcase  },
      { title: 'Interview prep',       desc: 'Get hired at your target co', il: IL.interview  },
      { title: 'Getting to senior',    desc: 'Levelling up your career',    il: IL.mid        },
      { title: 'Breaking into design', desc: 'First role or switching',     il: IL.transition },
    ],
  },
  {
    question: 'What does success look like in 6 months?',
    hint: 'Pick the one that resonates most.',
    options: [
      { title: 'Land a top-tier role',       desc: 'Google, Apple, Figma, Stripe…',  il: IL.hired      },
      { title: 'Build a standout portfolio', desc: 'Work I\'m proud to show',         il: IL.briefcase  },
      { title: 'Get promoted to senior',     desc: 'Level up at my current company',  il: IL.mid        },
      { title: 'Break into design',          desc: 'First role or career switch',      il: IL.transition },
      { title: 'Launch my own product',      desc: '0 to shipped',                    il: IL.product    },
      { title: 'Sharpen my craft',           desc: 'Get measurably better at design', il: IL.exploratory},
    ],
  },
]

const COMPANIES = [
  { name: 'Google',    mentors: 48, tier: 'hot',  tag: 'FAANG'    },
  { name: 'Apple',     mentors: 34, tier: 'hot',  tag: 'FAANG'    },
  { name: 'Meta',      mentors: 41, tier: 'hot',  tag: 'FAANG'    },
  { name: 'Figma',     mentors: 26, tier: 'hot',  tag: 'SaaS'     },
  { name: 'Amazon',    mentors: 29, tier: 'warm', tag: 'FAANG'    },
  { name: 'Stripe',    mentors: 22, tier: 'warm', tag: 'Fintech'  },
  { name: 'Notion',    mentors: 18, tier: 'warm', tag: 'SaaS'     },
  { name: 'Airbnb',    mentors: 19, tier: 'warm', tag: 'Travel'   },
  { name: 'Netflix',   mentors: 12, tier: 'cool', tag: 'FAANG'    },
  { name: 'Shopify',   mentors: 15, tier: 'warm', tag: 'Ecom'     },
  { name: 'Linear',    mentors: 9,  tier: 'cool', tag: 'SaaS'     },
  { name: 'Coinbase',  mentors: 11, tier: 'cool', tag: 'Fintech'  },
]

const COUNTRIES = [
  { name: 'United States',  flag: '🇺🇸' },
  { name: 'Canada',         flag: '🇨🇦' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Australia',      flag: '🇦🇺' },
  { name: 'Germany',        flag: '🇩🇪' },
  { name: 'France',         flag: '🇫🇷' },
  { name: 'Netherlands',    flag: '🇳🇱' },
  { name: 'Singapore',      flag: '🇸🇬' },
  { name: 'India',          flag: '🇮🇳' },
  { name: 'Japan',          flag: '🇯🇵' },
  { name: 'South Korea',    flag: '🇰🇷' },
  { name: 'Brazil',         flag: '🇧🇷' },
  { name: 'Mexico',         flag: '🇲🇽' },
  { name: 'Spain',          flag: '🇪🇸' },
  { name: 'Sweden',         flag: '🇸🇪' },
  { name: 'New Zealand',    flag: '🇳🇿' },
  { name: 'Ireland',        flag: '🇮🇪' },
  { name: 'Switzerland',    flag: '🇨🇭' },
  { name: 'UAE',            flag: '🇦🇪' },
  { name: 'South Africa',   flag: '🇿🇦' },
]

const TIMEZONES = {
  'United States':   ['Eastern (UTC−5)', 'Central (UTC−6)', 'Mountain (UTC−7)', 'Pacific (UTC−8)', 'Alaska (UTC−9)', 'Hawaii (UTC−10)'],
  'Canada':          ['Eastern (UTC−5)', 'Central (UTC−6)', 'Mountain (UTC−7)', 'Pacific (UTC−8)'],
  'United Kingdom':  ['London (UTC+0)'],
  'Australia':       ['Sydney / Melbourne (UTC+10)', 'Brisbane (UTC+10)', 'Adelaide (UTC+9:30)', 'Perth (UTC+8)'],
  'Germany':         ['Berlin (UTC+1)'],
  'France':          ['Paris (UTC+1)'],
  'Netherlands':     ['Amsterdam (UTC+1)'],
  'Singapore':       ['Singapore (UTC+8)'],
  'India':           ['India (UTC+5:30)'],
  'Japan':           ['Tokyo (UTC+9)'],
  'South Korea':     ['Seoul (UTC+9)'],
  'Brazil':          ['Brasília (UTC−3)', 'Manaus (UTC−4)', 'Acre (UTC−5)'],
  'Mexico':          ['Mexico City (UTC−6)', 'Tijuana (UTC−8)'],
  'Spain':           ['Madrid (UTC+1)'],
  'Sweden':          ['Stockholm (UTC+1)'],
  'New Zealand':     ['Auckland (UTC+12)'],
  'Ireland':         ['Dublin (UTC+0)'],
  'Switzerland':     ['Zurich (UTC+1)'],
  'UAE':             ['Dubai (UTC+4)'],
  'South Africa':    ['Johannesburg (UTC+2)'],
}

function CountryChip({ c, active, onClick }) {
  return (
    <div
      className="ob-card"
      onClick={onClick}
      onMouseDown={e => { e.currentTarget.style.transition = 'border-color 140ms ease, box-shadow 140ms ease, background 140ms ease, transform 100ms cubic-bezier(0.23,1,0.32,1)'; e.currentTarget.style.transform = 'scale(0.95)' }}
      onMouseUp={e   => { e.currentTarget.style.transition = 'border-color 140ms ease, box-shadow 140ms ease, background 140ms ease, transform 160ms cubic-bezier(0.23,1,0.32,1)'; e.currentTarget.style.transform = 'scale(1)' }}
      onMouseLeave={e => { e.currentTarget.style.transition = 'border-color 140ms ease, box-shadow 140ms ease, background 140ms ease, transform 160ms cubic-bezier(0.23,1,0.32,1)'; e.currentTarget.style.transform = 'scale(1)' }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '7px 14px 7px 10px', borderRadius: 999,
        background: active ? 'rgba(185,255,111,.08)' : 'rgba(255,249,230,.05)',
        border: active ? '1.5px solid rgba(185,255,111,.42)' : '1.5px solid rgba(255,249,230,.1)',
        boxShadow: active ? '0 0 0 3px rgba(185,255,111,.06)' : 'none',
        cursor: 'pointer', userSelect: 'none', WebkitUserSelect: 'none',
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>{c.flag}</span>
      <span style={{
        fontFamily: 'Urbanist', fontWeight: 600, fontSize: 14,
        color: active ? '#FFF9E6' : 'rgba(255,249,230,.75)',
        whiteSpace: 'nowrap',
      }}>{c.name}</span>
    </div>
  )
}

function ProgressBar({ step, total }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: 4, borderRadius: 999, flex: 1,
          background: i <= step ? G : 'rgba(255,249,230,.14)',
          boxShadow: i === step ? '0 0 8px rgba(185,255,111,.8)' : 'none',
          transition: 'background 250ms, box-shadow 250ms',
        }}/>
      ))}
    </div>
  )
}

function RadioCheck({ active, multi = false }) {
  const radius = multi ? 5 : 999
  if (!active) return (
    <div style={{ width: 18, height: 18, borderRadius: radius,
                  border: '1.5px solid rgba(255,249,230,.18)', flex: '0 0 18px' }}/>
  )
  return (
    <div style={{ width: 18, height: 18, borderRadius: radius, background: 'rgba(185,255,111,.7)', flex: '0 0 18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'checkIn 220ms cubic-bezier(0.23,1,0.32,1) both' }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth="3.5"
           strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12l5 5 11-11"/>
      </svg>
    </div>
  )
}

function OptionCard({ o, active, onClick, multi = false }) {
  return (
    <div
      className="ob-card"
      onClick={onClick}
      onMouseDown={e => { e.currentTarget.style.transition = 'border-color 140ms ease, box-shadow 140ms ease, background 140ms ease, transform 100ms cubic-bezier(0.23,1,0.32,1)'; e.currentTarget.style.transform = 'scale(0.975)' }}
      onMouseUp={e   => { e.currentTarget.style.transition = 'border-color 140ms ease, box-shadow 140ms ease, background 140ms ease, transform 160ms cubic-bezier(0.23,1,0.32,1)'; e.currentTarget.style.transform = 'scale(1)' }}
      onMouseLeave={e => { e.currentTarget.style.transition = 'border-color 140ms ease, box-shadow 140ms ease, background 140ms ease, transform 160ms cubic-bezier(0.23,1,0.32,1)'; e.currentTarget.style.transform = 'scale(1)' }}
      style={{
        padding: '13px 14px', borderRadius: 14,
        background: active ? 'rgba(185,255,111,.06)' : 'rgba(255,249,230,.04)',
        border: active ? '1.5px solid rgba(185,255,111,.42)' : '1.5px solid rgba(255,249,230,.09)',
        boxShadow: active ? '0 0 0 3px rgba(185,255,111,.06)' : 'none',
        display: 'flex', alignItems: 'center', gap: 12,
      }}
    >
      <div style={{
        width: 38, height: 38, flex: '0 0 38px', borderRadius: 10,
        background: active ? 'rgba(185,255,111,.1)' : 'rgba(255,249,230,.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: active ? G : 'rgba(255,249,230,.6)',
        transition: 'background 140ms, color 140ms',
      }}>
        {o.il}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16,
                      color: active ? '#FFF9E6' : 'rgba(255,249,230,.85)' }}>
          {o.title}
        </div>
        <div style={{ marginTop: 2, fontFamily: 'Urbanist', fontSize: 12,
                      color: 'rgba(255,249,230,.4)', lineHeight: 1.4 }}>
          {o.desc}
        </div>
      </div>
      <RadioCheck active={active} multi={multi} />
    </div>
  )
}

function CompanyChip({ c, active, onClick }) {
  const letters = c.name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
  let h = 0; for (let i = 0; i < c.name.length; i++) h = (h * 31 + c.name.charCodeAt(i)) & 0xffffff
  const hue = h % 360
  return (
    <div
      className="ob-card"
      onClick={onClick}
      onMouseDown={e => { e.currentTarget.style.transition = 'border-color 140ms ease, box-shadow 140ms ease, background 140ms ease, transform 100ms cubic-bezier(0.23,1,0.32,1)'; e.currentTarget.style.transform = 'scale(0.95)' }}
      onMouseUp={e   => { e.currentTarget.style.transition = 'border-color 140ms ease, box-shadow 140ms ease, background 140ms ease, transform 160ms cubic-bezier(0.23,1,0.32,1)'; e.currentTarget.style.transform = 'scale(1)' }}
      onMouseLeave={e => { e.currentTarget.style.transition = 'border-color 140ms ease, box-shadow 140ms ease, background 140ms ease, transform 160ms cubic-bezier(0.23,1,0.32,1)'; e.currentTarget.style.transform = 'scale(1)' }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '7px 14px 7px 7px', borderRadius: 999,
        background: active ? 'rgba(185,255,111,.08)' : 'rgba(255,249,230,.05)',
        border: active ? '1px solid rgba(185,255,111,.42)' : '1.5px solid rgba(255,249,230,.1)',
        boxShadow: active ? '0 0 0 3px rgba(185,255,111,.06)' : 'none',
        cursor: 'pointer', userSelect: 'none', WebkitUserSelect: 'none',
      }}
    >
      <div style={{
        width: 26, height: 26, borderRadius: '50%', flex: '0 0 26px',
        background: `hsl(${hue} 55% 22%)`, color: `hsl(${hue} 80% 72%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Urbanist', fontWeight: 700, fontSize: 11,
      }}>{letters}</div>
      <span style={{
        fontFamily: 'Urbanist', fontWeight: 600, fontSize: 14,
        color: active ? '#FFF9E6' : 'rgba(255,249,230,.75)',
        whiteSpace: 'nowrap',
      }}>{c.name}</span>
    </div>
  )
}

export function OnboardingFlowScreen({ step = 0, onNext, onBack }) {
  const s = ONBOARD_STEPS[step]
  const [sel, setSel] = useState(null)
  const [goalText, setGoalText] = useState('')
  const [companySearch, setCompanySearch] = useState('')
  const [customSel, setCustomSel]         = useState([])
  const [searchFocused, setSearchFocused] = useState(false)
  const [tzSel,  setTzSel]  = useState(null)
  const [tzOpen, setTzOpen] = useState(false)
  const [tzSearch, setTzSearch] = useState('')
  const dirRef = useRef(1)
  const prevStepRef = useRef(step)
  const searchRef = useRef(null)

  useEffect(() => {
    dirRef.current = step >= prevStepRef.current ? 1 : -1
    prevStepRef.current = step
    const st = ONBOARD_STEPS[step]
    setSel(st.slider ? 3 : st.multi ? [] : null)
    setGoalText('')
    setCompanySearch('')
    setCustomSel([])
    setTzSel(null)
    setTzOpen(false)
    setTzSearch('')
  }, [step])

  const animName  = dirRef.current >= 0 ? 'stepIn' : 'stepBack'
  const sliderVal = s.slider
    ? Math.max(1, Math.min(s.levels.length, (sel !== null && sel >= 1) ? sel : 3))
    : null

  const canProceed = s.skippable || s.slider
    ? true
    : s.location
      ? (sel !== null && tzSel !== null)
      : s.multi
        ? (Array.isArray(sel) && sel.length > 0)
        : sel !== null

  const ctaDisabled = !canProceed

  const query = companySearch.trim().toLowerCase()
  const filteredCompanies = s.companies
    ? (query
        ? COMPANIES.filter((c, i) =>
            c.name.toLowerCase().includes(query) ||
            (Array.isArray(sel) && sel.includes(i))
          )
        : COMPANIES)
    : []
  const showAddChip = s.companies && query.length > 1 &&
    !COMPANIES.some(c => c.name.toLowerCase() === query) &&
    !customSel.map(n => n.toLowerCase()).includes(query)

  function addCustomCompany() {
    const name = companySearch.trim()
    if (name) { setCustomSel(prev => [...prev, name]); setCompanySearch('') }
  }

  function handleSelect(i) {
    if (s.companies) {
      setSel(prev => {
        const arr = Array.isArray(prev) ? prev : []
        return arr.includes(i) ? arr.filter(x => x !== i) : [...arr, i]
      })
    } else {
      setSel(i)
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', background: '#0d0d0d', color: '#FFF9E6',
                  position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <style>{CSS}</style>
      <StatusBar dark />
      {/* Ambient glow — matches landing */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(460px 380px at 50% 60%, rgba(185,255,111,.06), transparent 70%)' }}/>

      {/* Top bar */}
      <div style={{ padding: '66px 24px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Bare back chevron — no box */}
          <div
            className="ob-back"
            onClick={onBack}
            style={{ flex: '0 0 auto', cursor: 'pointer', opacity: .55,
                     display: 'flex', alignItems: 'center', padding: '4px 2px' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </div>
          {/* Progress bar */}
          <div style={{ flex: 1 }}>
            <ProgressBar step={step} total={ONBOARD_STEPS.length} />
          </div>
          {/* Step counter or Skip */}
          {s.skippable ? (
            <div onClick={onNext} style={{
              fontFamily: 'Urbanist', fontWeight: 600, fontSize: 13,
              color: 'rgba(255,249,230,.45)', cursor: 'pointer', flex: '0 0 auto',
            }}>
              Skip
            </div>
          ) : (
            <div style={{
              fontFamily: 'Urbanist', fontWeight: 600, fontSize: 12, flex: '0 0 auto',
              color: 'rgba(255,249,230,.28)', letterSpacing: '.04em',
            }}>
              {step + 1}/{ONBOARD_STEPS.length}
            </div>
          )}
        </div>
      </div>

      {/* Animated content */}
      <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column',
                                overflow: 'hidden',
                                animation: `${animName} 250ms cubic-bezier(0.23,1,0.32,1) both` }}>

        {/* Headline */}
        <div style={{ padding: '32px 24px 24px' }}>
          <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 28,
                        letterSpacing: -.5, lineHeight: 1.18, color: '#FFF9E6' }}>
            {s.question}
          </div>
          <div style={{ marginTop: 12, fontFamily: 'Urbanist', fontSize: 14,
                        color: 'rgba(255,249,230,.45)', lineHeight: 1.6,
                        textWrap: 'pretty' }}>
            {s.hint}
          </div>
        </div>

        {/* Slider step */}
        {s.slider && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', padding: '0 28px 24px' }}>
            <div style={{ fontFamily: 'Urbanist', fontWeight: 800, fontSize: 38,
                          color: G, letterSpacing: -.5, textAlign: 'center',
                          lineHeight: 1.1 }}>
              {s.levels[sliderVal - 1].label}
            </div>
            <div style={{ marginTop: 10, fontFamily: 'Urbanist', fontSize: 14,
                          color: 'rgba(255,249,230,.42)' }}>
              Level {sliderVal} of {s.levels.length}
            </div>
            <div style={{ width: '100%', marginTop: 44 }}>
              <input
                type="range" min={1} max={s.levels.length} step={1}
                value={sliderVal}
                onChange={e => setSel(parseInt(e.target.value))}
                className="ob-slider"
                style={{
                  background: `linear-gradient(to right, ${G} 0%, ${G} ${((sliderVal-1)/(s.levels.length-1))*100}%, rgba(255,249,230,.15) ${((sliderVal-1)/(s.levels.length-1))*100}%, rgba(255,249,230,.15) 100%)`,
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10,
                            paddingLeft: 13, paddingRight: 13 }}>
                {s.levels.map((_, i) => (
                  <div key={i} style={{
                    width: 4, height: 4, borderRadius: 999,
                    background: i < sliderVal ? G : 'rgba(255,249,230,.22)',
                    transition: 'background 200ms',
                  }}/>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Options / Location / Companies / Goal */}
        <div style={{ flex: s.slider ? 0 : 1, overflowY: (s.companies || s.location) ? 'auto' : 'hidden',
                      padding: '0 24px 16px',
                      display: 'flex', flexDirection: 'column', gap: 12 }}>

          {s.companies && (
            <>
              {/* Search bar — real input */}
              <div style={{
                height: 48, padding: '0 14px', borderRadius: 12,
                background: 'rgba(255,249,230,.06)',
                border: `1.5px solid ${searchFocused ? 'rgba(185,255,111,.45)' : 'rgba(255,249,230,.1)'}`,
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
                transition: 'border-color 160ms',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke={searchFocused ? 'rgba(185,255,111,.7)' : 'rgba(255,249,230,.35)'}
                     strokeWidth="2" strokeLinecap="round" style={{ flex: '0 0 16px', transition: 'stroke 160ms' }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4-4"/>
                </svg>
                <input
                  ref={searchRef}
                  className="ob-search"
                  type="text"
                  value={companySearch}
                  onChange={e => setCompanySearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  onKeyDown={e => { if (e.key === 'Enter' && showAddChip) addCustomCompany() }}
                  placeholder="Search companies"
                  style={{
                    flex: 1, background: 'none', border: 'none', outline: 'none',
                    fontFamily: 'Urbanist', fontSize: 14, color: '#FFF9E6',
                  }}
                />
                {companySearch && (
                  <div
                    onClick={() => { setCompanySearch(''); searchRef.current?.focus() }}
                    style={{ cursor: 'pointer', opacity: .45, display: 'flex', padding: 2 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Chip grid */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {/* Custom-added companies — always active */}
                {customSel.map(name => (
                  <CompanyChip
                    key={`custom-${name}`}
                    c={{ name }}
                    active={true}
                    onClick={() => setCustomSel(prev => prev.filter(n => n !== name))}
                  />
                ))}
                {/* Preset companies filtered by search */}
                {filteredCompanies.map(c => {
                  const i = COMPANIES.indexOf(c)
                  return (
                    <CompanyChip
                      key={c.name}
                      c={c}
                      active={Array.isArray(sel) && sel.includes(i)}
                      onClick={() => handleSelect(i)}
                    />
                  )
                })}
                {/* Add custom chip */}
                {showAddChip && (
                  <div
                    onClick={addCustomCompany}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '7px 14px', borderRadius: 999,
                      background: 'rgba(185,255,111,.05)',
                      border: '1.5px dashed rgba(185,255,111,.35)',
                      cursor: 'pointer', userSelect: 'none', WebkitUserSelect: 'none',
                    }}
                  >
                    <span style={{ color: G, fontSize: 16, lineHeight: 1, fontWeight: 700 }}>+</span>
                    <span style={{ fontFamily: 'Urbanist', fontWeight: 600, fontSize: 14, color: G }}>
                      Add "{companySearch.trim()}"
                    </span>
                  </div>
                )}
                {/* Empty state */}
                {filteredCompanies.length === 0 && !showAddChip && query && (
                  <div style={{ fontFamily: 'Urbanist', fontSize: 14,
                                color: 'rgba(255,249,230,.3)', padding: '12px 0' }}>
                    No companies found
                  </div>
                )}
              </div>
            </>
          )}

          {s.location && (() => {
            const selectedCountry = sel !== null ? COUNTRIES[sel] : null
            const q = companySearch.trim().toLowerCase()
            const filtered = q ? COUNTRIES.filter(c => c.name.toLowerCase().includes(q)) : COUNTRIES
            const isOpen = searchFocused
            return (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {!isOpen ? (
                  /* Closed: trigger field */
                  <div
                    onClick={() => setSearchFocused(true)}
                    style={{
                      height: 56, padding: '0 16px', borderRadius: 14,
                      background: 'rgba(255,249,230,.06)',
                      border: `1.5px solid ${selectedCountry ? 'rgba(185,255,111,.45)' : 'rgba(255,249,230,.12)'}`,
                      display: 'flex', alignItems: 'center', gap: 12,
                      cursor: 'pointer', transition: 'border-color 160ms',
                    }}
                  >
                    {selectedCountry ? (
                      <>
                        <span style={{ fontSize: 22, lineHeight: 1 }}>{selectedCountry.flag}</span>
                        <span style={{ fontFamily: 'Urbanist', fontWeight: 600, fontSize: 16,
                                        color: '#FFF9E6', flex: 1 }}>
                          {selectedCountry.name}
                        </span>
                      </>
                    ) : (
                      <span style={{ fontFamily: 'Urbanist', fontSize: 16,
                                      color: 'rgba(255,249,230,.32)', flex: 1 }}>
                        Select your country
                      </span>
                    )}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                         stroke="rgba(255,249,230,.38)" strokeWidth="2" strokeLinecap="round">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>
                ) : (
                  /* Open: search input + list */
                  <>
                    <div style={{
                      height: 56, padding: '0 16px',
                      borderRadius: '14px 14px 0 0',
                      background: 'rgba(255,249,230,.06)',
                      border: '1.5px solid rgba(185,255,111,.5)',
                      borderBottom: '1px solid rgba(255,249,230,.08)',
                      display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                           stroke="rgba(185,255,111,.7)" strokeWidth="2" strokeLinecap="round">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4-4"/>
                      </svg>
                      <input
                        autoFocus
                        className="ob-search"
                        type="text"
                        value={companySearch}
                        onChange={e => setCompanySearch(e.target.value)}
                        placeholder="Search country"
                        style={{
                          flex: 1, background: 'none', border: 'none', outline: 'none',
                          fontFamily: 'Urbanist', fontSize: 14, color: '#FFF9E6',
                        }}
                      />
                      <div onClick={() => { setSearchFocused(false); setCompanySearch('') }}
                           style={{ cursor: 'pointer', opacity: .45, display: 'flex', padding: 4 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                      </div>
                    </div>
                    <div style={{
                      border: '1.5px solid rgba(185,255,111,.5)', borderTop: 'none',
                      borderRadius: '0 0 14px 14px', overflow: 'hidden',
                      background: '#151515',
                    }}>
                      {filtered.map((c, i) => {
                        const idx = COUNTRIES.indexOf(c)
                        const isActive = sel === idx
                        return (
                          <div
                            key={c.name}
                            onClick={() => {
                              setSel(idx)
                              setSearchFocused(false)
                              setCompanySearch('')
                              // Auto-select if this country has only one timezone
                              const tzs = TIMEZONES[c.name] || []
                              setTzSel(tzs.length === 1 ? tzs[0] : null)
                              setTzOpen(false)
                              setTzSearch('')
                            }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 12,
                              padding: '14px 16px', cursor: 'pointer',
                              background: isActive ? 'rgba(185,255,111,.08)' : 'transparent',
                              borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,249,230,.06)' : 'none',
                            }}
                          >
                            <span style={{ fontSize: 22, lineHeight: 1 }}>{c.flag}</span>
                            <span style={{ fontFamily: 'Urbanist', fontWeight: isActive ? 700 : 500,
                                            fontSize: 16, flex: 1,
                                            color: isActive ? '#FFF9E6' : 'rgba(255,249,230,.75)' }}>
                              {c.name}
                            </span>
                            {isActive && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={G}
                                   strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 12l5 5 11-11"/>
                              </svg>
                            )}
                          </div>
                        )
                      })}
                      {filtered.length === 0 && (
                        <div style={{ padding: '20px 16px', textAlign: 'center',
                                       fontFamily: 'Urbanist', fontSize: 14,
                                       color: 'rgba(255,249,230,.3)' }}>
                          No countries found
                        </div>
                      )}
                    </div>
                  </>
                )}
              {/* Timezone selector — appears after country is chosen */}
              {selectedCountry && (() => {
                  const tzList = TIMEZONES[selectedCountry.name] || []
                  const tzFiltered = tzSearch.trim()
                    ? tzList.filter(t => t.toLowerCase().includes(tzSearch.trim().toLowerCase()))
                    : tzList
                  return (
                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column',
                                  animation: 'stepIn 250ms cubic-bezier(0.23,1,0.32,1) both' }}>
                      <div style={{ marginBottom: 8, fontFamily: 'Urbanist', fontSize: 12,
                                    fontWeight: 600, color: 'rgba(255,249,230,.38)',
                                    letterSpacing: '.06em', textTransform: 'uppercase' }}>
                        Timezone
                      </div>
                      {!tzOpen ? (
                        /* Closed */
                        <div
                          onClick={() => setTzOpen(true)}
                          style={{
                            height: 52, padding: '0 16px', borderRadius: 14,
                            background: 'rgba(255,249,230,.06)',
                            border: `1.5px solid ${tzSel ? 'rgba(185,255,111,.4)' : 'rgba(255,249,230,.12)'}`,
                            display: 'flex', alignItems: 'center', gap: 12,
                            cursor: 'pointer', transition: 'border-color 160ms',
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                               stroke={tzSel ? G : 'rgba(255,249,230,.35)'}
                               strokeWidth="1.8" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 6v6l4 2"/>
                          </svg>
                          <span style={{ fontFamily: 'Urbanist', fontWeight: tzSel ? 600 : 400,
                                          fontSize: 14, flex: 1,
                                          color: tzSel ? '#FFF9E6' : 'rgba(255,249,230,.32)' }}>
                            {tzSel || 'Select timezone'}
                          </span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                               stroke="rgba(255,249,230,.38)" strokeWidth="2" strokeLinecap="round">
                            <path d="M6 9l6 6 6-6"/>
                          </svg>
                        </div>
                      ) : (
                        /* Open */
                        <>
                          <div style={{
                            height: 52, padding: '0 16px',
                            borderRadius: tzList.length > 1 ? '14px 14px 0 0' : 14,
                            background: 'rgba(255,249,230,.06)',
                            border: '1.5px solid rgba(185,255,111,.5)',
                            borderBottom: tzList.length > 1 ? '1px solid rgba(255,249,230,.08)' : undefined,
                            display: 'flex', alignItems: 'center', gap: 12,
                          }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                 stroke="rgba(185,255,111,.7)" strokeWidth="2" strokeLinecap="round">
                              <circle cx="11" cy="11" r="8"/><path d="m21 21-4-4"/>
                            </svg>
                            <input
                              autoFocus
                              className="ob-search"
                              type="text"
                              value={tzSearch}
                              onChange={e => setTzSearch(e.target.value)}
                              placeholder="Search timezone"
                              style={{
                                flex: 1, background: 'none', border: 'none', outline: 'none',
                                fontFamily: 'Urbanist', fontSize: 14, color: '#FFF9E6',
                              }}
                            />
                            <div onClick={() => { setTzOpen(false); setTzSearch('') }}
                                 style={{ cursor: 'pointer', opacity: .45, display: 'flex', padding: 4 }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                   stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M18 6L6 18M6 6l12 12"/>
                              </svg>
                            </div>
                          </div>
                          <div style={{
                            border: '1.5px solid rgba(185,255,111,.5)', borderTop: 'none',
                            borderRadius: '0 0 14px 14px', overflow: 'hidden',
                            background: '#151515',
                          }}>
                            {tzFiltered.map((tz, i) => (
                              <div
                                key={tz}
                                onClick={() => { setTzSel(tz); setTzOpen(false); setTzSearch('') }}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 12,
                                  padding: '13px 16px', cursor: 'pointer',
                                  background: tzSel === tz ? 'rgba(185,255,111,.08)' : 'transparent',
                                  borderBottom: i < tzFiltered.length - 1 ? '1px solid rgba(255,249,230,.06)' : 'none',
                                }}
                              >
                                <span style={{ fontFamily: 'Urbanist', fontWeight: tzSel === tz ? 700 : 500,
                                                fontSize: 14, flex: 1,
                                                color: tzSel === tz ? '#FFF9E6' : 'rgba(255,249,230,.75)' }}>
                                  {tz}
                                </span>
                                {tzSel === tz && (
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={G}
                                       strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 12l5 5 11-11"/>
                                  </svg>
                                )}
                              </div>
                            ))}
                            {tzFiltered.length === 0 && (
                              <div style={{ padding: '16px', textAlign: 'center',
                                             fontFamily: 'Urbanist', fontSize: 14,
                                             color: 'rgba(255,249,230,.3)' }}>
                                No timezones found
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })()}
              </div>
            )
          })()}

          {Array.isArray(s.options) && s.options.map((o, i) => {
            const isActive = s.multi ? (Array.isArray(sel) && sel.includes(i)) : sel === i
            return (
              <OptionCard
                key={i}
                o={o}
                active={isActive}
                multi={!!s.multi}
                onClick={() => {
                  if (s.multi) {
                    setSel(prev => {
                      const arr = Array.isArray(prev) ? prev : []
                      return arr.includes(i) ? arr.filter(x => x !== i) : [...arr, i]
                    })
                  } else {
                    setSel(i)
                  }
                }}
              />
            )
          })}
        </div>
      </div>

      {/* CTA */}
      {(
        <div style={{ padding: '12px 24px 48px' }}>
          <button
            className="ob-btn"
            onClick={() => { if (!ctaDisabled) setTimeout(onNext, 180) }}
            disabled={ctaDisabled}
            style={{
              width: '100%', height: 56, border: 'none',
              cursor: ctaDisabled ? 'default' : 'pointer',
              borderRadius: 14,
              background: ctaDisabled ? 'rgba(185,255,111,.25)' : G,
              color: '#121212',
              fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, letterSpacing: -.2,
              boxShadow: ctaDisabled ? 'none' : '0 10px 28px rgba(185,255,111,.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 200ms, box-shadow 200ms',
            }}
          >
            {s.companies ? 'Find my mentors' : 'Continue'}
          </button>
        </div>
      )}
      <HomeIndicator dark />
    </div>
  )
}

const MATCH_STARS = Array.from({ length: 18 }, (_, i) => ({
  t: `${5  + (i * 37 + 11) % 72}%`,
  l: `${3  + (i * 53 + 17) % 90}%`,
  w: i % 4 === 0 ? 2 : 1.5,
  o: 0.05 + (i % 5) * 0.07,
}))

const DONE_MENTORS = [
  { avatar: A('avatars/mentor-kimberly.jpg'), name: 'Kimberly', pct: 94, role: 'Product Design', company: 'Figma'  },
  { avatar: A('avatars/mentor-justin.jpg'),   name: 'Justin',   pct: 87, role: 'UX Research',    company: 'Google' },
  { avatar: A('avatars/mentor-alex.jpg'),     name: 'Alex',     pct: 81, role: 'Design Systems', company: 'Stripe' },
]

export function MatchingScreen({ onNext, onRestart }) {
  const [pct, setPct] = useState(0)
  const [done, setDone] = useState(false)
  const labels = ['Scanning your goals…', 'Matching your background…', 'Filtering 2,400 mentors…', 'Curating top picks…']
  const [labelIdx, setLabelIdx] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const duration = 4800
    const frame = () => {
      const elapsed = Date.now() - start
      const p = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setPct(Math.round(eased * 100))
      setLabelIdx(Math.min(labels.length - 1, Math.floor(p * labels.length)))
      if (p < 1) requestAnimationFrame(frame)
      else setDone(true)
    }
    const raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', background: '#0d0d0d', color: '#FFF9E6',
                  position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <style>{CSS}</style>
      <StatusBar dark />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(400px 400px at 50% 50%, rgba(185,255,111,.08), transparent 70%)' }}/>

      {!done ? (
        /* ── Loading phase ── */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center' }}>
          {/* Rings + logo */}
          <div style={{ position: 'relative', width: 160, height: 160,
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                position: 'absolute', width: '100%', height: '100%', borderRadius: '50%',
                border: `1.5px solid ${G}`, opacity: 0.6 - i * 0.15,
                animation: `matchRing 2.2s ease-out ${i * 0.45}s infinite`,
              }}/>
            ))}
            <div style={{
              width: 72, height: 72, borderRadius: '50%', background: G,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 0 8px rgba(185,255,111,.12)',
            }}>
              {/* Sway wrapper — pivots at base of stem */}
              <div style={{ animation: 'sproutSway 3.2s ease-in-out 1.4s infinite',
                            transformOrigin: '50% 80%' }}>
                <svg width="32" height="32" viewBox="0 0 110 110" fill="none">
                  <path
                    d="M55 88 Q55 72 55 58"
                    stroke="#121212" strokeWidth="4" strokeLinecap="round"
                    strokeDasharray="36"
                    style={{ animation: 'sproutStem 0.3s ease-out 0.15s both' }}
                  />
                  <path
                    d="M55 68 Q40 62 36 50 Q48 52 55 62Z"
                    fill="#121212"
                    style={{ transformBox: 'fill-box', transformOrigin: 'right bottom',
                             animation: 'sproutLeaf 0.25s ease-out 0.42s both' }}
                  />
                  <path
                    d="M55 64 Q70 58 74 46 Q62 48 55 58Z"
                    fill="#121212" opacity=".7"
                    style={{ transformBox: 'fill-box', transformOrigin: 'left bottom',
                             animation: 'sproutLeaf 0.25s ease-out 0.62s both' }}
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Counter */}
          <div style={{ marginTop: 44, textAlign: 'center' }}>
            <div style={{ fontFamily: 'Urbanist', fontWeight: 700, fontSize: 44,
                          letterSpacing: -1.5, color: G, lineHeight: 1 }}>
              {pct}%
            </div>
            <div style={{ marginTop: 10, fontFamily: 'Urbanist', fontWeight: 600, fontSize: 18,
                          color: '#FFF9E6' }}>
              Finding your matches
            </div>
            <div key={labelIdx} style={{ marginTop: 6, fontFamily: 'Urbanist', fontSize: 13,
                          color: 'rgba(255,249,230,.45)',
                          animation: 'matchFadeUp .3s ease-out both' }}>
              {labels[labelIdx]}
            </div>
          </div>
        </div>
      ) : (
        /* ── Confirmation phase ── */
        <>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* ── Centered content group ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center', width: '100%' }}>

            {/* ── Confirmation badge ── */}
            <div style={{ position: 'relative', width: 88, height: 88,
                          animation: 'matchFadeUp .38s .1s ease-out both' }}>
              {/* Expanding rings */}
              {[0, 1].map(i => (
                <div key={i} style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  border: '1px solid rgba(185,255,111,.45)',
                  animation: `ringExpand 1s ${.5 + i * .22}s cubic-bezier(0.22,1,0.36,1) both`,
                }}/>
              ))}
              {/* Sparkles */}
              {[
                { top: -18, left: -52, delay: '1.1s'  },
                { top: -18, left: 130, delay: '1.2s'  },
                { top:  42, left: -62, delay: '1.28s' },
                { top:  42, left: 140, delay: '1.22s' },
              ].map((sp, i) => (
                <div key={i} style={{ position: 'absolute', top: sp.top, left: sp.left,
                  pointerEvents: 'none',
                  animation: `sparkPop .28s ${sp.delay} cubic-bezier(0.23,1,0.32,1) both` }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 0 L5.7 4.3 L10 5 L5.7 5.7 L5 10 L4.3 5.7 L0 5 L4.3 4.3Z"
                          fill={G} opacity=".65"/>
                  </svg>
                </div>
              ))}
              {/* Orb */}
              <div style={{
                position: 'relative', width: '100%', height: '100%', borderRadius: '50%',
                background: 'radial-gradient(circle at 38% 36%, rgba(185,255,111,.22), rgba(185,255,111,.06) 70%)',
                border: '1.5px solid rgba(185,255,111,.42)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 52px rgba(185,255,111,.2)',
                animation: 'checkIn .28s .3s cubic-bezier(0.23,1,0.32,1) both',
              }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M 10 20 L 17 27 L 30 14"
                    stroke={G} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="32"
                    style={{ animation: 'checkDraw .28s .52s ease-out both' }}
                  />
                </svg>
              </div>
            </div>

            {/* ── Headline ── */}
            <div style={{ marginTop: 24, textAlign: 'center', padding: '0 32px',
                          animation: 'matchFadeUp .25s .3s ease-out both' }}>
              <div style={{ fontFamily: 'Urbanist', fontWeight: 700,
                            fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase',
                            color: G }}>
                You're all set
              </div>
              <div style={{ marginTop: 8, fontFamily: 'Urbanist', fontWeight: 800,
                            fontSize: 32, letterSpacing: -.5, color: '#FFF9E6' }}>
                Welcome!
              </div>
              <div style={{ marginTop: 10, fontFamily: 'Urbanist', fontSize: 14,
                            color: 'rgba(255,249,230,.45)', lineHeight: 1.6, textWrap: 'pretty' }}>
                We filtered 2,400 mentors down to your top picks.
              </div>
            </div>

            {/* ── Mentor match cards ── */}
            <div style={{ width: '100%', padding: '28px 20px 0',
                          display: 'flex', flexDirection: 'column', gap: 10 }}>
              {DONE_MENTORS.map((m, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', borderRadius: 16,
                  background: 'rgba(255,249,230,.04)',
                  border: '1.5px solid rgba(255,249,230,.08)',
                  animation: `matchFadeUp .25s ${.45 + i * .08}s both`,
                }}>
                  {/* Avatar */}
                  <div style={{ position: 'relative', flex: '0 0 auto' }}>
                    <img src={m.avatar} width="50" height="50"
                      style={{ display: 'block', borderRadius: '50%', objectFit: 'cover',
                        border: '2px solid rgba(185,255,111,.75)',
                        boxShadow: '0 4px 16px rgba(185,255,111,.12)' }}/>
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10,
                      borderRadius: '50%', background: G }}/>
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Urbanist', fontWeight: 700,
                                  fontSize: 16, color: '#FFF9E6' }}>
                      {m.name}
                    </div>
                    <div style={{ marginTop: 2, fontFamily: 'Urbanist', fontSize: 12,
                                  color: 'rgba(255,249,230,.38)' }}>
                      {m.role} · {m.company}
                    </div>
                  </div>
                  {/* Match % */}
                  <div style={{
                    background: 'rgba(185,255,111,.1)', border: '1px solid rgba(185,255,111,.28)',
                    borderRadius: 999, padding: '3px 10px',
                    fontFamily: 'Urbanist', fontWeight: 800, fontSize: 12, color: G,
                    flex: '0 0 auto',
                  }}>{m.pct}%</div>
                </div>
              ))}
            </div>

            </div>{/* end centered group */}

            {/* ── CTA ── */}
            <div style={{ width: '100%', padding: '20px 20px 48px',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
                          animation: 'matchFadeUp .25s .65s ease-out both' }}>
              <button
                className="ob-btn"
                onClick={onNext}
                style={{
                  width: '100%', height: 56, border: 'none', cursor: 'pointer',
                  borderRadius: 14, background: G, color: '#121212',
                  fontFamily: 'Urbanist', fontWeight: 700, fontSize: 16, letterSpacing: -.2,
                  boxShadow: '0 10px 28px rgba(185,255,111,.28)',
                }}
              >
                Meet my mentors
              </button>
              <div
                onClick={onRestart}
                style={{ fontFamily: 'Urbanist', fontSize: 14, cursor: 'pointer',
                         color: 'rgba(255,249,230,.35)' }}
              >
                Restart flow
              </div>
            </div>
          </div>
        </>
      )}

      <HomeIndicator dark />
    </div>
  )
}
