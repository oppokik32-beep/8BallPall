# 8 Ball Pool Auto-Win Mod - Technical Guide

## Overview

This document provides technical details about how the auto-win mod works and how to customize it.

## Architecture

### Core Components

1. **GameWinLogic.smali** - Win condition handler
2. **ScoreValidator.smali** - Score validation and anti-cheat bypass
3. **BallPhysics.smali** - Physics manipulation

## How the Mod Works

### 1. Win Condition Override

The `GameWinLogic.smali` patch intercepts the game's win condition checks:

```smali
.method public checkWinCondition()Z
    const/4 v0, 0x1  ; Load integer 1 (true) into v0
    return v0         ; Return true
.end method
```

This forces any win condition check to return `true`.

### 2. Anti-Cheat Bypass

The `ScoreValidator.smali` patch handles anti-cheat mechanisms:

```smali
.method public checkAntiCheat()Z
    const/4 v0, 0x1
    return v0
.end method
```

This prevents the game from flagging illegitimate wins.

### 3. Physics Manipulation

The `BallPhysics.smali` patch modifies ball trajectory calculations to ensure accurate shots.

## Smali Bytecode Basics

### Common Instructions

| Instruction | Purpose |
|-------------|----------|
| `const/4 v0, 0x1` | Load constant 1 (true) into register v0 |
| `return v0` | Return the value in v0 |
| `invoke-direct` | Call a private method |
| `new-instance` | Create new object instance |

### Register System

- `v0-v15` - Local registers (method parameters and local variables)
- `p0` - First parameter (usually `this`)
- `p1, p2, p3...` - Additional parameters

## Customization

### Modifying Win Condition

To make the mod more stealthy, you could add a delay:

```smali
.method public checkWinCondition()Z
    .registers 2
    
    # Add random delay
    const-wide/16 v0, 0x3e8  ; 1000ms delay
    # ... add threading code ...
    
    const/4 v0, 0x1
    return v0
.end method
```

### Advanced Patches

You can extend the mod with additional features:

1. **Unlimited Coins** - Patch coin validation
2. **Spin Control** - Modify shot spin mechanics
3. **Perfect Aim** - Always shoot straight

## Building and Testing

### Step-by-Step Build

```bash
# 1. Decompile
apktool d 8+Ball+Pool_56.26.2_APKPure.apk

# 2. Apply patches
bash scripts/apply_patches.sh 8+Ball+Pool_56.26.2_APKPure

# 3. Recompile
apktool b -o 8BallPool_MOD.apk 8+Ball+Pool_56.26.2_APKPure

# 4. Sign
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore ~/.android/debug.keystore \
  -storepass android -keypass android \
  8BallPool_MOD.apk androiddebugkey

# 5. Install
adb install 8BallPool_MOD.apk
```

### Testing

1. Launch the modded app
2. Start a new game
3. Verify that you win every game
4. Check for crashes or errors

## Troubleshooting

### Common Issues

**Issue**: App crashes on launch
- **Solution**: Verify all patches were applied correctly
- **Check**: Compare smali files with originals

**Issue**: Mod doesn't work
- **Solution**: Ensure you used the correct APK version (56.26.2)
- **Check**: Verify patch file paths are correct

**Issue**: Anti-cheat detected
- **Solution**: Update the ScoreValidator patch
- **Check**: Add more obfuscation to win logic

## Security Considerations

- Smali bytecode is easily decompiled
- Store backups of original APK
- Test on emulator before device installation
- Disable online features when using mod

## Resources

- [ApkTool Documentation](https://ibotpeaches.github.io/Apktool/)
- [Smali/Baksmali Documentation](https://github.com/google/smali)
- [Android Bytecode Reference](https://source.android.com/devices/tech/dalvik/instruction-formats)

---

**Last Updated**: 2026-07-02
