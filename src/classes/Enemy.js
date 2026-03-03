import * as PIXI from 'pixi.js';
import Character from './Character';

export default class Enemy extends Character {
    constructor(bodyTexture, barrelTexture) {
        super(bodyTexture, 60, 1);

        this.barrel = new PIXI.Sprite(barrelTexture);
        this.barrel.anchor.set(0.5, 0.5);
        this.addChild(this.barrel);
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
}