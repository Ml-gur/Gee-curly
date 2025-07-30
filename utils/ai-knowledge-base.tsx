// Comprehensive VIP Queens Salon Knowledge Base
import { Service, Staff } from '../components/booking/BookingContext'

export interface SalonInfo {
  name: string
  tagline: string
  description: string
  location: {
    address: string
    building: string
    area: string
    city: string
    country: string
    directions: string
  }
  contact: {
    phone: string
    whatsapp: string
    email: string
    website: string
  }
  hours: {
    weekdays: string
    saturday: string
    sunday: string
    details: string
  }
  socialMedia: {
    instagram: string
    facebook: string
    tiktok: string
  }
}

export interface Promotion {
  id: string
  title: string
  description: string
  discount: string
  validUntil: string
  terms: string
}

export interface FAQ {
  question: string
  answer: string
  keywords: string[]
}

// Complete salon information
export const SALON_INFO: SalonInfo = {
  name: "VIP Queens Salon",
  tagline: "Where Beauty Meets Excellence",
  description: "Ongata Rongai's premier beauty destination, specializing in professional hair styling, braiding, treatments, and nail services. We combine traditional African beauty techniques with modern styling trends.",
  location: {
    address: "Ronald Ngala Street",
    building: "RNG Plaza, 2nd floor S41",
    area: "Ongata Rongai",
    city: "Nairobi",
    country: "Kenya",
    directions: "Easy to find in RNG Plaza with ample parking. Take the elevator to the 2nd floor, we're in suite S41."
  },
  contact: {
    phone: "0718 779 129",
    whatsapp: "254718779129",
    email: "info@vipqueenssalon.com",
    website: "www.vipqueenssalon.com"
  },
  hours: {
    weekdays: "6:00 AM - 10:00 PM",
    saturday: "6:00 AM - 10:00 PM", 
    sunday: "9:00 AM - 6:00 PM",
    details: "We're open long hours to accommodate your busy schedule. Early morning and evening appointments available."
  },
  socialMedia: {
    instagram: "@vipqueenssalon",
    facebook: "VIP Queens Salon Ongata Rongai",
    tiktok: "@vipqueenssalon"
  }
}

