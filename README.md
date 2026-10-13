# Apple Music UI · Liquid Glass

Next.js recreation of the Apple Music player with **Liquid Glass** visual treatment inspired by Apple’s iOS 26 design language.

> **Note on the official docs**  
> The official Kotlin Multiplatform guide ([Liquid Glass in a Compose Multiplatform app](https://kotlinlang.org/docs/multiplatform/ios-liquid-glass.html)) explains how to adopt the *native* system material on iOS by wrapping Compose screens inside SwiftUI `TabView` / `NavigationStack`.  
> This project is a **web** (Next.js) app, so the real system material is not available. Instead we use a high-fidelity CSS approximation that follows the same visual principles documented by Apple and the community:

- Translucent surface (`rgba` + high saturation)
- `backdrop-filter: blur() saturate() brightness() contrast()`
- Specular top-edge highlight (`inset box-shadow`)
- Soft outer depth + subtle chromatic feel via gradients
- Animated ambient background so the glass “refracts” visible content

## Features

- Liquid Glass player card
- Album art with glass frame + playing scale animation
- Glass chips for controls
- Synchronized karaoke-style lyrics
- Keyboard spacebar play/pause
- Static export ready for Capacitor

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build for web

```bash
npm run build
# static files land in /out
```

## Android APK (Capacitor + GitHub Actions)

### One-time local setup (optional)

```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android   # opens Android Studio
```

### GitHub Actions

1. Push this repo to GitHub.
2. Go to **Actions → Build Android APK → Run workflow**.
3. Download the APK artifact (`apple-music-liquid-glass-debug`).

You can also trigger a release by pushing a tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

The workflow builds a **debug** APK (no signing secrets required). For a signed release APK add your keystore as repository secrets and extend the Gradle signing config.

## Project structure

```
app/
  page.tsx          # Liquid background + player
  globals.css       # Liquid Glass CSS system
  layout.tsx
  api/lyrics/       # LRC parser endpoint
components/
  Music.tsx         # Main player (glass classes)
public/             # Audio, poster, lyrics
capacitor.config.ts
.github/workflows/build-android-apk.yml
```

## Credits

- Song: Boney M. – Rasputin
- Liquid Glass inspiration: Apple iOS 26 + community CSS approximations
- Official KMP reference: https://kotlinlang.org/docs/multiplatform/ios-liquid-glass.html
