import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Database schema setup
const initializeDatabase = async () => {
  try {
    // Create services table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS services (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          price_min INTEGER NOT NULL,
          price_max INTEGER NOT NULL,
          duration_minutes INTEGER NOT NULL,
          description TEXT,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    // Create staff table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS staff (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          role TEXT NOT NULL,
          email TEXT UNIQUE,
          phone TEXT,
          specialties TEXT[],
          working_hours JSONB,
          is_available BOOLEAN DEFAULT true,
          image_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    // Create bookings table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS bookings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          customer_name TEXT NOT NULL,
          customer_phone TEXT NOT NULL,
          customer_email TEXT,
          service_id UUID REFERENCES services(id),
          service_name TEXT NOT NULL,
          service_category TEXT NOT NULL,
          price INTEGER NOT NULL,
          staff_id UUID REFERENCES staff(id),
          staff_name TEXT NOT NULL,
          booking_date DATE NOT NULL,
          booking_time TIME NOT NULL,
          end_time TIME NOT NULL,
          duration_minutes INTEGER NOT NULL,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
          booking_method TEXT DEFAULT 'website' CHECK (booking_method IN ('website', 'whatsapp', 'ai_chat')),
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    // Create indexes for performance
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_bookings_date_staff ON bookings(booking_date, staff_id);
        CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
        CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
      `
    })

    // Insert sample data
    await insertSampleData()
    
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}

const insertSampleData = async () => {
  // Insert services
  const { data: existingServices } = await supabase.from('services').select('id').limit(1)
  if (!existingServices || existingServices.length === 0) {
    await supabase.from('services').insert([
      {
        name: 'Basic Haircut & Styling',
        category: 'Hair Styling',
        price_min: 1500,
        price_max: 2500,
        duration_minutes: 90,
        description: 'Professional haircut with styling'
      },
      {
        name: 'Box Braids',
        category: 'Hair Braiding',
        price_min: 3000,
        price_max: 6000,
        duration_minutes: 240,
        description: 'Beautiful protective box braids'
      },
      {
        name: 'Deep Conditioning Treatment',
        category: 'Hair Treatment',
        price_min: 1500,
        price_max: 2500,
        duration_minutes: 90,
        description: 'Intensive moisture treatment'
      },
      {
        name: 'Gel Manicure',
        category: 'Nail Services',
        price_min: 1200,
        price_max: 1800,
        duration_minutes: 75,
        description: 'Long-lasting gel manicure'
      }
    ])
  }

  // Insert staff
  const { data: existingStaff } = await supabase.from('staff').select('id').limit(1)
  if (!existingStaff || existingStaff.length === 0) {
    await supabase.from('staff').insert([
      {
        name: 'Catherine',
        role: 'Senior Stylist & Owner',
        email: 'catherine@vipqueenssalon.com',
        phone: '0718779129',
        specialties: ['Hair Styling', 'Hair Treatment', 'Hair Relaxing'],
        working_hours: {
          start: '06:00',
          end: '22:00',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        },
        image_url: 'https://res.cloudinary.com/deasyoglq/image/upload/v1753684481/catherine_s3vklr.jpg'
      },
      {
        name: 'Njeri',
        role: 'Hair Specialist',
        email: 'njeri@vipqueenssalon.com',
        phone: '0712345678',
        specialties: ['Hair Styling', 'Hair Treatment', 'Hair Relaxing'],
        working_hours: {
          start: '06:00',
          end: '22:00',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        },
        image_url: 'https://res.cloudinary.com/deasyoglq/image/upload/v1753684481/njeri_i7nxbj.jpg'
      },
      {
        name: 'Ann',
        role: 'Braiding Expert',
        email: 'ann@vipqueenssalon.com',
        phone: '0723456789',
        specialties: ['Hair Braiding'],
        working_hours: {
          start: '06:00',
          end: '22:00',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        },
        image_url: 'https://res.cloudinary.com/deasyoglq/image/upload/v1753684481/ann_qcjpxg.jpg'
      },
      {
        name: 'Rachael',
        role: 'Nail Technician',
        email: 'rachael@vipqueenssalon.com',
        phone: '0734567890',
        specialties: ['Nail Services'],
        working_hours: {
          start: '06:00',
          end: '22:00',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        image_url: 'https://res.cloudinary.com/deasyoglq/image/upload/v1753684481/rachael_r0w9s6.jpg'
      }
    ])
  }
}

// API Route handlers
const handleServices = async () => {
  try {
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('category, name')

    if (error) throw error

    return new Response(JSON.stringify({
      success: true,
      data: services.map(service => ({
        id: service.id,
        name: service.name,
        category: service.category,
        price: { min: service.price_min, max: service.price_max },
        duration: `${Math.floor(service.duration_minutes / 60)} hour${Math.floor(service.duration_minutes / 60) !== 1 ? 's' : ''}${service.duration_minutes % 60 ? ` ${service.duration_minutes % 60} mins` : ''}`,
        durationMinutes: service.duration_minutes,
        description: service.description
      }))
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

const handleStaff = async () => {
  try {
    const { data: staff, error } = await supabase
      .from('staff')
      .select('*')
      .eq('is_available', true)
      .order('name')

    if (error) throw error

    return new Response(JSON.stringify({
      success: true,
      data: staff.map(member => ({
        id: member.id,
        name: member.name,
        role: member.role,
        specialties: member.specialties || [],
        workingHours: member.working_hours,
        image: member.image_url,
        isAvailable: member.is_available
      }))
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

const handleAvailability = async (url: URL) => {
  try {
    const date = url.searchParams.get('date')
    const staffId = url.searchParams.get('staff_id')
    const durationMinutes = parseInt(url.searchParams.get('duration_minutes') || '60')

    if (!date || !staffId) {
      throw new Error('Date and staff_id are required')
    }

    // Get staff working hours
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('working_hours')
      .eq('id', staffId)
      .single()

    if (staffError) throw staffError

    // Get existing bookings for the date and staff
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('booking_time, end_time')
      .eq('booking_date', date)
      .eq('staff_id', staffId)
      .in('status', ['confirmed', 'pending'])

    if (bookingsError) throw bookingsError

    // Generate available time slots
    const availableSlots = generateTimeSlots(staff.working_hours, bookings, durationMinutes, date)

    return new Response(JSON.stringify({
      success: true,
      data: availableSlots
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

const generateTimeSlots = (workingHours: any, existingBookings: any[], durationMinutes: number, date: string) => {
  const slots = []
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' })
  
  if (!workingHours.days.includes(dayOfWeek)) {
    return slots
  }

  const [startHour, startMin] = workingHours.start.split(':').map(Number)
  const [endHour, endMin] = workingHours.end.split(':').map(Number)
  
  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin
  
  // Generate slots every hour
  for (let minutes = startMinutes; minutes <= endMinutes - durationMinutes; minutes += 60) {
    const slotHour = Math.floor(minutes / 60)
    const slotMin = minutes % 60
    const slotTime = `${slotHour.toString().padStart(2, '0')}:${slotMin.toString().padStart(2, '0')}`
    
    // Check if this slot conflicts with existing bookings
    const hasConflict = existingBookings.some(booking => {
      const bookingStart = timeToMinutes(booking.booking_time)
      const bookingEnd = timeToMinutes(booking.end_time)
      const slotEnd = minutes + durationMinutes
      
      return (minutes < bookingEnd && slotEnd > bookingStart)
    })
    
    if (!hasConflict) {
      // Format for display
      const displayTime = new Date(2000, 0, 1, slotHour, slotMin).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
      slots.push(displayTime)
    }
  }
  
  return slots.slice(0, 8) // Limit to 8 slots
}

const timeToMinutes = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

const handleCreateBooking = async (request: Request) => {
  try {
    const bookingData = await request.json()
    
    // Validate required fields
    const required = ['customerName', 'customerPhone', 'serviceId', 'staffId', 'date', 'time']
    for (const field of required) {
      if (!bookingData[field]) {
        throw new Error(`${field} is required`)
      }
    }

    // Get service details
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', bookingData.serviceId)
      .single()

    if (serviceError) throw serviceError

    // Get staff details
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('*')
      .eq('id', bookingData.staffId)
      .single()

    if (staffError) throw staffError

    // Calculate end time
    const startMinutes = timeToMinutes(bookingData.time)
    const endMinutes = startMinutes + service.duration_minutes
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`

    // Check for conflicts
    const { data: conflicts, error: conflictError } = await supabase
      .from('bookings')
      .select('id')
      .eq('booking_date', bookingData.date)
      .eq('staff_id', bookingData.staffId)
      .in('status', ['confirmed', 'pending'])
      .or(`booking_time.lte.${bookingData.time},end_time.gte.${bookingData.time}`)

    if (conflictError) throw conflictError
    if (conflicts && conflicts.length > 0) {
      throw new Error('Time slot is no longer available')
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        customer_name: bookingData.customerName,
        customer_phone: bookingData.customerPhone,
        customer_email: bookingData.customerEmail,
        service_id: service.id,
        service_name: service.name,
        service_category: service.category,
        price: bookingData.price || service.price_min,
        staff_id: staff.id,
        staff_name: staff.name,
        booking_date: bookingData.date,
        booking_time: bookingData.time,
        end_time: endTime,
        duration_minutes: service.duration_minutes,
        status: 'confirmed',
        booking_method: bookingData.bookingMethod || 'website',
        notes: bookingData.notes
      }])
      .select()
      .single()

    if (bookingError) throw bookingError

    // Send notifications
    await sendNotifications(booking, service, staff)

    return new Response(JSON.stringify({
      success: true,
      data: {
        id: booking.id,
        customerName: booking.customer_name,
        customerPhone: booking.customer_phone,
        service: booking.service_name,
        stylistName: booking.staff_name,
        date: booking.booking_date,
        time: booking.booking_time,
        price: booking.price,
        status: booking.status,
        bookingMethod: booking.booking_method
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

const sendNotifications = async (booking: any, service: any, staff: any) => {
  try {
    // Format booking details
    const bookingDetails = {
      customer: booking.customer_name,
      phone: booking.customer_phone,
      service: service.name,
      staff: staff.name,
      date: booking.booking_date,
      time: booking.booking_time,
      price: booking.price,
      bookingId: booking.id
    }

    // In a real implementation, you would send actual notifications here
    // For now, we'll just log them
    console.log('Notifications sent for booking:', bookingDetails)
    
    // You could integrate with:
    // - WhatsApp Business API
    // - SMS service like Twilio
    // - Email service like SendGrid
    // - Push notifications
    
  } catch (error) {
    console.error('Notification error:', error)
  }
}

const handleGetBookings = async () => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return new Response(JSON.stringify({
      success: true,
      data: bookings.map(booking => ({
        id: booking.id,
        customerName: booking.customer_name,
        customerPhone: booking.customer_phone,
        customerEmail: booking.customer_email,
        service: booking.service_name,
        serviceCategory: booking.service_category,
        price: booking.price,
        duration: `${Math.floor(booking.duration_minutes / 60)} hour${Math.floor(booking.duration_minutes / 60) !== 1 ? 's' : ''}${booking.duration_minutes % 60 ? ` ${booking.duration_minutes % 60} mins` : ''}`,
        stylistId: booking.staff_id,
        stylistName: booking.staff_name,
        date: booking.booking_date,
        time: booking.booking_time,
        status: booking.status,
        bookingMethod: booking.booking_method,
        notes: booking.notes,
        createdAt: booking.created_at,
        updatedAt: booking.updated_at
      }))
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

const handleUpdateBooking = async (request: Request, url: URL) => {
  try {
    const bookingId = url.pathname.split('/').pop()
    const updates = await request.json()

    const { data: booking, error } = await supabase
      .from('bookings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single()

    if (error) throw error

    return new Response(JSON.stringify({
      success: true,
      data: booking
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const path = url.pathname

  try {
    // Initialize database on first request
    if (path === '/init') {
      await initializeDatabase()
      return new Response(JSON.stringify({ success: true, message: 'Database initialized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Route handlers
    switch (true) {
      case path === '/services':
        return await handleServices()
        
      case path === '/staff':
        return await handleStaff()
        
      case path === '/availability':
        return await handleAvailability(url)
        
      case path === '/bookings/create' && req.method === 'POST':
        return await handleCreateBooking(req)
        
      case path === '/bookings' && req.method === 'GET':
        return await handleGetBookings()
        
      case path.startsWith('/bookings/') && req.method === 'PUT':
        return await handleUpdateBooking(req, url)
        
      default:
        return new Response(JSON.stringify({
          success: false,
          error: 'Endpoint not found'
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})