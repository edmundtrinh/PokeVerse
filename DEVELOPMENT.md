# PokeVerse Development Guide

## Fast Refresh Setup (IMPORTANT!)

Fast Refresh is essential for React Native development but can be finicky. Follow these steps for reliable hot reloading:

### ✅ Recommended Commands

**For iOS Simulator (Primary Development):**
```bash
npm run ios        # Start with iOS simulator + localhost
npm run ios:dev    # Same as above but with cleared cache
```

**For Android Emulator:**
```bash
npm run android    # Start with Android emulator + localhost  
npm run android:dev # Same as above but with cleared cache
```

**For Physical Device (when QR code needed):**
```bash
npm run tunnel     # Creates public URL for physical devices
```

**For Web Development:**
```bash
npm run web        # Web-only development
```

### 🚫 Commands to AVOID

- `npx expo start` (without --localhost) → Uses LAN URL, breaks Fast Refresh
- `expo start --ios` (without --localhost) → Same issue
- Any command that creates `exp://10.0.0.x:8081` URLs

### 🔧 Troubleshooting Fast Refresh

If Fast Refresh stops working:

1. **Check the URL in terminal:**
   - ✅ Good: `exp://127.0.0.1:8081` or `exp://localhost:8081`
   - ❌ Bad: `exp://10.0.0.15:8081` (LAN URL)

2. **Open Developer Menu in simulator:**
   - iOS: `Cmd+D` or `Device > Shake`
   - Android: `Cmd+M` or shake device
   - Ensure "Fast Refresh" is enabled

3. **If still broken:**
   ```bash
   # Kill all processes and restart fresh
   pkill -f expo; pkill -f metro
   npm run ios:dev
   ```

4. **Nuclear option (if nothing works):**
   ```bash
   # Clear all caches
   npx expo start --clear --localhost --ios
   # Or use the npm script
   npm run ios:dev
   ```

### 🎯 Why localhost works better

- **Localhost URLs are stable** - don't change when network changes
- **Better Metro bundler connection** - more reliable websocket for hot reloading  
- **Faster bundle updates** - local connections are faster than LAN
- **No network interference** - works even with VPN/firewall issues

### 📱 Physical Device Testing

When you need to test on a physical device:

1. **Use tunnel mode:** `npm run tunnel`
2. **Scan QR code** with Expo Go app
3. **Note:** Tunnel mode is slower but more reliable for physical devices

### ⚡ Fast Development Workflow

1. **Start once:** `npm run ios`
2. **Make code changes** - they should appear instantly
3. **If changes don't appear:** Check dev menu → ensure Fast Refresh is on
4. **If still broken:** `npm run ios:dev` (clears cache)

### 🔍 Debugging Tips

- Fast Refresh works for most changes but **not** for:
  - New imports/dependencies (need full reload)
  - Changes to app.json or configuration files
  - Some hook changes (especially state initialization)
  
- If you see **red screen errors**, Fast Refresh is temporarily broken until fixed

- **Syntax errors** will pause Fast Refresh until resolved

---

## Key Development Commands

| Command | Purpose |
|---------|---------|
| `npm run ios` | Primary development with iOS simulator |
| `npm run ios:dev` | Fresh start with cleared cache |
| `npm run android` | Android development |
| `npm run tunnel` | Physical device testing |
| `npm run web` | Web-only testing |

## Configuration Notes

- **Fast Refresh**: Enabled by default in localhost mode
- **New Architecture**: Enabled (`newArchEnabled: true`) - may cause some Fast Refresh issues
- **Metro Bundler**: Uses localhost for reliability
- **Platform**: iOS simulator recommended for primary development

---

*Last updated: Latest session - Fast Refresh reliability fixes*