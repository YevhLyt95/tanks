import * as PIXI from 'pixi.js';

export default class Character extends PIXI.Sprite {
    constructor(texture, hp, speed) {
        super(texture);

        this.hp = hp;
        this.maxHp = hp;
        this.speed = speed;
        //anchor point for rotation
        this.anchor.set(0.5);

        this.healthBar = new PIXI.Graphics();
        this.drawHealthBar();
        this.addChild(this.healthBar);
    }

    drawHealthBar(){
        this.healthBar.clear();

        this.healthBar.rect(-20, -40, 40, 6);
        this.healthBar.fill(0x000000);

        const barWidth = 40;
        const padding = 1;
        const innerWidth = barWidth - (padding * 2);

        const healthWidth = (this.hp / this.maxHp) * innerWidth;

        if(healthWidth > 0) {
            this.healthBar.rect(-19, -39, healthWidth, 4);
            this.healthBar.fill(0x00ff00);
        }
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
        this.drawHealthBar();

        if (this.hp <= 0) {
            console.log("Unit destroyed");
            this.destroy();
        }
    }
}