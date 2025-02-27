// Sprite and image assets management

const sprites = {
    player: null,
    ball: null,
    court: null,
    background: null
};

/**
 * Loads all sprite assets needed for the game
 * @returns {Promise} Promise that resolves when all sprites are loaded
 */
export function loadSprites() {
    return new Promise((resolve) => {
        console.log('Loading sprite assets...');
        
        // Simulate loading sprite images
        setTimeout(() => {
            sprites.player = { width: 64, height: 128 };
            sprites.ball = { width: 32, height: 32 };
            sprites.court = { width: 800, height: 600 };
            sprites.background = { width: 1024, height: 768 };
            
            console.log('Sprite assets loaded successfully');
            resolve();
        }, 700);
    });
}

export { sprites };