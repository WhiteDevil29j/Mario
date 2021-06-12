var score = 0
var gamestate = 'play'

function preload() {
  
  bgimg = loadImage("images/bgnew.jpg")
  mario_run = loadAnimation("images/mar1.png", "images/mar2.png", "images/mar3.png", "images/mar4.png", "images/mar5.png", "images/mar6.png", "images/mar7.png")
  brickimg = loadImage("images/brick.png")
  coin_mov = loadAnimation("images/con1.png", "images/con2.png", "images/con3.png", "images/con4.png", "images/con5.png", "images/con6.png")
  coinsound = loadSound("sounds/sounds_coinSound.mp3")
  mush_wal = loadAnimation("images/mush1.png", "images/mush2.png", "images/mush3.png", "images/mush4.png", "images/mush5.png", "images/mush6.png")
  tur_wal = loadAnimation("images/tur1.png", "images/tur2.png", "images/tur3.png", "images/tur4.png")
  dead = loadAnimation("images/dead.png")
  diesound=loadSound("sounds/sounds_dieSound.mp3")
  restart_img = loadImage("images/restart.png")
}


function setup() {
  createCanvas(1000, 600);
  
  //background image
  bg = createSprite(580,300)
  bg.addImage(bgimg)
  bg.scale = 0.5
  
  //running Mario animation
  mario = createSprite(200,505,20,50)
  mario.addAnimation("running", mario_run)
  mario.addAnimation("dying", dead)
  mario.scale = 0.3
  
  //ground level
  ground = createSprite(200, 600, 400, 10)
  ground.visible = false

  //restart sprite
  restart = createSprite(500, 300)
  restart.addImage(restart_img)
  restart.visible = false

  //groups
  brickGroup = new Group()
  coinGroup = new Group()
  obsGroup = new Group()
 
}

function draw() {

  if (gamestate === 'play') {
    if (bg.x < 100) {
      bg.x = bg.width / 4;
    }
  
    if (mario.x < 200) {
      mario.x = 200
    }
  
    if (mario.y < 50) {
      mario.y = 50
    }
  
    if (keyDown('space')) {
      mario.velocityY = -15
    }

    bg.velocityX = -6;
    

    //functions
    createbricks()
    createcoins()
    createobs()

    //Mario touching coins to increase score
    for (var i = 0; i < coinGroup.length; i++) {
      temp = coinGroup.get(i)
      
      if (temp.isTouching(mario)) {
        temp.destroy()
        temp = null
        coinsound.play()
        score = score + 1
      }
    }

    //Mario colliding with bricks
    for (var i = 0; i < brickGroup.length; i++) {
      temp = brickGroup.get(i)
      
      if (temp.isTouching(mario)) {
        mario.collide(temp)
      }
    }

    //endstate
    if (mario.isTouching(obsGroup)) {
      diesound.play()
      gamestate = 'end'
    }
  }

  else if (gamestate === 'end') {
    bg.velocityX = 0
    mario.velocityX = 0
    mario.velocityY = 0
    mario.changeAnimation('dying', dead)
    obsGroup.setVelocityXEach(0)
    coinGroup.setVelocityXEach(0)
    brickGroup.setVelocityXEach(0)
    obsGroup.setLifetimeEach(0)
    coinGroup.setLifetimeEach(0)
    brickGroup.setLifetimeEach(0)
    mario.setCollider("rectangle", 0,0,300,10)
    mario.y = 550
    restart.visible = true

    if (mousePressedOver(restart)) {
      restartgame()
    }
  }
  

  mario.velocityY = mario.velocityY + 0.5
  mario.collide(ground)


  
  
  drawSprites()
  textSize(30)
  fill("gold")
  text("Coins: "+score, 870,50)
}

//function to create bricks(random)
function createbricks() {

  if (frameCount % 60 === 0) {
    brick = createSprite(1450, 150, 100, 5)
    brick.y = random(60, 400)
    brick.addImage(brickimg)
    brick.scale = 0.5
    brick.velocityX = -5
    brickGroup.add(brick)     
  }
  
}

//function to create coins(random)
function createcoins() {
  if (frameCount % 60 === 0) {
    coin = createSprite(1100,50)
    coin.addAnimation("flipping", coin_mov)
    coin.y = random(60, 400)
    coin.scale = 0.1
    coin.velocityX = -5
    coinGroup.add(coin) 
  }
}

//function to create obs(random)
function createobs() {
  var ab =Math.round(random(80,150))
  
  if (frameCount % ab === 0) {
    obs = createSprite(1000, 520)
    ran = Math.round(random(1, 2))

    //generate random mobs
    if (ran === 1) {
      obs.addAnimation("mushroom", mush_wal)
    }
    else {
      obs.addAnimation("turtle", tur_wal)
    }
    obs.scale = 0.2
    obs.velocityX = -5
    obsGroup.add(obs)     
  }
}

//function for restarting the game
function restartgame() {
  gamestate = "play"
  score = 0
  restart.visible = false
  mario.changeAnimation("running", mario_run)
  coinGroup.destroyEach()
  obsGroup.destroyEach()
  brickGroup.destroyEach()
  mario.setCollider("rectangle", 0, 0, 200, 600);
}