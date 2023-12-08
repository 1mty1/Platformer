document.addEventListener("DOMContentLoaded", function () {
  // Game variables
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  let shiftPressed = false;
  //buttons
  var nextLevel = document.getElementById("nextlevel");
  nextLevel.addEventListener("click", levelAdd);
  var perviousLevel = document.getElementById("previouslevel");
  perviousLevel.addEventListener("click", function () {
  levelAdd(false);
  });
  //levels
  var level = 0;
    function levelAdd(x) { //it dont work
    if (x) {
      if (level == levels.length - 1) {
        level = 0;
      } else {
        level++;
      }
      player.x = 50;
      player.y = 500;
    }
    if (!x) {
      if (level == 0) {
      } else {
        level -= 1;
      }
      player.x = 50;
      player.y = 500;
    }
  }

  // save level
  function savegame() {
    var gamesave = {
      level: level,
    };
    localStorage.setItem("gamesave", JSON.stringify(gamesave));
  }

  setInterval(function () {
    savegame();
  }, 200);

  window.onload = function () {
    loadgame();
  };

  function loadgame() {
    var savedgame = JSON.parse(localStorage.getItem("gamesave"));
    if (typeof savedgame.level !== "undefined") level = 0;
    level = Number(savedgame.level);
  }
  if (level == undefined) {
    level = 0;
  }

  //
  const player = {
    x: 50,
    y: 500,
    width: 50,
    height: 50,
    color: "#505d6e",
    borderColor: "black", // Color for the player border
    speed: 5,
    jumpStrength: 15,
    isJumping: false,
    canJump: true,
    velocityY: 0,
  };

  function createBlock(
    x,
    y,
    width,
    height,
    canJump = true,
    isDeathBlock = false,
    color = "black",
    isFlag = false
  ) {
    return {
      x,
      y,
      width,
      height,
      color, //can be hexcoded - ex: '#FF0000'
      canJump,
      isDeathBlock,
      isFlag,
    };
  }

  let level1 = [
    createBlock(0, 480, 1000, 20),
    createBlock(500, 395, 150, 20),
    createBlock(500, 300, 150, 20),
    createBlock(300, 450, 50, 30, false, true, "red"),
    createBlock(300, 250, 50, 30, false, true, "lime", true),
  ];

  let level2 = [
    createBlock(0, 480, 140, 20),
    createBlock(200, 395, 150, 20),
    createBlock(350, 340, 150, 20),
    createBlock(450, 310, 50, 30, false, true, "red"),
    createBlock(550, 280, 150, 20),
    createBlock(140, 480, 760, 20, false, true, "red"),
    createBlock(900, 480, 100, 30, true, false, "lime", true),
  ];

  let level3 = [
    createBlock(0, 480, 140, 20),
    createBlock(140, 480, 760, 20, false, true, "red"),
    createBlock(900, 480, 100, 30, true, false, "lime", true),
    createBlock(250, 480, 100, 30, true, false, "blue", true),
  ];

  let level4 = [
    createBlock(0, 480, 160, 20, true, false),
    createBlock(200, 396, 160, 20, true, false),
    createBlock(570, 396, 50, 20, true, false),
    createBlock(770, 320, 50, 20, true, false),
    createBlock(250, 357, 50, 40, false, true, "red"),
    createBlock(160, 480, 740, 20, false, true, "red"),
    createBlock(900, 480, 100, 20.9, false, true, "lime", true),
  ];

  let level5 = [createBlock(0, 480, 160, 20, true, false)];

  let levels = [level1, level2, level3, level4, level5];
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
  }); // Update function
  function update() {
    // Handle player movement
    if ((keys[" "] || keys["w"]) && !player.isJumping && player.canJump) {
      player.isJumping = true;
      player.canJump = false;
      player.velocityY = -player.jumpStrength;
    }

    if (keys["r"]) {
      player.x = 50;
      player.y = 500;
    }

    if (keys["a"] && player.x > 0) {
      player.x -= player.speed;
    }

    if (keys["d"] && player.x + player.width < canvas.width) {
      player.x += player.speed;
    }
    document.addEventListener(
      "keydown",
      function (event) {
        if (event.shiftKey && event.which == 82) {
          event.preventDefault();
          level = 0;
          player.x = 50;
          player.y = 500;
        }
      },
      false
    );
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //handle collision for each obj
    for (let i = 0; i < levels[level].length; i++) {
      let x = levels[level];
      let y = x[i];
      handleCollision(player, y);
    }
    //draw each obj except playa
    for (let i = 0; i < levels[level].length; i++) {
      let x = levels[level];
      let y = x[i];
      drawRect(y);
    }

    // f test
    ctx.font = "20px Arial";
    ctx.fillText("f", 10, 50);
    drawPlayer(player);

    // Call update again
    requestAnimationFrame(update);
  }

  // Draw playa function

  function drawPlayer(player) {
    // Draw player border
    ctx.fillStyle = player.borderColor;
    ctx.fillRect(
      player.x - 2,
      player.y - 2,
      player.width + 4,
      player.height + 4
    );

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
      // Check if playa is above the platform
      if (player.y < block.y && player.velocityY >= 0) {
        if (block.isDeathBlock) {
          player.x = 50;
          player.y = 500;
        }
        if (block.isFlag) {
          levelAdd(true);
        }
        player.y = block.y - player.height;
        player.isJumping = false;
        player.canJump = true;
        player.velocityY = 0;
      }
      // Check if playa is below the platform
      else if (player.y > block.y) {
        if (block.isDeathBlock) {
          player.x = 50;
          player.y = 500;
        }
        if (block.isFlag) {
          levelAdd(true);
        }
        player.y = block.y + block.height;
        player.velocityY = 0;
      }
    }

  }
  //clear console for devmode

  // Start the game loop
  update();
});
