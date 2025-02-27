# Tennis Game - Developer Guide

This document provides technical details and explanations about how the Tennis Game project works, designed to help developers understand the architecture and contribute to the codebase.

## Architecture Overview

The Tennis Game is built using a component-based architecture with a game loop pattern. The application follows these key architectural principles:

1. **Scene Management** - The game is divided into distinct scenes (Main Menu, Game Scene, Scoreboard)
2. **Entity-Component System** - Game objects are composed of reusable components
3. **Game Loop Pattern** - Core update-render cycle manages the game state
4. **Event-Driven Communication** - Components communicate via events

## Core Components

### Game Engine (`/js/engine/`)

The engine provides the fundamental infrastructure for the game:

#### Physics Engine (`physics.js`)

```javascript
// Core collision detection system
function detectCollision(objectA, objectB) {
  // Bounding box collision algorithm
  // Returns collision data or null if no collision
}

// Physics update loop
function updatePhysics(entities, deltaTime) {
  // Apply velocity, gravity, and other physics properties
  // Handle collisions between entities
}
```

#### Renderer (`renderer.js`) 

```javascript
// Handles drawing all game entities to the canvas
function render(scene, canvas) {
  // Clear canvas
  // Sort entities by z-index
  // Draw background elements
  // Draw game entities
  // Draw UI elements
}
```

#### Input System (`input.js`)

```javascript
// Manages keyboard, mouse, and touch inputs
const InputSystem = {
  keysPressed: {},
  
  initialize() {
    // Set up event listeners
    window.addEventListener('keydown', (e) => this.keysPressed[e.code] = true);
    window.addEventListener('keyup', (e) => this.keysPressed[e.code] = false);
  },
  
  isKeyDown(keyCode) {
    return !!this.keysPressed[keyCode];
  }
};
```

### Game Objects (`/js/entities/`)

#### Player (`player.js`)

The player entity handles user-controlled tennis character:

```javascript
class Player {
  constructor(x, y, isPlayerOne) {
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.isPlayerOne = isPlayerOne;
    this.score = 0;
    this.sprite = isPlayerOne ? playerOneSprite : playerTwoSprite;
    this.state = 'idle'; // idle, moving, hitting
  }
  
  update(deltaTime) {
    // Handle player movement
    // Manage animations based on state
  }
  
  hit() {
    // Handle ball hitting logic
    this.state = 'hitting';
    // Play animation
    // After animation completes, return to idle state
  }
}
```

#### Ball (`ball.js`)

The tennis ball with physics properties:

```javascript
class Ball {
  constructor() {
    this.position = { x: courtCenterX, y: courtCenterY };
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.sprite = ballSprite;
    this.radius = 5;
    this.spin = 0; // Affects trajectory
  }
  
  update(deltaTime) {
    // Apply physics
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    
    // Apply drag/friction
    this.velocity.x *= 0.99;
    this.velocity.y *= 0.99;
    
    // Apply spin effects to trajectory
  }
  
  reset() {
    // Reset ball to center with initial velocity
  }
}
```

#### Court (`court.js`)

Defines the playing field and boundaries:

```javascript
class Court {
  constructor() {
    this.width = 800;
    this.height = 600;
    this.boundaries = {
      left: 50,
      right: 750,
      top: 50, 
      bottom: 550,
      net: { x: 400, height: 30 }
    };
    this.sprite = courtSprite;
  }
  
  checkBoundaries(ball) {
    // Check if ball hits boundaries and apply appropriate physics
    // Return scoring information if ball is out of bounds
  }
}
```

### Scene Management (`/js/scenes/`)

#### Main Menu (`main-menu.js`)

```javascript
class MainMenuScene {
  constructor(game) {
    this.game = game;
    this.buttons = [
      { text: 'Start Game', action: () => this.game.changeScene('game') },
      { text: 'Instructions', action: () => this.showInstructions() },
      { text: 'Quit', action: () => this.quitGame() }
    ];
  }
  
  update() {
    // Handle menu navigation and selection
  }
  
  render(canvas) {
    // Draw menu background and buttons
  }
}
```

#### Game Scene (`game-scene.js`)

```javascript
class GameScene {
  constructor(game) {
    this.game = game;
    this.court = new Court();
    this.playerOne = new Player(100, 300, true);
    this.playerTwo = new Player(700, 300, false);
    this.ball = new Ball();
    this.isPaused = false;
  }
  
  update(deltaTime) {
    if (this.isPaused) return;
    
    // Update all entities
    this.playerOne.update(deltaTime);
    this.playerTwo.update(deltaTime);
    this.ball.update(deltaTime);
    
    // Check for collisions
    this.handleCollisions();
    
    // Check for scoring
    const scoreResult = this.checkScore();
    if (scoreResult) {
      this.updateScore(scoreResult);
      this.ball.reset();
    }
  }
  
  render(canvas) {
    // Draw court, players, ball, and UI elements
  }
}
```

