//CANVAS VARIABLES
let canvas = document.getElementById("mapCanvas");
let context = canvas.getContext("2d");

//MAP
let tileMap = {
  cols: 12,
  rows: 12,
  tsize: 36,
  tkey: ["grass", "earth", "flat rock", "steep rock", "shallow water", "deep water"],
  tiles: [
    3, 3, 3, 3, 4, 2, 0, 0, 0, 0, 0, 0,
    3, 3, 3, 2, 4, 0, 0, 0, 0, 0, 0, 0,
    3, 2, 2, 0, 4, 4, 0, 0, 0, 0, 0, 0,
    2, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 4, 4,
    0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 5, 5,
    0, 0, 0, 0, 0, 0, 0, 4, 5, 5, 5, 4,
    0, 0, 0, 0, 0, 0, 4, 5, 5, 4, 4, 1,
    0, 0, 0, 0, 0, 4, 5, 5, 4, 1, 1, 1,
    0, 0, 0, 0, 0, 4, 5, 4, 1, 1, 0, 0
  ],
  getTile: function (col, row) {
    return this.tiles[row * tileMap.cols + col]
  },
  getTileName: function(col, row) {
    return this.tkey[this.tiles[row * tileMap.cols + col]]
  },
  drawMap: function () {
    let tileSheet = new Image();
    tileSheet.src = "assets/sixtileset.png";
    for (let c = 0; c < tileMap.cols; c++) {
      for (let r = 0; r < tileMap.rows; r++) {
        let tile = tileMap.getTile(c, r);
        context.drawImage(tileSheet, tile * tileMap.tsize, 0, tileMap.tsize, tileMap.tsize, c * tileMap.tsize, r * tileMap.tsize, tileMap.tsize, tileMap.tsize);
      }
    }
  },

};

//PLAYER

let player = {
  position: [4, 3],
  walkTiles: [0, 1, 2, 4],
  wherePlayer: function () {
    document.getElementById("status").innerHTML = ["position: " + player.position + "<br/> focus: " + focus.position]
  },
  drawPlayer: function () {
    let playerImage = new Image();
    playerImage.src = "assets/player.png";
    context.drawImage(playerImage, this.position[0] * tileMap.tsize, this.position[1] * tileMap.tsize);
  },
}

//FOCUS

let focus = {
  position: [5, 3],
  tile: function() {
    return tileMap.getTile(this.position[0], this.position[1]);
  },
  drawFocus: function () {
    let focusImage = new Image();
    focusImage.src = "assets/focus.png";
    context.drawImage(focusImage, this.position[0] * tileMap.tsize, this.position[1] * tileMap.tsize);
  }
}

//ACTION

let action = {
  drinkable: true,
  drink: function () {
    if (focus.tile () == 4) {
      document.getElementById("actions").innerHTML = "press [Q] to drink";
      action.drinkable = true;
    }
    else {
      document.getElementById("actions").innerHTML = "&nbsp;";
      action.drinkable = false;
    }
  }
}

//MOVEMENT

document.addEventListener("keydown", event => {
  if (event.key == 'd') {
    if (player.walkTiles.includes(tileMap.getTile(player.position[0] + 1, player.position[1])) == true && player.position[0] + 1 < tileMap.cols) {
      player.position[0]++;
      focus.position[0] = player.position[0] +1;
      focus.position[1] = player.position[1];
    } else {
      focus.position[0] = player.position[0] +1;
      focus.position[1] = player.position[1];
    }
  } else if (event.key == 'a') {
    if (player.walkTiles.includes(tileMap.getTile(player.position[0] - 1, player.position[1])) == true && player.position[0] > 0) {
      player.position[0]--;
      focus.position[0] = player.position[0] -1;
      focus.position[1] = player.position[1];
    } else {
      focus.position[0] = player.position[0] -1;
      focus.position[1] = player.position[1];
    }
  } else if (event.key == 'w') {
    if (player.walkTiles.includes(tileMap.getTile(player.position[0], player.position[1] - 1)) == true && player.position[1] > 0) {
      player.position[1]--;
      focus.position[1] = player.position[1] - 1;
      focus.position[0] = player.position[0];
    } else {
      focus.position[1] = player.position[1] - 1;
      focus.position[0] = player.position[0];
    }
  } else if (event.key == 's') {
    if (player.walkTiles.includes(tileMap.getTile(player.position[0], player.position[1] + 1)) == true && player.position[1] + 1 < tileMap.rows) {
      player.position[1]++;
      focus.position[1] = player.position[1] + 1;
      focus.position[0] = player.position[0];
    } else {
      focus.position[1] = player.position[1] + 1;
      focus.position[0] = player.position[0];
    }
  }
});

//TIME

let time= {
  //all times in ms
  tick: 20,
  second: 1000,
  hour: (4 * this.second),
  day: 4 * this.hour,
  season: 4 * this.day
}

//HEALTH

let health = {
  alive: true,
  thirst: 4,
  thirstRate: 4000,
  thirstDeath: function () {
    if (this.thirst < 0) {
      clearInterval(thirstInterval);

    }
  },
  downThirst: function () {
    health.thirst--;
  },
  upThirst: function () {
    health.thirst++;
  },
  changeThirst: function () {
    let thirstInterval = window.setInterval(health.downThirst, health.thirstRate);
    thirstInterval;
    document.addEventListener("keydown", event => {
      if (event.key == "q" && health.thirst < 4 && action.drinkable == true) {
        health.upThirst();
      } 
    })
  },
  writeThirst: function () {
    document.getElementById("thirst").innerHTML = "thirst " + health.thirst;
  },
  
  
}

//CALLING FUNCTIONS

//change data on gameloop
function updateData() {
  action.drink();
  health.thirstDeath();
}

//write to ui on gameloop
function writeUI () {
  player.wherePlayer();
  health.writeThirst();
}

//draw to canvas on gameloop
function drawScreen() {
  tileMap.drawMap();
  player.drawPlayer();
  focus.drawFocus();
};

// redraw window and increment gametime forward
function gameLoop() {
  window.setTimeout(gameLoop, time.tick);
  updateData();
  writeUI();
  drawScreen();
};

//on start
gameLoop();
health.changeThirst();