// Comprehensive services with detailed information
export const SALON_SERVICES: Service[] = [
  // Hair Styling
  {
    id: 'service_1',
    name: 'Basic Haircut & Styling',
    category: 'Hair Styling',
    price: { min: 1500, max: 2500 },
    duration: '1.5 hours',
    durationMinutes: 90,
    description: 'Professional haircut with styling, blow-dry, and finishing touches. Perfect for a fresh new look.'
  },
  {
    id: 'service_2',
    name: 'Premium Cut & Style',
    category: 'Hair Styling',
    price: { min: 2500, max: 3500 },
    duration: '2 hours',
    durationMinutes: 120,
    description: 'Luxury haircut with advanced styling techniques, including consultation and premium products.'
  },
  {
    id: 'service_3',
    name: 'Professional Blow Dry',
    category: 'Hair Styling',
    price: { min: 1200, max: 2000 },
    duration: '1 hour',
    durationMinutes: 60,
    description: 'Expert blow-dry with volume, smoothness, and long-lasting results using professional tools.'
  },
  {
    id: 'service_4',
    name: 'Wash & Set',
    category: 'Hair Styling',
    price: { min: 1000, max: 1800 },
    duration: '1.5 hours',
    durationMinutes: 90,
    description: 'Traditional wash and set service for classic styles and volume.'
  },
  
  // Hair Braiding
  {
    id: 'service_5',
    name: 'Box Braids',
    category: 'Hair Braiding',
    price: { min: 3000, max: 6000 },
    duration: '4-6 hours',
    durationMinutes: 300,
    description: 'Beautiful protective box braids in various sizes. Price varies by length and thickness desired.'
  },
  {
    id: 'service_6',
    name: 'Cornrows',
    category: 'Hair Braiding',
    price: { min: 2000, max: 4000 },
    duration: '2-3 hours',
    durationMinutes: 150,
    description: 'Classic cornrow styles with creative patterns and designs.'
  },
  {
    id: 'service_7',
    name: 'Twist Styles',
    category: 'Hair Braiding',
    price: { min: 2500, max: 5000 },
    duration: '3-4 hours',
    durationMinutes: 210,
    description: 'Elegant twist styles including two-strand twists and protective styling.'
  },
  {
    id: 'service_8',
    name: 'Ghana Braids',
    category: 'Hair Braiding',
    price: { min: 2500, max: 4500 },
    duration: '3-4 hours',
    durationMinutes: 210,
    description: 'Traditional Ghana braids with modern styling techniques.'
  },
  {
    id: 'service_9',
    name: 'Faux Locs',
    category: 'Hair Braiding',
    price: { min: 4000, max: 7000 },
    duration: '5-6 hours',
    durationMinutes: 330,
    description: 'Beautiful faux locs for a protective style with natural appearance.'
  },
  
  // Hair Treatments
  {
    id: 'service_10',
    name: 'Deep Conditioning Treatment',
    category: 'Hair Treatment',
    price: { min: 1500, max: 2500 },
    duration: '1.5 hours',
    durationMinutes: 90,
    description: 'Intensive moisture treatment to restore hydration and shine to damaged hair.'
  },
  {
    id: 'service_11',
    name: 'Protein Hair Treatment',
    category: 'Hair Treatment',
    price: { min: 2000, max: 3000 },
    duration: '2 hours',
    durationMinutes: 120,
    description: 'Strengthening protein treatment for damaged, weak, or over-processed hair.'
  },
  {
    id: 'service_12',
    name: 'Hot Oil Treatment',
    category: 'Hair Treatment',
    price: { min: 1000, max: 1800 },
    duration: '1 hour',
    durationMinutes: 60,
    description: 'Nourishing hot oil treatment for scalp health and hair conditioning.'
  },
  {
    id: 'service_13',
    name: 'Scalp Treatment',
    category: 'Hair Treatment',
    price: { min: 1500, max: 2200 },
    duration: '1 hour',
    durationMinutes: 60,
    description: 'Specialized scalp treatment for dandruff, dryness, or irritation.'
  },
  
  // Hair Relaxing
  {
    id: 'service_14',
    name: 'Chemical Relaxer',
    category: 'Hair Relaxing',
    price: { min: 2000, max: 3500 },
    duration: '2.5-3 hours',
    durationMinutes: 165,
    description: 'Professional chemical relaxer application for smooth, manageable hair.'
  },
  {
    id: 'service_15',
    name: 'Keratin Treatment',
    category: 'Hair Relaxing',
    price: { min: 4000, max: 6000 },
    duration: '3-4 hours',
    durationMinutes: 210,
    description: 'Premium keratin treatment for frizz control and smoothness lasting 3-6 months.'
  },
  {
    id: 'service_16',
    name: 'Japanese Straightening',
    category: 'Hair Relaxing',
    price: { min: 5000, max: 8000 },
    duration: '4-5 hours',
    durationMinutes: 270,
    description: 'Permanent hair straightening for long-lasting smooth results.'
  },
  
  // Nail Services
  {
    id: 'service_17',
    name: 'Gel Manicure',
    category: 'Nail Services',
    price: { min: 1200, max: 1800 },
    duration: '1.25 hours',
    durationMinutes: 75,
    description: 'Long-lasting gel manicure with chip-resistant finish lasting 2-3 weeks.'
  },
  {
    id: 'service_18',
    name: 'Spa Pedicure',
    category: 'Nail Services',
    price: { min: 1500, max: 2000 },
    duration: '1.5 hours',
    durationMinutes: 90,
    description: 'Luxurious spa pedicure with foot soak, exfoliation, massage, and polish.'
  },
  {
    id: 'service_19',
    name: 'Nail Art Design',
    category: 'Nail Services',
    price: { min: 500, max: 1500 },
    duration: '0.5-1 hour',
    durationMinutes: 45,
    description: 'Creative nail art designs, from simple patterns to elaborate artwork.'
  },
  {
    id: 'service_20',
    name: 'Acrylic Nails',
    category: 'Nail Services',
    price: { min: 2000, max: 3000 },
    duration: '2 hours',
    durationMinutes: 120,
    description: 'Professional acrylic nail extensions with custom length and shape.'
  }
]

