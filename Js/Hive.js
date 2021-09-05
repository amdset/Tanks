import { TankDirection, Point } from './Utils.js';
import { Tank } from './Tank.js';

var Hive = class {
    constructor(noEnemies, ctx) {
        this.noEnemies = noEnemies;
        this.ctx = ctx;
        this.lstEnemies = [];
        this.createInitialTroop(ctx);
    }

    createInitialTroop(ctx) {
        for (let index = 0; index < this.noEnemies; index++) {
            const indexLoc = Math.floor(Math.random() * 6);
            this.lstEnemies[index] = this.createHunter(ctx, indexLoc);
        }
    }

    createHunter(context, indexLoc) {
        const point = this.getRandomPoint(indexLoc);
        let hunter = new Tank(context, false, point);
        return hunter;
    }

    startCreation() {
        var enemiesInBoard = this.lstEnemies.slice(0, 4);
        enemiesInBoard.forEach(element => {
            element.moveTank(element.point);
        });
    }

    endCreation() {

    }

    getRandomPoint(indexLoc) {
        const { x, y } = this.getAvailableLocation(indexLoc);
        const point = new Point(x, y, this.getRandomDirection());
        return point;
    }

    getAvailableLocation(index) {
        const sizeWidth = this.ctx.canvas.clientWidth;
        const sizeHeight = this.ctx.canvas.clientHeight;

        const lstAngars = [
            { x: 0, y: 0 },//Top left
            { x: sizeWidth - 30, y: 0 },//top right
            { x: 0, y: sizeHeight / 2 },//medium left
            { x: sizeWidth - 30, y: sizeHeight / 2 },//medium right
            { x: 0, y: sizeHeight - 30 },//Bottom left
            { x: sizeWidth - 30, y: sizeHeight - 30 } //Bottom right
        ]; //Six location available

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