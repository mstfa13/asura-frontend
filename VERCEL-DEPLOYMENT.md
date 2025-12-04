# Vercel Deployment Guide

## Quick Deploy

### Option 1: Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy from project root:
```bash
vercel
```

3. Follow the prompts:
   - Set up and deploy: **Yes**
   - Which scope: Select your account
   - Link to existing project: **No** (first time)
   - Project name: **asura-web** (or your preference)
   - Directory: **./** (current directory)
   - Override settings: **No**

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite configuration
6. Click "Deploy"

## Configuration Details

The project is already configured with:
- ✅ `vercel.json` - Deployment configuration
- ✅ `package.json` - Build scripts 
- ✅ SPA routing support
- ✅ PWA manifest and service worker
- ✅ Static asset optimization

## Build Details

- **Framework**: Vite (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x (default)

## Post-Deployment

After deployment:
1. Your app will be available at `https://your-project.vercel.app`
2. You can add a custom domain in Vercel dashboard
3. The app works as a PWA - users can install it on mobile
4. All routes are handled by client-side routing

## Environment Variables (if needed)

If you add any environment variables later:
1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Add variables with `VITE_` prefix to make them available in the app

## Troubleshooting

- **Build fails**: Check that all dependencies are in `package.json`
- **404 on refresh**: Vercel.json handles SPA routing automatically
- **Assets not loading**: Check that imports use relative paths

Your Asura app is ready to deploy! 🚀