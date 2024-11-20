var basket = document.getElementById("basket");
var item = document.getElementById("item");
var scoreElement = document.getElementById("score");
var startScreen = document.getElementById("start-screen");
var gameOverScreen = document.getElementById("game-over-screen");
var finalScoreElement = document.getElementById("final-score");
var startButton = document.getElementById("start-button");
var restartButton = document.getElementById("restart-button");
var basketPosition = window.innerWidth / 2 - basket.offsetWidth / 2;
var itemPosition = { x: Math.random() * window.innerWidth, y: 0 };
var score = 0;
var misses = 0;
var gameRunning = false;
// Basket movement for touch devices
var touchStartX = 0;
var isTouching = false;
document.addEventListener("touchstart", function (event) {
    if (!gameRunning)
        return;
    isTouching = true;
    touchStartX = event.touches[0].clientX; // Record the starting touch position
});
document.addEventListener("touchmove", function (event) {
    if (!gameRunning || !isTouching)
        return;
    var touchX = event.touches[0].clientX; // Get the current touch position
    var deltaX = touchX - touchStartX; // Calculate the movement
    basketPosition += deltaX; // Update basket position
    touchStartX = touchX; // Update the starting position for the next move
    // Prevent the basket from moving out of bounds
    basketPosition = Math.max(0, Math.min(basketPosition, window.innerWidth - basket.offsetWidth));
    basket.style.left = "".concat(basketPosition, "px");
});
document.addEventListener("touchend", function () {
    isTouching = false; // Stop movement when touch ends
});
// Basket movement for keyboard devices
document.addEventListener("keydown", function (event) {
    if (!gameRunning)
        return;
    var step = window.innerWidth * 0.05; // Responsive step size
    if (event.key === "ArrowLeft" && basketPosition > 0) {
        basketPosition -= step;
    }
    else if (event.key === "ArrowRight" &&
        basketPosition < window.innerWidth - basket.offsetWidth) {
        basketPosition += step;
    }
    basket.style.left = "".concat(basketPosition, "px");
});
// Update item position
function updateItem() {
    if (!gameRunning)
        return;
    itemPosition.y += window.innerHeight * 0.01; // Responsive falling speed
    if (itemPosition.y > window.innerHeight) {
        misses++;
        resetItem();
        if (misses >= 3) {
            endGame();
        }
    }
    item.style.top = "".concat(itemPosition.y, "px");
    item.style.left = "".concat(itemPosition.x, "px");
    // Collision detection
    if (itemPosition.y + item.offsetHeight > basket.offsetTop && // Ball bottom crosses basket top
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
    var colors = ["#FF6347", "#FFD700", "#7FFF00", "#1E90FF", "#FF69B4"];
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
