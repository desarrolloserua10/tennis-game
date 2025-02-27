class Ball {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = 0;
        this.speedY = 0;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    setSpeed(speedX, speedY) {
        this.speedX = speedX;
        this.speedY = speedY;
    }

    resetPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    checkCollision(entity) {
        const distX = this.x - entity.x;
        const distY = this.y - entity.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        return distance < this.radius + entity.radius;
    }
}

export default Ball;