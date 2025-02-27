class Court {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.color = '#4CAF50'; // Default court color
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);
        this.drawLines(ctx);
    }

    drawLines(ctx) {
        ctx.strokeStyle = '#FFFFFF'; // Line color
        ctx.lineWidth = 2;

        // Draw the center line
        ctx.beginPath();
        ctx.moveTo(this.width / 2, 0);
        ctx.lineTo(this.width / 2, this.height);
        ctx.stroke();

        // Draw the service boxes
        ctx.strokeRect(this.width / 2 - 60, 0, 120, this.height / 2);
        ctx.strokeRect(this.width / 2 - 60, this.height / 2, 120, this.height / 2);
    }
}

export default Court;