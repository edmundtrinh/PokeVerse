# Android Development Environment Verification Script
# Run this after setting up Android Studio and environment variables

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "   Android Development Environment Check" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

$allGood = $true

# Check 1: ANDROID_HOME
Write-Host "Checking ANDROID_HOME..." -NoNewline
if ($env:ANDROID_HOME) {
    Write-Host " ✓ Set" -ForegroundColor Green
    Write-Host "  Path: $env:ANDROID_HOME" -ForegroundColor Gray
    
    if (Test-Path $env:ANDROID_HOME) {
        Write-Host "  ✓ Directory exists" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Directory does NOT exist!" -ForegroundColor Red
        $allGood = $false
    }
} else {
    Write-Host " ✗ Not set" -ForegroundColor Red
    Write-Host "  → Add ANDROID_HOME to System Environment Variables" -ForegroundColor Yellow
    $allGood = $false
}

# Check 2: platform-tools (adb)
Write-Host "`nChecking adb (Android Debug Bridge)..." -NoNewline
$adb = Get-Command adb -ErrorAction SilentlyContinue
if ($adb) {
    Write-Host " ✓ Found" -ForegroundColor Green
    Write-Host "  Path: $($adb.Source)" -ForegroundColor Gray
    $adbVersion = adb --version 2>&1 | Select-Object -First 1
    Write-Host "  Version: $adbVersion" -ForegroundColor Gray
} else {
    Write-Host " ✗ Not found" -ForegroundColor Red
    Write-Host "  → Add %ANDROID_HOME%\platform-tools to PATH" -ForegroundColor Yellow
    $allGood = $false
}

# Check 3: emulator
Write-Host "`nChecking Android Emulator..." -NoNewline
$emulator = Get-Command emulator -ErrorAction SilentlyContinue
if ($emulator) {
    Write-Host " ✓ Found" -ForegroundColor Green
    Write-Host "  Path: $($emulator.Source)" -ForegroundColor Gray
} else {
    Write-Host " ✗ Not found" -ForegroundColor Red
    Write-Host "  → Add %ANDROID_HOME%\emulator to PATH" -ForegroundColor Yellow
    $allGood = $false
}

# Check 4: Java (required for Android development)
Write-Host "`nChecking Java..." -NoNewline
if ($env:JAVA_HOME) {
    Write-Host " ✓ JAVA_HOME set" -ForegroundColor Green
    Write-Host "  Path: $env:JAVA_HOME" -ForegroundColor Gray
    
    $java = Get-Command java -ErrorAction SilentlyContinue
    if ($java) {
        $javaVersion = java -version 2>&1 | Select-Object -First 1
        Write-Host "  Version: $javaVersion" -ForegroundColor Gray
    }
} else {
    Write-Host " ⚠ JAVA_HOME not set (may still work)" -ForegroundColor Yellow
}

# Check 5: SDK packages
if ($env:ANDROID_HOME -and (Test-Path $env:ANDROID_HOME)) {
    Write-Host "`nChecking Android SDK packages..." -ForegroundColor White
    
    $platformsPath = Join-Path $env:ANDROID_HOME "platforms"
    if (Test-Path $platformsPath) {
        $platforms = Get-ChildItem $platformsPath -Directory | Select-Object -ExpandProperty Name
        if ($platforms.Count -gt 0) {
            Write-Host "  ✓ Platforms installed: $($platforms.Count)" -ForegroundColor Green
            $platforms | ForEach-Object { Write-Host "    - $_" -ForegroundColor Gray }
        } else {
            Write-Host "  ✗ No platforms installed" -ForegroundColor Red
            Write-Host "    → Install Android SDK Platform in Android Studio" -ForegroundColor Yellow
            $allGood = $false
        }
    } else {
        Write-Host "  ✗ Platforms directory not found" -ForegroundColor Red
        $allGood = $false
    }
    
    $buildToolsPath = Join-Path $env:ANDROID_HOME "build-tools"
    if (Test-Path $buildToolsPath) {
        $buildTools = Get-ChildItem $buildToolsPath -Directory | Select-Object -ExpandProperty Name
        if ($buildTools.Count -gt 0) {
            Write-Host "  ✓ Build-tools installed: $($buildTools.Count)" -ForegroundColor Green
            $latest = $buildTools | Sort-Object -Descending | Select-Object -First 1
            Write-Host "    Latest: $latest" -ForegroundColor Gray
        } else {
            Write-Host "  ✗ No build-tools installed" -ForegroundColor Red
            $allGood = $false
        }
    }
    
    $emulatorPath = Join-Path $env:ANDROID_HOME "emulator"
    if (Test-Path $emulatorPath) {
        Write-Host "  ✓ Emulator package installed" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Emulator package not installed" -ForegroundColor Red
        $allGood = $false
    }
}

# Check 6: AVDs (Android Virtual Devices)
Write-Host "`nChecking Android Virtual Devices (AVDs)..." -ForegroundColor White
if ($emulator) {
    $avds = & emulator -list-avds 2>&1
    if ($avds -and $avds.Count -gt 0 -and $avds[0] -notlike "*ERROR*") {
        Write-Host "  ✓ AVDs found: $($avds.Count)" -ForegroundColor Green
        $avds | ForEach-Object { Write-Host "    - $_" -ForegroundColor Gray }
    } else {
        Write-Host "  ✗ No AVDs created" -ForegroundColor Yellow
        Write-Host "    → Create a Virtual Device in Android Studio" -ForegroundColor Yellow
        Write-Host "       (Tools → Device Manager → Create Device)" -ForegroundColor Gray
    }
} else {
    Write-Host "  ⊘ Cannot check (emulator not in PATH)" -ForegroundColor Yellow
}

# Check 7: Node.js and npm (for React Native)
Write-Host "`nChecking Node.js..." -NoNewline
$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
    Write-Host " ✓ Found" -ForegroundColor Green
    $nodeVersion = node --version
    Write-Host "  Version: $nodeVersion" -ForegroundColor Gray
} else {
    Write-Host " ✗ Not found" -ForegroundColor Red
    $allGood = $false
}

# Check 8: Check if we're in the PokeVerse directory
Write-Host "`nChecking project directory..." -NoNewline
$pokeversePath = "c:\Users\ETrinh1\OneDrive - T-Mobile USA\Documents\PokeVerse"
if (Test-Path $pokeversePath) {
    Write-Host " ✓ Found" -ForegroundColor Green
    
    $packageJson = Join-Path $pokeversePath "package.json"
    if (Test-Path $packageJson) {
        Write-Host "  ✓ package.json exists" -ForegroundColor Green
    }
    
    $nodeModules = Join-Path $pokeversePath "node_modules"
    if (Test-Path $nodeModules) {
        Write-Host "  ✓ Dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Dependencies not installed" -ForegroundColor Yellow
        Write-Host "    → Run: npm install" -ForegroundColor Yellow
    }
}

# Final Summary
Write-Host "`n================================================" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "   ✓ ALL CHECKS PASSED!" -ForegroundColor Green
    Write-Host "================================================`n" -ForegroundColor Cyan
    Write-Host "You're ready to run: npm run android" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor White
    Write-Host "  1. cd '$pokeversePath'" -ForegroundColor Gray
    Write-Host "  2. npm run android" -ForegroundColor Gray
} else {
    Write-Host "   ⚠ SETUP INCOMPLETE" -ForegroundColor Yellow
    Write-Host "================================================`n" -ForegroundColor Cyan
    Write-Host "Please fix the items marked with ✗ above" -ForegroundColor Yellow
    Write-Host "Then restart your terminal and run this script again" -ForegroundColor Yellow
}

Write-Host ""