// Detailed staff information
export const SALON_STAFF: Staff[] = [
  {
    id: 'staff_1',
    name: 'Catherine',
    role: 'Senior Stylist & Owner',
    image: 'https://res.cloudinary.com/deasyoglq/image/upload/v1753684481/catherine_s3vklr.jpg',
    specialties: ['Hair Styling', 'Hair Treatment', 'Hair Relaxing'],
    isAvailable: true,
    workingHours: {
      start: '06:00',
      end: '22:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
  },
  {
    id: 'staff_2',
    name: 'Njeri',
    role: 'Hair Specialist',
    image: 'https://res.cloudinary.com/deasyoglq/image/upload/v1753684481/njeri_i7nxbj.jpg',
    specialties: ['Hair Styling', 'Hair Treatment', 'Hair Relaxing'],
    isAvailable: true,
    workingHours: {
      start: '06:00',
      end: '22:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
  },
  {
    id: 'staff_3',
    name: 'Ann',
    role: 'Braiding Expert',
    image: 'https://res.cloudinary.com/deasyoglq/image/upload/v1753684481/ann_qcjpxg.jpg',
    specialties: ['Hair Braiding'],
    isAvailable: true,
    workingHours: {
      start: '06:00',
      end: '22:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
  },
  {
    id: 'staff_4',
    name: 'Rachael',
    role: 'Nail Technician',
    image: 'https://res.cloudinary.com/deasyoglq/image/upload/v1753684481/rachael_r0w9s6.jpg',
    specialties: ['Nail Services'],
    isAvailable: true,
    workingHours: {
      start: '06:00',
      end: '22:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }
  }
]

// Current promotions and special offers
export const SALON_PROMOTIONS: Promotion[] = [
  {
    id: 'promo_1',
    title: 'First Visit Special',
    description: '20% off your first service at VIP Queens Salon',
    discount: '20%',
    validUntil: '2024-12-31',
    terms: 'Valid for new customers only. Cannot be combined with other offers.'
  },
  {
    id: 'promo_2',
    title: 'Student Discount',
    description: '15% off all services for students with valid ID',
    discount: '15%',
    validUntil: 'Ongoing',
    terms: 'Valid student ID required. Applicable to all services.'
  },
  {
    id: 'promo_3',
    title: 'Group Booking Special',
    description: 'Book for 3+ people and get 10% off each service',
    discount: '10%',
    validUntil: 'Ongoing',
    terms: 'Minimum 3 people. All appointments must be on the same day.'
  }
]

// Comprehensive FAQ system
export const SALON_FAQS: FAQ[] = [
  {
    question: "What services do you offer?",
    answer: "We offer a full range of beauty services including hair styling, braiding, hair treatments, hair relaxing, and nail services. Our specialties include box braids, cornrows, keratin treatments, gel manicures, and professional haircuts.",
    keywords: ["services", "what do you do", "offerings", "beauty services", "hair", "nails", "treatments"]
  },
  {
    question: "What are your prices?",
    answer: "Our prices range from KES 500 for nail art to KES 8,000 for premium treatments. Hair styling starts from KES 1,000, braiding from KES 2,000, treatments from KES 1,000, and nail services from KES 500. Final prices depend on hair length and service complexity.",
    keywords: ["price", "cost", "how much", "rates", "charges", "fees", "pricing"]
  },
  {
    question: "Where are you located?",
    answer: "We're located at Ronald Ngala Street, RNG Plaza, 2nd floor S41, in Ongata Rongai. There's ample parking available and we're easily accessible by public transport.",
    keywords: ["location", "address", "where", "directions", "rongai", "plaza", "parking"]
  },
  {
    question: "What are your working hours?",
    answer: "We're open Monday to Saturday from 6:00 AM to 10:00 PM, and Sunday from 9:00 AM to 6:00 PM. We offer early morning and late evening appointments to fit your schedule.",
    keywords: ["hours", "time", "open", "closed", "schedule", "when", "operating hours"]
  },
  {
    question: "How do I book an appointment?",
    answer: "You can book through this chat, call us at 0718 779 129, WhatsApp us, or visit our salon. We recommend booking in advance, especially for braiding services which take several hours.",
    keywords: ["book", "appointment", "reservation", "schedule", "booking"]
  },
  {
    question: "Do you offer bridal services?",
    answer: "Yes! We provide complete bridal packages including hair styling, makeup trials, and day-of services. We can also accommodate bridal parties. Contact us to discuss your special day needs.",
    keywords: ["bridal", "wedding", "bride", "makeup", "special occasion", "event"]
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept cash, M-Pesa, bank transfers, and card payments. Payment is due after service completion unless prior arrangements are made.",
    keywords: ["payment", "pay", "money", "cash", "mpesa", "card", "bank"]
  },
  {
    question: "Do you use quality products?",
    answer: "Absolutely! We use only professional-grade products from trusted brands. For treatments and chemical services, we use premium products to ensure the best results and hair health.",
    keywords: ["products", "quality", "brands", "professional", "chemicals", "safe"]
  },
  {
    question: "How long do services take?",
    answer: "Service duration varies: haircuts (1.5 hours), basic braiding (2-3 hours), box braids (4-6 hours), treatments (1-2 hours), relaxers (2.5-3 hours), and nail services (45 minutes-2 hours).",
    keywords: ["time", "duration", "how long", "takes", "hours"]
  },
  {
    question: "Can I bring my own hair extensions?",
    answer: "Yes, you can bring your own hair for braiding services. However, we also stock high-quality hair extensions and can recommend the best options for your desired style.",
    keywords: ["extensions", "hair", "bring own", "own hair", "braiding hair"]
  }
]

// Keyword matching system
export const KEYWORD_CATEGORIES = {
  BOOKING: [
    "book", "appointment", "schedule", "reserve", "booking", "make appointment", 
    "want to book", "need appointment", "can i book", "available", "availability"
  ],
  SERVICES: [
    "services", "what do you do", "offerings", "hair", "nails", "treatment", 
    "braiding", "relaxer", "styling", "cuts", "manicure", "pedicure"
  ],
  PRICING: [
    "price", "cost", "how much", "rates", "charges", "fees", "pricing", 
    "expensive", "cheap", "affordable", "money"
  ],
  LOCATION: [
    "where", "location", "address", "directions", "rongai", "plaza", 
    "ronald ngala", "how to get", "parking"
  ],
  HOURS: [
    "hours", "time", "open", "closed", "when", "schedule", "operating", 
    "working hours", "what time"
  ],
  STAFF: [
    "staff", "stylist", "who", "team", "catherine", "njeri", "ann", "rachael", 
    "hairdresser", "braider", "nail tech"
  ],
  CONTACT: [
    "contact", "phone", "call", "whatsapp", "email", "reach", "get in touch"
  ],
  PROMOTIONS: [
    "discount", "offer", "special", "promo", "deal", "promotion", "cheap", 
    "student discount", "first time"
  ]
}

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', { 
    style: 'currency', 
    currency: 'KES', 
    minimumFractionDigits: 0 
  }).format(amount)
}

export const findMatchingKeywords = (text: string, categories: typeof KEYWORD_CATEGORIES): string[] => {
  const lowerText = text.toLowerCase()
  const matches: string[] = []
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerText.includes(keyword.toLowerCase()))) {
      matches.push(category)
    }
  }
  
  return matches
}

