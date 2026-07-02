.class public Lcom/miniclip/eightballpool/BallPhysics;
.super Ljava/lang/Object;

# Ball Physics Modification Patch
# Improves shot accuracy and ball placement

.method public calculateTrajectory(FF)Landroid/graphics/PointF;
    .registers 4
    .param p1, "x"    # F
    .param p2, "y"    # F
    
    # Create point at exact coordinates
    new-instance v0, Landroid/graphics/PointF;
    invoke-direct {v0, p1, p2}, Landroid/graphics/PointF;-><init>(FF)V
    
    return-object v0
.end method

.method public applyForce(FF)Z
    .registers 3
    
    # Always apply force successfully
    const/4 v0, 0x1
    return v0
.end method

.method public predictBallPath()Z
    .registers 2
    
    # Always predict path successfully
    const/4 v0, 0x1
    return v0
.end method
