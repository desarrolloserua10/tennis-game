const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawImage(image, x, y, width, height) {
    ctx.drawImage(image, x, y, width, height);
}

function render(entities) {
    clearCanvas();
    entities.forEach(entity => {
        if (entity.type === 'rectangle') {
            drawRect(entity.x, entity.y, entity.width, entity.height, entity.color);
        } else if (entity.type === 'circle') {
            drawCircle(entity.x, entity.y, entity.radius, entity.color);
        } else if (entity.type === 'image') {
            drawImage(entity.image, entity.x, entity.y, entity.width, entity.height);
        }
    });
}

export { render };