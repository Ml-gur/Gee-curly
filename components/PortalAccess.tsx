import { Crown, Users, Calendar, BarChart3, Settings, Shield } from 'lucide-react'

interface PortalAccessProps {
  onNavigateToPortal: (portal: 'owner' | 'staff') => void
}

export function PortalAccess({ onNavigateToPortal }: PortalAccessProps) {
  const handleOwnerAccess = () => {
    const ownerCode = prompt('Enter GeeCurly Salon owner access code:')
    if (ownerCode === 'GEECURLY2024' || ownerCode === 'sam123') {
      onNavigateToPortal('owner')
    } else if (ownerCode !== null) {
      alert('Invalid access code. Contact Sam Karanja for GeeCurly Salon owner portal access.')
    }
  }

  const handleStaffAccess = () => {
    const staffId = prompt('Enter your GeeCurly Salon staff ID or name:')
    if (staffId && staffId.length > 2) {
      onNavigateToPortal('staff')
    } else if (staffId !== null) {
      alert('Please enter a valid GeeCurly Salon staff ID or name.')
    }
  }

  return (
    <section className="py-16 bg-gradient-to-br from-electric-pink-light/20 to-deep-purple-light/20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="font-script bg-gradient-to-r from-electric-pink to-deep-purple bg-clip-text text-transparent">
              GeeCurly Salon Portal Access
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access your dedicated GeeCurly Salon portal to manage appointments, view earnings, and oversee salon operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Owner Portal */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-electric-pink to-sunset-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Owner Portal</h3>
              <p className="text-gray-600 text-sm">Complete GeeCurly Salon management system</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <Calendar className="w-4 h-4 text-electric-pink" />
                <span>Manage all bookings & appointments</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <Users className="w-4 h-4 text-electric-pink" />
                <span>Staff management & scheduling</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <BarChart3 className="w-4 h-4 text-electric-pink" />
                <span>Revenue reports & analytics</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <Settings className="w-4 h-4 text-electric-pink" />
                <span>Salon settings & promotions</span>
              </div>
            </div>

            <button
              onClick={handleOwnerAccess}
              className="w-full bg-gradient-to-r from-electric-pink to-sunset-orange text-white py-3 px-6 rounded-xl font-medium hover:from-electric-pink-dark hover:to-sunset-orange-dark transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
            >
              <Shield className="w-4 h-4" />
              <span>Access Owner Portal</span>
            </button>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Access code required • Contact Sam Karanja for access
              </p>
            </div>
          </div>

          {/* Staff Portal */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-mint to-deep-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Staff Portal</h3>
              <p className="text-gray-600 text-sm">Personal dashboard for GeeCurly team members</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <Calendar className="w-4 h-4 text-teal-mint" />
                <span>View your appointments</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <BarChart3 className="w-4 h-4 text-teal-mint" />
                <span>Track earnings & performance</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <Users className="w-4 h-4 text-teal-mint" />
                <span>Manage availability</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <Settings className="w-4 h-4 text-teal-mint" />
                <span>Update profile & preferences</span>
              </div>
            </div>

            <button
              onClick={handleStaffAccess}
              className="w-full bg-gradient-to-r from-teal-mint to-deep-purple text-white py-3 px-6 rounded-xl font-medium hover:from-teal-mint-dark hover:to-deep-purple-dark transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
            >
              <Users className="w-4 h-4" />
              <span>Access Staff Portal</span>
            </button>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Enter your staff ID or name • Available to all GeeCurly team members
              </p>
            </div>
          </div>
        </div>

        {/* Quick Access Info */}
        <div className="mt-12 text-center">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-3">GeeCurly Salon Portal Access Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <strong className="text-electric-pink">Owner Portal:</strong>
                <br />Access codes: GEECURLY2024 or sam123
              </div>
              <div>
                <strong className="text-teal-mint">Staff Portal:</strong>
                <br />Use your name or staff ID
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              * In production, these would be secure login systems with proper authentication
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}