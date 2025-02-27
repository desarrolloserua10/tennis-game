// Main menu scene

/**
 * Displays the main menu of the game
 * @param {Game} game - The game instance
 */
export function displayMainMenu(game) {
    console.log('Displaying main menu');
    
    // Clear canvas
    const ctx = game.ctx;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
    
    // Draw menu title
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('TENNIS GAME', game.canvas.width / 2, 100);
    
    // Draw start button
    ctx.fillStyle = 'green';
    const buttonX = game.canvas.width / 2 - 100;
    const buttonY = game.canvas.height / 2 - 25;
    const buttonWidth = 200;
    const buttonHeight = 50;
    
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('START GAME', game.canvas.width / 2, game.canvas.height / 2 + 8);
    
    // Add click event listener for the button
    game.canvas.addEventListener('click', handleMenuClick);
    
    function handleMenuClick(event) {
        const rect = game.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Check if click is within the button
        if (x >= buttonX && x <= buttonX + buttonWidth && 
            y >= buttonY && y <= buttonY + buttonHeight) {
            // Remove event listener and start game
            game.canvas.removeEventListener('click', handleMenuClick);
            game.startMatch();
        }
    }
}

function startGame() {
    // Logic to transition to the game scene
}

function showInstructions() {
    // Logic to display game instructions
}

function showScoreboard() {
    // Logic to transition to the scoreboard scene
}