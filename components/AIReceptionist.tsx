import { useState, useRef, useEffect } from 'react'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  RefreshCw, 
  ArrowLeft, 
  Sparkles, 
  Phone, 
  MapPin,
  Clock,
  Star,
  Zap,
  Heart,
  Settings,
  User,
  Calendar,
  CheckCircle,
  TrendingUp
} from 'lucide-react'
import { useBooking } from './booking/BookingContext'

// AI Response Interface
interface AIResponse {
  text: string
  type: 'welcome' | 'booking' | 'info' | 'confirmation' | 'escalation' | 'error'
  quickActions?: string[]
  confidence: number
  suggestions?: string[]
  bookingData?: any
}

// Message Interface
interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  type?: AIResponse['type']
  quickActions?: string[]
  suggestions?: string[]
  confidence?: number
  bookingData?: any
}

// Customer Memory Interface
interface CustomerMemory {
  id: string
  name?: string
  phone?: string
  email?: string
  preferredServices: string[]
  preferredStylists: string[]
  conversationHistory: string[]
  lastVisit?: Date
  preferredLocation?: 'kiambu' | 'roysambu'
}

// Booking Flow State
interface BookingFlowState {
  step: 'greeting' | 'location_selection' | 'service_selection' | 'stylist_selection' | 'slot_selection' | 'customer_info' | 'confirmation' | 'completed'
  selectedLocation?: 'kiambu' | 'roysambu'
  selectedService?: any
  selectedStylist?: any
  selectedSlot?: { date: string; time: string }
  customerInfo?: { name: string; phone: string; email?: string }
  notes?: string
}

interface AIReceptionistProps {
  selectedLocation: 'kiambu' | 'roysambu'
}

// GeeCurly Salon Information
const SALON_INFO = {
  name: "GeeCurly Salon",
  tagline: "Your Beauty, Our Passion — Now Smarter With AI",
  socialProof: "Trusted by 1M+ beauty lovers on TikTok",
  tiktokHandle: "@gee_curly_salon",
  locations: {
    kiambu: {
      name: "Kiambu Road Bypass",
      address: "Next to Pro Swim",
      area: "Kiambu Road",
      phone: "0715 589 102",
      whatsapp: "254715589102"
    },
    roysambu: {
      name: "Roysambu, Lumumba Drive",
      address: "Opposite Nairobi Butchery, Flash Building 2nd Floor",
      area: "Roysambu",
      phone: "0700 235 466",
      whatsapp: "254700235466"
    }
  },
  hours: {
    weekdays: "8:00 AM - 8:00 PM",
    sunday: "9:00 AM - 6:00 PM"
  },
  owner: "Sam Karanja"
}

