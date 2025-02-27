// This file defines the scoreboard scene, exporting functions to display scores and player statistics.

export class Scoreboard {
    constructor() {
        this.playerScores = {
            player1: 0,
            player2: 0
        };
    }

    updateScore(player) {
        if (player === 'player1') {
            this.playerScores.player1 += 1;
        } else if (player === 'player2') {
            this.playerScores.player2 += 1;
        }
    }

    displayScores(context) {
        context.fillStyle = 'white';
        context.font = '20px Arial';
        context.fillText(`Player 1: ${this.playerScores.player1}`, 50, 50);
        context.fillText(`Player 2: ${this.playerScores.player2}`, 50, 80);
    }

    resetScores() {
        this.playerScores.player1 = 0;
        this.playerScores.player2 = 0;
    }
}