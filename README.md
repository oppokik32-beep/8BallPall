# 8 Ball Pool Auto-Win Mod

A Smali patching mod for 8 Ball Pool (v56.26.2) that enables automatic win functionality.

## Features

- **Auto-Win**: Automatically win every game played
- Smali-based patches for direct APK modification
- Simple one-click installation

## Installation

### Prerequisites
- ApkTool
- Java Development Kit (JDK)
- Android device or emulator
- 8 Ball Pool APK v56.26.2

### Steps

1. **Decompile the APK:**
   ```bash
   apktool d "8+Ball+Pool_56.26.2_APKPure.apk"
   ```

2. **Copy mod files** from this repository into the decompiled folder

3. **Apply patches** using the included patch files

4. **Recompile the APK:**
   ```bash
   apktool b -o 8BallPool_MOD.apk <decompiled_folder>
   ```

5. **Sign the APK:**
   ```bash
   jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/.android/debug.keystore -storepass android -keypass android 8BallPool_MOD.apk androiddebugkey
   ```

6. **Install on device:**
   ```bash
   adb install 8BallPool_MOD.apk
   ```

## Patches Included

### GameWinLogic.smali
- Modifies the game win condition to always return true
- Ensures victory is triggered on every game

### ScoreValidator.smali
- Bypasses score validation checks
- Prevents anti-cheat detection

### BallPhysics.smali
- Simplifies ball physics to guarantee shots
- Increases accuracy of ball placement

## File Structure

```
8BallPall/
├── README.md
├── patches/
│   ├── GameWinLogic.smali
│   ├── ScoreValidator.smali
│   └── BallPhysics.smali
├── scripts/
│   ├── apply_patches.sh
│   └── install_mod.bat
└── docs/
    └── TECHNICAL_GUIDE.md
```

## How It Works

The mod intercepts the game's win condition checks and forces them to return success. This is done at the Smali bytecode level before the APK is recompiled.

## Disclaimer

⚠️ **Educational Purpose Only**
- Use this mod only on devices you own
- Do not use in online multiplayer ranked matches
- Respect game developers and terms of service
- Use at your own risk

## Support

For issues or questions, open an issue on this repository.

---

**Version**: 1.0  
**Target Game**: 8 Ball Pool v56.26.2  
**Last Updated**: 2026-07-02  
**License**: Educational Use Only
