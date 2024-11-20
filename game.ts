const basket = document.getElementById("basket") as HTMLElement;
const item = document.getElementById("item") as HTMLElement;
const scoreElement = document.getElementById("score") as HTMLElement;
const startScreen = document.getElementById("start-screen") as HTMLElement;
const gameOverScreen = document.getElementById("game-over-screen") as HTMLElement;
const finalScoreElement = document.getElementById("final-score") as HTMLElement;
const startButton = document.getElementById("start-button") as HTMLElement;
const restartButton = document.getElementById("restart-button") as HTMLElement;

let basketPosition = window.innerWidth / 2 - basket.offsetWidth / 2;
let itemPosition = { x: Math.random() * window.innerWidth, y: 0 };
let score = 0;
let misses = 0;
let gameRunning = false;

// Basket movement for touch devices
let touchStartX = 0;
let isTouching = false;

document.addEventListener("touchstart", (event) => {
  if (!gameRunning) return;
  isTouching = true;
  touchStartX = event.touches[0].clientX; // Record the starting touch position
});

document.addEventListener("touchmove", (event) => {
  if (!gameRunning || !isTouching) return;
  
  const touchX = event.touches[0].clientX; // Get the current touch position
  const deltaX = touchX - touchStartX; // Calculate the movement

  basketPosition += deltaX; // Update basket position
  touchStartX = touchX; // Update the starting position for the next move

  // Prevent the basket from moving out of bounds
  basketPosition = Math.max(0, Math.min(basketPosition, window.innerWidth - basket.offsetWidth));
  basket.style.left = `${basketPosition}px`;
});

document.addEventListener("touchend", () => {
  isTouching = false; // Stop movement when touch ends
});

// Basket movement for keyboard devices
document.addEventListener("keydown", (event) => {
  if (!gameRunning) return;

  const step = window.innerWidth * 0.05; // Responsive step size
  if (event.key === "ArrowLeft" && basketPosition > 0) {
    basketPosition -= step;
  } else if (
    event.key === "ArrowRight" &&
    basketPosition < window.innerWidth - basket.offsetWidth
  ) {
    basketPosition += step;
  }

  basket.style.left = `${basketPosition}px`;
});

// Update item position
function updateItem() {
  if (!gameRunning) return;

  itemPosition.y += window.innerHeight * 0.01; // Responsive falling speed

  if (itemPosition.y > window.innerHeight) {
    misses++;
    resetItem();

    if (misses >= 3) {
      endGame();
    }
  }

  item.style.top = `${itemPosition.y}px`;
  item.style.left = `${itemPosition.x}px`;

  // Collision detection
  if (
    itemPosition.y + item.offsetHeight > basket.offsetTop && // Ball bottom crosses basket top
    itemPosition.x + item.offsetWidth > basketPosition && // Ball right crosses basket left
    itemPosition.x < basketPosition + basket.offsetWidth // Ball left crosses basket right
  ) {
    score++;
    scoreElement.textContent = score.toString();
    resetItem();
  }
}

// Reset item position and color
function resetItem() {
  itemPosition.y = 0;
  itemPosition.x = Math.random() * (window.innerWidth - item.offsetWidth);
  item.style.backgroundColor = getRandomColor();
}

// Generate random color
function getRandomColor() {
  const colors = ["#FF6347", "#FFD700", "#7FFF00", "#1E90FF", "#FF69B4"];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Start game
function startGame() {
  score = 0;
  misses = 0;
  gameRunning = true;
  scoreElement.textContent = score.toString();
  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  resetItem();
  requestAnimationFrame(gameLoop);
}

// End game
function endGame() {
  gameRunning = false;
  finalScoreElement.textContent = score.toString();
  gameOverScreen.classList.remove("hidden");
}

// Game loop
function gameLoop() {
  updateItem();
  if (gameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

// Event listeners
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
