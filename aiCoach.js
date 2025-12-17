/* ===================================
   AI COACH - RULE-BASED INTELLIGENCE
   Monitors gameplay and provides hints
   =================================== */

class AICoach {
    constructor() {
        this.messageElement = document.getElementById('coachMessage');
        this.lastMessage = '';
        this.messageTimer = null;
        this.messageCooldown = 3000; // 3 seconds between messages
        this.lastMessageTime = 0;
        
        // Message categories with priorities
        this.messages = {
            danger: [
                "⚠️ Wall ahead! Turn now!",
                "🚨 Danger zone! Change direction!",
                "⛔ You're heading into a wall!"
            ],
            selfTrap: [
                "🔄 You're boxing yourself in!",
                "⚡ Tight space! Plan your escape!",
                "🎯 Leave yourself room to move!"
            ],
            goodMove: [
                "✨ Nice move! Keep it up!",
                "👍 Good spacing!",
                "🎮 Smooth navigation!"
            ],
            general: [
                "🐍 Stay focused!",
                "💡 Plan ahead!",
                "🎯 Watch your tail!"
            ]
        };
    }

    /**
     * Main analysis function - called every game tick
     * @param {Object} snake - Snake object with position and direction
     * @param {Object} grid - Grid dimensions
     * @param {Array} snakeBody - Full snake body array
     */
    analyze(snake, grid, snakeBody) {
        const now = Date.now();
        
        // Cooldown check to avoid message spam
        if (now - this.lastMessageTime < this.messageCooldown) {
            return;
        }

        // Priority 1: Check for immediate wall danger
        if (this.checkWallDanger(snake, grid)) {
            this.showMessage(this.getRandomMessage('danger'), 'danger');
            return;
        }

        // Priority 2: Check for self-trapping patterns
        if (this.checkSelfTrap(snake, grid, snakeBody)) {
            this.showMessage(this.getRandomMessage('selfTrap'), 'warning');
            return;
        }

        // Priority 3: Positive reinforcement for good moves
        if (this.checkGoodMove(snake, grid, snakeBody)) {
            this.showMessage(this.getRandomMessage('goodMove'), 'success');
            return;
        }
    }

    /**
     * Detects if snake is approaching a wall (within 2-3 cells)
     */
    checkWallDanger(snake, grid) {
        const head = snake.head;
        const dir = snake.direction;
        const dangerZone = 3; // cells from wall

        // Check based on current direction
        if (dir.x === 1 && head.x >= grid.cols - dangerZone) return true; // Moving right
        if (dir.x === -1 && head.x < dangerZone) return true; // Moving left
        if (dir.y === 1 && head.y >= grid.rows - dangerZone) return true; // Moving down
        if (dir.y === -1 && head.y < dangerZone) return true; // Moving up

        return false;
    }

    /**
     * Detects if snake is creating a tight loop or trapping itself
     */
    checkSelfTrap(snake, grid, snakeBody) {
        const head = snake.head;
        const surroundingCells = this.getSurroundingCells(head, grid);
        
        // Count how many surrounding cells are blocked
        let blockedCells = 0;
        
        for (const cell of surroundingCells) {
            // Check if cell is occupied by snake body or out of bounds
            if (this.isCellBlocked(cell, grid, snakeBody)) {
                blockedCells++;
            }
        }

        // If 3 or more surrounding cells are blocked, snake is in danger
        return blockedCells >= 3;
    }

    /**
     * Detects good moves (moving toward open space)
     */
    checkGoodMove(snake, grid, snakeBody) {
        const head = snake.head;
        const dir = snake.direction;
        
        // Calculate next position
        const nextPos = {
            x: head.x + dir.x,
            y: head.y + dir.y
        };

        // Check if moving toward center (away from edges)
        const centerX = Math.floor(grid.cols / 2);
        const centerY = Math.floor(grid.rows / 2);
        
        const distanceToCenter = Math.abs(nextPos.x - centerX) + Math.abs(nextPos.y - centerY);
        const currentDistance = Math.abs(head.x - centerX) + Math.abs(head.y - centerY);

        // Good move if moving toward center and have open space
        if (distanceToCenter < currentDistance && snakeBody.length > 10) {
            const openSpace = this.countOpenSpace(nextPos, grid, snakeBody);
            return openSpace >= 3;
        }

        return false;
    }

    /**
     * Get all adjacent cells (up, down, left, right)
     */
    getSurroundingCells(pos, grid) {
        return [
            { x: pos.x + 1, y: pos.y },
            { x: pos.x - 1, y: pos.y },
            { x: pos.x, y: pos.y + 1 },
            { x: pos.x, y: pos.y - 1 }
        ];
    }

    /**
     * Check if a cell is blocked (wall or snake body)
     */
    isCellBlocked(cell, grid, snakeBody) {
        // Out of bounds check
        if (cell.x < 0 || cell.x >= grid.cols || cell.y < 0 || cell.y >= grid.rows) {
            return true;
        }

        // Snake body collision check
        return snakeBody.some(segment => segment.x === cell.x && segment.y === cell.y);
    }

    /**
     * Count open adjacent cells
     */
    countOpenSpace(pos, grid, snakeBody) {
        const surrounding = this.getSurroundingCells(pos, grid);
        let openCount = 0;

        for (const cell of surrounding) {
            if (!this.isCellBlocked(cell, grid, snakeBody)) {
                openCount++;
            }
        }

        return openCount;
    }

    /**
     * Display message with type-based styling
     */
    showMessage(message, type = 'info') {
        if (message === this.lastMessage) return;

        this.lastMessage = message;
        this.lastMessageTime = Date.now();
        this.messageElement.textContent = message;

        // Apply color based on message type
        const colors = {
            danger: '#ff4444',
            warning: '#ffaa00',
            success: '#00ff88',
            info: '#66b3ff'
        };

        this.messageElement.style.color = colors[type] || colors.info;
    }

    /**
     * Get random message from category
     */
    getRandomMessage(category) {
        const messages = this.messages[category];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    /**
     * Reset coach state
     */
    reset() {
        this.lastMessage = '';
        this.lastMessageTime = 0;
        this.showMessage('Let\'s go! Stay alert!', 'info');
    }

    /**
     * Show game over analysis
     */
    gameOver(score, cause) {
        const messages = {
            wall: `💥 Wall collision! Final score: ${score}`,
            self: `🔄 Self collision! Final score: ${score}`,
            default: `Game Over! Final score: ${score}`
        };

        this.showMessage(messages[cause] || messages.default, 'danger');
    }
}
