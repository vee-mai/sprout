import { useState } from 'react'
import { CustomCursor } from './components/Cursor.jsx'
import { PhoneScreen } from './components/Phone.jsx'
import { LandingScreenDynamic, WelcomeScreen, HowItWorksScreen } from './components/screens/LandingScreen.jsx'
import { OnboardingFlowScreen, MatchingScreen } from './components/screens/OnboardingScreens.jsx'
import { SearchScreen, ScheduleScreen, BookedScreen } from './components/screens/BookingScreens.jsx'
import { SignInScreen, HomeScreen, MentorBioScreen, BookingsScreen, MENTORS } from './components/screens/Screens.jsx'
import { ChatInboxScreen, ChatThreadScreen, MeScreen } from './components/screens/AppScreens.jsx'
import { MyGardenScreen, PlantDetailSheet, PostSessionGrowth, PostSessionFlow, ShareGardenModal } from './components/screens/GardenScreens.jsx'

export default function App() {
  const [route,       setRoute]       = useState('landing')
  const [onboardStep, setOnboardStep] = useState(0)
  const [mentor,      setMentor]      = useState(null)
  const [booking,     setBooking]     = useState(null)
  const [chatThread,  setChatThread]  = useState(null)
  const [plant,       setPlant]       = useState(null)
  const [showShare,       setShowShare]       = useState(false)
  const [showGrowth,      setShowGrowth]      = useState(false)
  const [showSessionFlow, setShowSessionFlow] = useState(false)
  const [userName,        setUserName]        = useState('')
  const [lastSession,     setLastSession]     = useState(null)

  const go  = (r) => setRoute(r)
  const tab = (t) => { setPlant(null); setShowShare(false); go(t) }

  let screen
  switch (route) {
    case 'landing':
      screen = <LandingScreenDynamic onNext={() => go('signin')} />
      break
    case 'signin':
      screen = <SignInScreen onNext={(name) => { setUserName(name); go('howitworks') }} onBack={() => go('landing')} />
      break
    case 'howitworks':
      screen = <HowItWorksScreen onNext={() => go('welcome')} onSkip={() => go('onboard')} />
      break
    case 'welcome':
      screen = <WelcomeScreen onNext={() => go('onboard')} />
      break
    case 'onboard':
      screen = (
        <OnboardingFlowScreen
          step={onboardStep}
          onNext={() => { if (onboardStep < 3) setOnboardStep(s => s + 1); else go('matching') }}
          onBack={() => { if (onboardStep > 0) setOnboardStep(s => s - 1); else go('signin') }}
        />
      )
      break
    case 'matching':
      screen = (
        <MatchingScreen
          onNext={() => go('home')}
          onRestart={() => { setOnboardStep(0); go('onboard') }}
        />
      )
      break
    case 'home':
      screen = (
        <HomeScreen
          onOpenSearch={() => go('search')}
          onOpenMentor={(m) => { setMentor(m); go('bio') }}
          onTab={tab}
          tab="home"
          userName={userName}
        />
      )
      break
    case 'search':
      screen = <SearchScreen onPick={(m) => { setMentor(m); go('bio') }} onBack={() => go('home')} />
      break
    case 'bio':
      screen = <MentorBioScreen mentor={mentor} onBack={() => go('home')} onBook={(b) => { setBooking(b); go('booked') }}
        onMessage={() => {
          setChatThread({
            id: mentor.id,
            name: mentor.name,
            avatar: mentor.avatar.replace('/assets/', ''),
            last: '',
            time: 'Now',
            unread: 0,
            online: true,
            isNew: true,
          })
          go('chatThread')
        }} />
      break
    case 'schedule':
      screen = <ScheduleScreen mentor={mentor} onBack={() => go('bio')} onConfirm={(b) => { setBooking(b); go('booked') }} />
      break
    case 'bookAgain':
      screen = <ScheduleScreen mentor={mentor} isRebook lastSession={lastSession} onBack={() => go('cal')} onConfirm={(b) => { setBooking(b); go('booked') }} />
      break
    case 'booked':
      screen = (
        <BookedScreen
          mentor={mentor}
          booking={booking}
          onHome={() => go('home')}
          onSeeBookings={() => go('cal')}
          onGarden={() => tab('garden')}
          onCompleteSession={() => setShowSessionFlow(true)}
        />
      )
      break
    case 'cal':
      screen = <BookingsScreen onTab={tab} tab="cal" onBack={() => go('home')}
                 onBookAgain={(id, ls) => { const m = MENTORS.find(x => x.id === id); if (m) setMentor(m); setLastSession(ls || null); go('bookAgain') }}
                 onSearch={() => go('search')} />
      break
    case 'chat':
      screen = <ChatInboxScreen onOpenThread={(t) => { setChatThread(t); go('chatThread') }} onTab={tab} tab="chat" />
      break
    case 'chatThread':
      screen = <ChatThreadScreen thread={chatThread} onBack={() => go(chatThread?.isNew ? 'bio' : 'chat')} />
      break
    case 'garden':
      screen = <MyGardenScreen onTab={tab} tab="garden" onShare={() => setShowShare(true)} onOpenPlant={(p) => setPlant(p)} />
      break
    case 'me':
      screen = <MeScreen onTab={tab} tab="me" onRematch={() => { setOnboardStep(0); go('onboard') }} />
      break
    default:
      screen = <LandingScreenDynamic onNext={() => go('signin')} />
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
      <style>{`
        @keyframes screenEnter {
          from { opacity: 0; transform: scale(0.98) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
      <CustomCursor />
      <PhoneScreen>
        <div key={route} style={{ width: '100%', height: '100%', animation: 'screenEnter 180ms cubic-bezier(.2,.8,.2,1)' }}>
          {screen}
        </div>
        {plant     && <PlantDetailSheet plant={plant} onClose={() => setPlant(null)} />}
        {showShare && <ShareGardenModal onClose={() => setShowShare(false)} />}
        {showSessionFlow && (
          <PostSessionFlow
            mentor={mentor?.name}
            onDone={() => { setShowSessionFlow(false); tab('garden') }}
          />
        )}
        {showGrowth && (
          <PostSessionGrowth
            mentor={mentor?.name}
            species="fiddle"
            fromStage={3}
            toStage={4}
            onDone={() => { setShowGrowth(false); go('garden') }}
          />
        )}
      </PhoneScreen>
    </div>
  )
}
