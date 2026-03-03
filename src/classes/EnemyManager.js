import Enemy from './Enemy';

export default class EnemyManager {
    constructor(app, textures, maxEnemies = 5) {
        this.app = app;
        this.textures = textures;
        this.maxEnemies = maxEnemies;

        this.activeEnemies = [];
        this.pool = [];
    }

    spawn() {
        const enemyBody = this.textures['./assets/tankRed.png'];
        const enemyBarrel = this.textures['./assets/barrelRed_outline.png'];
        if(this.activeEnemies.length >= this.maxEnemies) return;
        let enemy = 0;
        if(this.pool.length > 0) {
            enemy = this.pool.pop();
            enemy.visible = true;
            enemy.hp = 50;
            enemy.drawHealthBar();
        } else {
            enemy = new Enemy(enemyBody, enemyBarrel);
            this.app.stage.addChild(enemy);
        }

        this.resetPosition(enemy);
        this.activeEnemies.push(enemy);
    }

    setupInteractivity(enemy) {
        enemy.eventMode = 'static';
        enemy.cursor = 'pointer';
        /*enemy.on('pointerdown', () => {
            enemy.takeDamage(20);
            if(enemy.hp <= 0) {
                this.despawn(enemy);
            }
        }); */
    }

    resetPosition(enemy) {
        const padding = 64;
        enemy.x = padding + Math.random() * (this.app.screen.width - padding * 2);
        enemy.y = -padding;
    }

    despawn(enemy) {
        enemy.visible = false;
        const index = this.activeEnemies.indexOf(enemy);
        if(index > -1) this.activeEnemies.splice(index, 1);
        this.pool.push(enemy);
    }

    update(playerX, playerY) {
        this.activeEnemies.forEach(enemy => {
            enemy.drive();
            enemy.aiming(playerX, playerY);
        });

        if(this.activeEnemies.length < this.maxEnemies) {
            this.spawn();
        }
    }
}