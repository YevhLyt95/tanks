//this is a player's class
import * as PIXI from 'pixi.js';
import Character from "./Character";

export default class Tank extends Character {
    constructor (bodyTexture, barrelTexture, ammo) {
        super(bodyTexture, 100, 2);
        this.ammo = ammo;
        this.barrel = new PIXI.Sprite(barrelTexture);
        this.barrel.anchor.set(0.5, 0.9);
        this.addChild(this.barrel);

        this.ammoLabel = new PIXI.Text({
            text: `Ammo: ${this.ammo}`,
            style: {
                fontSize: 14,
                fill: 0xffffff,
                align: 'center'
            }
        });

        this.ammoLabel.anchor.set(0.5);
        this.ammoLabel.y = 45;
        this.addChild(this.ammoLabel);
    }

    rotateBarrel(angle) {
        this.barrel.rotation = angle;
    }

    getMuzzlePosition() {
        const angle = this.barrel.rotation;
        const offset = this.barrel.height * 0.9;
        return {
            x: this.x + Math.cos(angle - Math.PI / 2) * offset,
            y: this.y + Math.sin(angle - Math.PI / 2) * offset,
            angle: angle
        };
    }

    shoot() {
        if (this.ammo > 0) {
            this.ammo--;
            this.ammoLabel.text = `Ammo: ${this.ammo}`;
            return this.getMuzzlePosition();
        } else {
            this.ammoLabel.text = "No ammo";
            return null;
        }


    }
}