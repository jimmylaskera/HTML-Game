const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

var gameStart = false;
const lobbies = document.getElementById('lobbies');

var p1 = {
    name: "Player 1",
    health: 3,
    posX: 100,
    posY: 0,
    shotCD: 0,
    facing: "up"
};
var p2 = {
    name: "Player 2",
    health: 3,
    posX: 650,
    posY: 0,
    shotCD: 0,
    facing: "up"
};
var objects = [];

function drawTitle() {
  // B
  ctx.fillStyle = 'red';
  ctx.fillRect(252, 152, 8, 46);
  ctx.fillRect(260, 152, 25, 6);
  ctx.fillRect(260, 168, 25, 5);
  ctx.fillRect(260, 192, 25, 6);
  ctx.fillRect(285, 155, 6, 15);
  ctx.fillRect(285, 175, 6, 20);

  // A
  ctx.fillRect(315, 152, 20, 6);
  ctx.fillRect(309, 158, 8, 12);
  ctx.fillRect(332, 158, 8, 12);
  ctx.fillRect(305, 170, 40, 6);
  ctx.fillRect(305, 176, 8, 22);
  ctx.fillRect(337, 176, 8, 22);

  // T*2
  ctx.fillRect(355, 152, 40, 6);
  ctx.fillRect(370, 158, 10, 40);
  ctx.fillRect(405, 152, 40, 6);
  ctx.fillRect(420, 158, 10, 40);

  // L
  ctx.fillRect(452, 152, 8, 46);
  ctx.fillRect(460, 193, 35, 5);

  // E
  ctx.fillRect(502, 152, 42, 5);
  ctx.fillRect(502, 157, 8, 40);
  ctx.fillRect(510, 170, 20, 5);
  ctx.fillRect(510, 192, 34, 5);

  // C
  ctx.fillRect(310, 252, 28, 5);
  ctx.fillRect(302, 257, 13, 5);
  ctx.fillRect(337, 257, 8, 5);
  ctx.fillRect(302, 262, 8, 26);
  ctx.fillRect(302, 288, 13, 5);
  ctx.fillRect(337, 288, 8, 5);
  ctx.fillRect(310, 293, 28, 5);

  // I
  ctx.fillRect(360, 252, 28, 5);
  ctx.fillRect(370, 257, 10, 35);
  ctx.fillRect(360, 292, 28, 5);

  // T
  ctx.fillRect(405, 252, 40, 6);
  ctx.fillRect(420, 258, 10, 40);

  // Y
  ctx.fillRect(456, 252, 8, 10);
  ctx.fillRect(486, 252, 8, 10);
  ctx.fillRect(460, 262, 7, 10);
  ctx.fillRect(483, 262, 7, 10);
  ctx.fillRect(463, 272, 23, 6);
  ctx.fillRect(470, 278, 10, 19);

  ctx.fillStyle = 'white';
  ctx.font = "24px bold sans-serif";
  ctx.fillText('Esperando novo jogo...', 300, 400);
}
function drawScores(hp1, hp2) {
  ctx.font = "12px sans-serif";
  // 1
  ctx.fillRect(20, 2, 12, 40);
  ctx.fillRect(16, 10, 4, 8);
  ctx.fillRect(10, 41, 30, 7);

  // P
  ctx.fillRect(52, 2, 12, 46);
  ctx.fillRect(60, 2, 24, 6);
  ctx.fillRect(60, 20, 24, 6);
  ctx.fillRect(80, 6, 8, 16);

  ctx.fillText(p1.name, 5, 63, 100);

  for (let i = 0; i < hp1; i++) {
    // Heart
    ctx.fillRect(35, 70+(50*i), 10, 5);
    ctx.fillRect(55, 70+(50*i), 10, 5);
    ctx.fillRect(30, 75+(50*i), 30, 5);
    ctx.fillRect(65, 75+(50*i), 5, 5);
    ctx.fillRect(30, 80+(50*i), 25, 5);
    ctx.fillRect(60, 80+(50*i), 10, 5);
    ctx.fillRect(35, 85+(50*i), 30, 5);
    ctx.fillRect(40, 90+(50*i), 20, 5);
    ctx.fillRect(45, 95+(50*i), 10, 5);
  }

  // 2
  ctx.fillRect(710, 2, 30, 7);
  ctx.fillRect(707, 5, 8, 8);
  ctx.fillRect(731, 7, 14, 12);
  ctx.fillRect(735, 19, 5, 4);
  ctx.fillRect(725, 13, 10, 15);
  ctx.fillRect(720, 18, 10, 15);
  ctx.fillRect(715, 23, 10, 15);
  ctx.fillRect(710, 28, 10, 15);
  ctx.fillRect(707, 33, 10, 10);
  ctx.fillRect(707, 41, 38, 7);

  // P
  ctx.fillRect(752, 2, 12, 46);
  ctx.fillRect(760, 2, 24, 6);
  ctx.fillRect(760, 20, 24, 6);
  ctx.fillRect(780, 6, 8, 16);
  
  ctx.fillText(p2.name, 705, 63, 100);

  for (let i = 0; i < hp2; i++) {
    // Heart
    ctx.fillRect(735, 70+(50*i), 10, 5);
    ctx.fillRect(755, 70+(50*i), 10, 5);
    ctx.fillRect(730, 75+(50*i), 30, 5);
    ctx.fillRect(765, 75+(50*i), 5, 5);
    ctx.fillRect(730, 80+(50*i), 25, 5);
    ctx.fillRect(760, 80+(50*i), 10, 5);
    ctx.fillRect(735, 85+(50*i), 30, 5);
    ctx.fillRect(740, 90+(50*i), 20, 5);
    ctx.fillRect(745, 95+(50*i), 10, 5);
  }
}
function drawGame() {
  // Player 1
  ctx.fillStyle = document.getElementById('colorp1').value;
  ctx.translate(p1.posX+25, p1.posY+25);
  switch(p1.facing) {
    case "up":
      ctx.rotate(0);
      break;
    case "right":
      ctx.rotate(Math.PI/2);
      break;
    case "down":
      ctx.rotate(Math.PI);
      break;
    case "left":
      ctx.rotate(3*Math.PI/2);
      break;
  }
  ctx.translate(-(p1.posX+25), -(p1.posY+25));

  ctx.fillRect(p1.posX+5, p1.posY+5, 5, 40);
  ctx.fillRect(p1.posX+10, p1.posY+20, 5, 20);
  ctx.fillRect(p1.posX+15, p1.posY+15, 20, 30);
  ctx.fillRect(p1.posX+35, p1.posY+20, 5, 20);
  ctx.fillRect(p1.posX+40, p1.posY+5, 5, 40);
  ctx.fillRect(p1.posX+23, p1.posY+5, 4, 10);

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // Player 2
  ctx.fillStyle = document.getElementById('colorp2').value;
  if (p2.health > 0) {
    ctx.translate(p2.posX+25, p2.posY+25);
    switch(p2.facing) {
      case "up":
        ctx.rotate(0);
        break;
      case "right":
        ctx.rotate(Math.PI/2);
        break;
      case "down":
        ctx.rotate(Math.PI);
        break;
      case "left":
        ctx.rotate(3*Math.PI/2);
        break;
    }
    ctx.translate(-(p2.posX+25), -(p2.posY+25));

    ctx.fillRect(p2.posX+5, p2.posY+5, 5, 40);
    ctx.fillRect(p2.posX+10, p2.posY+20, 5, 20);
    ctx.fillRect(p2.posX+15, p2.posY+15, 20, 30);
    ctx.fillRect(p2.posX+35, p2.posY+20, 5, 20);
    ctx.fillRect(p2.posX+40, p2.posY+5, 5, 40);
    ctx.fillRect(p2.posX+23, p2.posY+5, 4, 10);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  // Shots
  ctx.fillStyle = 'white';
  for (i = 0; i < objects.length; i++) {
    // Check collision
    if (p1.health > 0 && p1.posX < objects[i].posX && objects[i].posX < p1.posX+50 && p1.posY < objects[i].posY && objects[i].posY < p1.posY+50) {
      p1.health--;
      objects.splice(i, 1);
      i--;
      continue;
    } else if (p2.health > 0 && p2.posX < objects[i].posX && objects[i].posX < p2.posX+50 && p2.posY < objects[i].posY && objects[i].posY < p2.posY+50) {
      p2.health--;
      objects.splice(i, 1);
      i--;
      continue;
    }
    
    switch(objects[i].facing) {
      case "up":
        ctx.fillRect(objects[i].posX+1, objects[i].posY, 3, 2);
        ctx.fillRect(objects[i].posX, objects[i].posY+2, 5, 3);
        if (objects[i].posY > 0) objects[i].posY -= 5;
        else {
          objects.splice(i, 1);
          i--;
        }
        break;
      case "right":
        ctx.fillRect(objects[i].posX, objects[i].posY, 3, 5);
        ctx.fillRect(objects[i].posX+3, objects[i].posY+1, 2, 3);
        if (objects[i].posX < 695) objects[i].posX += 5;
        else {
          objects.splice(i, 1);
          i--;
        }
        break;
      case "down":
        ctx.fillRect(objects[i].posX, objects[i].posY, 5, 3);
        ctx.fillRect(objects[i].posX+1, objects[i].posY+3, 3, 2);
        if (objects[i].posY < 595) objects[i].posY += 5;
        else {
          objects.splice(i, 1);
          i--;
        }
        break;
      case "left":
        ctx.fillRect(objects[i].posX, objects[i].posY+1, 2, 3);
        ctx.fillRect(objects[i].posX+2, objects[i].posY, 3, 5);
        if (objects[i].posX > 100) objects[i].posX -= 5;
        else {
          objects.splice(i, 1);
          i--;
        }
        break;
    }
  }

  if (p1.shotCD > 0) p1.shotCD--;
  if (p2.shotCD > 0) p2.shotCD--;
}

canvas.addEventListener('keydown', (event) => {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  if(nome === p1.name) {
    switch (event.key) {
      case "ArrowUp":
        p1.facing = "up";
        if (p1.posY > 0) p1.posY--;
        break;
      case "ArrowRight":
        p1.facing = "right";
        if (p1.posX < 650) p1.posX++;
        break;
      case "ArrowDown":
        p1.facing = "down";
        if (p1.posY < 550) p1.posY++;
        break;
      case "ArrowLeft":
        p1.facing = "left";
        if (p1.posX > 100) p1.posX--;
        break;
      case " ":
        if (p1.shotCD === 0 && p1.facing === "up") {
          objects.push({posX: p1.posX+25, posY: p1.posY-5, facing: "up"});
          p1.shotCD = 100;
        } else if (p1.shotCD === 0 && p1.facing === "right") {
          objects.push({posX: p1.posX+50, posY: p1.posY+25, facing: "right"});
          p1.shotCD = 100;
        } else if (p1.shotCD === 0 && p1.facing === "down") {
          objects.push({posX: p1.posX+25, posY: p1.posY+50, facing: "down"});
          p1.shotCD = 100;
        } else if (p1.shotCD === 0 && p1.facing === "left") {
          objects.push({posX: p1.posX-5, posY: p1.posY+25, facing: "left"});
          p1.shotCD = 100;
        }
        break;
      default:
        break;
    } 
  }
  if (nome === p2.name) {
    switch (event.key) {
      case "ArrowUp":
        p2.facing = "up";
        if (p2.posY > 0) p2.posY--;
        break;
      case "ArrowRight":
        p2.facing = "right";
        if (p2.posX < 650) p2.posX++;
        break;
      case "ArrowDown":
        p2.facing = "down";
        if (p2.posY < 550) p2.posY++;
        break;
      case "ArrowLeft":
        p2.facing = "left";
        if (p2.posX > 100) p2.posX--;
        break;
      case " ":
        if (p2.shotCD === 0 && p2.facing === "up") {
          objects.push({posX: p2.posX+25, posY: p2.posY-5, facing: "up"});
          p2.shotCD = 100;
        } else if (p2.shotCD === 0 && p2.facing === "right") {
          objects.push({posX: p2.posX+50, posY: p2.posY+25, facing: "right"});
          p2.shotCD = 100;
        } else if (p2.shotCD === 0 && p2.facing === "down") {
          objects.push({posX: p2.posX+25, posY: p2.posY+50, facing: "down"});
          p2.shotCD = 100;
        } else if (p2.shotCD === 0 && p2.facing === "left") {
          objects.push({posX: p2.posX-5, posY: p2.posY+25, facing: "left"});
          p2.shotCD = 100;
        }
        break;
      default:
        break;
    }
  }
  
  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
  if (document.getElementById('p1name').innerText === nome) {
    serverSocket.emit('updategame', {nome: document.getElementById('rname').innerText, player: nome, stats: p1, objects: objects});
  } else if (document.getElementById('p2name').innerText === nome) {
    serverSocket.emit('updategame', {nome: document.getElementById('rname').innerText, player: nome, stats: p2, objects: objects});
  }
});
    
function draw() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Desenhar limites
  ctx.clearRect(0, 0, 100, canvas.height);
  ctx.clearRect(canvas.width - 100, 0, 100, canvas.height);

  if (!gameStart) drawTitle();
  else {
    drawScores(p1.health, p2.health);
    drawGame();
  }

  requestAnimationFrame(draw);
}