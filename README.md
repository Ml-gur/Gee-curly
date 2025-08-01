# VIP Queens Salon Website

A modern, responsive website for VIP Queens Salon - the premier beauty salon in Nairobi, Kenya.

## Features

- **Modern Design**: Pearl Rose & Champagne Silk color palette with elegant animations
- **Responsive Layout**: Mobile-first design that works perfectly on all devices
- **Interactive Components**: Animated galleries, testimonial carousels, and booking forms
- **Professional Portals**: Separate staff and owner management dashboards
- **WhatsApp Integration**: Direct booking and communication through WhatsApp
- **Performance Optimized**: Fast loading with optimized images and code splitting

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v3
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vip-queens-salon
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Vercel will automatically detect it's a Vite project
3. Deploy with default settings

The `vercel.json` configuration is already set up for optimal deployment.

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Upload the `dist` folder to your hosting provider

## Project Structure

```
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles and Tailwind CSS
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── figma/          # Figma-specific components
├── utils/              # Utility functions
├── styles/             # Additional stylesheets
└── public/             # Static assets
```

## Components

### Main Sections
- **Hero**: Animated landing section with image slider
- **Services**: Professional beauty services showcase
- **Gallery**: Before/after transformations with expandable preview
- **Team**: Meet our expert stylists
- **Booking**: Appointment booking with staff selection
- **Contact**: Multiple ways to get in touch

### Management Portals
- **Staff Portal**: For stylists to manage their appointments
- **Owner Portal**: Complete business management dashboard

## Customization

### Colors
The color palette is defined in `src/index.css` and can be customized by updating the CSS variables:

```css
:root {
  --pearl-rose: #f4c2c2;
  --pearl-rose-dark: #d63384;
  --champagne-silk: #f5e6d3;
  --champagne-silk-dark: #d4a574;
  /* ... */
}
```

### Fonts
- **Primary**: Inter (body text)
- **Logo**: Dancing Script (decorative)

## Business Information

- **Name**: VIP Queens Salon
- **Location**: Ronald Ngala Street, RNG Plaza 2nd floor S41, Nairobi
- **Phone**: 0718 779 129
- **Hours**: Mon-Sat 6AM-10PM, Sun 9AM-6PM
- **Social**: @vipqueenssalon (Instagram, TikTok)

## License

This project is proprietary software for VIP Queens Salon.

## Support

For technical support or questions about the website, please contact the development team.#   G e e - c u r l y  
 