#### Scoreboard (`scoreboard.js`)

```javascript
class ScoreboardScene {
  constructor(game, finalScore) {
    this.game = game;
    this.finalScore = finalScore;
  }
  
  update() {
    // Handle user input to return to main menu
  }
  
  render(canvas) {
    // Display final scores and winner
    // Show options to play again or return to menu
  }
}
```

## Game Loop Implementation

The core game loop is implemented in `game.js`:

```javascript
class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.scenes = {
      menu: new MainMenuScene(this),
      game: new GameScene(this),
      scoreboard: new ScoreboardScene(this)
    };
    this.currentScene = this.scenes.menu;
    this.lastFrameTime = 0;
  }
  
  changeScene(sceneName, data) {
    this.currentScene = this.scenes[sceneName];
    if (data) this.currentScene.initialize(data);
  }
  
  gameLoop(timestamp) {
    // Calculate delta time
    const deltaTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;
    
    // Update current scene
    this.currentScene.update(deltaTime);
    
    // Render current scene
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.currentScene.render(this.ctx);
    
    // Request next frame
    requestAnimationFrame(this.gameLoop.bind(this));
  }
  
  start() {
    InputSystem.initialize();
    requestAnimationFrame(this.gameLoop.bind(this));
  }
}
```

## Asset Management

### Loading and Managing Assets

Assets are loaded asynchronously before the game starts:

```javascript
// From sounds.js
const SoundManager = {
  sounds: {},
  
  async loadSounds() {
    const soundFiles = {
      hit: 'assets/audio/hit.mp3',
      score: 'assets/audio/score.mp3',
      background: 'assets/audio/background.mp3'
    };
    
    for (const [name, path] of Object.entries(soundFiles)) {
      const audio = new Audio();
      audio.src = path;
      this.sounds[name] = audio;
    }
    
    // Wait for all sounds to load
    await Promise.all(Object.values(this.sounds).map(audio => {
      return new Promise(resolve => {
        audio.addEventListener('canplaythrough', resolve, { once: true });
      });
    }));
  },
  
  play(soundName) {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  }
};
```

## Development Workflow

### Setting up the Development Environment

1. Install dependencies: `npm install`
2. Run the development server: `npm start`
3. The game will be available at `http://localhost:8080`

### Building for Production

```bash
npm run build
```

This creates optimized assets in the `dist` folder.

### Adding a New Feature

To add a new feature (e.g., a power-up system):

1. Create appropriate entity classes in `/js/entities/`
2. Integrate with the game scene in `game-scene.js`
3. Add any required assets to `/assets/`
4. Update the physics engine if needed

## Extending the Game

### Adding New Character Types

Create a new player class that extends the base Player class:

```javascript
class AdvancedPlayer extends Player {
  constructor(x, y, isPlayerOne) {
    super(x, y, isPlayerOne);
    this.specialMoveAvailable = true;
  }
  
  specialMove() {
    if (this.specialMoveAvailable) {
      // Implement special move logic
      this.specialMoveAvailable = false;
      setTimeout(() => { this.specialMoveAvailable = true; }, 10000);
    }
  }
}
```

### Creating New Game Modes

1. Create a new scene class in the `/js/scenes/` directory
2. Implement the required `update()` and `render()` methods
3. Add the scene to the `scenes` object in `game.js`
4. Create a way to access the new scene (e.g., a menu option)

## Performance Optimization

The game uses several optimization techniques:

1. **Object Pooling** - Reuses objects to minimize garbage collection
2. **Sprite Batching** - Minimizes draw calls
3. **Throttled Physics** - Full physics calculations only for entities in view

## Debugging

Enable debug mode by adding `?debug=true` to the URL. This displays:

- Hitboxes around entities
- Frame rate counter
- Physics simulation information

## Contributing

When contributing to the codebase:

1. Follow the existing code style (ESLint configuration is provided)
2. Add appropriate tests for new features
3. Update this documentation for significant changes
4. Consider performance implications of your changes

## Additional Resources

- [Game Development Patterns and Best Practices](https://gameprogrammingpatterns.com/)
- [Canvas API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [JavaScript Game Development Basics](https://developer.mozilla.org/en-US/docs/Games/Introduction)
