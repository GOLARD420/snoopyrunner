var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;
var bg,bg1;
var back;
var sniff,bark;

function preload(){
  trex_running =   loadAnimation("dog-0.png","dog-1.png","dog-2.png","dog-3.png","dog-4.png","dog-5.png","dog-6.png","dog-7.png","dog-8.png","dog-9.png");
  trex_collided = loadAnimation("dog-9.png");
  
  groundImage = loadImage("ground2.png");
  bg= loadAnimation("Foreground-0.png","Foreground-1.png","Foreground-2.png","Foreground-3.png","Foreground-4.png","Foreground-5.png","Foreground-6.png","Foreground-7.png")
  back= loadImage("bg.jpg");
  
  cloudImage = loadAnimation("good0.png","good7.png","good9.png","good12.png","good17.png")
  bluebImage = loadAnimation("blue0.png","blue1.png","blue2.png","blue4.png","blue5.png","blue6.png","blue7.png");
  badbImage = loadAnimation("bad2.png","bad3.png","bad4.png");
  sniff= loadSound("Sn.wav");
  bark=loadSound("bark.wav")
  
  
  
  /*
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  */
  gameOverImg = loadImage("gameover1.png");
  restartImg = loadImage("restart1.png");
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  

  sniff.play();
  sniff.setVolume(0.5);
  bg1= createSprite(displayWidth/2,displayHeight-90,width,20);
  bg1.addAnimation("wall",bg);

  trex = createSprite(50,displayHeight-130,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  trex.setCollider("circle",0,0,100)
  
  ground = createSprite(displayWidth/2,displayHeight-120,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(displayWidth/2,displayHeight/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/2,displayHeight/2+200);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(displayWidth/2,displayHeight-120,width,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(back);
  
  
  if (gameState===PLAY){
   
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  push();
    if(keyDown("space") && trex.y >= 159) {
      
      trex.velocityY = -12;
      barking()
    }
  
    trex.velocityY = trex.velocityY + 0.8
  pop();
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
  text("Score: "+ score, 500,50);
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(displayWidth,displayHeight/2-20,40,10);
    cloud.y = Math.round(random(80,displayHeight/2));
    cloud.addAnimation("goodbird",cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = displayWidth/3;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(displayWidth,displayHeight/2-35,10,40);
    obstacle.y=Math.round(random(80,displayHeight/2))
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addAnimation("bluebird",bluebImage);
              break;
      case 2: obstacle.addAnimation("bad",badbImage);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
 
  
  score = 0;
  
}

function barking()
{
  if(keyDown("space") && trex.y >= 159) {
      
    sniff.stop()
    bark.play()
    bark.setVolume(0.1)
  }
  else{
    sniff.play()
    bark.stop()
    sniff.setVolume(0.7)
  }
}