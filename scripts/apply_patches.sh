#!/bin/bash

# 8 Ball Pool Auto-Win Mod - Apply Patches Script
# This script automatically applies all patches to your decompiled APK

echo "8 Ball Pool Auto-Win Mod - Patch Installer"
echo "=========================================="
echo ""

# Check if decompiled folder is provided
if [ -z "$1" ]; then
    echo "Usage: ./apply_patches.sh <path_to_decompiled_apk>"
    echo "Example: ./apply_patches.sh ./8+Ball+Pool_56.26.2_APKPure"
    exit 1
fi

DECOMPILED_PATH="$1"
PATCH_DIR="$(dirname "$0")/../patches"

echo "Decompiled APK Path: $DECOMPILED_PATH"
echo "Patches Directory: $PATCH_DIR"
echo ""

# Check if path exists
if [ ! -d "$DECOMPILED_PATH" ]; then
    echo "Error: Decompiled APK path not found!"
    exit 1
fi

echo "Applying patches..."
echo ""

# Copy patches to appropriate locations
echo "[1/3] Applying GameWinLogic patch..."
cp "$PATCH_DIR/GameWinLogic.smali" "$DECOMPILED_PATH/smali/com/miniclip/eightballpool/GameWinLogic.smali" 2>/dev/null && echo "✓ GameWinLogic patched" || echo "✗ GameWinLogic patch failed"

echo "[2/3] Applying ScoreValidator patch..."
cp "$PATCH_DIR/ScoreValidator.smali" "$DECOMPILED_PATH/smali/com/miniclip/eightballpool/ScoreValidator.smali" 2>/dev/null && echo "✓ ScoreValidator patched" || echo "✗ ScoreValidator patch failed"

echo "[3/3] Applying BallPhysics patch..."
cp "$PATCH_DIR/BallPhysics.smali" "$DECOMPILED_PATH/smali/com/miniclip/eightballpool/BallPhysics.smali" 2>/dev/null && echo "✓ BallPhysics patched" || echo "✗ BallPhysics patch failed"

echo ""
echo "=========================================="
echo "Patches applied successfully!"
echo "Next step: Recompile the APK with ApkTool"
echo "Command: apktool b -o 8BallPool_MOD.apk $DECOMPILED_PATH"
echo "=========================================="
