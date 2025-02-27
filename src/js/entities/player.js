class Player {
    constructor(name, position) {
        this.name = name;
        this.position = position; // { x: number, y: number }
        this.speed = 5; // Speed of the player
        this.score = 0; // Player's score
    }

    move(direction) {
        switch (direction) {
            case 'up':
                this.position.y -= this.speed;
                break;
            case 'down':
                this.position.y += this.speed;
                break;
            case 'left':
                this.position.x -= this.speed;
                break;
            case 'right':
                this.position.x += this.speed;
                break;
        }
    }

    scorePoint() {
        this.score += 1;
    }

    resetPosition(startPosition) {
        this.position = startPosition;
    }
}

export default Player;