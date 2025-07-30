import { MapPin, Phone, Clock, Heart, TrendingUp } from 'lucide-react'

interface FooterProps {
  selectedLocation: 'kiambu' | 'roysambu'
}

export function Footer({ selectedLocation }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const locations = {
    kiambu: {
      name: 'Kiambu Road Bypass',
      address: 'Next to Pro Swim',
      phone: '0715 589 102',
      whatsapp: 'https://wa.me/254715589102'
    },
    roysambu: {
      name: 'Roysambu, Lumumba Drive',
      address: 'Opposite Nairobi Butchery, Flash Building 2nd Floor',
      phone: '0700 235 466',
      whatsapp: 'https://wa.me/254700235466'
    }
  }

  const services = [
    'Hair Styling & Cuts',
    'Hair Coloring',
    'Braiding & Weaving',
    'Nail Services',
    'Facial Treatments',
    'Hair Treatments'
  ]

  const quickLinks = [
    { name: 'Book Appointment', href: '#booking' },
    { name: 'Our Services', href: '#services' },
    { name: 'Meet Our Team', href: '#team' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Special Offers', href: '#offers' },
    { name: 'Contact Us', href: '#contact' }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-electric-pink rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <div>
                <h3 className="text-2xl font-script font-bold bg-gradient-to-r from-electric-pink to-teal-mint bg-clip-text text-transparent">
                  GeeCurly Salon
                </h3>
                <p className="text-sm text-gray-400">Your Beauty, Our Passion</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              GeeCurly Salon brings you premium beauty services across Nairobi with AI-powered booking. 
              Trusted by over 1M beauty lovers on TikTok.
            </p>

            {/* TikTok Badge */}
            <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold">@gee_curly_salon</div>
                  <div className="text-pink-300 text-sm">1M+ TikTok followers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">Our Services</h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <span className="text-gray-300 hover:text-electric-pink transition-colors cursor-pointer text-sm">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-teal-mint transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">GeeCurly Salon Locations</h4>
            
            <div className="space-y-4">
              {Object.entries(locations).map(([key, location]) => (
                <div 
                  key={key}
                  className={`p-4 rounded-xl border transition-all ${
                    selectedLocation === key 
                      ? 'border-electric-pink bg-electric-pink/10' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <h5 className="font-semibold text-white mb-2">{location.name}</h5>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-electric-pink mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{location.address}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-teal-mint flex-shrink-0" />
                      <a 
                        href={`tel:${location.phone}`}
                        className="text-gray-300 hover:text-teal-mint transition-colors"
                      >
                        {location.phone}
                      </a>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-sunset-orange flex-shrink-0" />
                      <span className="text-gray-300">Mon-Sat: 8AM-8PM, Sun: 9AM-6PM</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <a
                      href={location.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} GeeCurly Salon. All rights reserved. | Owned by Sam Karanja
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-electric-pink fill-electric-pink" />
              <span>for beauty lovers in Nairobi</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}