/* ===================================
   RETRO SNAKE GAME - CORE LOGIC
   Modular, production-quality code
   =================================== */

// Game Configuration
const CONFIG = {
    gridSize: 20,        // 20x20 grid
    cellSize: 20,        // Each cell is 20px
    initialSpeed: 150,   // Initial game speed (ms per frame)
    speedIncrement: 5,   // Speed increase per food eaten
    minSpeed: 50         // Maximum speed limit
};

// Game State
const GAME_STATE = {
    READY: 'ready',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver'
};

// Direction Constants
const DIRECTION = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

// Game Class - Main game controller
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.aiCoach = new AICoach();
        
        // Game state
        this.state = GAME_STATE.READY;
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.speed = CONFIG.initialSpeed;
        this.gameLoop = null;
        
        // Initialize game objects
        this.initializeGame();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Update UI
        this.updateUI();
    }

    /**
     * Initialize game objects to starting state
     */
    initializeGame() {
        // Snake starts in center, moving right
        const centerX = Math.floor(CONFIG.gridSize / 2);
        const centerY = Math.floor(CONFIG.gridSize / 2);
        
        this.snake = {
            body: [
                { x: centerX, y: centerY },
                { x: centerX - 1, y: centerY },
                { x: centerX - 2, y: centerY }
            ],
            direction: DIRECTION.RIGHT,
            nextDirection: DIRECTION.RIGHT
        };
        
        // Place initial food
        this.food = this.generateFood();
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Button controls
        document.getElementById('startButton').addEventListener('click', () => this.startGame());
        document.getElementById('pauseButton').addEventListener('click', () => this.togglePause());
        document.getElementById('restartButton').addEventListener('click', () => this.restartGame());
    }

    /**
     * Handle keyboard input
     */
    handleKeyPress(e) {
        // Prevent default scrolling for arrow keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }

        // Only accept input during gameplay
        if (this.state !== GAME_STATE.PLAYING && this.state !== GAME_STATE.PAUSED) {
            return;
        }

        const currentDir = this.snake.direction;

        switch (e.key) {
            case 'ArrowUp':
                // Prevent 180-degree turns
                if (currentDir.y === 0) {
                    this.snake.nextDirection = DIRECTION.UP;
                }
                break;
            case 'ArrowDown':
                if (currentDir.y === 0) {
                    this.snake.nextDirection = DIRECTION.DOWN;
                }
                break;
            case 'ArrowLeft':
                if (currentDir.x === 0) {
                    this.snake.nextDirection = DIRECTION.LEFT;
                }
                break;
            case 'ArrowRight':
                if (currentDir.x === 0) {
                    this.snake.nextDirection = DIRECTION.RIGHT;
                }
                break;
            case ' ':
                this.togglePause();
                break;
        }
    }

    /**
     * Start the game
     */
    startGame() {
        this.state = GAME_STATE.PLAYING;
        this.hideOverlay();
        this.enableControls();
        this.aiCoach.reset();
        this.startGameLoop();
    }

    /**
     * Toggle pause state
     */
    togglePause() {
        if (this.state === GAME_STATE.PLAYING) {
            this.state = GAME_STATE.PAUSED;
            this.stopGameLoop();
            document.getElementById('pauseIcon').textContent = '▶';
            this.aiCoach.showMessage('⏸ Game Paused', 'info');
        } else if (this.state === GAME_STATE.PAUSED) {
            this.state = GAME_STATE.PLAYING;
            this.startGameLoop();
            document.getElementById('pauseIcon').textContent = '⏸';
            this.aiCoach.showMessage('▶ Resumed! Stay focused!', 'info');
        }
    }

    /**
     * Restart the game
     */
    restartGame() {
        this.stopGameLoop();
        this.score = 0;
        this.speed = CONFIG.initialSpeed;
        this.initializeGame();
        this.updateUI();
        this.startGame();
    }

    /**
     * Main game loop
     */
    startGameLoop() {
        this.gameLoop = setInterval(() => {
            this.update();
            this.render();
        }, this.speed);
    }

    /**
     * Stop game loop
     */
    stopGameLoop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }

    /**
     * Update game state (called every frame)
     */
    update() {
        // Update snake direction
        this.snake.direction = this.snake.nextDirection;

        // Calculate new head position
        const head = this.snake.body[0];
        const newHead = {
            x: head.x + this.snake.direction.x,
            y: head.y + this.snake.direction.y
        };

        // Check collisions
        if (this.checkWallCollision(newHead)) {
            this.gameOver('wall');
            return;
        }

        if (this.checkSelfCollision(newHead)) {
            this.gameOver('self');
            return;
        }

        // Move snake
        this.snake.body.unshift(newHead);

        // Check food collision
        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            this.eatFood();
        } else {
            // Remove tail if no food eaten
            this.snake.body.pop();
        }

        // AI Coach analysis
        this.aiCoach.analyze(
            {
                head: this.snake.body[0],
                direction: this.snake.direction
            },
            {
                cols: CONFIG.gridSize,
                rows: CONFIG.gridSize
            },
            this.snake.body
        );
    }

    /**
     * Check if snake hit a wall
     */
    checkWallCollision(position) {
        return position.x < 0 || 
               position.x >= CONFIG.gridSize || 
               position.y < 0 || 
               position.y >= CONFIG.gridSize;
    }

    /**
     * Check if snake hit itself
     */
    checkSelfCollision(position) {
        return this.snake.body.some(segment => 
            segment.x === position.x && segment.y === position.y
        );
    }

    /**
     * Handle food consumption
     */
    eatFood() {
        this.score += 10;
        this.food = this.generateFood();
        
        // Increase speed (decrease interval)
        if (this.speed > CONFIG.minSpeed) {
            this.speed = Math.max(CONFIG.minSpeed, this.speed - CONFIG.speedIncrement);
            this.stopGameLoop();
            this.startGameLoop();
        }
        
        this.updateUI();
    }

    /**
     * Generate new food position (not on snake)
     */
    generateFood() {
        let newFood;
        let isValid = false;

        while (!isValid) {
            newFood = {
                x: Math.floor(Math.random() * CONFIG.gridSize),
                y: Math.floor(Math.random() * CONFIG.gridSize)
            };

            // Check if food spawns on snake
            isValid = !this.snake.body.some(segment => 
                segment.x === newFood.x && segment.y === newFood.y
            );
        }

        return newFood;
    }

    /**
     * Handle game over
     */
    gameOver(cause) {
        this.state = GAME_STATE.GAME_OVER;
        this.stopGameLoop();
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
        
        this.updateUI();
        this.aiCoach.gameOver(this.score, cause);
        this.showGameOverScreen();
    }

    /**
     * Render game graphics
     */
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid (subtle)
        this.drawGrid();

        // Draw food
        this.drawFood();

        // Draw snake
        this.drawSnake();
    }

    /**
     * Draw subtle grid lines
     */
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x <= CONFIG.gridSize; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * CONFIG.cellSize, 0);
            this.ctx.lineTo(x * CONFIG.cellSize, this.canvas.height);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= CONFIG.gridSize; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * CONFIG.cellSize);
            this.ctx.lineTo(this.canvas.width, y * CONFIG.cellSize);
            this.ctx.stroke();
        }
    }

    /**
     * Draw snake with gradient effect
     */
    drawSnake() {
        this.snake.body.forEach((segment, index) => {
            const x = segment.x * CONFIG.cellSize;
            const y = segment.y * CONFIG.cellSize;

            // Head is brightest, tail fades
            const opacity = 1 - (index / this.snake.body.length) * 0.5;
            
            if (index === 0) {
                // Snake head - brighter with glow
                this.ctx.fillStyle = '#00ff41';
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#00ff41';
            } else {
                // Body segments
                this.ctx.fillStyle = `rgba(0, 255, 65, ${opacity})`;
                this.ctx.shadowBlur = 5;
            }

            // Draw rounded rectangle
            this.ctx.fillRect(x + 1, y + 1, CONFIG.cellSize - 2, CONFIG.cellSize - 2);
        });

        // Reset shadow
        this.ctx.shadowBlur = 0;
    }

    /**
     * Draw food with pulsing effect
     */
    drawFood() {
        const x = this.food.x * CONFIG.cellSize;
        const y = this.food.y * CONFIG.cellSize;

        // Pulsing red food
        this.ctx.fillStyle = '#ff4444';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#ff4444';
        
        // Draw as circle
        this.ctx.beginPath();
        this.ctx.arc(
            x + CONFIG.cellSize / 2,
            y + CONFIG.cellSize / 2,
            CONFIG.cellSize / 2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();

        // Reset shadow
        this.ctx.shadowBlur = 0;
    }

    /**
     * Update UI elements
     */
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('highScore').textContent = this.highScore;
        
        // Calculate speed level (1-10)
        const speedLevel = Math.ceil((CONFIG.initialSpeed - this.speed) / CONFIG.speedIncrement) + 1;
        document.getElementById('speed').textContent = speedLevel;
    }

    /**
     * Show game over overlay
     */
    showGameOverScreen() {
        const overlay = document.getElementById('gameOverlay');
        const title = document.getElementById('overlayTitle');
        const message = document.getElementById('overlayMessage');
        const button = document.getElementById('startButton');

        title.textContent = 'GAME OVER';
        message.innerHTML = `
            Final Score: <strong>${this.score}</strong><br>
            High Score: <strong>${this.highScore}</strong><br>
            ${this.score === this.highScore && this.score > 0 ? '🏆 New High Score!' : ''}
        `;
        button.textContent = 'PLAY AGAIN';

        overlay.classList.remove('hidden');
        this.disableControls();
    }

    /**
     * Hide overlay
     */
    hideOverlay() {
        document.getElementById('gameOverlay').classList.add('hidden');
    }

    /**
     * Enable control buttons
     */
    enableControls() {
        document.getElementById('pauseButton').disabled = false;
        document.getElementById('restartButton').disabled = false;
    }

    /**
     * Disable control buttons
     */
    disableControls() {
        document.getElementById('pauseButton').disabled = true;
        document.getElementById('restartButton').disabled = true;
        document.getElementById('pauseIcon').textContent = '⏸';
    }

    /**
     * Load high score from localStorage
     */
    loadHighScore() {
        const saved = localStorage.getItem('snakeHighScore');
        return saved ? parseInt(saved, 10) : 0;
    }

    /**
     * Save high score to localStorage
     */
    saveHighScore() {
        localStorage.setItem('snakeHighScore', this.highScore.toString());
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});
