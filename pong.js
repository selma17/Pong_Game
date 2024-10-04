// Variables globales
let board;
let boardWidth = 500;
let boardHeight = 667;
let context;

let playerWidth = 10;
let playerHeight = 40;
let playerVelocityY = 3;

// Variables pour les images des rounds
let roundImages = {};
let currentRoundImage = null;

let player1 = {
    x: 10,
    y: boardHeight / 2 - playerHeight / 2,
    width: playerWidth,
    height: playerHeight,
    velocityY: 0,
    roundScore: 0,
    globalScore: 0
};

let player2 = {
    x: boardWidth - playerWidth - 10,
    y: boardHeight / 2 - playerHeight / 2,
    width: playerWidth,
    height: playerHeight,
    velocityY: 0,
    roundScore: 0,
    globalScore: 0
};

// Balle
let ballRadius = 9;
let ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    radius: ballRadius,
    velocityX: 1.5, // Augmentation de la vitesse initiale
    velocityY: 1.5
};

let currentRound = 1;
let isRoundStarting = true;
let roundStartTime = 0;
let gameEnded = false;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    loadRoundImages(); // Charger les images des rounds
    startNewRound();
    requestAnimationFrame(update);
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
};

// Charger les images pour chaque round
function loadRoundImages() {
    for (let i = 1; i <= 5; i++) { 
        let img = new Image();
        img.src = "round" + i + ".png"; 
        roundImages[i] = img;
    }
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    if (isRoundStarting) {
        currentRoundImage = roundImages[currentRound];
        if (currentRoundImage) {
            context.drawImage(currentRoundImage, 0, 0, boardWidth, boardHeight);
        }

        if (Date.now() - roundStartTime > 2000) {
            isRoundStarting = false;
        }
        return;
    }

    // Fin du jeu
    if (gameEnded) {
        return;
    }

    // Déplacement des raquettes
    player1.y += player1.velocityY;
    player2.y += player2.velocityY;

    // Limiter les raquettes au cadre
    player1.y = Math.max(Math.min(player1.y, boardHeight - playerHeight), 0);
    player2.y = Math.max(Math.min(player2.y, boardHeight - playerHeight), 0);

    // Dessiner les raquettes
    context.fillStyle = "red";
    context.fillRect(player1.x, player1.y, playerWidth, playerHeight);
    context.fillRect(player2.x, player2.y, playerWidth, playerHeight);

    // Déplacement de la balle
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Dessiner la balle
    context.fillStyle = "black";
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fill();

    // Rebondir sur le haut/bas du cadre
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= boardHeight) {
        ball.velocityY *= -1;
    }

    // Vérifier les collisions avec les raquettes
    if (detectCollision(ball, player1)) {
        ball.velocityX *= -1;
        ball.x = player1.x + player1.width + ball.radius;
    } else if (detectCollision(ball, player2)) {
        ball.velocityX *= -1;
        ball.x = player2.x - ball.radius;
    }

    // Vérifier si la balle sort du cadre 
    if (ball.x - ball.radius < 0) {
        player2.roundScore++;
        resetBall();
        resetPlayers();
    } else if (ball.x + ball.radius > boardWidth) {
        player1.roundScore++;
        resetBall();
        resetPlayers();
    }

    // Vérifier si un joueur a gagné le round
    if (player1.roundScore >= 3 || player2.roundScore >= 3) {
        endRound();
    }

    // Afficher les scores et les informations
    displayScores();
}

function resetBall() {
    ball.x = boardWidth / 2;
    ball.y = boardHeight / 2;

    // Générer une direction aléatoire pour la balle
    let randomDirectionX = Math.random() < 0.5 ? -1 : 1;
    let randomDirectionY = Math.random() < 0.5 ? -1 : 1;  

    ball.velocityX = 1.5;
    ball.velocityY = 1.5;
}

function resetPlayers() {
    player1.x = 10;
    player1.y = boardHeight / 2 - playerHeight / 2;
    player2.x = boardWidth - playerWidth - 10;
    player2.y = boardHeight / 2 - playerHeight / 2;
}

function startNewRound() {
    player1.roundScore = 0;
    player2.roundScore = 0;
    roundStartTime = Date.now();
    isRoundStarting = true;
    resetBall();
}

