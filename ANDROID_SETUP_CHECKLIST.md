# Android Studio Setup Checklist

## ✅ Step-by-Step Setup Guide

### 1️⃣ Install Android Studio (In Progress)
- [ ] Download from https://developer.android.com/studio
- [ ] Run installer
- [ ] Select these components during installation:
  - [ ] Android SDK
  - [ ] Android SDK Platform
  - [ ] Android Virtual Device
  - [ ] Performance (Intel HAXM or Hyper-V)

---

### 2️⃣ First Launch Setup (After Installation)
- [ ] Open Android Studio
- [ ] Complete the Setup Wizard
- [ ] Choose "Standard" installation type
- [ ] Wait for all downloads to complete

---

### 3️⃣ Install Required SDK Components

**Open SDK Manager:**
- [ ] Click **More Actions** → **SDK Manager** (or Tools → SDK Manager)

**In "SDK Platforms" tab:**
- [ ] Check **Android 13.0 (Tiramisu)** - API Level 33 ✨ RECOMMENDED
- [ ] Check **Android SDK Platform 33**
- [ ] Click "Apply" to install

**In "SDK Tools" tab:**
- [ ] Check **Android SDK Build-Tools**
- [ ] Check **Android SDK Platform-Tools**
- [ ] Check **Android Emulator**
- [ ] Check **Android SDK Tools** (if available)
- [ ] Click "Apply" to install

**Note the SDK Location** (top of SDK Manager window):
- Usually: `C:\Users\ETrinh1\AppData\Local\Android\Sdk`
- Write it down: _________________________________

---

### 4️⃣ Create Virtual Device (Emulator)

- [ ] Click **More Actions** → **Device Manager** (or Tools → Device Manager)
- [ ] Click the **'+'** button (or **Create Device** button)
- [ ] Select a device (recommended: **Pixel 5** or **Pixel 6**)
- [ ] Click **Next**
- [ ] Select system image: **Android 13.0 (API 33)** with Google APIs
- [ ] Download the system image if needed (click Download button)
- [ ] Click **Next**
- [ ] Name your AVD (e.g., "Pixel_5_API_33")
- [ ] Optional: Click "Show Advanced Settings"
  - [ ] Set RAM to 2048 MB or higher
  - [ ] Graphics: Hardware - GLES 2.0
- [ ] Click **Finish**

---

### 5️⃣ Set Environment Variables

**Open System Environment Variables:**
1. [ ] Press `Win + X`
2. [ ] Click **System**
3. [ ] Click **Advanced system settings** (right side)
4. [ ] Click **Environment Variables** button

**Add ANDROID_HOME:**
1. [ ] Under "System variables", click **New**
2. [ ] Variable name: `ANDROID_HOME`
3. [ ] Variable value: `C:\Users\ETrinh1\AppData\Local\Android\Sdk`
   - (Use the path you noted in Step 3)
4. [ ] Click **OK**

**Update PATH:**
1. [ ] Under "System variables", find and select **Path**
2. [ ] Click **Edit**
3. [ ] Click **New** and add: `%ANDROID_HOME%\platform-tools`
4. [ ] Click **New** and add: `%ANDROID_HOME%\emulator`
5. [ ] Click **New** and add: `%ANDROID_HOME%\tools`
6. [ ] Click **New** and add: `%ANDROID_HOME%\tools\bin`
7. [ ] Click **OK** on all windows

---

### 6️⃣ Restart Everything

- [ ] **Close ALL VS Code windows completely**
- [ ] **Close ALL PowerShell/Command Prompt windows**
- [ ] **(Optional) Restart your computer for good measure**
- [ ] Open VS Code fresh

---

### 7️⃣ Verify Setup

- [ ] Open PowerShell in VS Code
- [ ] Navigate to PokeVerse:
  ```powershell
  cd 'c:\Users\ETrinh1\OneDrive - T-Mobile USA\Documents\PokeVerse'
  ```
- [ ] Run verification script:
  ```powershell
  .\verify-android-setup.ps1
  ```
- [ ] All checks should be ✓ green

---

### 8️⃣ Run Your App! 🚀

**Option A: Start emulator first (recommended)**
```powershell
# In Android Studio: Device Manager → Click ▶️ on your AVD
# Then:
cd 'c:\Users\ETrinh1\OneDrive - T-Mobile USA\Documents\PokeVerse'
npm run android
```

**Option B: Let Expo start it**
```powershell
cd 'c:\Users\ETrinh1\OneDrive - T-Mobile USA\Documents\PokeVerse'
npm run android
```

---

## 🆘 Common Issues

### "ANDROID_HOME not found"
- ❌ You skipped Step 5 or didn't restart VS Code
- ✅ Set the environment variable and **restart VS Code completely**

### "No emulator found"
- ❌ You didn't create an AVD (Step 4)
- ✅ Open Android Studio → Device Manager → Create Device

### "adb not found"
- ❌ PATH not updated or VS Code not restarted
- ✅ Check Step 5 and restart VS Code

### Emulator is slow
- ⚡ Increase RAM in AVD settings (2048 MB minimum)
- ⚡ Enable Hardware Graphics (GLES 2.0)
- ⚡ Make sure Hyper-V or Intel HAXM is enabled

### Build fails with "SDK not found"
- ❌ ANDROID_HOME points to wrong location
- ✅ Open Android Studio → Settings → Android SDK
- ✅ Note the exact path and update ANDROID_HOME

---

## 📞 Need Help?

After completing setup, check:
1. Run `.\verify-android-setup.ps1` - all should be green ✓
2. Run `adb devices` - should show your emulator when running
3. Run `emulator -list-avds` - should list your created AVDs

If stuck, share the output of the verification script!
