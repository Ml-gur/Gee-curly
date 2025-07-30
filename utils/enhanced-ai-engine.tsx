// Enhanced AI Engine for VIP Queens Salon
import { 
  SALON_INFO, 
  SALON_SERVICES, 
  SALON_STAFF, 
  SALON_PROMOTIONS, 
  SALON_FAQS,
  formatCurrency 
} from './ai-knowledge-base'
import { memorySystem, CustomerMemory, ConversationStage } from './ai-memory-system'

interface AIResponse {
  text: string
  type: 'welcome' | 'booking' | 'info' | 'confirmation' | 'escalation' | 'error'
  quickActions?: string[]
  confidence: number
  suggestions?: string[]
  data?: any
}

interface IntentAnalysis {
  primaryIntent: string
  secondaryIntents: string[]
  entities: {
    service?: any
    stylist?: any
    timePreference?: string
    urgency?: 'low' | 'medium' | 'high'
    sentiment?: 'positive' | 'neutral' | 'negative'
  }
  confidence: number
  context: string[]
}

class EnhancedAIEngine {
  private sessionId: string
  private customer: CustomerMemory | null = null
  private conversationStage: ConversationStage | null = null

  constructor() {
    this.sessionId = memorySystem.createSession()
    this.initializeSession()
  }

  private initializeSession(): void {
    this.customer = memorySystem.identifyCustomer(undefined, undefined, this.sessionId)
    this.conversationStage = {
      current: 'greeting',
      context: [],
      confidence: 1.0,
      nextSuggestions: ['Book appointment', 'View services', 'Ask about prices', 'Get location info']
    }
    memorySystem.setConversationStage(this.sessionId, this.conversationStage)
  }

  // Enhanced Intent Analysis
  private analyzeIntent(message: string): IntentAnalysis {
    const lowerMessage = message.toLowerCase()
    const words = lowerMessage.split(/\s+/)
    
    // Intent patterns with weights
    const intentPatterns = {
      'booking': {
        keywords: ['book', 'appointment', 'schedule', 'reserve', 'available', 'slot'],
        weight: 1.0
      },
      'service_inquiry': {
        keywords: ['service', 'treatment', 'haircut', 'braiding', 'nails', 'what do you offer'],
        weight: 0.9
      },
      'pricing': {
        keywords: ['price', 'cost', 'how much', 'rate', 'fee', 'charge', 'expensive'],
        weight: 0.8
      },
      'staff_inquiry': {
        keywords: ['stylist', 'staff', 'who', 'catherine', 'njeri', 'ann', 'rachael'],
        weight: 0.8
      },
      'location': {
        keywords: ['where', 'location', 'address', 'direction', 'how to get'],
        weight: 0.7
      },
      'hours': {
        keywords: ['hour', 'time', 'open', 'close', 'when'],
        weight: 0.7
      },
      'greeting': {
        keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
        weight: 0.6
      },
      'help': {
        keywords: ['help', 'assist', 'support', 'question'],
        weight: 0.5
      }
    }

    // Calculate intent scores
    const intentScores: { [key: string]: number } = {}
    
    for (const [intent, pattern] of Object.entries(intentPatterns)) {
      let score = 0
      for (const keyword of pattern.keywords) {
        if (lowerMessage.includes(keyword)) {
          score += pattern.weight
        }
      }
      if (score > 0) {
        intentScores[intent] = score
      }
    }

    // Get primary and secondary intents
    const sortedIntents = Object.entries(intentScores)
      .sort(([,a], [,b]) => b - a)
    
    const primaryIntent = sortedIntents[0]?.[0] || 'general'
    const secondaryIntents = sortedIntents.slice(1, 3).map(([intent]) => intent)

    // Extract entities
    const entities = this.extractEntities(message)
    
    // Calculate confidence
    const confidence = Math.min(
      (sortedIntents[0]?.[1] || 0) / Math.max(words.length * 0.3, 1),
      1.0
    )

    return {
      primaryIntent,
      secondaryIntents,
      entities,
      confidence,
      context: this.conversationStage?.context || []
    }
  }

