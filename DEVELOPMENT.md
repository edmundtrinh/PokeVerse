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
- **New Architecture**: Disabled (`newArchEnabled: false`) - prevents Fast Refresh issues
- **Metro Bundler**: Custom config with localhost URL rewriting for reliability
- **Platform**: iOS simulator recommended for primary development
- **Watchman**: Fixed with proper watch deletion/recreation
- **Babel**: Simplified config without NativeWind plugin (was breaking Fast Refresh)

## ⚠️ CRITICAL: Fast Refresh Troubleshooting

**If Fast Refresh stops working after ANY config change:**

1. **Kill everything and fix watchman:**
   ```bash
   pkill -f expo; pkill -f metro
   watchman watch-del '/Users/edmundtrinh/Documents/Projects/PokeVerse'
   watchman watch-project '/Users/edmundtrinh/Documents/Projects/PokeVerse'
   npm run ios:dev
   ```

2. **Check babel.config.js - MUST be minimal:**
   ```js
   module.exports = function (api) {
     api.cache(true);
     return {
       presets: ['babel-preset-expo'],
       plugins: ['react-native-reanimated/plugin'], // Must be last
     };
   };
   ```

3. **No CSS imports in App.tsx** - breaks Fast Refresh

4. **Verify metro.config.js exists** with localhost URL rewriting

---

## Recent Bug Fixes & Improvements (September 2025)

### ✅ Latest Fixes Applied:

1. **Form Buttons Layout Fixed**
   - Added `maxHeight: 160` to form cards to prevent vertical stretching
   - Form buttons now stay within screen bounds

2. **Pokemon Display Names Cleaned**
   - Created `cleanPokemonName()` function
   - Deoxys shows as "Deoxys" instead of "Deoxys Normal"
   - Removes "-normal" suffixes from base form displays

3. **Duplicate Pokemon Results Eliminated**
   - Added deduplication logic in `getPokemons()` API function
   - Filters out Pokemon with IDs > 1025 (forms beyond main series)
   - Only keeps first occurrence of each unique Pokemon ID
   - No more multiple Mudkip, Rayquaza, Ralts in search results

4. **Sprite Version Dropdown Filtering**
   - Already implemented and working correctly
   - Disables sprite versions when sprites aren't available for that Pokemon
   - Uses `getSprite()` function to check availability
   - Styles disabled options with reduced opacity

### Hot Reload Status: ✅ FULLY WORKING
- App auto-recompiles on file save
- Fast Refresh preserves component state
- Changes reflect immediately in simulator
- Use `npm run ios:dev` for development with cache clearing

---

## Critical Troubleshooting Guide (September 2025 Session)

### 🚨 **Metro Bundler "Disconnected" Error - THE #1 ISSUE**

**Symptoms**: Simulator shows "Disconnected from Metro (1001: 'Stream end encountered')" with call stack

**Why this happens**:
- Metro bundler restarts but simulator keeps old connection
- Very common in React Native development - NOT a bug
- Happens after cache clearing, process kills, or Metro crashes

**SOLUTION** (Standard RN Developer Workflow):
```bash
# 1. Kill all Metro processes
pkill -f expo && pkill -f metro

# 2. Restart Metro fresh
npm run ios:dev

# 3. CRITICAL STEP: In simulator, do Cmd+D → "Reload"
# This reconnects simulator to new Metro instance
```

**Alternative**: Force close app in simulator, reopen from home screen

**Prevention**: Use `npm run ios:dev` which includes cache clearing from start

### 🔍 **Pokemon API Data Issues & Solutions**

**Problem**: Multiple Pokemon showing in search (4 Deoxys, 4 Mudkip, etc.)
**Root Cause**: PokeAPI returns alternate forms as separate entries:
- `deoxys-normal`, `deoxys-attack`, `deoxys-defense`, `deoxys-speed`
- `mudkip` variants from different regions/generations