export const findMatchingService = (text: string): Service | null => {
  const lowerText = text.toLowerCase()
  
  // Direct service name matching
  const directMatch = SALON_SERVICES.find(service => 
    lowerText.includes(service.name.toLowerCase())
  )
  if (directMatch) return directMatch
  
  // Category-based matching
  const serviceKeywords = {
    'hair styling': ['haircut', 'cut', 'style', 'styling', 'blow dry', 'wash set'],
    'hair braiding': ['braid', 'braids', 'cornrow', 'twist', 'box braid', 'ghana', 'faux loc'],
    'hair treatment': ['treatment', 'condition', 'protein', 'hot oil', 'scalp'],
    'hair relaxing': ['relax', 'relaxer', 'keratin', 'straighten', 'japanese'],
    'nail services': ['nail', 'manicure', 'pedicure', 'gel', 'acrylic', 'nail art']
  }
  
  for (const [category, keywords] of Object.entries(serviceKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return SALON_SERVICES.find(service => 
        service.category.toLowerCase() === category
      ) || null
    }
  }
  
  return null
}

export const findMatchingStaff = (text: string): Staff | null => {
  const lowerText = text.toLowerCase()
  
  return SALON_STAFF.find(staff => 
    lowerText.includes(staff.name.toLowerCase()) ||
    lowerText.includes(staff.role.toLowerCase())
  ) || null
}

