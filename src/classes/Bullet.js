import * as PIXI from 'pixi.js';

export default class Bullet extends PIXI.Graphics {
    constructor(x, y, angle) {
        super();

        this.fill({color: 0xffff00});
        this.poly([
            0, -8,
            4, 4,
            -4, 4
        ]);
        
        this.x = x;
        this.y = y;

        this.speed = 8;
        this.rotation = angle;
        this.toRemove = false; //flag for deleting

        this.vx = Math.cos(angle - Math.PI / 2) * this.speed;
        this.vy = Math.sin(angle - Math.PI / 2) * this.speed;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    destroyBullet(stage) {
        this.toRemove = true;
        stage.removeChild(this);
    }
    
}