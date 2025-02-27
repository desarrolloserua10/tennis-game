// This file contains the physics engine logic, exporting functions to handle collisions and movement.

export function detectCollision(entityA, entityB) {
    // Simple AABB collision detection
    return (
        entityA.x < entityB.x + entityB.width &&
        entityA.x + entityA.width > entityB.x &&
        entityA.y < entityB.y + entityB.height &&
        entityA.y + entityA.height > entityB.y
    );
}

export function applyPhysics(entity, deltaTime) {
    // Apply gravity and movement to the entity
    entity.velocity.y += entity.gravity * deltaTime;
    entity.x += entity.velocity.x * deltaTime;
    entity.y += entity.velocity.y * deltaTime;

    // Simple ground collision
    if (entity.y + entity.height > canvas.height) {
        entity.y = canvas.height - entity.height;
        entity.velocity.y = 0; // Reset vertical velocity
    }
}