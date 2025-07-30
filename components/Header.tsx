import { useState, useEffect } from 'react'
import { Menu, X, MapPin, Users, Phone, Settings, Crown } from 'lucide-react'

interface HeaderProps {
  currentView: string
  onNavigate: (view: string) => void
  selectedLocation: 'kiambu' | 'roysambu'
  onLocationChange: (location: 'kiambu' | 'roysambu') => void
}

export function Header({ currentView, onNavigate, selectedLocation, onLocationChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showPortalMenu, setShowPortalMenu] = useState(false)
  const [showLocationMenu, setShowLocationMenu] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const locations = {
    kiambu: {
      name: 'Kiambu Road',
      address: 'Next to Pro Swim',
      phone: '0715 589 102'
    },
    roysambu: {
      name: 'Roysambu',
      address: 'Lumumba Drive, Flash Building 2nd Floor',
      phone: '0700 235 466'
    }
  }

  const scrollToSection = (sectionId: string) => {
    if (currentView !== 'home') {
      onNavigate('home')
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setIsMenuOpen(false)
  }

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Services', id: 'services' },
    { label: 'Gallery', id: 'gallery' },
    { label: 'Team', id: 'team' },
    { label: 'Book Now', id: 'booking' },
    { label: 'Contact', id: 'contact' }
  ]

  const handlePortalAccess = (portal: 'owner' | 'staff') => {
    setShowPortalMenu(false)
    setIsMenuOpen(false)
    
    if (portal === 'owner') {
      // GeeCurly Salon owner access
      const ownerAccess = prompt('Enter GeeCurly Salon owner access code:')
      if (ownerAccess === 'GEECURLY2024' || ownerAccess === 'sam123') {
        onNavigate('owner-portal')
      } else if (ownerAccess !== null) {
        alert('Invalid access code. Contact Sam Karanja for GeeCurly Salon owner portal access.')
      }
    } else {
      // GeeCurly Salon staff portal access
      const staffAccess = prompt('Enter GeeCurly Salon staff ID or name:')
      if (staffAccess && staffAccess.length > 2) {
        onNavigate('staff-portal')
      } else if (staffAccess !== null) {
        alert('Please enter a valid GeeCurly Salon staff ID or name.')
      }
    }
  }

  const handleLocationSelect = (location: 'kiambu' | 'roysambu') => {
    onLocationChange(location)
    setShowLocationMenu(false)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-sm shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="mx-auto px-2 sm:px-3 lg:px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo - GeeCurly Salon */}
          <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-shrink-0 -ml-1 sm:ml-0">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
              isScrolled 
                ? 'bg-electric-pink' 
                : 'bg-white/20 backdrop-blur-sm'
            }`}>
              <span className="text-white font-bold text-base sm:text-lg lg:text-xl">G</span>
            </div>
            
            <div className="min-w-0 flex-1 -ml-1">
              <h1 className={`font-script font-bold transition-colors duration-300 whitespace-nowrap text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl ${
                isScrolled 
                  ? 'text-electric-pink' 
                  : 'text-white'
              }`}>
                GeeCurly Salon
              </h1>
              
              <p className={`font-inter transition-colors duration-300 text-xs lg:text-sm leading-tight hidden sm:block -mt-0.5 ${
                isScrolled 
                  ? 'text-gray-600' 
                  : 'text-white/90'
              }`}>
                Your Beauty, Our Passion
              </p>
            </div>
          </div>

          {/* Location Selector & Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {/* Location Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLocationMenu(!showLocationMenu)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105 text-sm ${
                  isScrolled 
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                    : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="font-medium">{locations[selectedLocation].name}</span>
              </button>

              {showLocationMenu && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  {Object.entries(locations).map(([key, location]) => (
                    <button
                      key={key}
                      onClick={() => handleLocationSelect(key as 'kiambu' | 'roysambu')}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-sm ${
                        selectedLocation === key ? 'bg-electric-pink-light' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-4 h-4 text-electric-pink mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-800">{location.name}</div>
                          <div className="text-xs text-gray-600">{location.address}</div>
                          <div className="text-xs text-electric-pink font-medium">{location.phone}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <nav className="flex items-center space-x-4 lg:space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-medium transition-all duration-300 hover:scale-105 whitespace-nowrap text-sm lg:text-base ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-electric-pink' 
                      : 'text-white hover:text-electric-pink-light'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Portal Access Button */}
            <div className="relative">
              <button
                onClick={() => setShowPortalMenu(!showPortalMenu)}
                className={`flex items-center space-x-1.5 lg:space-x-2 px-3 lg:px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 whitespace-nowrap text-sm lg:text-base ${
                  isScrolled 
                    ? 'bg-electric-pink hover:bg-electric-pink-dark text-white' 
                    : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                }`}
              >
                <Settings className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                <span className="font-medium font-inter">Portal</span>
              </button>

              {showPortalMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => handlePortalAccess('owner')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 text-sm"
                  >
                    <Crown className="w-4 h-4 text-electric-pink" />
                    <div>
                      <div className="font-medium text-gray-800">Owner Portal</div>
                      <div className="text-xs text-gray-600">GeeCurly Salon management</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handlePortalAccess('staff')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 text-sm"
                  >
                    <Users className="w-4 h-4 text-teal-mint" />
                    <div>
                      <div className="font-medium text-gray-800">Staff Portal</div>
                      <div className="text-xs text-gray-600">View appointments</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-1.5 sm:p-2 rounded-lg transition-all duration-300 flex-shrink-0 ${
              isScrolled 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
            }`}
          >
            {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm shadow-lg">
          <div className="mx-auto px-3 sm:px-4 py-4">
            {/* Mobile Location Selector */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-3">GeeCurly Salon Locations</div>
              <div className="space-y-2">
                {Object.entries(locations).map(([key, location]) => (
                  <button
                    key={key}
                    onClick={() => handleLocationSelect(key as 'kiambu' | 'roysambu')}
                    className={`w-full flex items-start space-x-3 p-3 rounded-lg text-left transition-colors ${
                      selectedLocation === key 
                        ? 'bg-electric-pink-light text-electric-pink' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">{location.name}</div>
                      <div className="text-xs opacity-70">{location.phone}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left text-gray-700 hover:text-electric-pink font-medium transition-colors text-sm"
                >
                  {item.label}
                </button>
              ))}
              
              {/* Mobile Portal Access */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="text-sm font-medium text-gray-600 mb-2">GeeCurly Salon Portal Access</div>
                <button
                  onClick={() => handlePortalAccess('owner')}
                  className="flex items-center space-x-3 text-gray-700 hover:text-electric-pink font-medium transition-colors w-full p-3 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Crown className="w-4 h-4 text-electric-pink" />
                  <div className="text-left">
                    <div>Owner Portal</div>
                    <div className="text-xs text-gray-600">Sam's admin dashboard</div>
                  </div>
                </button>
                <button
                  onClick={() => handlePortalAccess('staff')}
                  className="flex items-center space-x-3 text-gray-700 hover:text-electric-pink font-medium transition-colors w-full p-3 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Users className="w-4 h-4 text-teal-mint" />
                  <div className="text-left">
                    <div>Staff Portal</div>
                    <div className="text-xs text-gray-600">View appointments</div>
                  </div>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Click outside to close menus */}
      {(showPortalMenu || showLocationMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowPortalMenu(false)
            setShowLocationMenu(false)
          }}
        />
      )}
    </header>
  )
}