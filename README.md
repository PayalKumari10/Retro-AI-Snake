# 🐍 Retro Snake Game - AI Coach Edition

A fully functional, retro-styled Snake game with an intelligent AI Coach that provides real-time gameplay hints. Built with vanilla HTML, CSS, and JavaScript.

## 🎮 Features

### Core Gameplay
- **Classic Snake mechanics** - Grid-based movement with smooth controls
- **Progressive difficulty** - Speed increases as you eat more food
- **Collision detection** - Wall and self-collision with game over
- **Score tracking** - Current score and persistent high score (localStorage)
- **Pause/Resume** - Full game state control

### AI Coach (Rule-Based Intelligence)
The AI Coach monitors your gameplay in real-time and provides contextual hints:
- **Wall danger detection** - Warns when approaching walls (3 cells away)
- **Self-trap detection** - Alerts when boxing yourself in (3+ blocked sides)
- **Positive reinforcement** - Encourages good moves toward open space
- **Smart cooldown** - Prevents message spam (3-second intervals)
- **Priority system** - Shows most critical warnings first

### UI/UX Design
- **Retro aesthetic** - Win95/arcade-inspired with neon green theme
- **Smooth animations** - No jitter, clean rendering with glow effects
- **Clear visual hierarchy** - Separated panels for score, coach, and controls
- **Responsive layout** - Works on desktop and mobile
- **Accessibility** - High contrast, clear typography, keyboard-first controls

## 🚀 Quick Start

1. **Download all files** to a folder:
   - `index.html`
   - `style.css`
   - `game.js`
   - `aiCoach.js`

2. **Open `index.html`** in any modern browser

3. **Play!** No build tools, no dependencies, no setup required.

## 🎯 Controls

| Key | Action |
|-----|--------|
| `↑` `↓` `←` `→` | Move snake |
| `SPACE` | Pause/Resume |
| Click buttons | Start, Pause, Restart |

## 🧠 How the AI Coach Works

The AI Coach uses **rule-based logic** (no ML, no APIs) to analyze gameplay:

### 1. Wall Danger Detection
```javascript
// Checks if snake is within 3 cells of a wall in current direction
if (dir.x === 1 && head.x >= grid.cols - 3) return true; // Moving right
```

### 2. Self-Trap Detection
```javascript
// Counts blocked surrounding cells (walls + snake body)
// Warns if 3+ of 4 adjacent cells are blocked
```

### 3. Good Move Recognition
```javascript
// Rewards moving toward center with open space
// Encourages strategic positioning
```

### Priority System
1. **Danger** (red) - Immediate wall collision risk
2. **Warning** (orange) - Self-trapping patterns
3. **Success** (green) - Good strategic moves
4. **Info** (blue) - General tips

## 📁 File Structure

```
retro-snake/
├── index.html      # Game structure and layout
├── style.css       # Retro styling and animations
├── game.js         # Core game logic and rendering
└── aiCoach.js      # AI intelligence and hint system
```

## 🎨 UX Design Choices

### Why These Decisions Improve Gameplay:

1. **Neon Green on Black** - High contrast reduces eye strain, classic arcade feel
2. **Grid Overlay** - Helps players plan moves spatially
3. **Snake Gradient** - Head is brightest, making direction instantly clear
4. **Pulsing Food** - Draws attention without being distracting
5. **AI Coach Panel** - Separate from game board to avoid visual clutter
6. **Smooth Speed Progression** - Gradual difficulty curve keeps players engaged
7. **Persistent High Score** - Motivates replay and improvement
8. **Keyboard-First Controls** - Fastest input method for precision gameplay
9. **Clear Button States** - Disabled states prevent confusion
10. **Instant Feedback** - All actions have immediate visual/textual response

## 🔧 Customization

Edit `CONFIG` object in `game.js`:

```javascript
const CONFIG = {
    gridSize: 20,        // Grid dimensions (20x20)
    cellSize: 20,        // Pixel size of each cell
    initialSpeed: 150,   // Starting speed (ms per frame)
    speedIncrement: 5,   // Speed increase per food
    minSpeed: 50         // Maximum speed limit
};
```

## 🏆 Scoring System

- **+10 points** per food eaten
- **Speed increases** every food (up to max speed)
- **High score** persists across sessions

## 🌟 Code Quality

- **Modular architecture** - Separate concerns (game logic, AI, rendering)
- **Clear naming** - Self-documenting code with descriptive variables
- **Comprehensive comments** - Explains "why" not just "what"
- **No dependencies** - Pure vanilla JavaScript
- **Production-ready** - Error handling, state management, clean structure

## 📱 Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## 🎓 Learning Resources

This project demonstrates:
- Canvas API rendering
- Game loop architecture
- State management
- Event handling
- LocalStorage API
- CSS animations
- Responsive design
- Rule-based AI logic

## 📄 License

MIT

---

**Enjoy the game! 🎮 May the AI Coach guide you to victory!**
