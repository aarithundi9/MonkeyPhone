# thumb speed

> how fast do u actually text

A mobile-first typing speed test PWA built for phone keyboards. Think MonkeyType, but with texts and slang.

## Features

- **15s / 30s / 60s** timed modes
- 75 prompts across 5 vibe categories (hype, confused, making plans, drama, late night)
- Live WPM + accuracy counter
- MonkeyType-style character-by-character feedback
- High scores saved per mode in localStorage
- Web Share API for sharing results
- Installable as PWA on iPhone and Android
- Works offline after first load

---

## Local Dev

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser (or on your phone via your local IP).

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project → select your repo
3. Framework: **Vite** (auto-detected)
4. Click Deploy — done

The `vercel.json` SPA rewrite rule is already included so React Router routes work correctly.

---

## Install as PWA

### iPhone (Safari)
1. Open the deployed URL in Safari
2. Tap the **Share** button (box with arrow)
3. Scroll down and tap **Add to Home Screen**
4. Tap **Add**

### Android (Chrome)
1. Open the deployed URL in Chrome
2. Tap the **three-dot menu** in the top right
3. Tap **Add to Home screen** or **Install app**
4. Tap **Install**

Once installed, the app opens fullscreen without the browser UI, like a native app.

---

## Stack

- React 18 + Vite 5
- Tailwind CSS v3
- vite-plugin-pwa (Workbox service worker)
- React Router v6
- No backend, no database — localStorage only
