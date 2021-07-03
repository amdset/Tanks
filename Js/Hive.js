import { TankDirection, Point } from './Utils.js';
import { Tank } from './Tank.js';

var Hive = class {
    constructor(noEnemies, ctx) {
        this.noEnemies = noEnemies;
        this.ctx = ctx;
        this.lstEnemies = [];
        for (let index = 0; index < this.noEnemies; index++) {
            this.lstEnemies[index] = new Tank(ctx, false, this.getRandomLocation());
        }
    }

    startCreation() {
        var enemiesInBoard = this.lstEnemies.slice(0, 4);
        enemiesInBoard.forEach(element => {
            element.moveTank(element.point);
        });
    }

    endCreation() {

    }

    getRandomLocation() {
        const { x, y } = this.getAvailableLocation();
        const point = new Point(x, y, this.getRandomDirection())
        return point;
    }

    getAvailableLocation() {
        const sizeWidth = this.ctx.canvas.clientWidth;
        const sizeHeight = this.ctx.canvas.clientHeight;
        const index = Math.floor(Math.random() * 6);
        const lstAngars = [
            { x: 0, y: 0 },//Top left
            { x: sizeWidth - 30, y: 0 },//top right
            { x: 0, y: sizeHeight / 2 },//medium left
            { x: sizeWidth - 30, y: sizeHeight / 2 },//medium right
            { x: 0, y: sizeHeight - 30 },//Bottom left
            { x: sizeWidth - 30, y: sizeHeight - 30 } //Bottom right
        ];

        return lstAngars[index];
    }

    getRandomDirection() {
        const index = Math.floor(Math.random() * 3);
        switch (index) {
            case 0: return TankDirection.UP;
            case 1: return TankDirection.DOWN;
            case 2: return TankDirection.LEFT;
            case 3: return TankDirection.RIGHT;
        }
    }

}

export { Hive };