function endRound() {
    if (player1.roundScore >= 3) {
        player1.globalScore += 1;
    } else {
        player2.globalScore += 1; 
    }

    if (player1.globalScore >= 2 || player2.globalScore >= 2) {
        // afficher le bouton "Reset"
        gameEnded = true;
        createResetButton();
        return;
    }

    currentRound++;
    startNewRound();
}

function createResetButton() {
    let resetButton = document.createElement("button");
    resetButton.innerText = "REPLAY";
    
    // Appliquer du style au bouton
    resetButton.style.position = "absolute";
    resetButton.style.top = "70%";
    resetButton.style.left = "50%";
    resetButton.style.transform = "translateX(-50%)";
    resetButton.style.padding = "15px 30px"; 
    resetButton.style.fontSize = "22px";  
    resetButton.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";  
    resetButton.style.color = "white"; 
    resetButton.style.backgroundColor = "black"; 
    resetButton.style.border = "none";
    resetButton.style.borderRadius = "10px"; 
    resetButton.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)"; 
    resetButton.style.cursor = "pointer";
    resetButton.style.transition = "background-color 0.3s, box-shadow 0.3s";  
    
    resetButton.addEventListener("mouseover", function() {
        resetButton.style.backgroundColor = "#0056b3";  
        resetButton.style.boxShadow = "0 6px 14px rgba(0, 0, 0, 0.3)"; 
    });
    
    resetButton.addEventListener("mouseout", function() {
        resetButton.style.backgroundColor = "black";  
        resetButton.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)"; 
    });

    // Ajouter le bouton au document
    document.body.appendChild(resetButton);

    // Rafraîchir la page lorsqu'on clique sur le bouton
    resetButton.addEventListener("click", function() {
        location.reload();
    });
}


function keyDownHandler(e) {
    if (e.code === "KeyW") {
        player1.velocityY = -playerVelocityY;
    } else if (e.code === "KeyS") {
        player1.velocityY = playerVelocityY;
    }

    if (e.code === "ArrowUp") {
        player2.velocityY = -playerVelocityY;
    } else if (e.code === "ArrowDown") {
        player2.velocityY = playerVelocityY;
    }
}

function detectCollision(ball, player) {
    return ball.x - ball.radius < player.x + player.width &&
        ball.x + ball.radius > player.x &&
        ball.y - ball.radius < player.y + player.height &&
        ball.y + ball.radius > player.y;
}

function displayScores() {
    // Afficher les noms des joueurs (Player 1, Player 2)
    context.font = "bold 30px Arial"; 
    context.fillStyle = "#FF0000";  
    context.textAlign = "center";  
    context.fillText("Player 1", boardWidth / 5, 50); 
    context.fillStyle = "#0000FF"; 
    context.fillText("Player 2", boardWidth * 4 / 5, 50); 
   
    context.font = "bold 50px Arial"; 
    context.fillStyle = "#000000"; 
    context.fillText(player1.roundScore, boardWidth / 5, 120); 
    context.fillText(player2.roundScore, boardWidth * 4 / 5, 120); 

    // Afficher les scores globaux 
    context.font = "30px Arial";  
    context.fillStyle = "#FF0000";  
    context.fillText(player1.globalScore + "/2", boardWidth / 5, boardHeight - 30); 
    context.fillStyle = "#0000FF"; 
    context.fillText(player2.globalScore + "/2", boardWidth * 4 / 5, boardHeight - 30);

}

let touchstartX = 0;
let touchendX = 0;
let touchstartY = 0;
let touchendY = 0;


let square = document.getElementById('square');
let positionX = 0;  
let positionY = 0;  

function left() {
  positionX -= 10; 
  square.style.transform = `translate(${positionX}px, ${positionY}px)`;
}

function right() {
  positionX += 10;  
  square.style.transform = `translate(${positionX}px, ${positionY}px)`;
}

function up() {
  positionY -= 10;  
  square.style.transform = `translate(${positionX}px, ${positionY}px)`;
}

function down() {
  positionY += 10;  
  square.style.transform = `translate(${positionX}px, ${positionY}px)`;
}

function handleGesture(e) {
  if (touchendX - touchstartX < -45) {
    left(); 
  } else if (touchendX - touchstartX > 45) {
    right(); 
  } else if (touchendY - touchstartY < -45) {
    up(); 
  } else if (touchendY - touchstartY > 45) {
    down(); 
  }
}

document.body.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX;
  touchstartY = e.changedTouches[0].screenY;
});

document.body.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX;
  touchendY = e.changedTouches[0].screenY;
  handleGesture(e);
});


  