export function AIReceptionist({ selectedLocation }: AIReceptionistProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationStage, setConversationStage] = useState('greeting')
  const [customerMemory, setCustomerMemory] = useState<CustomerMemory | null>(null)
  const [bookingFlow, setBookingFlow] = useState<BookingFlowState>({ 
    step: 'greeting',
    selectedLocation: selectedLocation 
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { 
    isLoading, 
    addBooking, 
    services, 
    staff, 
    getStaffBySpecialty, 
    getAvailableSlots 
  } = useBooking()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeConversation()
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // Update booking flow when location changes
  useEffect(() => {
    setBookingFlow(prev => ({ ...prev, selectedLocation }))
  }, [selectedLocation])

  // Simple Memory System
  const initializeMemory = (): CustomerMemory => {
    const sessionId = `session_${Date.now()}`
    const memory: CustomerMemory = {
      id: sessionId,
      preferredServices: [],
      preferredStylists: [],
      conversationHistory: [],
      preferredLocation: selectedLocation
    }
    setCustomerMemory(memory)
    return memory
  }

  const updateMemory = (updates: Partial<CustomerMemory>) => {
    if (customerMemory) {
      const updated = { ...customerMemory, ...updates }
      setCustomerMemory(updated)
      localStorage.setItem('geecurly_customer_memory', JSON.stringify(updated))
    }
  }

  // AI Intent Analysis
  const analyzeIntent = (message: string) => {
    const lowerMessage = message.toLowerCase()
    
    const intents = {
      booking: ['book', 'appointment', 'schedule', 'reserve', 'available'],
      services: ['service', 'treatment', 'hair', 'nails', 'what do you offer'],
      pricing: ['price', 'cost', 'how much', 'rate', 'fee', 'charge'],
      staff: ['staff', 'stylist', 'who', 'team'],
      location: ['where', 'location', 'address', 'direction', 'kiambu', 'roysambu'],
      hours: ['hour', 'time', 'open', 'close', 'when'],
      greeting: ['hello', 'hi', 'hey', 'good morning'],
      confirmation: ['yes', 'confirm', 'proceed', 'book it'],
      back: ['back', 'previous', 'go back'],
      reset: ['start over', 'reset', 'new conversation']
    }

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return intent
      }
    }
    
    return 'general'
  }

  const findService = (message: string) => {
    const lowerMessage = message.toLowerCase()
    return services.find(service => 
      lowerMessage.includes(service.name.toLowerCase()) ||
      lowerMessage.includes(service.category.toLowerCase())
    )
  }

  const findStaff = (message: string) => {
    const lowerMessage = message.toLowerCase()
    return staff.find(member => 
      lowerMessage.includes(member.name.toLowerCase()) ||
      lowerMessage.includes(member.role.toLowerCase())
    )
  }

  // Enhanced Booking Flow Handler
  const handleBookingFlow = async (message: string, intent: string): Promise<AIResponse> => {
    const lowerMessage = message.toLowerCase()
    const currentLocation = bookingFlow.selectedLocation || selectedLocation

    switch (bookingFlow.step) {
      case 'greeting':
        // Initial booking request
        setBookingFlow(prev => ({ ...prev, step: 'location_selection' }))
        setConversationStage('booking')
        return {
          text: `Perfect! I'd love to help you book at GeeCurly Salon! 🌟\n\n**Choose Your Location:**\n\n🏢 **Kiambu Road Bypass** - Next to Pro Swim\n📱 Phone: ${SALON_INFO.locations.kiambu.phone}\n\n🏢 **Roysambu, Lumumba Drive** - Flash Building 2nd Floor\n📱 Phone: ${SALON_INFO.locations.roysambu.phone}\n\nWhich location works best for you? 📍`,
          type: 'booking',
          quickActions: ['Kiambu Road', 'Roysambu', 'Current location: ' + (currentLocation === 'kiambu' ? 'Kiambu' : 'Roysambu')],
          confidence: 1.0
        }

      case 'location_selection':
        let chosenLocation = currentLocation
        if (lowerMessage.includes('kiambu')) {
          chosenLocation = 'kiambu'
        } else if (lowerMessage.includes('roysambu')) {
          chosenLocation = 'roysambu'
        }
        
        setBookingFlow(prev => ({ ...prev, selectedLocation: chosenLocation, step: 'service_selection' }))
        updateMemory({ preferredLocation: chosenLocation })
        
        return {
          text: `Excellent! You've chosen our **${SALON_INFO.locations[chosenLocation].name}** location! ✨\n\n**Our Popular Services:**\n\n💇‍♀️ **Hair Styling** - KES 1,500 - 3,500\n🎨 **Hair Braiding** - KES 2,000 - 6,000\n✨ **Hair Treatment** - KES 1,000 - 3,000\n💅 **Nail Services** - KES 500 - 2,000\n\nWhich service would you like to book? 🌟`,
          type: 'booking',
          quickActions: ['Hair Styling', 'Hair Braiding', 'Hair Treatment', 'Nail Services'],
          confidence: 1.0
        }

      case 'service_selection':
        const detectedService = findService(message)
        if (detectedService) {
          const availableStaff = getStaffBySpecialty(detectedService.category)
          setBookingFlow(prev => ({ ...prev, selectedService: detectedService, step: 'stylist_selection' }))
          
          let response = `Perfect choice! **${detectedService.name}** 💫\n\n**Service Details:**\n• Duration: ${detectedService.duration}\n• Price: KES ${detectedService.price.min} - ${detectedService.price.max}\n• Location: ${SALON_INFO.locations[bookingFlow.selectedLocation!].name}\n\n**Available Stylists:**\n`
          
          availableStaff.forEach(stylist => {
            response += `• **${stylist.name}** - ${stylist.role}\n`
          })
          
          response += `\nWho would you prefer? 👩‍💼`
          
          return {
            text: response,
            type: 'booking',
            quickActions: availableStaff.map(s => s.name).concat(['Any available stylist']),
            confidence: 0.9
          }
        } else {
          return {
            text: `I'd love to help you find the perfect service! Which service interests you?\n\n**Available at GeeCurly Salon:**\n• Hair Styling\n• Hair Braiding\n• Hair Treatment\n• Nail Services\n\nJust click one above or tell me what you're looking for! 💇‍♀️`,
            type: 'booking',
            quickActions: ['Hair Styling', 'Hair Braiding', 'Hair Treatment', 'Nail Services'],
            confidence: 0.7
          }
        }

      case 'stylist_selection':
        const detectedStylist = findStaff(message) || 
          (lowerMessage.includes('any') ? getStaffBySpecialty(bookingFlow.selectedService!.category)[0] : null)

        if (detectedStylist) {
          try {
            // Get available slots for the next 7 days
            const today = new Date()
            const availableSlots = []
            
            for (let i = 1; i <= 7; i++) {
              const date = new Date(today)
              date.setDate(today.getDate() + i)
              const dateStr = date.toISOString().split('T')[0]
              
              try {
                const slots = await getAvailableSlots(
                  dateStr, 
                  detectedStylist.id, 
                  bookingFlow.selectedService!.durationMinutes || 60
                )
                
                if (slots.length > 0) {
                  availableSlots.push({
                    date: dateStr,
                    displayDate: date.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    }),
                    slots: slots.slice(0, 3)
                  })
                }
                
                if (availableSlots.length >= 3) break
              } catch (error) {
                console.error('Error getting slots:', error)
              }
            }

            setBookingFlow(prev => ({ ...prev, selectedStylist: detectedStylist, step: 'slot_selection' }))

            if (availableSlots.length === 0) {
              const locationInfo = SALON_INFO.locations[bookingFlow.selectedLocation!]
              return {
                text: `${detectedStylist.name} is currently fully booked. Let me help you with alternatives:\n\n📞 **Call:** ${locationInfo.phone}\n💬 **WhatsApp:** +${locationInfo.whatsapp}\n\nOr would you like to try a different stylist? 🌟`,
                type: 'escalation',
                quickActions: ['Try different stylist', 'Call salon', 'WhatsApp'],
                confidence: 0.8
              }
            }

            let response = `Perfect! **${detectedStylist.name}** is available at our ${SALON_INFO.locations[bookingFlow.selectedLocation!].name} location! 🌟\n\n**Next Available Times:**\n\n`
            
            availableSlots.forEach((day, index) => {
              response += `**${day.displayDate}:**\n`
              day.slots.forEach(slot => {
                response += `• ${slot}\n`
              })
              if (index < availableSlots.length - 1) response += '\n'
            })
            
            response += '\nWhich time works best for you? 🕐'

            return {
              text: response,
              type: 'booking',
              quickActions: availableSlots.flatMap(day => day.slots.slice(0, 2)),
              confidence: 0.9
            }
          } catch (error) {
            const locationInfo = SALON_INFO.locations[bookingFlow.selectedLocation!]
            return {
              text: `Let me connect you with our team for real-time availability:\n\n📱 **Call:** ${locationInfo.phone}\n💬 **WhatsApp:** +${locationInfo.whatsapp}\n\nThey'll find the perfect time for you! 🚀`,
              type: 'escalation',
              quickActions: ['Call now', 'WhatsApp', 'Try again'],
              confidence: 0.7
            }
          }
        } else {
          const availableStaff = getStaffBySpecialty(bookingFlow.selectedService!.category)
          let response = `Please choose your preferred stylist:\n\n`
          availableStaff.forEach(stylist => {
            response += `👩‍💼 **${stylist.name}** - ${stylist.role}\n`
          })
          response += `\nWho would you like to book with? ✨`
          
          return {
            text: response,
            type: 'booking',
            quickActions: availableStaff.map(s => s.name),
            confidence: 0.8
          }
        }

      case 'slot_selection':
        // Extract time from message
        const timeMatch = message.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)/i) || 
                         message.match(/(\d{1,2})\s*(am|pm)/i)
        
        if (timeMatch || lowerMessage.includes('first') || lowerMessage.includes('available')) {
          const today = new Date()
          const tomorrow = new Date(today)
          tomorrow.setDate(today.getDate() + 1)
          
          const selectedSlot = {
            date: tomorrow.toISOString().split('T')[0],
            time: timeMatch ? timeMatch[0] : '10:00 AM'
          }

          setBookingFlow(prev => ({ ...prev, selectedSlot, step: 'customer_info' }))

          return {
            text: `Great! I've reserved **${tomorrow.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}** at **${selectedSlot.time}** for you! 🎉\n\n📝 **Just need your details:**\n\n• Your full name\n• Phone number\n• Email (optional)\n\nPlease share them with me to complete your GeeCurly Salon booking! 😊`,
            type: 'booking',
            quickActions: [],
            confidence: 0.9
          }
        } else {
          return {
            text: `What time works best for you? You can say:\n\n• "10am tomorrow"\n• "2pm"\n• "First available"\n• "Morning time"\n\nJust let me know your preference! 🕐`,
            type: 'booking',
            quickActions: ['10:00 AM', '2:00 PM', 'First available', 'Morning'],
            confidence: 0.8
          }
        }

      case 'customer_info':
        // Extract customer information
        const nameMatch = message.match(/(?:name is|i'm|my name|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i) ||
                          message.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i)
        const phoneMatch = message.match(/(\+?254\d{9}|\d{10}|\d{9})/i)
        const emailMatch = message.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)
        
        const customerInfo = {
          name: nameMatch ? nameMatch[1] : '',
          phone: phoneMatch ? phoneMatch[1] : '',
          email: emailMatch ? emailMatch[1] : ''
        }

        if (customerInfo.name && customerInfo.phone) {
          setBookingFlow(prev => ({ ...prev, customerInfo, step: 'confirmation' }))
          updateMemory({ name: customerInfo.name, phone: customerInfo.phone, email: customerInfo.email })

          const locationInfo = SALON_INFO.locations[bookingFlow.selectedLocation!]
          return {
            text: `Perfect! Let me confirm your GeeCurly Salon booking: ✨\n\n📋 **BOOKING SUMMARY**\n\n👤 **Customer:** ${customerInfo.name}\n📱 **Phone:** ${customerInfo.phone}\n${customerInfo.email ? `📧 **Email:** ${customerInfo.email}\n` : ''}💇‍♀️ **Service:** ${bookingFlow.selectedService!.name}\n👩‍💼 **Stylist:** ${bookingFlow.selectedStylist!.name}\n📅 **Date & Time:** ${new Date(bookingFlow.selectedSlot!.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })} at ${bookingFlow.selectedSlot!.time}\n📍 **Location:** ${locationInfo.name}\n💰 **Price:** KES ${bookingFlow.selectedService!.price.min} - ${bookingFlow.selectedService!.price.max}\n\n✅ **Confirm this booking?**`,
            type: 'booking',
            quickActions: ['Yes, confirm booking', 'Make changes', 'Cancel'],
            confidence: 1.0,
            bookingData: {
              customerName: customerInfo.name,
              customerPhone: customerInfo.phone,
              customerEmail: customerInfo.email,
              service: bookingFlow.selectedService!.name,
              serviceCategory: bookingFlow.selectedService!.category,
              price: bookingFlow.selectedService!.price.min,
              duration: bookingFlow.selectedService!.duration,
              stylistId: bookingFlow.selectedStylist!.id,
              stylistName: bookingFlow.selectedStylist!.name,
              date: bookingFlow.selectedSlot!.date,
              time: bookingFlow.selectedSlot!.time,
              location: bookingFlow.selectedLocation!,
              status: 'confirmed',
              bookingMethod: 'ai_chat'
            }
          }
        } else {
          return {
            text: `I need your contact details to complete the GeeCurly Salon booking:\n\n📝 **Please provide:**\n• Your full name\n• Phone number\n\n**Example:** "My name is Sarah Wanjiku and my phone is 0712345678"\n\nThis helps us send confirmations and reminders! 📱`,
            type: 'booking',
            quickActions: [],
            confidence: 0.8
          }
        }

      case 'confirmation':
        if (intent === 'confirmation' || lowerMessage.includes('yes') || lowerMessage.includes('confirm')) {
          try {
            // Create the booking using the BookingContext
            const bookingData = {
              customerName: bookingFlow.customerInfo!.name,
              customerPhone: bookingFlow.customerInfo!.phone,
              customerEmail: bookingFlow.customerInfo?.email,
              service: bookingFlow.selectedService!.name,
              serviceCategory: bookingFlow.selectedService!.category,
              price: bookingFlow.selectedService!.price.min,
              duration: bookingFlow.selectedService!.duration,
              stylistId: bookingFlow.selectedStylist!.id,
              stylistName: bookingFlow.selectedStylist!.name,
              date: bookingFlow.selectedSlot!.date,
              time: bookingFlow.selectedSlot!.time,
              location: bookingFlow.selectedLocation!,
              status: 'confirmed',
              notes: bookingFlow.notes,
              bookingMethod: 'ai_chat'
            }

            const booking = await addBooking(bookingData)
            setBookingFlow({ step: 'completed' })
            setConversationStage('completed')

            const locationInfo = SALON_INFO.locations[bookingFlow.selectedLocation!]
            return {
              text: `🎉 **BOOKING CONFIRMED!** 🎉\n\n✅ Congratulations ${bookingFlow.customerInfo!.name}! Your GeeCurly Salon appointment is booked!\n\n🆔 **Booking ID:** ${booking.id.slice(-8).toUpperCase()}\n📱 **Confirmation sent via SMS**\n⏰ **Reminder set for 24 hours before**\n\n**📍 Location:**\n${locationInfo.name}\n${locationInfo.address}\n${locationInfo.area}\n\n**📞 Need to make changes?**\nCall: ${locationInfo.phone}\n\n**We can't wait to make you look stunning!** ✨👑\n\n*${SALON_INFO.socialProof}* 💫`,
              type: 'confirmation',
              quickActions: ['Book another appointment', 'Get directions', 'Call salon'],
              confidence: 1.0
            }
          } catch (error) {
            console.error('Booking creation failed:', error)
            const locationInfo = SALON_INFO.locations[bookingFlow.selectedLocation!]
            return {
              text: `There was an issue creating your booking. Please contact us directly:\n\n📱 **Call:** ${locationInfo.phone}\n💬 **WhatsApp:** +${locationInfo.whatsapp}\n\nOur team will complete your booking immediately! 🤝`,
              type: 'error',
              quickActions: ['Call now', 'WhatsApp', 'Try again'],
              confidence: 0.7
            }
          }
        } else if (lowerMessage.includes('change') || lowerMessage.includes('back')) {
          setBookingFlow(prev => ({ ...prev, step: 'service_selection' }))
          return {
            text: `No problem! Let's make some changes to your booking.\n\nWhich part would you like to modify? 🔄`,
            type: 'booking',
            quickActions: ['Change service', 'Change stylist', 'Change time', 'Start over'],
            confidence: 0.9
          }
        } else {
          setBookingFlow({ step: 'greeting', selectedLocation })
          setConversationStage('greeting')
          return {
            text: `Booking cancelled. No worries! I'm here whenever you're ready to book.\n\nHow else can I help you today? 😊`,
            type: 'welcome',
            quickActions: ['Book appointment', 'View services', 'Ask questions'],
            confidence: 1.0
          }
        }

      default:
        return {
          text: `I'm here to help you book an appointment at GeeCurly Salon! Let's start fresh.\n\nWhat service would you like to book? 📅`,
          type: 'booking',
          quickActions: ['Hair Styling', 'Hair Braiding', 'Hair Treatment', 'Nail Services'],
          confidence: 0.8
        }
    }
  }

  // AI Response Generation
  const generateResponse = async (message: string): Promise<AIResponse> => {
    const intent = analyzeIntent(message)
    const service = findService(message)
    const staff = findStaff(message)

    // Update memory
    if (service && customerMemory) {
      updateMemory({
        preferredServices: [...new Set([...customerMemory.preferredServices, service.name])]
      })
    }
    if (staff && customerMemory) {
      updateMemory({
        preferredStylists: [...new Set([...customerMemory.preferredStylists, staff.name])]
      })
    }

    // Handle booking flow if active
    if (bookingFlow.step !== 'greeting' || intent === 'booking') {
      return await handleBookingFlow(message, intent)
    }

    // Handle other intents
    switch (intent) {
      case 'reset':
        setBookingFlow({ step: 'greeting', selectedLocation })
        setConversationStage('greeting')
        return {
          text: `🔄 Perfect! Let's start fresh.\n\nWelcome to ${SALON_INFO.name}! I'm here to help you with:\n\n• Booking appointments 📅\n• Service information 💇‍♀️\n• Pricing details 💰\n• Location & directions 📍\n\n*${SALON_INFO.socialProof}*\n\nHow can I help you today? ✨`,
          type: 'welcome',
          quickActions: ['Book appointment', 'View services', 'Check prices', 'Location info'],
          confidence: 1.0
        }

      case 'greeting':
        return {
          text: `Hello! 👋 Welcome to ${SALON_INFO.name}!\n\n*${SALON_INFO.socialProof}* 🌟\n\nI'm your AI beauty assistant, here to help you:\n• Book appointments 📅\n• Learn about our services 💇‍♀️\n• Meet our expert team 👩‍💼\n• Get pricing information 💰\n• Find our locations 📍\n\nHow can I make you look and feel amazing today?`,
          type: 'welcome',
          quickActions: ['Book appointment', 'View services', 'Check prices', 'Location info', 'Meet the team', 'Special offers'],
          confidence: 1.0
        }

      case 'services':
        return {
          text: `💇‍♀️ **GeeCurly Salon Expert Services:**\n\n**💫 Hair Styling**\n• Haircut & Styling - KES 1,500 - 3,500\n• Professional Blow Dry - KES 1,200 - 2,000\n\n**🎨 Hair Braiding**\n• Box Braids - KES 3,000 - 6,000\n• Cornrows - KES 2,000 - 4,000\n\n**✨ Hair Treatment**\n• Deep Conditioning - KES 1,500 - 2,500\n• Protein Treatment - KES 2,000 - 3,000\n\n**💅 Nail Services**\n• Gel Manicure - KES 1,200 - 1,800\n• Spa Pedicure - KES 1,500 - 2,000\n\nWhich service interests you most? ✨`,
          type: 'info',
          quickActions: ['Book Hair Styling', 'Book Hair Braiding', 'Book Hair Treatment', 'Book Nail Services', 'View all services', 'Get pricing'],
          confidence: 0.9
        }

      case 'pricing':
        return {
          text: `💰 **GeeCurly Salon Pricing:**\n\n• **Hair Styling:** KES 1,500 - 3,500\n• **Hair Braiding:** KES 2,000 - 6,000\n• **Hair Treatment:** KES 1,000 - 3,000\n• **Hair Relaxing:** KES 2,000 - 6,000\n• **Nail Services:** KES 500 - 2,000\n\n*Prices vary based on hair length and service complexity.*\n\n🎉 **Special Offers:**\n• First-time clients: 20% off\n• Student discount: 15% off\n\nReady to book your appointment? 📅`,
          type: 'info',
          quickActions: ['Book appointment', 'Ask about offers', 'View services', 'Contact salon'],
          confidence: 0.9
        }

      case 'staff':
        return {
          text: `👩‍💼 **Meet Our Expert GeeCurly Team:**\n\nOur skilled professionals are ready to serve you at both locations!\n\n🌟 **Hair Specialists**\n• Expert in styling, treatments, and braiding\n\n💅 **Nail Technicians**\n• Professional manicures and pedicures\n\n👑 **Senior Stylists**\n• Advanced techniques and luxury treatments\n\nWho would you like to book with? 🌟`,
          type: 'info',
          quickActions: ['Book with any stylist', 'Hair specialist', 'Nail technician', 'Senior stylist'],
          confidence: 0.9
        }

      case 'location':
        const currentLocationInfo = SALON_INFO.locations[selectedLocation]
        return {
          text: `📍 **Visit GeeCurly Salon:**\n\n**Currently Selected:** ${currentLocationInfo.name}\n\n🏢 **Kiambu Road Bypass**\n${SALON_INFO.locations.kiambu.address}\n📱 ${SALON_INFO.locations.kiambu.phone}\n\n🏢 **Roysambu, Lumumba Drive**\n${SALON_INFO.locations.roysambu.address}\n📱 ${SALON_INFO.locations.roysambu.phone}\n\n⏰ **Hours:**\n• Mon-Sat: ${SALON_INFO.hours.weekdays}\n• Sunday: ${SALON_INFO.hours.sunday}`,
          type: 'info',
          quickActions: ['Book at Kiambu', 'Book at Roysambu', 'Call salon', 'Get directions'],
          confidence: 0.9
        }

      case 'hours':
        return {
          text: `⏰ **GeeCurly Salon Hours:**\n\n📅 **Monday - Saturday:** ${SALON_INFO.hours.weekdays}\n📅 **Sunday:** ${SALON_INFO.hours.sunday}\n\n**Both locations follow the same schedule!**\n\n💡 We recommend booking in advance for the best availability!\n\nReady to schedule your visit? 📱`,
          type: 'info',
          quickActions: ['Book appointment', 'Check availability', 'Ask questions', 'Call salon'],
          confidence: 0.9
        }

      default:
        return {
          text: `I'm here to help you with ${SALON_INFO.name}! ✨\n\n*${SALON_INFO.socialProof}*\n\n**I can assist with:**\n• 📅 Booking appointments\n• 💇‍♀️ Service information\n• 👩‍💼 Meeting our stylists\n• 💰 Pricing details\n• 📍 Location & directions\n\nWhat would you like to know? 🌟`,
          type: 'info',
          quickActions: ['Book appointment', 'View services', 'Meet team', 'Check prices', 'Get location', 'Ask questions'],
          confidence: 0.7
        }
    }
  }

  const initializeConversation = async () => {
    setIsTyping(true)
    initializeMemory()
    
    setTimeout(async () => {
      try {
        const response = await generateResponse('hello')
        const welcomeMessage: Message = {
          id: '1',
          text: response.text,
          sender: 'bot',
          timestamp: new Date(),
          type: response.type,
          quickActions: response.quickActions,
          confidence: response.confidence
        }
        setMessages([welcomeMessage])
      } catch (error) {
        console.error('Failed to initialize conversation:', error)
        const errorMessage: Message = {
          id: '1',
          text: `Welcome to ${SALON_INFO.name}! 🏛️\n\n*${SALON_INFO.socialProof}*\n\nI'm here to help you book appointments and answer questions.\n\nHow can I assist you today?`,
          sender: 'bot',
          timestamp: new Date(),
          type: 'welcome'
        }
        setMessages([errorMessage])
      } finally {
        setIsTyping(false)
      }
    }, 800)
  }

  const sendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    const currentInput = inputText
    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Add to conversation history
    if (customerMemory) {
      updateMemory({
        conversationHistory: [...customerMemory.conversationHistory, currentInput]
      })
    }

    setTimeout(async () => {
      try {
        const response = await generateResponse(currentInput)
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          sender: 'bot',
          timestamp: new Date(),
          type: response.type,
          quickActions: response.quickActions,
          confidence: response.confidence,
          bookingData: response.bookingData
        }
        
        setMessages(prev => [...prev, botMessage])
        
      } catch (error) {
        console.error('AI processing error:', error)
        const currentLocationInfo = SALON_INFO.locations[selectedLocation]
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `I apologize for the technical issue! Please contact our team:\n\n📱 **Call:** ${currentLocationInfo.phone}\n💬 **WhatsApp:** +${currentLocationInfo.whatsapp}\n\nThey'll provide immediate assistance! 🤝`,
          sender: 'bot',
          timestamp: new Date(),
          type: 'error'
        }
        setMessages(prev => [...prev, errorMessage])
      } finally {
        setIsTyping(false)
      }
    }, 1200)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleQuickAction = (action: string) => {
    setInputText(action)
    setTimeout(() => sendMessage(), 100)
  }

  const resetConversation = () => {
    setMessages([])
    setBookingFlow({ step: 'greeting', selectedLocation })
    setConversationStage('greeting')
    setCustomerMemory(null)
    localStorage.removeItem('geecurly_customer_memory')
    initializeConversation()
  }

  const goBack = () => {
    const steps: (typeof bookingFlow.step)[] = ['greeting', 'location_selection', 'service_selection', 'stylist_selection', 'slot_selection', 'customer_info', 'confirmation', 'completed']
    const currentIndex = steps.indexOf(bookingFlow.step)
    if (currentIndex > 0) {
      const previousStep = steps[currentIndex - 1]
      setBookingFlow(prev => ({ ...prev, step: previousStep }))
      
      // Send a message to trigger the previous step
      setTimeout(() => {
        handleQuickAction('go back')
      }, 100)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-electric-pink hover:bg-electric-pink-dark text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 animate-pulse"
      >
        <div className="relative">
          <Bot className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-mint rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-mint rounded-full"></div>
        </div>
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200">
      {/* Header with improved color contrast */}
      <div className="bg-gradient-to-r from-electric-pink to-deep-purple p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">GeeCurly AI Assistant</h3>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-teal-mint rounded-full animate-pulse"></div>
                <span className="text-white/90">Online • Ready to help</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* TikTok Social Proof */}
        <div className="mt-3 bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4 text-white" />
            <span className="text-white font-medium">{SALON_INFO.socialProof}</span>
          </div>
        </div>
      </div>

      {/* Messages Area with improved readability */}
      <div className="h-96 overflow-y-auto bg-soft-gray p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                message.sender === 'user'
                  ? 'bg-electric-pink text-white'
                  : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.text}</div>
              {message.quickActions && message.quickActions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action)}
                      className="block w-full text-left p-2 bg-electric-pink-light hover:bg-electric-pink text-electric-pink-dark hover:text-white rounded-lg transition-colors text-xs font-medium"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 p-3 rounded-2xl border border-gray-200">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-electric-pink rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-teal-mint rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-sunset-orange rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area with better contrast */}
      <div className="border-t border-gray-200 p-4 bg-white">
        {/* Navigation Buttons */}
        {bookingFlow.step !== 'greeting' && (
          <div className="flex justify-between mb-3">
            <button
              onClick={goBack}
              className="flex items-center space-x-2 text-electric-pink hover:text-electric-pink-dark text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
            <button
              onClick={resetConversation}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Start Over</span>
            </button>
          </div>
        )}
        
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-electric-pink focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-500"
            disabled={isTyping}
          />
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || isTyping}
            className="bg-electric-pink hover:bg-electric-pink-dark disabled:bg-gray-300 text-white p-3 rounded-xl transition-colors disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500">
            Powered by GeeCurly AI • Always improving for you ✨
          </span>
        </div>
      </div>
    </div>
  )
}