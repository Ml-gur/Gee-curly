// Advanced Memory System for VIP Queens AI Assistant
interface CustomerMemory {
  id: string
  name?: string
  phone?: string
  email?: string
  preferredServices: string[]
  preferredStylists: string[]
  preferredTimes: string[]
  lastVisit?: Date
  bookingHistory: BookingMemory[]
  conversationHistory: ConversationMemory[]
  preferences: CustomerPreferences
}

interface BookingMemory {
  id: string
  service: string
  stylist: string
  date: string
  time: string
  price: number
  status: 'confirmed' | 'completed' | 'cancelled'
  satisfaction?: number
  notes?: string
}

interface ConversationMemory {
  id: string
  timestamp: Date
  intent: string[]
  entities: any
  context: string
  outcome: 'resolved' | 'escalated' | 'abandoned'
}

interface CustomerPreferences {
  communicationStyle: 'formal' | 'casual' | 'friendly'
  urgencyLevel: 'low' | 'medium' | 'high'
  priceRange: { min: number; max: number }
  timePreferences: string[]
  serviceFrequency: 'first-time' | 'occasional' | 'regular' | 'frequent'
}

interface ConversationStage {
  current: 'greeting' | 'exploring' | 'booking' | 'confirmation' | 'completed'
  previous?: string
  context: string[]
  confidence: number
  nextSuggestions: string[]
}

class AIMemorySystem {
  private customers: Map<string, CustomerMemory> = new Map()
  private sessions: Map<string, string> = new Map() // sessionId -> customerId
  private conversationStages: Map<string, ConversationStage> = new Map()

  constructor() {
    this.loadFromStorage()
  }

  // Session Management
  createSession(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  getCustomerBySession(sessionId: string): CustomerMemory | null {
    const customerId = this.sessions.get(sessionId)
    return customerId ? this.customers.get(customerId) || null : null
  }

  // Customer Memory Management
  identifyCustomer(phone?: string, name?: string, sessionId?: string): CustomerMemory {
    let customer: CustomerMemory

    if (phone) {
      // Find existing customer by phone
      const existing = Array.from(this.customers.values()).find(c => c.phone === phone)
      if (existing) {
        customer = existing
      } else {
        // Create new customer
        customer = this.createNewCustomer(phone, name)
      }
    } else {
      // Anonymous session
      customer = this.createAnonymousCustomer()
    }

    if (sessionId) {
      this.sessions.set(sessionId, customer.id)
    }

    return customer
  }

  private createNewCustomer(phone?: string, name?: string): CustomerMemory {
    const id = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const customer: CustomerMemory = {
      id,
      phone,
      name,
      preferredServices: [],
      preferredStylists: [],
      preferredTimes: [],
      bookingHistory: [],
      conversationHistory: [],
      preferences: {
        communicationStyle: 'friendly',
        urgencyLevel: 'medium',
        priceRange: { min: 0, max: 10000 },
        timePreferences: [],
        serviceFrequency: 'first-time'
      }
    }

    this.customers.set(id, customer)
    this.saveToStorage()
    return customer
  }

  private createAnonymousCustomer(): CustomerMemory {
    return this.createNewCustomer()
  }

  // Memory Updates
  updateCustomerInfo(customerId: string, info: Partial<CustomerMemory>): void {
    const customer = this.customers.get(customerId)
    if (customer) {
      Object.assign(customer, info)
      this.saveToStorage()
    }
  }

  addServiceInterest(customerId: string, service: string): void {
    const customer = this.customers.get(customerId)
    if (customer && !customer.preferredServices.includes(service)) {
      customer.preferredServices.push(service)
      this.saveToStorage()
    }
  }

  addStylistPreference(customerId: string, stylist: string): void {
    const customer = this.customers.get(customerId)
    if (customer && !customer.preferredStylists.includes(stylist)) {
      customer.preferredStylists.push(stylist)
      this.saveToStorage()
    }
  }

  addTimePreference(customerId: string, time: string): void {
    const customer = this.customers.get(customerId)
    if (customer && !customer.preferredTimes.includes(time)) {
      customer.preferredTimes.push(time)
      this.saveToStorage()
    }
  }

  addBookingToHistory(customerId: string, booking: BookingMemory): void {
    const customer = this.customers.get(customerId)
    if (customer) {
      customer.bookingHistory.push(booking)
      customer.lastVisit = new Date()
      this.updateServiceFrequency(customer)
      this.saveToStorage()
    }
  }

  addConversationMemory(customerId: string, conversation: ConversationMemory): void {
    const customer = this.customers.get(customerId)
    if (customer) {
      customer.conversationHistory.push(conversation)
      // Keep only last 50 conversations
      if (customer.conversationHistory.length > 50) {
        customer.conversationHistory = customer.conversationHistory.slice(-50)
      }
      this.saveToStorage()
    }
  }

  // Conversation Stage Management
  setConversationStage(sessionId: string, stage: ConversationStage): void {
    this.conversationStages.set(sessionId, stage)
  }

  getConversationStage(sessionId: string): ConversationStage | null {
    return this.conversationStages.get(sessionId) || null
  }

  updateConversationStage(sessionId: string, updates: Partial<ConversationStage>): void {
    const current = this.conversationStages.get(sessionId)
    if (current) {
      Object.assign(current, updates)
    }
  }

  // Intelligence & Recommendations
  getPersonalizedGreeting(customer: CustomerMemory): string {
    if (customer.name) {
      if (customer.bookingHistory.length > 0) {
        return `Welcome back, ${customer.name}! 🌟 Great to see you again!`
      } else {
        return `Hello ${customer.name}! 👋 Welcome to VIP Queens Salon!`
      }
    } else {
      return `Welcome to VIP Queens Salon! 🏛️ I'm here to help you look and feel amazing!`
    }
  }

  getServiceRecommendations(customer: CustomerMemory): string[] {
    const recommendations: string[] = []
    
    // Based on previous bookings
    if (customer.bookingHistory.length > 0) {
      const lastService = customer.bookingHistory[customer.bookingHistory.length - 1].service
      recommendations.push(`Your usual ${lastService}`)
    }
    
    // Based on preferences
    customer.preferredServices.forEach(service => {
      if (!recommendations.includes(service)) {
        recommendations.push(service)
      }
    })
    
    return recommendations.slice(0, 3)
  }

  getStylistRecommendations(customer: CustomerMemory): string[] {
    return customer.preferredStylists.slice(0, 2)
  }

  getTimeRecommendations(customer: CustomerMemory): string[] {
    return customer.preferredTimes.slice(0, 3)
  }

  detectUrgency(message: string): 'low' | 'medium' | 'high' {
    const urgentWords = ['urgent', 'asap', 'emergency', 'now', 'immediately', 'today']
    const soonWords = ['soon', 'quick', 'fast', 'tomorrow']
    
    const lowerMessage = message.toLowerCase()
    
    if (urgentWords.some(word => lowerMessage.includes(word))) {
      return 'high'
    } else if (soonWords.some(word => lowerMessage.includes(word))) {
      return 'medium'
    }
    
    return 'low'
  }

  // Analytics & Insights
  getCustomerInsights(customer: CustomerMemory): any {
    return {
      totalBookings: customer.bookingHistory.length,
      favoriteServices: this.getMostFrequent(customer.preferredServices),
      favoriteStylists: this.getMostFrequent(customer.preferredStylists),
      averageSpending: this.calculateAverageSpending(customer),
      loyaltyLevel: this.calculateLoyaltyLevel(customer),
      lastVisit: customer.lastVisit,
      communicationStyle: customer.preferences.communicationStyle,
      serviceFrequency: customer.preferences.serviceFrequency
    }
  }

  // Helper Methods
  private updateServiceFrequency(customer: CustomerMemory): void {
    const bookingCount = customer.bookingHistory.length
    if (bookingCount === 1) {
      customer.preferences.serviceFrequency = 'first-time'
    } else if (bookingCount <= 3) {
      customer.preferences.serviceFrequency = 'occasional'
    } else if (bookingCount <= 8) {
      customer.preferences.serviceFrequency = 'regular'
    } else {
      customer.preferences.serviceFrequency = 'frequent'
    }
  }

  private getMostFrequent(array: string[]): string[] {
    const frequency: { [key: string]: number } = {}
    array.forEach(item => {
      frequency[item] = (frequency[item] || 0) + 1
    })
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([item]) => item)
  }

