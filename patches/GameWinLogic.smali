.class public Lcom/miniclip/eightballpool/GameWinLogic;
.super Ljava/lang/Object;

# Auto-Win Patch for 8 Ball Pool
# This patch modifies the game win condition to always return true

.method public checkWinCondition()Z
    .registers 2
    
    # Force win condition to always be true
    const/4 v0, 0x1
    return v0
.end method

.method public validateGameState()Z
    .registers 2
    
    # Always validate as successful game state
    const/4 v0, 0x1
    return v0
.end method

.method public isPlayerWinner()Z
    .registers 2
    
    # Player always wins
    const/4 v0, 0x1
    return v0
.end method
