import { useState } from 'react'
import { MapPin, Phone, Clock, MessageCircle, Mail, Instagram, Send, User, MessageSquare } from 'lucide-react'

interface ContactProps {
  selectedLocation: 'kiambu' | 'roysambu'
}

export function Contact({ selectedLocation }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: selectedLocation,
    message: ''
  })

  const locations = {
    kiambu: {
      name: 'Kiambu Road Bypass',
      address: 'Next to Pro Swim',
      phone: '0715 589 102',
      hours: 'Mon-Sat: 8AM-8PM, Sun: 9AM-6PM',
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7234!2d36.8419!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTcnMzEuNiJTIDM2wrA1MCczMS4wIkU!5e0!3m2!1sen!2ske!4v1234567890!5m2!1sen!2ske',
      whatsappLink: 'https://wa.me/254715589102'
    },
    roysambu: {
      name: 'Roysambu, Lumumba Drive',
      address: 'Opposite Nairobi Butchery, Flash Building 2nd Floor',
      phone: '0700 235 466',
      hours: 'Mon-Sat: 8AM-8PM, Sun: 9AM-6PM',
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8234!2d36.8919!3d-1.2421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTQnMzEuNiJTIDM2wrA1Mzczf0!5e0!3m2!1sen!2ske!4v1234567890!5m2!1sen!2ske',
      whatsappLink: 'https://wa.me/254700235466'
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create WhatsApp message
    const message = `Hello GeeCurly Salon! 

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Preferred Location: ${locations[formData.location as keyof typeof locations].name}

Message: ${formData.message}

I'd like to get in touch regarding your services.`

    const whatsappUrl = `${locations[formData.location as keyof typeof locations].whatsappLink}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="contact" className="py-16 lg:py-24 bg-soft-gray">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              <span className="font-script bg-gradient-to-r from-electric-pink to-deep-purple bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-inter">
              Visit us at either GeeCurly Salon location or reach out through your preferred method. 
              Our AI assistant is also available 24/7 to help with bookings!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 font-inter">Visit Our GeeCurly Salon Locations</h3>
              
              {/* Location Cards */}
              <div className="space-y-6">
                {Object.entries(locations).map(([key, location]) => (
                  <div
                    key={key}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                      selectedLocation === key
                        ? 'border-electric-pink bg-electric-pink-light/20'
                        : 'border-gray-200 bg-white hover:border-electric-pink-light'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        selectedLocation === key ? 'bg-electric-pink' : 'bg-gray-100'
                      }`}>
                        <MapPin className={`w-6 h-6 ${
                          selectedLocation === key ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-800 mb-2">{location.name}</h4>
                        <p className="text-gray-600 mb-3">{location.address}</p>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-3 text-gray-600">
                            <Phone className="w-4 h-4 text-electric-pink" />
                            <span>{location.phone}</span>
                          </div>
                          <div className="flex items-center space-x-3 text-gray-600">
                            <Clock className="w-4 h-4 text-electric-pink" />
                            <span>{location.hours}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex space-x-3">
                          <a
                            href={location.whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-teal-mint hover:bg-teal-mint-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>WhatsApp</span>
                          </a>
                          <a
                            href={`tel:${location.phone}`}
                            className="bg-electric-pink hover:bg-electric-pink-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                          >
                            <Phone className="w-4 h-4" />
                            <span>Call</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-r from-electric-pink-light to-deep-purple-light p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Follow Our GeeCurly Journey</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <a
                      href="https://tiktok.com/@gee_curly_salon"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-xl hover:scale-110 transition-transform"
                    >
                      <div className="w-6 h-6 font-bold text-center text-sm leading-6">T</div>
                    </a>
                    <div>
                      <p className="text-gray-800 font-medium">@gee_curly_salon</p>
                      <p className="text-sm text-gray-600">1M+ followers on TikTok</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-electric-pink">1M+</p>
                    <p className="text-sm text-gray-600">Beauty lovers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 font-inter">Send GeeCurly Salon a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-electric-pink focus:border-transparent transition-colors bg-white text-gray-800 placeholder-gray-500"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-electric-pink focus:border-transparent transition-colors bg-white text-gray-800 placeholder-gray-500"
                        placeholder="0700 000 000"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-electric-pink focus:border-transparent transition-colors bg-white text-gray-800 placeholder-gray-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred GeeCurly Salon Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-electric-pink focus:border-transparent transition-colors appearance-none bg-white text-gray-800"
                    >
                      <option value="kiambu">Kiambu Road Bypass</option>
                      <option value="roysambu">Roysambu, Lumumba Drive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-electric-pink focus:border-transparent transition-colors resize-none bg-white text-gray-800 placeholder-gray-500"
                      placeholder="Tell us about the services you're interested in or any questions you have..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-electric-pink to-deep-purple text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:from-electric-pink-dark hover:to-deep-purple-dark hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <Send className="w-5 h-5" />
                  <span>Send via WhatsApp</span>
                </button>

                <p className="text-sm text-gray-600 text-center">
                  This will open WhatsApp with your message pre-filled
                </p>
              </form>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center font-inter">
              Find GeeCurly Salon at {locations[selectedLocation].name}
            </h3>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <iframe
                src={locations[selectedLocation].mapEmbed}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}