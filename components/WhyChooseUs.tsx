import { Shield, Star, Users, Clock, Heart, Award, Sparkles, CheckCircle, TrendingUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function WhyChooseUs() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const features = [
    {
      id: 1,
      icon: <Star className="w-6 h-6" />,
      title: 'Expert Stylists',
      description: 'Experienced professionals specialized in African hair care',
      color: 'electric-pink'
    },
    {
      id: 2,
      icon: <Shield className="w-6 h-6" />,
      title: 'Quality Products',
      description: 'Premium hair care products for lasting results',
      color: 'teal-mint'
    },
    {
      id: 3,
      icon: <Heart className="w-6 h-6" />,
      title: 'Personalized Service',
      description: 'Consultations tailored to your hair type and lifestyle',
      color: 'sunset-orange'
    },
    {
      id: 4,
      icon: <Users className="w-6 h-6" />,
      title: 'Comfortable Environment',
      description: 'Relaxing atmosphere where you feel like royalty',
      color: 'deep-purple'
    },
    {
      id: 5,
      icon: <Clock className="w-6 h-6" />,
      title: 'Flexible Hours',
      description: 'Open 8AM-8PM daily to fit your busy schedule',
      color: 'electric-pink'
    },
    {
      id: 6,
      icon: <Award className="w-6 h-6" />,
      title: 'Best Salon in Nairobi',
      description: '1M+ TikTok followers with 5-star reviews',
      color: 'teal-mint'
    },
    {
      id: 7,
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Natural Hair Expertise',
      description: 'Specialists in protective styles and natural care',
      color: 'sunset-orange'
    },
    {
      id: 8,
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'TikTok Famous',
      description: 'Trusted by 1M+ beauty lovers on social media',
      color: 'deep-purple'
    }
  ]

  // Scroll animation effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            setVisibleItems(prev => [...prev, index])
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    const items = containerRef.current?.querySelectorAll('[data-index]')
    items?.forEach(item => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  const getIconBg = (color: string) => {
    switch (color) {
      case 'electric-pink':
        return 'bg-electric-pink'
      case 'teal-mint':
        return 'bg-teal-mint'
      case 'sunset-orange':
        return 'bg-sunset-orange'
      case 'deep-purple':
        return 'bg-deep-purple'
      default:
        return 'bg-electric-pink'
    }
  }

  const getCardBorder = (color: string) => {
    switch (color) {
      case 'electric-pink':
        return 'border-electric-pink/30 hover:border-electric-pink/60 hover:shadow-electric-pink/20'
      case 'teal-mint':
        return 'border-teal-mint/30 hover:border-teal-mint/60 hover:shadow-teal-mint/20'
      case 'sunset-orange':
        return 'border-sunset-orange/30 hover:border-sunset-orange/60 hover:shadow-sunset-orange/20'
      case 'deep-purple':
        return 'border-deep-purple/30 hover:border-deep-purple/60 hover:shadow-deep-purple/20'
      default:
        return 'border-electric-pink/30 hover:border-electric-pink/60'
    }
  }

  return (
    <section id="why-choose-us" className="py-16 lg:py-24 bg-gradient-to-b from-soft-gray to-electric-pink-light/20">
      <div className="container-mobile" ref={containerRef}>
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-electric-pink/20 rounded-full px-6 py-2 mb-6">
            <Award className="w-4 h-4 text-electric-pink mr-2" />
            <span className="text-sm font-medium text-gray-700 font-inter">Why Choose Us</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6 font-inter">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-electric-pink to-deep-purple bg-clip-text text-transparent">
              GeeCurly Salon
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-inter">
            Experience the difference with Nairobi's premier beauty salon. 
            Our commitment to excellence and personalized care sets us apart.
          </p>
        </div>

        {/* Features Grid - 2 columns on mobile, responsive scaling */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.id}
              data-index={index}
              className={`group bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border ${getCardBorder(feature.color)} ${
                visibleItems.includes(index) 
                  ? 'animate-slideInUp opacity-100' 
                  : 'opacity-0'
              }`}
              style={{
                animationDelay: visibleItems.includes(index) ? `${index * 0.1}s` : '0s'
              }}
            >
              {/* Icon with proper contrast */}
              <div className={`${getIconBg(feature.color)} text-white w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              
              {/* Content */}
              <div className="text-center">
                <h3 className="text-sm md:text-lg font-bold text-gray-800 mb-2 font-inter leading-tight">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-inter">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-100 shadow-xl max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 font-inter">
              Ready to Experience the GeeCurly Treatment?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto font-inter">
              Join over 1 million satisfied clients who trust GeeCurly Salon for their beauty needs. 
              Book your appointment today and discover why we're Nairobi's favorite salon.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => {
                  const bookingSection = document.getElementById('booking')
                  if (bookingSection) {
                    bookingSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-electric-pink to-deep-purple text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 font-inter hover:from-electric-pink-dark hover:to-deep-purple-dark"
              >
                <span>Book Your Appointment</span>
                <Star className="w-4 h-4" />
              </button>
              
              <button 
                onClick={() => window.open('https://wa.me/254715589102?text=Hello GeeCurly Salon! I would like to learn more about your services.', '_blank')}
                className="w-full sm:w-auto bg-teal-mint hover:bg-teal-mint-dark text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 font-inter"
              >
                📱 Chat with Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}