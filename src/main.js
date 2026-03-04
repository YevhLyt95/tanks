import * as PIXI from 'pixi.js';
import Tank from './classes/Tank';
import Bullet from './classes/Bullet';
import EnemyManager from './classes/EnemyManager';

const app = new PIXI.Application();
let enemyBullets = [];
let bullets = [];
let enemyManager;
let player;
let msg;
const keys = {};

async function init() {
    await app.init({ resizeTo: window, backgroundColor: 0x35693d });
    document.body.appendChild(app.canvas);

    const assets = {
        playerBody: './assets/tankBlue.png',
        playerBarrel: './assets/barrelBlue_outline.png',
        enemyBody: './assets/tankRed.png',
        enemyBarrel: './assets/barrelRed_outline.png'
    };

    const textures = await PIXI.Assets.load(Object.values(assets));

    player = new Tank(textures[assets.playerBody], textures[assets.playerBarrel], 30);
    player.x = app.screen.width / 2;
    player.y = app.screen.height / 2;
    app.stage.addChild(player);

    msg = new PIXI.Text({
    text: '', 
    style: { fill: 0xff0000, fontSize: 50, fontWeight: 'bold' }
    });
    msg.anchor.set(0.5);
    msg.x = app.screen.width / 2;
    msg.y = app.screen.height / 2;
    app.stage.addChild(msg);

    enemyManager = new EnemyManager(app, textures, 5);

    // Події
    window.addEventListener('keydown', (e) => keys[e.code] = true);
    window.addEventListener('keyup', (e) => keys[e.code] = false);
    window.addEventListener('mousedown', handlePlayerShoot);

    app.ticker.add(gameLoop);
}

function handlePlayerShoot() {
    const shotData = player.shoot();
    if (shotData) {
        const bullet = new Bullet(shotData.x, shotData.y, shotData.angle);
        app.stage.addChild(bullet);
        bullets.push(bullet);
    }
}

function gameLoop() {
    updatePlayer();
    updateBullets();
    if(enemyManager) {
        enemyManager.update(player.x, player.y);

        enemyManager.activeEnemies.forEach(enemy => {
            const shotData = enemy.tryShoot();
            if(shotData && enemy.visible) {
                const b = new Bullet(shotData.x, shotData.y, shotData.angle);
                b.fill({color: 0xff0000});
                app.stage.addChild(b);
                enemyBullets.push(b);
            }
        });
    }
    checkCollisions();
    
    // clean up (Filter creates new array without "garbage")
    bullets = bullets.filter(b => !b.toRemove);
    enemyBullets = enemyBullets.filter(b => !b.toRemove);
}

function updatePlayer() {
    const mouse = app.renderer.events.pointer;
    player.rotateBarrel(Math.atan2(mouse.y - player.y, mouse.x - player.x) + Math.PI / 2);
    
    if (keys['KeyW']) player.y -= player.speed;
    if (keys['KeyS']) player.y += player.speed;
    if (keys['KeyA']) player.x -= player.speed;
    if (keys['KeyD']) player.x += player.speed;
    
    handleScreenWrap(player);
}

function updateBullets() {
    bullets.forEach(b => {
        b.update();
        // delete outside the screen
        if (b.x < -50 || b.x > app.screen.width + 50 || b.y < -50 || b.y > app.screen.height + 50) {
            b.destroyBullet(app.stage);
        }
    });
    enemyBullets.forEach(b => {
        b.update();
        if(b.x < 50 || b.x > app.screen.width + 50 || b.y < -50 || b.y > app.screen.height + 50) {
            b.destroyBullet(app.stage);
        }
    })
}

function checkCollisions() {
    bullets.forEach(b => {
        if (b.toRemove) return;

        enemyManager.activeEnemies.forEach(enemy => {
            if (!enemy.visible) return;

            const dx = b.x - enemy.x;
            const dy = b.y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 40) {
                enemy.takeDamage(20);
                if (enemy.hp <= 0) enemyManager.despawn(enemy);
                b.destroyBullet(app.stage);
            }
        });
    });
    
    enemyBullets.forEach(b => {
        if(b.toRemove) return;

        const dx = b.x - player.x;
        const dy = b.y - player.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if(dist < 30) {
            player.takeDamage(10);
            b.destroyBullet(app.stage);

            if(player.hp <= 0) {
                msg.text = "GAME OVER! You are dead";
                app.ticker.stop();
                setTimeout(() => window.location.reload(), 10000);
                window.location.reload();
            }
        }
    })
    // tank collision
    enemyManager.activeEnemies.forEach(enemy => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 55) {
            const angle = Math.atan2(dy, dx);
            player.x = enemy.x + Math.cos(angle) * 55;
            player.y = enemy.y + Math.sin(angle) * 55;
        }
    });
}

function handleScreenWrap(sprite) {
    const p = 50;
    if (sprite.x > app.screen.width + p) sprite.x = -p;
    else if (sprite.x < -p) sprite.x = app.screen.width + p;
    if (sprite.y > app.screen.height + p) sprite.y = -p;
    else if (sprite.y < -p) sprite.y = app.screen.height + p;
}

init();