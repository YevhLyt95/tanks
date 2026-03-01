//this is a player's class
import * as PIXI from 'pixi.js';
import Character from "./Character";

export default class Tank extends Character {
    constructor (bodyTexture, barrelTexture, ammo) {
        super(bodyTexture, 100, 2);
        this.ammo = ammo;
        this.barrel = new PIXI.Sprite(barrelTexture);
        this.barrel.anchor.set(0.5, 0.5);
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

    shoot() {
        if (this.ammo > 0) {
            this.ammo--;
            this.ammoLabel.text = `Ammo: ${this.ammo}`;
            return true;
        } else {
            this.ammoLabel.text = "No ammo";
            return false;
        }
    }
}