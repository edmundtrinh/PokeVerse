#!/bin/bash

# PokeVerse Development Reset Script
# Fixes Metro bundler cache issues and slow startup times

echo "🧹 Cleaning development environment..."

# Kill any running Metro/Expo processes
echo "Stopping Metro bundler..."
pkill -f "expo\|metro" 2>/dev/null || true

# Reset Watchman file watching
echo "Resetting Watchman..."
watchman watch-del-all

# Clear Metro bundler caches
echo "Clearing Metro cache..."
rm -rf $TMPDIR/react-native-packager-cache-* $TMPDIR/metro-bundler-cache-* ~/.metro 2>/dev/null || true

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force 2>/dev/null || true

# Clean and reinstall dependencies if needed
if [ "$1" = "--full" ]; then
  echo "Full reset: Reinstalling dependencies..."
  rm -rf node_modules
  npm install
fi

echo "✅ Environment reset complete!"
echo "🚀 Starting Expo with clean cache..."

# Start with cache reset
npx expo start --localhost --reset-cache