  private extractEntities(message: string): IntentAnalysis['entities'] {
    const entities: IntentAnalysis['entities'] = {}

    // Extract service
    const service = this.findMatchingService(message)
    if (service) entities.service = service

    // Extract stylist
    const stylist = this.findMatchingStaff(message)
    if (stylist) entities.stylist = stylist

    // Extract time preference
    const timePreference = this.extractTimePreference(message)
    if (timePreference) entities.timePreference = timePreference

    // Extract urgency
    entities.urgency = memorySystem.detectUrgency(message)

    // Extract sentiment
    entities.sentiment = this.extractSentiment(message)

    return entities
  }

  private findMatchingService(text: string): any {
    const lowerText = text.toLowerCase()
    
    // Direct service name matching
    const directMatch = SALON_SERVICES.find(service => 
      lowerText.includes(service.name.toLowerCase())
    )
    if (directMatch) return directMatch
    
    // Enhanced category-based matching
    const serviceKeywords = {
      'Hair Styling': ['haircut', 'cut', 'style', 'styling', 'blow dry', 'wash', 'set', 'trim'],
      'Hair Braiding': ['braid', 'braids', 'cornrow', 'twist', 'box braid', 'ghana', 'faux loc', 'protective'],
      'Hair Treatment': ['treatment', 'condition', 'protein', 'hot oil', 'scalp', 'repair', 'deep condition'],
      'Hair Relaxing': ['relax', 'relaxer', 'keratin', 'straighten', 'japanese', 'chemical'],
      'Nail Services': ['nail', 'manicure', 'pedicure', 'gel', 'acrylic', 'nail art', 'polish']
    }
    
    for (const [category, keywords] of Object.entries(serviceKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return SALON_SERVICES.find(service => service.category === category)
      }
    }
    
    return null
  }

  private findMatchingStaff(text: string): any {
    const lowerText = text.toLowerCase()
    
    return SALON_STAFF.find(staff => {
      // Full name match
      if (lowerText.includes(staff.name.toLowerCase())) return true
      
      // First name match
      const firstName = staff.name.split(' ')[0].toLowerCase()
      if (lowerText.includes(firstName)) return true
      
      // Role match
      if (lowerText.includes(staff.role.toLowerCase())) return true
      
      return false
    })
  }

  private extractTimePreference(text: string): string | null {
    const timePatterns = [
      /\b(\d{1,2}):?(\d{2})?\s*(am|pm)\b/i,
      /\b(\d{1,2})\s*(am|pm)\b/i,
      /\b(morning|afternoon|evening|night)\b/i,
      /\b(today|tomorrow|next week|this week)\b/i,
      /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i
    ]
    
    for (const pattern of timePatterns) {
      const match = text.match(pattern)
      if (match) return match[0]
    }
    
    return null
  }

