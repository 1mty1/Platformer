document.addEventListener("DOMContentLoaded", function () {
  // Game variables
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const player = {
    x: 50,
    y: 500,
    width: 50,
    height: 50,
    color: "#dedede",
    borderColor: "black", // Color for the player border
    speed: 5,
    jumpStrength: 15,
    isJumping: false,
    canJump: true,
    velocityY: 0,
  };

  function createBlock(x, y, width, height, canJump = true, isDeathBlock = false, color = "black") {
    return {
      x,
      y,
      width,
      height,
      color,
      canJump,
      isDeathBlock,
    };
  }

  const platform1 = createBlock(0, 480, 1000, 20);
  const platform2 = createBlock(500, 395, 150, 20);
  const platform3 = createBlock(500, 300, 150, 20,);
  const platform4 = createBlock(300, 450, 50, 30 ,false, true, "red");

  // Keyboard input
  const keys = {};

  window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (e.key === " ") {
      e.preventDefault();
    }
  });
  window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
    if (e.key === " ") {
      player.canJump = true;
    }
  });

  // Update function
  function update() {
    // Handle player movement
    if ((keys[" "] || keys["w"]) && !player.isJumping && player.canJump) {
      player.isJumping = true;
      player.canJump = false;
      player.velocityY = -player.jumpStrength;
    }

    if (keys["r"]) {
      player.x =50;
      player.y =500;
    }
    
    if (keys["a"] && player.x > 0) {
      player.x -= player.speed;
    }

    if (keys["d"] && player.x + player.width < canvas.width) {
      player.x += player.speed;
    }

     var jumpcounter = 0
    if ( player.isJumping) {
      player.isJumping = true
       document.getElementById('jumppcounter').value = ++jumppcounter;
   }
    
    
    
    // Apply gravity
    if (player.y < canvas.height - player.height) {
      player.velocityY += 1; // Gravity
      player.y += player.velocityY;
    } else {
      player.y = canvas.height - player.height;
      player.isJumping = false;
      player.canJump = true;
      player.velocityY = 0;
    }

    // Check for collision with platform1
    handleCollision(player, platform1);

    // Check for collision with platform2
    handleCollision(player, platform2);

    // Check for collision with platform3
    handleCollision(player, platform3);
    
    handleCollision(player, platform4);

    // Draw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer(player);
    drawRect(platform1);
    drawRect(platform2);
    drawRect(platform3);
    drawRect(platform4);

    // Call update again
    requestAnimationFrame(update);
  }

  // Draw player function
  function drawPlayer(player) {
    // Draw player border
    ctx.fillStyle = player.borderColor;
    ctx.fillRect(player.x - 2, player.y - 2, player.width + 4, player.height + 4);

    // Draw filled player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }

  // Draw rectangle function
  function drawRect(obj) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
  }

  // Handle collision function
  function handleCollision(player, block) {
        if (
      player.x < block.x + block.width &&
      player.x + player.width > block.x &&
      player.y + player.height > block.y &&
      player.y < block.y + block.height
    ) {
      // Check if player is above the platform
      if (player.y < block.y && player.velocityY >= 0) {
        if (block.isDeathBlock){
          player.x=50
          player.y=500
        }
        player.y = block.y - player.height;
        player.isJumping = false;
        player.canJump = true;
        player.velocityY = 0;
      }
      // Check if player is below the platform
      else if (player.y > block.y && player.velocityY <= 0) {
                if (block.isDeathBlock){
          player.x=50
          player.y=500
        }
        player.y = block.y + block.height;
        player.velocityY = 0;
      }
    } 

  }

  // Start the game loop
  update();
});