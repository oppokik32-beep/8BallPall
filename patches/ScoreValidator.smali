.class public Lcom/miniclip/eightballpool/ScoreValidator;
.super Ljava/lang/Object;

# Score Validation Bypass Patch
# Prevents anti-cheat from detecting the mod

.method public validateScore(I)Z
    .registers 3
    .param p1, "score"    # I
    
    # Always validate score as legitimate
    const/4 v0, 0x1
    return v0
.end method

.method public checkAntiCheat()Z
    .registers 2
    
    # Bypass anti-cheat detection
    const/4 v0, 0x1
    return v0
.end method

.method public isScoreLegitimate()Z
    .registers 2
    
    # Mark all scores as legitimate
    const/4 v0, 0x1
    return v0
.end method