export const getServicesText = (): string => {
  const categories = [...new Set(SALON_SERVICES.map(s => s.category))]
  
  let text = "🌟 **Our Services & Pricing:**\n\n"
  
  categories.forEach(category => {
    const categoryServices = SALON_SERVICES.filter(s => s.category === category)
    text += `**${getCategoryIcon(category)} ${category}:**\n`
    categoryServices.slice(0, 3).forEach(service => {
      text += `• ${service.name} - ${formatCurrency(service.price.min)}-${formatCurrency(service.price.max)}\n`
    })
    text += '\n'
  })
  
  return text
}

export const getCategoryIcon = (category: string): string => {
  const icons: { [key: string]: string } = {
    'Hair Styling': '💇‍♀️',
    'Hair Braiding': '🧑‍🎨',
    'Hair Treatment': '✨',
    'Hair Relaxing': '🌿',
    'Nail Services': '💅'
  }
  return icons[category] || '💅'
}

export const getStaffText = (): string => {
  let text = "👩‍💼 **Meet Our Expert Team:**\n\n"
  
  SALON_STAFF.forEach(staff => {
    text += `**${staff.name}** - ${staff.role}\n`
    text += `Specializes in: ${staff.specialties.join(', ')}\n\n`
  })
  
  return text
}

export const getLocationText = (): string => {
  return `📍 **Visit VIP Queens Salon:**\n\n🏢 ${SALON_INFO.location.address}\n${SALON_INFO.location.building}\n${SALON_INFO.location.area}, ${SALON_INFO.location.city}\n\n🚗 ${SALON_INFO.location.directions}\n\n📱 **Contact:** ${SALON_INFO.contact.phone}\n💬 **WhatsApp:** Available 24/7\n⏰ **Hours:** ${SALON_INFO.hours.weekdays} (Mon-Sat), ${SALON_INFO.hours.sunday} (Sun)`
}

export const getPromotionsText = (): string => {
  let text = "🎉 **Current Special Offers:**\n\n"
  
  SALON_PROMOTIONS.forEach(promo => {
    text += `**${promo.title}**\n${promo.description}\n💰 Save ${promo.discount}\n${promo.terms}\n\n`
  })
  
  return text
}