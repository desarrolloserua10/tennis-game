// Main game class and initialization

import { sounds } from '../assets/audio/sounds.js';
import { sprites } from '../assets/images/sprites.js';
import { displayMainMenu } from './scenes/main-menu.js';

export class Game {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.players = [];
        this.ball = null;
        this.score = {
            player1: 0,
            player2: 0
        };
        this.isRunning = false;
        this.paused = false;
    }

    start() {
        console.log('Initializing game...');
        
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.ctx = this.canvas.getContext('2d');
        
        // Add canvas to the DOM
        document.body.appendChild(this.canvas);
        
        // Display main menu
        displayMainMenu(this);
        
        console.log('Game initialized successfully!');
    }

    startMatch() {
        this.isRunning = true;
        this.initializeGameObjects();
        // Call the gameLoop method - this was missing or incorrectly defined
        this.gameLoop();
    }

    // Make sure this method is properly defined
    gameLoop() {
        if (!this.isRunning) return;
        
        this.update();
        this.render();
        
        // Use requestAnimationFrame for smooth animation
        requestAnimationFrame(() => this.gameLoop());
    }

    initializeGameObjects() {
        // Create player objects
        this.player1 = {
            x: 100,
            y: this.canvas.height / 2 - 50, // Center paddle vertically
            width: 20,
            height: 100,
            speed: 8,
            score: 0,
            movingUp: false,
            movingDown: false
        };
        
        this.player2 = {
            x: this.canvas.width - 120,
            y: this.canvas.height / 2 - 50, // Center paddle vertically
            width: 20, 
            height: 100,
            speed: 8,
            score: 0,
            movingUp: false,
            movingDown: false
        };
        
        // Create ball
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            radius: 10,
            speedX: 5,
            speedY: 2,
            inPlay: true
        };
        
        // Set up input handlers
        this.setupControls();
    }
    
    setupControls() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                // Player 1 controls (W/S keys)
                case 'w':
                case 'W':
                    this.player1.movingUp = true;
                    break;
                case 's':
                case 'S':
                    this.player1.movingDown = true;
                    break;
                    
                // Player 2 controls (Arrow keys)
                case 'ArrowUp':
                    this.player2.movingUp = true;
                    break;
                case 'ArrowDown':
                    this.player2.movingDown = true;
                    break;
                
                // Pause game
                case 'p':
                case 'P':
                    this.togglePause();
                    break;
            }
        });
        
        window.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'w':
                case 'W':
                    this.player1.movingUp = false;
                    break;
                case 's':
                case 'S':
                    this.player1.movingDown = false;
                    break;
                case 'ArrowUp':
                    this.player2.movingUp = false;
                    break;
                case 'ArrowDown':
                    this.player2.movingDown = false;
                    break;
            }
        });
        
        // Add touch controls for mobile
        this.setupTouchControls();
    }
    
    setupTouchControls() {
        // Simple touch controls - left half controls player 1, right half controls player 2
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            if (x < this.canvas.width / 2) {
                // Left side - Player 1
                this.player1.y = y - this.player1.height / 2;
            } else {
                // Right side - Player 2
                this.player2.y = y - this.player2.height / 2;
            }
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            if (x < this.canvas.width / 2) {
                this.player1.y = y - this.player1.height / 2;
            } else {
                this.player2.y = y - this.player2.height / 2;
            }
        });
    }
    
    update() {
        if (!this.isRunning || this.paused) return;
        
        // Update player positions based on movement flags
        if (this.player1.movingUp && this.player1.y > 0) {
            this.player1.y -= this.player1.speed;
        }
        if (this.player1.movingDown && this.player1.y < this.canvas.height - this.player1.height) {
            this.player1.y += this.player1.speed;
        }
        
        if (this.player2.movingUp && this.player2.y > 0) {
            this.player2.y -= this.player2.speed;
        }
        if (this.player2.movingDown && this.player2.y < this.canvas.height - this.player2.height) {
            this.player2.y += this.player2.speed;
        }
        
        // Update ball position
        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;
        
        // Ball collision with top and bottom walls
        if (this.ball.y - this.ball.radius < 0 || 
            this.ball.y + this.ball.radius > this.canvas.height) {
            this.ball.speedY = -this.ball.speedY;
            // Play bounce sound if available
            if (sounds.bounce) sounds.bounce.play();
        }
        
        // Ball collision with paddles
        this.checkPaddleCollision();
        
        // Check if ball is out of bounds (scoring)
        this.checkScoring();
    }
    
    checkPaddleCollision() {
        // Player 1 paddle collision
        if (this.ball.x - this.ball.radius < this.player1.x + this.player1.width &&
            this.ball.x + this.ball.radius > this.player1.x &&
            this.ball.y + this.ball.radius > this.player1.y &&
            this.ball.y - this.ball.radius < this.player1.y + this.player1.height) {
            
            // Calculate bounce angle based on where ball hits paddle
            const hitPosition = (this.ball.y - (this.player1.y + this.player1.height / 2)) / (this.player1.height / 2);
            
            // Reverse X direction and adjust Y based on hit position
            this.ball.speedX = -this.ball.speedX * 1.05; // Slightly increase speed
            this.ball.speedY = hitPosition * 7;
            
            // Play hit sound if available
            if (sounds.hit) sounds.hit.play();
        }
        
        // Player 2 paddle collision (similar logic)
        if (this.ball.x + this.ball.radius > this.player2.x &&
            this.ball.x - this.ball.radius < this.player2.x + this.player2.width &&
            this.ball.y + this.ball.radius > this.player2.y &&
            this.ball.y - this.ball.radius < this.player2.y + this.player2.height) {
            
            const hitPosition = (this.ball.y - (this.player2.y + this.player2.height / 2)) / (this.player2.height / 2);
            
            this.ball.speedX = -this.ball.speedX * 1.05;
            this.ball.speedY = hitPosition * 7;
            
            if (sounds.hit) sounds.hit.play();
        }
    }
    
    checkScoring() {
        // Ball out on left side - player 2 scores
        if (this.ball.x + this.ball.radius < 0) {
            this.player2.score++;
            if (sounds.score) sounds.score.play();
            this.resetBall(1);  // Direction 1 means ball goes to player 1
        }
        
        // Ball out on right side - player 1 scores
        if (this.ball.x - this.ball.radius > this.canvas.width) {
            this.player1.score++;
            if (sounds.score) sounds.score.play();
            this.resetBall(-1);  // Direction -1 means ball goes to player 2
        }
    }
    
    resetBall(direction) {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.speedX = 5 * direction;
        this.ball.speedY = Math.random() * 4 - 2; // Random vertical speed
    }
    
    togglePause() {
        this.paused = !this.paused;
    }
    
    render() {
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw court
        ctx.fillStyle = '#2F7831'; // Tennis court green
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw net
        ctx.setLineDash([5, 15]);
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(this.canvas.width / 2, 0);
        ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw players
        ctx.fillStyle = 'white';
        ctx.fillRect(this.player1.x, this.player1.y, this.player1.width, this.player1.height);
        ctx.fillRect(this.player2.x, this.player2.y, this.player2.width, this.player2.height);
        
        // Draw ball
        ctx.beginPath();
        ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.closePath();
        
        // Draw score
        ctx.fillStyle = 'white';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.player1.score, this.canvas.width / 4, 50);
        ctx.fillText(this.player2.score, 3 * this.canvas.width / 4, 50);
        ctx.textAlign = 'start';
        
        // Draw pause indicator if needed
        if (this.paused) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
            ctx.font = '24px Arial';
            ctx.fillText('Press P to resume', this.canvas.width / 2, this.canvas.height / 2 + 40);
            ctx.textAlign = 'start';
        }
    }
}