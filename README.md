# Asura LifeTracker - Frontend

A personal development tracking application built with React, TypeScript, and Vite.

## 🚀 Quick Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Connect this GitHub repository
3. Add environment variable: `VITE_API_URL` = your backend URL + `/api`
4. Deploy!

## ✨ Features

- 📊 Track hours across multiple activities (Boxing, Gym, Music, Languages)
- 🎯 Daily activity checklist with streak tracking
- 🏆 Gamification system (XP, levels, achievements, challenges)
- 📈 Progress visualization with charts
- 🎨 Beautiful dark-themed UI
- 💾 Per-user data persistence via backend API
- 📱 Responsive design

## 🛠️ Technology Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand with persist middleware
- **Charts**: MUI X Charts
- **Icons**: Lucide React

## 📋 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-backend.railway.app/api` |

## 🏃 Local Development

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local and set VITE_API_URL

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (Auth, Theme)
├── hooks/          # Custom React hooks
├── lib/            # Utilities and stores
├── pages/          # Page components
└── App.tsx         # Main app component
```

## 🔗 Related

- [Backend Repository](https://github.com/mstfa13/asura-backend) - API server

## 📄 License

MIT
