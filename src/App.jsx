import { useState } from 'react'
import { PhoneScreen } from './components/Phone.jsx'
import { LandingScreenDynamic, OnboardingFlowScreen, MatchingScreen, SearchScreen, ScheduleScreen, BookedScreen } from './components/screens/FlowScreens.jsx'
import { SignInScreen, HomeScreen, MentorBioScreen, BookingsScreen } from './components/screens/Screens.jsx'
import { ChatInboxScreen, ChatThreadScreen, MeScreen } from './components/screens/AppScreens.jsx'
import { MyGardenScreen, PlantDetailSheet, PostSessionGrowth, ShareGardenModal } from './components/screens/GardenScreens.jsx'

export default function App() {
  const [route,       setRoute]       = useState('landing')
  const [onboardStep, setOnboardStep] = useState(0)
  const [mentor,      setMentor]      = useState(null)
  const [booking,     setBooking]     = useState(null)
  const [chatThread,  setChatThread]  = useState(null)
  const [plant,       setPlant]       = useState(null)
  const [showShare,   setShowShare]   = useState(false)
  const [showGrowth,  setShowGrowth]  = useState(false)

  const go  = (r) => setRoute(r)
  const tab = (t) => { setPlant(null); setShowShare(false); go(t) }

  let screen
  switch (route) {
    case 'landing':
      screen = <LandingScreenDynamic onNext={() => go('signin')} />
      break
    case 'signin':
      screen = <SignInScreen onNext={() => go('onboard')} onBack={() => go('landing')} />
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
      screen = <MatchingScreen onNext={() => go('home')} />
      break
    case 'home':
      screen = (
        <HomeScreen
          onOpenSearch={() => go('search')}
          onOpenMentor={(m) => { setMentor(m); go('bio') }}
          onTab={tab}
          tab="home"
        />
      )
      break
    case 'search':
      screen = <SearchScreen onPick={(m) => { setMentor(m); go('bio') }} onBack={() => go('home')} />
      break
    case 'bio':
      screen = <MentorBioScreen mentor={mentor} onBack={() => go('home')} onBook={() => go('schedule')} onMessage={() => go('chat')} />
      break
    case 'schedule':
      screen = <ScheduleScreen mentor={mentor} onBack={() => go('bio')} onConfirm={(b) => { setBooking(b); go('booked') }} />
      break
    case 'booked':
      screen = (
        <BookedScreen
          mentor={mentor}
          booking={booking}
          onHome={() => go('home')}
          onSeeBookings={() => go('cal')}
          onCompleteSession={() => setShowGrowth(true)}
        />
      )
      break
    case 'cal':
      screen = <BookingsScreen onTab={tab} tab="cal" onBack={() => go('home')} />
      break
    case 'chat':
      screen = <ChatInboxScreen onOpenThread={(t) => { setChatThread(t); go('chatThread') }} onTab={tab} tab="chat" />
      break
    case 'chatThread':
      screen = <ChatThreadScreen thread={chatThread} onBack={() => go('chat')} />
      break
    case 'garden':
      screen = <MyGardenScreen onTab={tab} tab="garden" onShare={() => setShowShare(true)} onOpenPlant={(p) => setPlant(p)} />
      break
    case 'me':
      screen = <MeScreen onTab={tab} tab="me" />
      break
    default:
      screen = <LandingScreenDynamic onNext={() => go('signin')} />
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
      <PhoneScreen>
        {screen}
        {plant     && <PlantDetailSheet plant={plant} onClose={() => setPlant(null)} />}
        {showShare && <ShareGardenModal onClose={() => setShowShare(false)} />}
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