  private extractSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'perfect', 'wonderful']
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'disappointed', 'angry']
    
    const lowerText = text.toLowerCase()
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length
    
    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }

  // Main Processing Method
  async processMessage(message: string): Promise<AIResponse> {
    if (!this.customer || !this.conversationStage) {
      this.initializeSession()
    }

    const analysis = this.analyzeIntent(message)
    
    // Update conversation context
    this.conversationStage!.context.push(analysis.primaryIntent)
    if (this.conversationStage!.context.length > 10) {
      this.conversationStage!.context = this.conversationStage!.context.slice(-10)
    }

    // Update memory with interaction
    if (analysis.entities.service) {
      memorySystem.addServiceInterest(this.customer!.id, analysis.entities.service.name)
    }
    if (analysis.entities.stylist) {
      memorySystem.addStylistPreference(this.customer!.id, analysis.entities.stylist.name)
    }
    if (analysis.entities.timePreference) {
      memorySystem.addTimePreference(this.customer!.id, analysis.entities.timePreference)
    }

    // Handle commands
    if (this.isResetCommand(message)) {
      return this.handleReset()
    }
    if (this.isGoBackCommand(message)) {
      return this.handleGoBack()
    }

    // Route to appropriate handler
    switch (analysis.primaryIntent) {
      case 'booking':
        return await this.handleBookingIntent(message, analysis)
      case 'service_inquiry':
        return this.handleServiceInquiry(message, analysis)
      case 'pricing':
        return this.handlePricingInquiry(message, analysis)
      case 'staff_inquiry':
        return this.handleStaffInquiry(message, analysis)
      case 'location':
        return this.handleLocationInquiry(message, analysis)
      case 'hours':
        return this.handleHoursInquiry(message, analysis)
      case 'greeting':
        return this.handleGreeting(message, analysis)
      default:
        return this.handleGeneralInquiry(message, analysis)
    }
  }

  // Command Handlers
  private isResetCommand(message: string): boolean {
    const resetCommands = ['start over', 'reset', 'start again', 'new conversation', 'restart']
    return resetCommands.some(cmd => message.toLowerCase().includes(cmd))
  }

  private isGoBackCommand(message: string): boolean {
    const goBackCommands = ['go back', 'previous', 'back', 'undo']
    return goBackCommands.some(cmd => message.toLowerCase().includes(cmd))
  }

  private handleReset(): AIResponse {
    this.conversationStage = {
      current: 'greeting',
      context: [],
      confidence: 1.0,
      nextSuggestions: ['Book appointment', 'View services', 'Ask about prices']
    }
    memorySystem.setConversationStage(this.sessionId, this.conversationStage)

    return {
      text: `🔄 Perfect! Let's start fresh.\n\n${memorySystem.getPersonalizedGreeting(this.customer!)}\n\nHow can I help you today?`,
      type: 'welcome',
      quickActions: ['Book appointment', 'View services', 'Check prices', 'Location info'],
      confidence: 1.0,
      suggestions: ['Book appointment', 'View our services', 'Ask about pricing']
    }
  }

  private handleGoBack(): AIResponse {
    const stages = ['greeting', 'exploring', 'booking', 'confirmation']
    const currentIndex = stages.indexOf(this.conversationStage!.current)
    const previousStage = stages[Math.max(currentIndex - 1, 0)]
    
    this.conversationStage!.previous = this.conversationStage!.current
    this.conversationStage!.current = previousStage as any
    
    return {
      text: `↩️ Going back to ${previousStage}.\n\nWhat would you like to do?`,
      type: 'info',
      quickActions: ['Book appointment', 'View services', 'Ask questions'],
      confidence: 1.0
    }
  }

  // Intent Handlers
  private async handleBookingIntent(message: string, analysis: IntentAnalysis): Promise<AIResponse> {
    this.conversationStage!.current = 'booking'
    
    const recommendations = memorySystem.getServiceRecommendations(this.customer!)
    const stylistRecommendations = memorySystem.getStylistRecommendations(this.customer!)
    
    let response = `📅 I'd love to help you book an appointment!\n\n`
    
    // Personalized recommendations
    if (recommendations.length > 0) {
      response += `**Based on your preferences:**\n`
      recommendations.forEach(rec => {
        response += `• ${rec}\n`
      })
      response += '\n'
    }
    
    if (analysis.entities.service && analysis.entities.stylist) {
      // Fast-track booking
      response += `Perfect! I see you want **${analysis.entities.service.name}** with **${analysis.entities.stylist.name}**.\n\nLet me check available times for you! ⏰`
      
      return {
        text: response,
        type: 'booking',
        confidence: analysis.confidence,
        data: {
          service: analysis.entities.service,
          stylist: analysis.entities.stylist
        }
      }
    } else if (analysis.entities.service) {
      response += `Great choice on **${analysis.entities.service.name}**!\n\n**Available stylists:**\n`
      
      // Show stylist recommendations first
      if (stylistRecommendations.length > 0) {
        response += `*Your preferred stylists:*\n`
        stylistRecommendations.forEach(stylist => {
          response += `• ${stylist} ⭐\n`
        })
        response += '\n'
      }
      
      // Show all available stylists for this service
      const availableStaff = SALON_STAFF.filter(staff => 
        staff.specialties.includes(analysis.entities.service.category)
      )
      
      response += `*All available stylists:*\n`
      availableStaff.forEach(staff => {
        response += `• **${staff.name}** - ${staff.role}\n`
      })
      
      response += `\nWho would you prefer? 👩‍💼`
    } else {
      response += `**Our Popular Services:**\n`
      SALON_SERVICES.slice(0, 5).forEach(service => {
        response += `• ${service.name} - ${formatCurrency(service.price.min)}-${formatCurrency(service.price.max)}\n`
      })
      response += `\nWhich service interests you? ✨`
    }
    
    return {
      text: response,
      type: 'booking',
      quickActions: ['Hair Styling', 'Hair Braiding', 'Nail Services'],
      confidence: analysis.confidence
    }
  }

  private handleServiceInquiry(message: string, analysis: IntentAnalysis): AIResponse {
    this.conversationStage!.current = 'exploring'
    
    let response = `💇‍♀️ **Our Expert Services at VIP Queens Salon:**\n\n`
    
    if (analysis.entities.service) {
      const service = analysis.entities.service
      response = `✨ **${service.name}**\n\n`
      response += `📋 **Details:**\n`
      response += `• Duration: ${service.duration}\n`
      response += `• Price: ${formatCurrency(service.price.min)} - ${formatCurrency(service.price.max)}\n`
      response += `• ${service.description}\n\n`
      response += `Would you like to book this service? 📅`
    } else {
      const categories = [...new Set(SALON_SERVICES.map(s => s.category))]
      categories.forEach(category => {
        const categoryServices = SALON_SERVICES.filter(s => s.category === category)
        const minPrice = Math.min(...categoryServices.map(s => s.price.min))
        const maxPrice = Math.max(...categoryServices.map(s => s.price.max))
        
        response += `**${category}:**\n`
        response += `• Price range: ${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}\n`
        categoryServices.slice(0, 2).forEach(service => {
          response += `• ${service.name}\n`
        })
        response += '\n'
      })
      
      response += `Which service would you like to know more about? 🤔`
    }
    
    return {
      text: response,
      type: 'info',
      quickActions: ['Book appointment', 'Check prices', 'Meet our team'],
      confidence: analysis.confidence
    }
  }

  private handlePricingInquiry(message: string, analysis: IntentAnalysis): AIResponse {
    let response = `💰 **VIP Queens Salon Pricing:**\n\n`
    
    if (analysis.entities.service) {
      const service = analysis.entities.service
      response += `**${service.name}:**\n`
      response += `• Price: ${formatCurrency(service.price.min)} - ${formatCurrency(service.price.max)}\n`
      response += `• Duration: ${service.duration}\n\n`
    } else {
      response += `**Price Ranges by Category:**\n\n`
      const categories = [...new Set(SALON_SERVICES.map(s => s.category))]
      categories.forEach(category => {
        const services = SALON_SERVICES.filter(s => s.category === category)
        const minPrice = Math.min(...services.map(s => s.price.min))
        const maxPrice = Math.max(...services.map(s => s.price.max))
        response += `• **${category}:** ${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}\n`
      })
      response += '\n'
    }
    
    // Add current promotions
    if (SALON_PROMOTIONS.length > 0) {
      response += `🎉 **Current Offers:**\n`
      SALON_PROMOTIONS.forEach(promo => {
        response += `• ${promo.title} - ${promo.discount}\n`
      })
      response += '\n'
    }
    
    response += `Ready to book your appointment? 📅`
    
    return {
      text: response,
      type: 'info',
      quickActions: ['Book now', 'View services', 'Ask about offers'],
      confidence: analysis.confidence
    }
  }

  private handleStaffInquiry(message: string, analysis: IntentAnalysis): AIResponse {
    let response = `👩‍💼 **Meet Our Expert Team:**\n\n`
    
    if (analysis.entities.stylist) {
      const stylist = analysis.entities.stylist
      response = `✨ **${stylist.name}** - ${stylist.role}\n\n`
      response += `**Specializes in:** ${stylist.specialties.join(', ')}\n\n`
      response += `${stylist.name} is highly experienced and loved by our clients! Would you like to book with her? 📅`
    } else {
      SALON_STAFF.forEach(staff => {
        response += `**${staff.name}** - ${staff.role}\n`
        response += `• Specializes in: ${staff.specialties.join(', ')}\n\n`
      })
      response += `Who would you like to book with? 🌟`
    }
    
    return {
      text: response,
      type: 'info',
      quickActions: ['Book with Catherine', 'Book with Njeri', 'Any available stylist'],
      confidence: analysis.confidence
    }
  }

  private handleLocationInquiry(message: string, analysis: IntentAnalysis): AIResponse {
    const response = `📍 **Visit VIP Queens Salon:**\n\n🏢 ${SALON_INFO.location.address}\n${SALON_INFO.location.building}\n${SALON_INFO.location.area}, ${SALON_INFO.location.city}\n\n🚗 **Directions:** ${SALON_INFO.location.directions}\n\n📱 **Contact:**\n• Phone: ${SALON_INFO.contact.phone}\n• WhatsApp: Available 24/7\n\n⏰ **Hours:**\n• Mon-Sat: ${SALON_INFO.hours.weekdays}\n• Sunday: ${SALON_INFO.hours.sunday}\n\nReady to visit us? 🚗`
    
    return {
      text: response,
      type: 'info',
      quickActions: ['Book appointment', 'Call now', 'Get directions'],
      confidence: analysis.confidence
    }
  }

  private handleHoursInquiry(message: string, analysis: IntentAnalysis): AIResponse {
    const response = `⏰ **VIP Queens Salon Hours:**\n\n📅 **Monday - Saturday:** ${SALON_INFO.hours.weekdays}\n📅 **Sunday:** ${SALON_INFO.hours.sunday}\n\n💡 **Note:** ${SALON_INFO.hours.details}\n\nWould you like to book an appointment? 📱`
    
    return {
      text: response,
      type: 'info',
      quickActions: ['Book appointment', 'Check availability', 'Ask questions'],
      confidence: analysis.confidence
    }
  }

  private handleGreeting(message: string, analysis: IntentAnalysis): AIResponse {
    const personalizedGreeting = memorySystem.getPersonalizedGreeting(this.customer!)
    const recommendations = memorySystem.getServiceRecommendations(this.customer!)
    
    let response = `${personalizedGreeting}\n\nI'm here to help you with:\n• Booking appointments 📅\n• Service information 💇‍♀️\n• Pricing details 💰\n• Meeting our team 👩‍💼\n• Location & directions 📍\n\n`
    
    if (recommendations.length > 0) {
      response += `**Based on your preferences, you might like:**\n`
      recommendations.forEach(rec => {
        response += `• ${rec}\n`
      })
      response += '\n'
    }
    
    response += `How can I help you today? ✨`
    
    return {
      text: response,
      type: 'welcome',
      quickActions: ['Book appointment', 'View services', 'Check prices', 'Location info'],
      confidence: 1.0,
      suggestions: recommendations.length > 0 ? recommendations : ['Book appointment', 'Browse services']
    }
  }

  private handleGeneralInquiry(message: string, analysis: IntentAnalysis): AIResponse {
    // Try to match with FAQ
    const faqMatch = SALON_FAQS.find(faq => 
      faq.keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase()))
    )
    
    if (faqMatch) {
      return {
        text: `${faqMatch.answer}\n\nIs there anything else you'd like to know? 🤔`,
        type: 'info',
        quickActions: ['Book appointment', 'More questions', 'Talk to team'],
        confidence: 0.8
      }
    }
    
    // Low confidence - escalate
    if (analysis.confidence < 0.3) {
      return {
        text: `I'd love to help you with that! Let me connect you with our expert team:\n\n📱 **Call:** ${SALON_INFO.contact.phone}\n💬 **WhatsApp:** Available 24/7\n\nOr feel free to ask me about:\n• Booking appointments\n• Our services\n• Pricing\n• Location\n\nWhat would you like to know? 🌟`,
        type: 'escalation',
        quickActions: ['Book appointment', 'View services', 'Call salon'],
        confidence: analysis.confidence
      }
    }
    
    return {
      text: `I'm your beauty assistant at VIP Queens Salon! ✨\n\n**I can help you with:**\n• 📅 Book appointments\n• 💇‍♀️ Service information\n• 👩‍💼 Meet our stylists\n• 💰 Pricing details\n• 📍 Location & directions\n\nWhat would you like to explore? 🌟`,
      type: 'info',
      quickActions: ['Book appointment', 'View services', 'Meet team', 'Get directions'],
      confidence: analysis.confidence
    }
  }

  // Utility Methods
  updateCustomerInfo(phone: string, name?: string): void {
    if (this.customer) {
      memorySystem.updateCustomerInfo(this.customer.id, { phone, name })
      this.customer = memorySystem.getCustomerBySession(this.sessionId)
    }
  }

  getMemoryDebugInfo(): any {
    return {
      sessionId: this.sessionId,
      customer: this.customer,
      conversationStage: this.conversationStage,
      systemMemory: memorySystem.getDebugInfo()
    }
  }
}

export { EnhancedAIEngine, type AIResponse, type IntentAnalysis }