**Solution Implemented**: Enhanced deduplication in `src/api/pokeApi.ts`
```javascript
// Comprehensive form suffix removal
const baseName = pokemon.name.replace(
  /-normal$|-attack$|-defense$|-speed$|-origin$|-sky$|-heat$|-wash$|-frost$|-fan$|-mow$|-altered$|-plant$|-sandy$|-trash$|-10-percent$|-50-percent$|-complete$|-red-meteor$|-orange-meteor$|-yellow-meteor$|-green-meteor$|-blue-meteor$|-indigo-meteor$|-violet-meteor$/i,
  ''
);
```

**Key Decision**: Filter at API level, not UI level for better performance

### 📱 **React Native Layout Issues with Pokemon Forms**

**Problem**: Pokemon detail pages with forms showed only form buttons, content cut off
**Root Cause**: Forms section with no height constraints pushed main content off-screen

**Solution**: Multi-level height constraints
```javascript
// Parent container
formsSection: {
  maxHeight: 180,
  marginVertical: 16, // Reduced from 20
}

// Horizontal ScrollView
<ScrollView style={{ maxHeight: 150 }}>

// Individual form cards
formCard: {
  maxHeight: 160,
  width: 140,
}
```

**Key Lesson**: React Native layouts need explicit height limits for scrollable content

### ⚙️ **Component State Management Decisions**

**Issue**: Settings button (TM disk icon) stopped working after prop cleanup
**Root Cause**: Removed settings modal state props but button still tried to call them
**Decision**: Keep modal state in parent (App.tsx) for better UX consistency

**Why**: Parent-managed modals:
- Maintain state across navigation
- Better accessibility
- Consistent with React Native patterns

### 🎨 **Pokemon Display Name Strategy**

**Problem**: Pokemon showing as "Deoxys Normal" instead of clean "Deoxys"
**Solution**: Created `cleanPokemonName()` utility
```javascript
const cleanPokemonName = (name: string): string => {
  // Remove "-normal" suffix, replace remaining hyphens with spaces
  const cleanedName = name.replace(/-normal$/i, '');
  return cleanedName.replace('-', ' ');
};
```

**Key Decision**: Clean names for UI display only, preserve original for API calls

### 🚀 **Fast Refresh Optimization Findings**

**What Works Perfect with Fast Refresh**:
- Style changes (colors, spacing, dimensions)
- Component logic modifications
- State management updates
- API function changes

**What Requires Manual Reload**:
- New imports or dependencies
- Navigation structure changes
- Metro config modifications
- Environment variables

**Optimal Workflow Discovered**:
1. Make changes → Save
2. Changes appear instantly (no manual reload needed)
3. If stuck: `Cmd+D → Reload` in simulator
4. If really stuck: Kill Metro + restart + reload

### 📝 **Git Workflow Decisions**

**Files to Commit**: App logic, components, API changes, documentation
**Files to Exclude**: `.claude/settings.local.json` (development-only permissions)
**Commit Style**: Concise summary + detailed bullet points matching project pattern

### 🔧 **Development Environment Optimizations**

**Metro Config**: Localhost URL rewriting for stable Fast Refresh
**Scripts**: `npm run ios:dev` includes cache clearing
**Reset Script**: `./scripts/dev-reset.sh --full` for complete environment reset
**Port Management**: Kill processes on 8081 when stuck

---

## Session Summary - September 26, 2025

**Major Issues Resolved**:
✅ Metro connection problems
✅ Duplicate Pokemon search results
✅ Pokemon detail page layout
✅ Settings button functionality
✅ Fast Refresh workflow optimization

**Key Technical Decisions**:
- API-level deduplication over UI filtering
- Height-constrained forms sections
- Parent-managed modal state
- Clean display names with preserved API names
- Comprehensive Metro troubleshooting workflow

**Development Workflow Established**:
- Reliable Fast Refresh with localhost Metro
- Standard RN developer Metro restart procedure
- Proper git commit strategy excluding dev files

*Last updated: September 26, 2025 - Complete troubleshooting guide added*