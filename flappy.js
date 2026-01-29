(function () {
  // ==========================================
  //  CONFIGURATION
  // ==========================================
  const birdConfig = {
    color: "#FFD700",
    imageUrl: "assets/flappy/dtoe_flappy.png",
    radius: 12,
    speed: 0,
    gravity: 0.25,
    jumpStrength: 4.5,
  };

  const myLifeEvents = [
    {
      title: "Trail of Ten Falls",
      color: "#d1e8e2",
      imageUrl: "assets/flappy/trail_of_ten_falls.jpg",
      range: "7.4 miles",
    },
    {
      title: "Multnomah-Wahkeena Falls Loop",
      color: "#f9ebff",
      imageUrl: "assets/flappy/multnomah_wahkeena_falls_loop.jpg",
      range: "4.9 miles",
    },
    {
      title: "Misery Ridge Trail",
      color: "#fff4e3",
      imageUrl: "assets/flappy/misery_ridge_trail.jpeg",
      range: "3.5 miles",
    },
    {
      title: "South Sister Summit",
      color: "#e2f0ff",
      imageUrl: "assets/flappy/south_sister_summit.webp",
      range: "12.2 miles",
    },
    {
      title: "Tamolitch Blue Pool",
      color: "#d4f1f4",
      imageUrl: "assets/flappy/tamolitch_blue_pool.jpg",
      range: "4.2 miles",
    },
    {
      title: "Angel’s Rest",
      color: "#ffecda",
      imageUrl: "assets/flappy/angels_rest.webp",
      range: "4.8 miles",
    },
    {
      title: "Ramona Falls",
      color: "#e8f5e9",
      imageUrl: "assets/flappy/ramona_falls.jpg",
      range: "7.1 miles",
    },
    {
      title: "Tamanawas Falls",
      color: "#f3e5f5",
      imageUrl: "assets/flappy/tamanawas_falls.webp",
      range: "3.4 miles",
    },
    {
      title: "Mirror Lake",
      color: "#e0f2f1",
      imageUrl: "assets/flappy/mirror_lake.jpg",
      range: "4.2 miles",
    },
    {
      title: "Tom, Dick, and Harry Mountain",
      color: "#fff9c4",
      imageUrl: "assets/flappy/tom_dick_and_harry_mountain.jpg",
      range: "9.0 miles",
    },
    {
      title: "Eagle Creek to Tunnel Falls",
      color: "#fce4ec",
      imageUrl: "assets/flappy/eagle_creek_to_tunnel_falls.webp",
      range: "12.0 miles",
    },
    {
      title: "God’s Thumb",
      color: "#e1f5fe",
      imageUrl: "assets/flappy/gods_thumb.webp",
      range: "4.3 miles",
    },
    {
      title: "Cape Lookout",
      color: "#efebe9",
      imageUrl: "assets/flappy/cape_lookout.jpeg",
      range: "4.7 miles",
    },
    {
      title: "Saddle Mountain",
      color: "#f1f8e9",
      imageUrl: "assets/flappy/saddle_mountain.jpg",
      range: "4.7 miles",
    },
    {
      title: "Drift Creek Falls",
      color: "#fff3e0",
      imageUrl: "assets/flappy/drift_creek_falls.jpg",
      range: "3.7 miles",
    },
    {
      title: "Green Lakes Trail",
      color: "#e0f7fa",
      imageUrl: "assets/flappy/green_lakes_trail.jpg",
      range: "9.1 miles",
    },
    {
      title: "Proxy Falls",
      color: "#f9fbe7",
      imageUrl: "assets/flappy/proxy_falls.jpg",
      range: "1.6 miles",
    },
    {
      title: "Big Indian Gorge",
      color: "#ede7f6",
      imageUrl: "assets/flappy/big_indian_gorge.jpg",
      range: "17.0 miles",
    },
    {
      title: "Ice Lake Trail",
      color: "#fff0f0",
      imageUrl: "assets/flappy/ice_lake_trail.webp",
      range: "15.2 miles",
    },
    {
      title: "Tumalo Falls",
      color: "#e3f2fd",
      imageUrl: "assets/flappy/tumalo_falls.jpg",
      range: "6.5 miles",
    },
  ];

  const gameConfig = {
    speed: 2,
    gapHeight: 150,
    pipeWidth: 60,
    spawnRate: 180,
  };

  // ==========================================
  //  GAME ENGINE
  // ==========================================
  const canvas = document.getElementById("gameCanvas");
  if (!canvas) return; // Safety check if canvas element is missing

  const ctx = canvas.getContext("2d");
  const uiLayer = document.getElementById("ui-layer");
  const startBtn = document.getElementById("start-btn");
  const scoreEl = document.getElementById("score-board");
  const titleEl = document.getElementById("game-title");
  const msgEl = document.getElementById("game-message");

  const memoryCard = document.getElementById("memory-card");
  const memoryImg = document.getElementById("memory-img");
  const memoryTitle = document.getElementById("memory-title");
  const memoryPlaceholder = document.getElementById("memory-placeholder");

  let frames = 0;
  let score = 0;
  let gameState = "START";
  let animationId;

  function resizeCanvas() {
    const container = document.getElementById("game-wrapper");
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // ==========================================
  //  ASSET LOADING
  // ==========================================
  const birdImg = new Image();
  let birdImgLoaded = false;
  if (birdConfig.imageUrl) {
    birdImg.src = birdConfig.imageUrl;
    birdImg.onload = () => {
      birdImgLoaded = true;
    };
  }

  const eventAssets = myLifeEvents.map((event) => {
    const img = new Image();
    if (event.imageUrl) img.src = event.imageUrl;
    return { ...event, imgObj: img, imgLoaded: false };
  });
  eventAssets.forEach((asset) => {
    asset.imgObj.onload = () => {
      asset.imgLoaded = true;
    };
  });

  // ==========================================
  //  HELPERS
  // ==========================================
  function showMemory(data) {
    // Combine the title and the range for the memory card display
    memoryTitle.innerText = `${data.title} (${data.range})`;

    if (data.imgLoaded && data.imageUrl) {
      memoryImg.src = data.imageUrl;
      memoryImg.style.display = "block";
      memoryPlaceholder.style.display = "none";
    } else {
      memoryImg.style.display = "none";
      memoryPlaceholder.style.display = "block";
      memoryPlaceholder.style.backgroundColor = data.color;
    }
    memoryCard.classList.remove("show");
    void memoryCard.offsetWidth; // Force reflow to restart CSS animation
    memoryCard.classList.add("show");
  }

  function hideMemory() {
    memoryCard.classList.remove("show");
  }

  // ==========================================
  //  CLASSES
  // ==========================================
  class Bird {
    constructor() {
      this.x = canvas.width / 4;
      this.y = canvas.height / 2;
      this.radius = birdConfig.radius;
      this.velocity = 0;
    }

    draw() {
      if (birdImgLoaded && birdConfig.imageUrl) {
        const scale = 6.5;
        const targetSize = this.radius * scale;
        const aspectRatio = birdImg.naturalWidth / birdImg.naturalHeight;

        let newWidth, newHeight;
        if (aspectRatio > 1) {
          newWidth = targetSize;
          newHeight = targetSize / aspectRatio;
        } else {
          newHeight = targetSize;
          newWidth = targetSize * aspectRatio;
        }

        ctx.drawImage(
          birdImg,
          this.x - newWidth / 2,
          this.y - newHeight / 2,
          newWidth,
          newHeight
        );
      } else {
        // Fallback drawing if image fails to load
        ctx.fillStyle = birdConfig.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(this.x + 4, this.y - 4, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    update() {
      this.velocity += birdConfig.gravity;
      this.y += this.velocity;
      if (this.y + this.radius >= canvas.height) {
        this.y = canvas.height - this.radius;
        gameOver();
      }
      if (this.y - this.radius <= 0) {
        this.y = this.radius;
        this.velocity = 0;
      }
    }

    flap() {
      this.velocity = -birdConfig.jumpStrength;
    }
  }

  class Obstacle {
    constructor() {
      this.x = canvas.width;
      this.w = gameConfig.pipeWidth;
      const minHeight = 50;
      const maxPos = canvas.height - minHeight - gameConfig.gapHeight;
      this.topHeight =
        Math.floor(Math.random() * (maxPos - minHeight)) + minHeight;
      this.bottomY = this.topHeight + gameConfig.gapHeight;
      this.passed = false;
      this.data = eventAssets[Math.floor(Math.random() * eventAssets.length)];
    }

    draw() {
      this.drawFrame(this.x, 0, this.w, this.topHeight, this.data, true);
      this.drawFrame(
        this.x,
        this.bottomY,
        this.w,
        canvas.height - this.bottomY,
        this.data,
        false
      );
    }

    drawFrame(x, y, w, h, data, isTop) {
      const isLongerBox = h > canvas.height / 2 - gameConfig.gapHeight / 2;
      const textToDisplay = isLongerBox ? data.title : data.range;
      ctx.font = "bold 12px sans-serif";
      const textWidth = ctx.measureText(textToDisplay).width;
      const dynamicFrameH = textWidth + 20;

      const frameY = isTop ? h - dynamicFrameH : y;

      ctx.fillStyle = "#555";
      const poleY = isTop ? y : frameY + dynamicFrameH;
      const poleHeight = isTop ? h - dynamicFrameH : h - dynamicFrameH;
      ctx.fillRect(x + w / 2 - 2, poleY, 4, poleHeight);

      this.drawPlaceholder(
        x,
        frameY,
        w,
        dynamicFrameH,
        data.color,
        textToDisplay
      );
    }

    drawPlaceholder(x, frameY, w, frameH, color, text) {
      const cornerRadius = 10;
      const inset = 5;
      const boxX = x;
      const boxY = frameY + inset;
      const boxW = w;
      const boxH = frameH - inset * 2;

      ctx.fillStyle = color;
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.moveTo(boxX + cornerRadius, boxY);
      ctx.lineTo(boxX + boxW - cornerRadius, boxY);
      ctx.arcTo(
        boxX + boxW,
        boxY,
        boxX + boxW,
        boxY + cornerRadius,
        cornerRadius
      );
      ctx.lineTo(boxX + boxW, boxY + boxH - cornerRadius);
      ctx.arcTo(
        boxX + boxW,
        boxY + boxH,
        boxX + boxW - cornerRadius,
        boxY + boxH,
        cornerRadius
      );
      ctx.lineTo(boxX + cornerRadius, boxY + boxH);
      ctx.arcTo(
        boxX,
        boxY + boxH,
        boxX,
        boxY + boxH - cornerRadius,
        cornerRadius
      );
      ctx.lineTo(boxX, boxY + cornerRadius);
      ctx.arcTo(boxX, boxY, boxX + cornerRadius, boxY, cornerRadius);
      ctx.closePath();

      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.translate(boxX + boxW / 2, boxY + boxH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = "#000";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(text, 0, 4);
      ctx.restore();
    }

    update() {
      this.x -= gameConfig.speed;
    }
  }

  // ==========================================
  //  GAME LOGIC
  // ==========================================
  let bird;
  let obstacles = [];

  function initGame() {
    bird = new Bird();
    obstacles = [];
    score = 0;
    frames = 0;
    scoreEl.innerText = score;
    gameState = "PLAYING";
    uiLayer.classList.add("hidden");
    hideMemory();
    loop();
  }

  function gameOver() {
    gameState = "GAMEOVER";
    titleEl.innerText = "GAME OVER";
    msgEl.innerText = `You've explored ${score} trails!`;
    startBtn.innerText = "Try Again";
    uiLayer.classList.remove("hidden");
  }

  // ==========================================
  //  BACKGROUND ELEMENTS
  // ==========================================
  const backgroundElements = [];
  const elementTypes = ["cloud", "mountain", "tree"];

  for (let i = 0; i < 30; i++) {
    const type = elementTypes[Math.floor(Math.random() * elementTypes.length)];
    let element = {
      type: type,
      x: Math.random() * canvas.width,
      speed: 0.1 + Math.random() * 0.2,
    };

    if (type === "cloud") {
      element.y = Math.random() * canvas.height * 0.6; // Clouds are in the upper 60%
      element.radius = 10 + Math.random() * 20;
      element.color = `rgba(255, 255, 255, ${0.5 + Math.random() * 0.4})`;
    } else if (type === "mountain") {
      element.y = canvas.height; // Anchored to the bottom
      element.width = 100 + Math.random() * 150;
      element.height = 80 + Math.random() * 120;
      element.color = `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}40`;
    } else if (type === "tree") {
      element.y = canvas.height; // Anchored to the bottom
      element.height = 40 + Math.random() * 60;
      element.width = 10 + Math.random() * 10;
    }
    backgroundElements.push(element);
  }

  function drawCloud(ctx, el) {
    ctx.fillStyle = el.color;
    ctx.beginPath();
    ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
    ctx.arc(el.x + el.radius * 0.8, el.y, el.radius * 0.8, 0, Math.PI * 2);
    ctx.arc(el.x - el.radius * 0.8, el.y, el.radius * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawMountain(ctx, el) {
    ctx.fillStyle = el.color;
    ctx.beginPath();
    ctx.moveTo(el.x - el.width / 2, el.y);
    ctx.lineTo(el.x, el.y - el.height);
    ctx.lineTo(el.x + el.width / 2, el.y);
    ctx.closePath();
    ctx.fill();
  }

  function drawTree(ctx, el) {
    ctx.fillStyle = "#8B4513"; // Trunk
    ctx.fillRect(el.x - el.width / 2, el.y - el.height, el.width, el.height);
    ctx.fillStyle = "#228B22"; // Leaves
    ctx.beginPath();
    ctx.arc(el.x, el.y - el.height, el.width * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // ==========================================
  //  GAME LOOP
  // ==========================================
  function loop() {
    if (gameState !== "PLAYING") return;
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    backgroundElements.forEach((el) => {
      el.x -= el.speed;
      if (el.x < -200) el.x = canvas.width + 200; // Reset position when off-screen

      switch (el.type) {
        case "cloud":
          drawCloud(ctx, el);
          break;
        case "mountain":
          drawMountain(ctx, el);
          break;
        case "tree":
          drawTree(ctx, el);
          break;
      }
    });

    bird.update();
    bird.draw();

    if (frames % gameConfig.spawnRate === 0) obstacles.push(new Obstacle());

    for (let i = 0; i < obstacles.length; i++) {
      let ob = obstacles[i];
      ob.update();
      ob.draw();

      if (
        bird.x + bird.radius > ob.x &&
        bird.x - bird.radius < ob.x + ob.w &&
        (bird.y - bird.radius < ob.topHeight ||
          bird.y + bird.radius > ob.bottomY)
      ) {
        gameOver();
      }

      if (ob.x + ob.w < bird.x && !ob.passed) {
        score++;
        scoreEl.innerText = score;
        ob.passed = true;
        showMemory(ob.data);
      }

      if (ob.x + ob.w < 0) {
        obstacles.shift();
        i--;
      }
    }
    frames++;
    animationId = requestAnimationFrame(loop);
  }

  // ==========================================
  //  INPUTS
  // ==========================================
  startBtn.addEventListener("click", initGame);

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      // Prevent page scroll if game is active or on the start/end screen
      if (gameState === "PLAYING" || !uiLayer.classList.contains("hidden")) {
        e.preventDefault();
      }

      if (gameState === "PLAYING") {
        bird.flap();
      } else {
        initGame();
      }
    }
  });

  canvas.addEventListener("mousedown", () => {
    if (gameState === "PLAYING") bird.flap();
  });
  canvas.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      if (gameState === "PLAYING") bird.flap();
    },
    { passive: false }
  );

  // Initial Paint
  resizeCanvas();
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
})();
