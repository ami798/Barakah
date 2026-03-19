# Barakah Lanterns

A spiritual wellness app for releasing intentions, journaling emotions, and connecting with community wisdom.

## Features

### 🏮 Lantern Garden
Release intentions and watch them float in your personal garden. Each lantern glows with a brightness level you can increase through meditation or reflection, eventually releasing after 40 days.

### 💌 Sealed Letters
Write messages to your future self and seal them until February 8, 2027. Track the countdown to your unlock date with a beautiful crescent meter.

### 📔 Heart Journal
Daily emotional check-ins with mood tracking and heart-level indicators. Maintain a streak of continuous reflection and track your emotional journey over time.

### ✨ Dashboard
Comprehensive statistics about your wellness journey including streaks, completion rates, average mood levels, and data export capabilities.

### 🔮 Echo Whispers
Share wisdom and inspiration with the community. Browse, like, and contribute to a collection of uplifting messages organized by category (wisdom, reflection, inspiration, healing).

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS 4 with custom design tokens
- **Animations**: Framer Motion
- **Storage**: Browser localStorage (offline-first)
- **Type Safety**: TypeScript
- **PWA**: Service Worker for offline support

## Getting Started

### Installation

```bash
# Using shadcn CLI (recommended)
npx shadcn-cli@latest init

# Or clone and install manually
npm install
# or
pnpm install
```

### Development

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
# or
pnpm build
pnpm start
```

## Project Structure

```
├── app/
│   ├── page.tsx              # Home/Garden page
│   ├── letter/page.tsx       # Sealed letters
│   ├── journal/page.tsx      # Heart journal
│   ├── dashboard/page.tsx    # Statistics dashboard
│   ├── echoes/page.tsx       # Community wisdom
│   ├── layout.tsx            # Root layout with PWA
│   └── globals.css           # Design tokens
├── components/
│   ├── Lantern.tsx           # Animated lantern component
│   ├── CrescentMeter.tsx     # Moon progress meter
│   ├── IntentionModal.tsx    # Letter/intention input
│   ├── JournalEntry.tsx      # Journal entry display
│   ├── BottomNavigation.tsx  # Mobile navigation
│   ├── PWAProvider.tsx       # PWA initialization
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── storage.ts            # localStorage utilities
│   ├── helpers.ts            # Utility functions
│   ├── pwa.ts                # PWA features
│   └── utils.ts              # Tailwind utilities
└── public/
    ├── sw.js                 # Service worker
    ├── manifest.json         # PWA manifest
    └── icons/                # App icons
```

## Color Scheme

- **Background**: Deep Navy (#0a1428)
- **Primary**: Warm Gold (#f59e0b)
- **Secondary**: Emerald Green (#10b981)
- **Accent**: Gold with gradients

## Data Structure

All data is stored in browser localStorage:

```typescript
// Lantern
{
  id: string
  intention: string
  brightness: 0-100
  releaseDate: ISO date string
  createdAt: ISO date string
  isReleased: boolean
  streak: number
}

// Letter
{
  id: string
  content: string
  sealedDate: ISO date string
  unlockDate: "2027-02-08"
  isOpened: boolean
}

// JournalEntry
{
  id: string
  date: ISO date string
  heartLevel: 1-5
  note: string
  mood: 'radiant' | 'calm' | 'contemplative' | 'restless' | 'heavy'
  tags: string[]
}

// EchoWhisper
{
  id: string
  content: string
  author: string
  createdAt: ISO date string
  likes: number
  category: 'wisdom' | 'reflection' | 'inspiration' | 'healing'
}
```

## Features Breakdown

### Offline Support
- Service Worker enables full offline functionality
- All data persists in localStorage
- Background sync when reconnected (extensible)

### PWA Ready
- Installable on iOS and Android
- Standalone app experience
- Manifest with app shortcuts
- Maskable icons for adaptive displays

### Animations
- Smooth page transitions with Framer Motion
- Floating lantern animations
- Glowing effects on interactive elements
- Respectful of `prefers-reduced-motion` settings

### Accessibility
- WCAG 2.1 Level AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast colors
- Semantic HTML structure

## Future Enhancements

- Backend sync for data persistence across devices
- Multi-device synchronization
- Social features and community
- Meditation and guided practices
- Reminder notifications
- Data analytics and insights
- Theme customization
- Multi-language support

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS 12+, Android 7+

## Performance

- Optimized for mobile-first experience
- Lazy loading of components
- Efficient animations with GPU acceleration
- Minimal bundle size (Core Web Vitals optimized)

## Security

- No sensitive data sent to external servers
- All data stored locally in browser
- HTTPS recommended for deployment
- Content Security Policy headers

## License

MIT License - Free to use and modify

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## Support

For issues, questions, or suggestions, please open an issue or contact the community through the Echo Whispers section of the app.

---

Made with intention and care. ✨🌙
