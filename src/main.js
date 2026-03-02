import * as PIXI from 'pixi.js';
import Tank from './classes/Tank';
import Enemy from './classes/Enemy';
import EnemyManager from './classes/EnemyManager';

const app = new PIXI.Application();

async function init() {
   console.log("1. Початок ініціалізації");
   await app.init({
     resizeTo: window,
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
   app.stage.addChild(player);

   const enemyManager = new EnemyManager(app, textures, 5);
   const keys = {};

   window.addEventListener('keydown',(e) => keys[e.code] = true);
   window.addEventListener('keyup', (e) => keys[e.code] = false);

   //main game cycle

   app.ticker.add(() => {
    const mouse = app.renderer.events.pointer;
    player.rotateBarrel(Math.atan2(mouse.y - player.y, mouse.x - player.x) + Math.PI / 2);
    if (keys['KeyW']) player.y -= player.speed;
    if (keys['KeyS']) player.y += player.speed;
    if (keys['KeyA']) player.x -= player.speed;
    if (keys['KeyD']) player.x += player.speed;
    
    handleScreenWrap(player);

    enemyManager.update(player.x, player.y);

    enemyManager.activeEnemies.forEach(e => handleScreenWrap(e));
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