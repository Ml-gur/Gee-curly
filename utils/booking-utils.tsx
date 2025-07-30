// Utility functions for the booking system
// This replaces any Supabase dependencies with pure JavaScript functions

export interface BookingData {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  service: string
  serviceCategory: string
  price: number
  duration: string
  stylistId: string
  stylistName: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  bookingMethod: 'website' | 'whatsapp' | 'ai_chat'
  createdAt: string
  updatedAt: string
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', { 
    style: 'currency', 
    currency: 'KES', 
    minimumFractionDigits: 0 
  }).format(amount)
}

export const formatTime = (timeStr: string): string => {
  try {
    // Handle various time formats
    const cleanTime = timeStr.replace(/\s*(AM|PM)\s*/i, '')
    const [hours, minutes] = cleanTime.split(':').map(Number)
    
    let displayHour = hours
    let period = 'AM'
    
    if (hours >= 12) {
      period = 'PM'
      if (hours > 12) displayHour = hours - 12
    } else if (hours === 0) {
      displayHour = 12
    }
    
    return `${displayHour}:${(minutes || 0).toString().padStart(2, '0')} ${period}`
  } catch (error) {
    return timeStr // Return original if parsing fails
  }
}

export const timeToMinutes = (timeStr: string): number => {
  try {
    const cleanTime = timeStr.replace(/\s*(AM|PM)\s*/i, '')
    const [hours, minutes] = cleanTime.split(':').map(Number)
    
    let totalMinutes = hours * 60 + (minutes || 0)
    
    // Handle AM/PM format
    if (timeStr.match(/PM/i) && hours !== 12) {
      totalMinutes += 12 * 60
    } else if (timeStr.match(/AM/i) && hours === 12) {
      totalMinutes -= 12 * 60
    }
    
    return totalMinutes
  } catch (error) {
    return 0
  }
}

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  const period = hours >= 12 ? 'PM' : 'AM'
  
  return `${displayHour}:${mins.toString().padStart(2, '0')} ${period}`
}

export const generateBookingId = (): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  return `booking_${timestamp}_${random}`
}

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+?254|0)[7-9]\d{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\s/g, '')
  if (cleaned.startsWith('0')) {
    return '+254' + cleaned.slice(1)
  }
  if (cleaned.startsWith('254')) {
    return '+' + cleaned
  }
  return cleaned
}

export const getDateDayName = (dateStr: string): string => {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'long' })
  } catch (error) {
    return ''
  }
}

export const isDateInWorkingDays = (dateStr: string, workingDays: string[]): boolean => {
  const dayName = getDateDayName(dateStr)
  return workingDays.includes(dayName)
}

export const generateTimeSlots = (
  startTime: string, 
  endTime: string, 
  intervalMinutes: number = 60
): string[] => {
  const slots: string[] = []
  const startMinutes = timeToMinutes(startTime)
  const endMinutes = timeToMinutes(endTime)
  
  for (let minutes = startMinutes; minutes < endMinutes; minutes += intervalMinutes) {
    slots.push(minutesToTime(minutes))
  }
  
  return slots
}

export const checkTimeConflict = (
  newStart: string,
  newDuration: number,
  existingStart: string,
  existingDuration: number
): boolean => {
  const newStartMinutes = timeToMinutes(newStart)
  const newEndMinutes = newStartMinutes + newDuration
  const existingStartMinutes = timeToMinutes(existingStart)
  const existingEndMinutes = existingStartMinutes + existingDuration
  
  return (newStartMinutes < existingEndMinutes && newEndMinutes > existingStartMinutes)
}

export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

export const loadFromLocalStorage = (key: string): any => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Failed to load from localStorage:', error)
    return null
  }
}

export const createWhatsAppMessage = (booking: BookingData): string => {
  return `Hello VIP Queens Salon! My appointment has been booked:

📅 Booking ID: ${booking.id.slice(-8).toUpperCase()}
💇‍♀️ Service: ${booking.service}
👩‍💼 Stylist: ${booking.stylistName}
📅 Date: ${booking.date}
🕐 Time: ${booking.time}
👤 Name: ${booking.customerName}
📱 Phone: ${booking.customerPhone}

Looking forward to my appointment!`
}

export const sendWhatsAppConfirmation = (booking: BookingData): void => {
  const message = createWhatsAppMessage(booking)
  const whatsappUrl = `https://wa.me/254718779129?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}