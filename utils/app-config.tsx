// Application configuration
// This replaces the Supabase configuration with local app settings

export const APP_CONFIG = {
  name: 'VIP Queens Salon',
  business: {
    name: 'VIP Queens Salon',
    phone: '0718779129',
    whatsappNumber: '254718779129',
    email: 'info@vipqueenssalon.com',
    address: {
      street: 'Ronald Ngala Street',
      building: 'RNG Plaza, 2nd floor S41',
      city: 'Ongata Rongai',
      country: 'Kenya'
    },
    hours: {
      weekdays: '6AM - 10PM',
      saturday: '6AM - 10PM', 
      sunday: '9AM - 6PM'
    },
    socialMedia: {
      instagram: 'https://instagram.com/vipqueenssalon',
      facebook: 'https://facebook.com/vipqueenssalon',
      tiktok: 'https://tiktok.com/@vipqueenssalon'
    }
  },
  booking: {
    advanceBookingDays: 30,
    cancellationHours: 24,
    reminderHours: 24,
    defaultDuration: 60, // minutes
    maxSlotsPerDay: 8
  },
  storage: {
    bookingsKey: 'vip-queens-bookings',
    settingsKey: 'vip-queens-settings',
    staffKey: 'vip-queens-staff-data',
    servicesKey: 'vip-queens-services-data'
  },
  features: {
    aiReceptionist: true,
    whatsappIntegration: true,
    realTimeUpdates: true,
    multipleBookingMethods: true,
    staffPortals: true,
    ownerDashboard: true
  }
}

// Helper functions for app configuration
export const getBusinessPhone = () => APP_CONFIG.business.phone
export const getWhatsAppNumber = () => APP_CONFIG.business.whatsappNumber
export const getBusinessAddress = () => {
  const addr = APP_CONFIG.business.address
  return `${addr.street}, ${addr.building}, ${addr.city}, ${addr.country}`
}

export const getBusinessHours = () => {
  const hours = APP_CONFIG.business.hours
  return {
    weekdays: hours.weekdays,
    saturday: hours.saturday,
    sunday: hours.sunday
  }
}

export const isFeatureEnabled = (feature: keyof typeof APP_CONFIG.features): boolean => {
  return APP_CONFIG.features[feature] || false
}