import * as PIXI from 'pixi.js';
import Tank from './classes/Tank';
import Enemy from './classes/Enemy';

const app = new PIXI.Application();

async function init() {
   console.log("1. Початок ініціалізації");
   await app.init({
     resizeTo: window,
     antialias: true,
     backgroundColor: 0x35693d
   });

   document.body.appendChild(app.canvas);

   const assets = {
    playerBody: './assets/tankBlue.png',
    playerBarrel: './assets/barrelBlue_outline.png',
    enemyBody: './assets/tankRed.png',
    enemyBarrel: './assets/barrelRed_outline.png'
   };

   const textures = await PIXI.Assets.load(Object.values(assets));
   console.log("Assets are loaded", textures);
   const player = new Tank(
    textures[assets.playerBody],
    textures[assets.playerBarrel],
    20 //ammo
   );

   player.x = app.screen.width / 2;
   player.y = app.screen.height / 2;

   const enemy = new Enemy(
    textures[assets.enemyBody],
    textures[assets.enemyBarrel]
   );


   enemy.eventMode = 'static';
   enemy.cursor = 'pointer';

   enemy.on('pointerdown', () => {
    if(player.shoot()) {
      enemy.takeDamage(10);
      console.log("enemy takes damage");
    }
   });

   app.stage.addChild(player, enemy);

   const keys = {};
   window.addEventListener('keydown',(e) => keys[e.code] = true);
   window.addEventListener('keyup', (e) => keys[e.code] = false);

   //main game cycle

   app.ticker.add(() => {
    const mouse = app.renderer.events.pointer;
    const dx = mouse.x - player.x;
    const dy = mouse.y - player.y;
    player.rotateBarrel(Math.atan2(dy, dx) + Math.PI / 2);

    if (keys['KeyW'] || keys['ArrowUp']) player.y -= player.speed;
    if (keys['KeyS'] || keys['ArrowDown']) player.y += player.speed;
    if (keys['KeyA'] || keys['ArrowLeft']) player.x -= player.speed;
    if (keys['KeyD'] || keys['ArrowRight']) player.x += player.speed;
    enemy.drive();
    enemy.aiming(player.x, player.y);

    handleScreenWrap(player);
    handleScreenWrap(enemy);
   });
}

function handleScreenWrap(sprite) {
  const padding = 50;

  if(sprite.x > app.screen.width + padding) sprite.x = -padding;
  else if(sprite.x < -padding) sprite.x = app.screen.width + padding;

  if(sprite.y > app.screen.height + padding) sprite.y = -padding;
  else if(sprite.y < -padding) sprite.y = app.screen.height + padding;

}

init();