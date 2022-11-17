//Variáveis de estado de jogo
var play = 1;
var end = 0;
var gameState = play;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
//variáveis para os sons
var jumpSound , checkPointSound, dieSound;
//variáveis para nuvens
var cloud, cloudsGroup, cloudImage;
//variáveis para os obstáculos
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
//variáveis para grupo de obstáculos
var obstacleGroup;
//variáveis para fim e restart
var gameOver, gameOverImg, restart, restartImg;
var score;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  //imagem da colisão
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  //adicioanr imagem de nuvem
  cloudImage = loadImage("cloud.png");
  
  //adicionar imagens dos obstáculos 
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  //adicionar imagem de gameOver e restart
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")

  //adicionar sons
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  
}

function setup() {

  createCanvas(600,200)
  
  //crie um sprite de trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;

  //adiconar animação de colisão
  trex.addAnimation("collided", trex_collided);
  
  //crie sprite ground (solo)
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  //crie um solo invisível
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;

  //Criar grupos
  obstacleGroup = new Group();
  cloudsGroup = new Group();

  //criar sprites de gameOver e restart 
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;

  restart = createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale = 0.5;

  //criar variável que gera números aleatórios
  var rand = Math.round(random(1, 100))
  console.log(rand);

  //adicionar colisor
  trex.setCollider("circle",0,0,40);
  //aumentar colisor
  //trex.setCollider("rectangle",0,0,40, trex.height);

  trex.debug = true

  score = 0;
 
}

function draw() {
  //definir cor do plano de fundo
  background(180);
  
  text("Pontuação: " + score, 500, 50);
  
  if(gameState === play) {
    //ocultar imagem de gameOver e restart
    gameOver.visible = false
    restart.visible = false

    //mover o solo
    ground.velocityX = -4;
    //aumentar velocidade do chão
    //ground.velocityX = -(4 + 3 * score/200);
    //pontuação
    score = score + Math.round(frameCount/60);

    //som de checkpoint a cada 100 pontos
    if(score > 0 && score%500 === 0) {
      checkPointSound.play();
    }

    // pulando o trex ao pressionar a tecla de espaço
    if(keyDown("space")&& trex.y >= 100) {
      trex.velocityY = -10;
      //adcionar som ao pular
      jumpSound.play(); 
    }
    
    //gravidade
    trex.velocityY = trex.velocityY + 0.8
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    //gerar nuvens e obstáculos
    spawClouds();
    spawObstacles();

    //checar se trex está tocando obstáculos
    if(obstacleGroup.isTouching(trex)) {
      //fazer o trex pular ao escostar em um obstáculo
      trex.velocityY= -12;
      jumpSound.play();
      //gameState = end;
      //adicionar som ao trex morrer
      //dieSound.play();
    }
  } else if(gameState === end) {
    //mostrar sprite de fim de jogo e de restart
    gameOver.visible = true;
    restart.visible = true;

    //parar o solo
    ground.velocityX = 0;

    //parar trex
    trex.velocityY = 0;
  
    //mudar a animação do trex
    trex.changeAnimation("collided", trex_collided);

    //definir tempo de vida dos objetos do jogo para que eles nunca sejam destruídos
    obstacleGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    //parar obstáculos e nuvens
    obstacleGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
  }
  
  //impedir que o trex caia
  trex.collide(invisibleGround);
  
  drawSprites();
  
}

//função para gerar nuvens
function spawClouds() {
  //condiiconal para gerar nuvens
  if(frameCount % 60 === 0) {
    cloud = createSprite(600, 300, 40, 10);
    cloud.addImage(cloudImage);
    cloud.scale = 0.4
    cloud.velocityX = -3;  
    cloud.y = Math.round(random(10,60));

    //atribua tempo de vida
    cloud.lifetime = 200;

    //ajustar profundidade da nuvem e do trex
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;

    //adicioanr nuvem ao grupo
    cloudsGroup.add(cloud);
  }
}

//criar function para gerar obstáculos
function spawObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(400, 164, 10, 40);
    //aumentar velocidade do trex ao longo do jogo
    obstacle.velocityX = -(6 + score/200);

    //gerar obstáculos aleatóreos
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
      default: break;
    }

    //atribuir dimensão e tempo de vida aos obstáculos
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //adicionar obstáculo ao grupo
    obstacleGroup.add(obstacle);
  }
}