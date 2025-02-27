// This file serves as the entry point for the application, loading assets and starting the game.

import '../css/styles.css';
import { loadAssets } from '../assets/audio/sounds.js';
import { loadSprites } from '../assets/images/sprites.js';
import { Game } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
    // Load all assets first
    Promise.all([
        loadAssets(),
        loadSprites()
    ]).then(() => {
        // Start the game once assets are loaded
        const game = new Game();
        game.start();
    }).catch(error => {
        console.error('Failed to load game assets:', error);
    });
});