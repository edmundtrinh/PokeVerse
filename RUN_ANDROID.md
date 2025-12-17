# Running PokeVerse on Android Emulator

## Prerequisites Checklist

- [ ] Android Studio installed
- [ ] Android SDK installed (API Level 33 recommended)
- [ ] Android Virtual Device (AVD) created
- [ ] ANDROID_HOME environment variable set
- [ ] Platform-tools added to PATH
- [ ] Terminal/VS Code restarted after setting environment variables

## Quick Start Commands

### Option 1: Start Emulator First (Recommended)

```powershell
# Start your Android emulator from Android Studio Device Manager
# OR from command line:
emulator -avd <your_avd_name>

# Then in your project directory:
cd 'c:\Users\ETrinh1\OneDrive - T-Mobile USA\Documents\PokeVerse'
npm run android
```

### Option 2: Let Expo Start Emulator

```powershell
cd 'c:\Users\ETrinh1\OneDrive - T-Mobile USA\Documents\PokeVerse'
npm run android
# This will automatically start your default AVD if none is running
```

### Development Commands

```powershell
# Standard run (with cache)
npm run android

# Development run (clear cache)
npm run android:dev

# Just start Expo dev server
npm start
# Then press 'a' to open on Android
```

## Troubleshooting

### Emulator Not Found

```powershell
# List available AVDs
emulator -list-avds

# Start specific AVD
emulator -avd <name_from_list>
```

### Port Already in Use

```powershell
# Kill process on port 8081
netstat -ano | findstr :8081
taskkill /PID <PID_NUMBER> /F

# Or restart with different port
npx expo start --port 8082
```

### ADB Issues

```powershell
# Restart ADB server
adb kill-server
adb start-server

# Check connected devices
adb devices
```

### Build Errors

```powershell
# Clean and rebuild
npm run android:dev

# If that doesn't work, full clean:
cd android
.\gradlew clean
cd ..
npm run android
```

### Fast Refresh Not Working

1. Open Developer Menu (Ctrl+M in emulator)
2. Enable "Fast Refresh"
3. Or reload app: Press 'r' in terminal or shake device

## First Time Setup Verification

After setup, verify everything works:

```powershell
# Check Android SDK
echo $env:ANDROID_HOME
# Should output: C:\Users\ETrinh1\AppData\Local\Android\Sdk

# Check ADB
adb --version
# Should show version number

# Check emulator
emulator -list-avds
# Should list your created AVDs

# Check devices
adb devices
# Should show your running emulator when it's started
```

## Performance Tips

1. **Enable Hardware Acceleration**: In AVD settings, ensure Graphics is set to "Hardware - GLES 2.0"
2. **Allocate More RAM**: Give your AVD at least 2048 MB RAM
3. **Use Cold Boot**: In AVD settings, set "Boot option" to "Cold boot" for stability
4. **Keep Emulator Running**: Don't close emulator between development sessions

## Developer Menu

Access it by pressing **Ctrl+M** in the emulator or run:
```powershell
adb shell input keyevent 82
```

Available options:
- Reload
- Debug
- Enable/Disable Fast Refresh
- Show Performance Monitor
- Toggle Inspector