  private calculateAverageSpending(customer: CustomerMemory): number {
    if (customer.bookingHistory.length === 0) return 0
    const total = customer.bookingHistory.reduce((sum, booking) => sum + booking.price, 0)
    return total / customer.bookingHistory.length
  }

  private calculateLoyaltyLevel(customer: CustomerMemory): 'new' | 'bronze' | 'silver' | 'gold' | 'platinum' {
    const bookingCount = customer.bookingHistory.length
    if (bookingCount === 0) return 'new'
    if (bookingCount <= 2) return 'bronze'
    if (bookingCount <= 5) return 'silver'
    if (bookingCount <= 10) return 'gold'
    return 'platinum'
  }

  // Storage Management
  private saveToStorage(): void {
    try {
      const data = {
        customers: Array.from(this.customers.entries()),
        sessions: Array.from(this.sessions.entries()),
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('vip_queens_ai_memory', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save memory to storage:', error)
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('vip_queens_ai_memory')
      if (stored) {
        const data = JSON.parse(stored)
        this.customers = new Map(data.customers)
        this.sessions = new Map(data.sessions)
      }
    } catch (error) {
      console.error('Failed to load memory from storage:', error)
    }
  }

  // Debug Methods (for development)
  getDebugInfo(): any {
    return {
      totalCustomers: this.customers.size,
      activeSessions: this.sessions.size,
      activeStages: this.conversationStages.size,
      memoryUsage: JSON.stringify({
        customers: Array.from(this.customers.entries()),
        sessions: Array.from(this.sessions.entries())
      }).length
    }
  }

  clearMemory(): void {
    this.customers.clear()
    this.sessions.clear()
    this.conversationStages.clear()
    localStorage.removeItem('vip_queens_ai_memory')
  }
}

// Export singleton instance
export const memorySystem = new AIMemorySystem()

// Export types
export type {
  CustomerMemory,
  BookingMemory,
  ConversationMemory,
  CustomerPreferences,
  ConversationStage
}