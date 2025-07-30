import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { QuickInfo } from './components/QuickInfo'
import { Services } from './components/Services'
import { WhyChooseUs } from './components/WhyChooseUs'
import { Stats } from './components/Stats'
import { Gallery } from './components/Gallery'
import { SpecialOffers } from './components/SpecialOffers'
import { Team } from './components/Team'
import { BookingSection } from './components/BookingSection'
import { PortalAccess } from './components/PortalAccess'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { AIReceptionist } from './components/AIReceptionist'
import { StaffPortal } from './components/StaffPortal'
import { OwnerPortal } from './components/OwnerPortal'
import { BookingProvider } from './components/booking/BookingContext'

export default function App() {
  const [currentView, setCurrentView] = useState('home')
  const [selectedLocation, setSelectedLocation] = useState('kiambu') // Default to Kiambu location
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize GeeCurly Salon app
    const initializeApp = () => {
      try {
        console.log('Initializing GeeCurly Salon app...')
        
        // Check if localStorage is available
        if (typeof Storage !== 'undefined') {
          // Initialize with welcome data
          const hasVisited = localStorage.getItem('geecurly-visited')
          if (!hasVisited) {
            localStorage.setItem('geecurly-visited', 'true')
            localStorage.setItem('geecurly-initialized', new Date().toISOString())
            localStorage.setItem('geecurly-preferred-location', 'kiambu')
            console.log('First visit - GeeCurly Salon localStorage initialized')
          } else {
            // Load preferred location
            const savedLocation = localStorage.getItem('geecurly-preferred-location')
            if (savedLocation && (savedLocation === 'kiambu' || savedLocation === 'roysambu')) {
              setSelectedLocation(savedLocation)
            }
          }
        } else {
          console.warn('localStorage not available')
        }
        
        // Set a small delay for smooth loading animation
        setTimeout(() => {
          console.log('GeeCurly Salon app initialization complete')
          setIsInitialized(true)
        }, 1200)
      } catch (error) {
        console.error('GeeCurly Salon app initialization error:', error)
        // Always set initialized to true to prevent infinite loading
        setIsInitialized(true)
      }
    }

    initializeApp()
  }, [])

  // Handle location changes
  const handleLocationChange = (location: 'kiambu' | 'roysambu') => {
    setSelectedLocation(location)
    localStorage.setItem('geecurly-preferred-location', location)
    console.log(`GeeCurly Salon location changed to: ${location}`)
  }

  const handlePortalAccess = (portal: 'owner' | 'staff') => {
    if (portal === 'owner') {
      setCurrentView('owner-portal')
    } else {
      setCurrentView('staff-portal')
    }
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'staff-portal':
        return <StaffPortal onBack={() => setCurrentView('home')} selectedLocation={selectedLocation} />
      case 'owner-portal':
        return <OwnerPortal onBack={() => setCurrentView('home')} />
      default:
        return (
          <>
            <Hero 
              selectedLocation={selectedLocation}
              onLocationChange={handleLocationChange}
            />
            <QuickInfo selectedLocation={selectedLocation} />
            <Services selectedLocation={selectedLocation} />
            <WhyChooseUs />
            <Stats />
            <Gallery />
            <SpecialOffers selectedLocation={selectedLocation} />
            <Team selectedLocation={selectedLocation} />
            <BookingSection selectedLocation={selectedLocation} />
            <PortalAccess onNavigateToPortal={handlePortalAccess} />
            <Contact selectedLocation={selectedLocation} />
          </>
        )
    }
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-geecurly-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-electric-pink-light border-t-electric-pink mx-auto mb-6"></div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            <span className="font-script bg-gradient-to-r from-electric-pink to-deep-purple bg-clip-text text-transparent">
              GeeCurly Salon
            </span>
          </h2>
          <p className="text-gray-600 font-inter">Your Beauty, Our Passion — Now Smarter With AI</p>
          <p className="text-sm text-gray-500 font-inter mt-2">Trusted by over 1M beauty lovers on TikTok</p>
          
          {/* Loading animation with floating elements */}
          <div className="mt-8 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-electric-pink rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-teal-mint rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-sunset-orange rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
          
          {/* TikTok branding hint */}
          <div className="mt-4 inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">T</span>
            </div>
            <span className="text-gray-700 text-sm">@gee_curly_salon</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <BookingProvider>
      <div className="min-h-screen bg-cream-white">
        <Header 
          currentView={currentView} 
          onNavigate={setCurrentView}
          selectedLocation={selectedLocation}
          onLocationChange={handleLocationChange}
        />
        
        <main>
          {renderCurrentView()}
        </main>
        
        {currentView === 'home' && (
          <>
            <Footer selectedLocation={selectedLocation} />
            <AIReceptionist selectedLocation={selectedLocation} />
          </>
        )}
      </div>
    </BookingProvider>
  )
}