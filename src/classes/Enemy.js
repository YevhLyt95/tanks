import * as PIXI from 'pixi.js';
import Character from './Character';

export default class Enemy extends Character {
    constructor(bodyTexture, barrelTexture) {
        super(bodyTexture, 60, 1);

        this.barrel = new PIXI.Sprite(barrelTexture);
        this.barrel.anchor.set(0.5, 0.5);
        this.addChild(this.barrel);
        this.lastShotTime = 0;
        this.shootInterval = 1500 + Math.random() * 1000;
    }

    aiming(targetX, targetY) {
        //angle to player:
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        this.barrel.rotation = Math.atan2(dy, dx) + Math.PI / 2;
    }

    drive() {
        const angle = this.barrel.rotation;
        this.x += Math.cos(angle - Math.PI / 2) * this.speed;
        this.y += Math.sin(angle - Math.PI / 2) * this.speed;
    }

    //Can enemy shoot?
    tryShoot() {
        const now = Date.now();
        if (now - this.lastShotTime > this.shootInterval) {
            this.lastShotTime = now;

            //coordinates for enemy bullet
            const angle = this.barrel.rotation;
            const offset = this.barrel.height * 0.9;
            return {
                x: this.x + Math.cos(angle - Math.PI / 2) * offset,
                y: this.y + Math.sin(angle - Math.PI / 2) * offset,
                angle: angle
            };
        }
        return null;
    }
}