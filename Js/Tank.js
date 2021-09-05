import { Block } from './Block.js';
import { TankDirection, Point, sleep } from './Utils.js';

var Tank = class {
    constructor(context, isPlayer, point) {
        this.ctx = context;
        this.isPlayer = isPlayer;
        this.point = point;
        this.move = 10;
        this.width = 3; //Default size of tank
        this.height = 3;//Default size of tank
        this.lstTankBlocks = this.createTankBlocks();
        this.lstBullets = [];
    }

    createTankBlocks() {
        var blocks = [];
        var dx = this.point.x;
        var dy = this.point.y;
        for (var c = 0; c < this.width; c++) {//columns
            blocks[c] = [];// An empy array for each column
            for (var r = 0; r < this.height; r++) {//rows
                blocks[c][r] = { x: dx, y: dy, draw: 1 };
                dy += 10;
            }
            dx += 10;
            var dy = this.point.y;
        }
        return blocks;
    }

    removeBlock(col, row) {
        var remove = false;
        switch (this.point.TankDirection) {
            case TankDirection.UP:
                remove = (col == 0 && row == 0) || (col == 2 && row == 0);
                if (remove == false && this.isPlayer == false) {
                    remove = (col == 1 && row == 2);
                }
                break;

            case TankDirection.DOWN:
                remove = (col == 0 && row == 2) || (col == 2 && row == 2);
                if (remove == false && this.isPlayer == false) {
                    remove = (col == 1 && row == 0);
                }
                break;

            case TankDirection.LEFT:
                remove = (col == 0 && row == 0) || (col == 0 && row == 2);
                if (remove == false && this.isPlayer == false) {
                    remove = (col == 2 && row == 1);
                }
                break;

            case TankDirection.RIGHT:
                remove = (col == 2 && row == 0) || (col == 2 && row == 2);
                if (remove == false && this.isPlayer == false) {
                    remove = (col == 0 && row == 1);
                }
                break;
        }
        return remove;
    }

    drawTank() {
        for (var c = 0; c < this.width; c++) {//columns
            for (var r = 0; r < this.height; r++) {//rows
                if (this.removeBlock(c, r) == false) {
                    var b = this.lstTankBlocks[c][r];
                    var block = new Block(this.ctx, b.x, b.y, 10);
                    block.createBlock();
                }
            }
        }
    }

    moveTank(point) {
        this.point = point;
        this.lstTankBlocks = this.createTankBlocks();
        this.drawTank();
    }

    CreateFire() {
        var bp = this.getBulletPoint();
        var newBullet = new Block(this.ctx, bp.x, bp.y, this.move);
        this.lstBullets.push(newBullet);

        newBullet.moveBlock(this.point.TankDirection, this.move);
    }

    getBulletPoint() {
        var p = null;
        if (this.point.TankDirection == TankDirection.UP) {
            p = this.lstTankBlocks[1][0];
        } else if (this.point.TankDirection == TankDirection.RIGHT) {
            p = this.lstTankBlocks[2][1];
        } else if (this.point.TankDirection == TankDirection.DOWN) {
            p = this.lstTankBlocks[1][2];
        }
        else if (this.point.TankDirection == TankDirection.LEFT) {
            p = this.lstTankBlocks[0][1];
        }
        return { x: p.x, y: p.y };
    }
}

export { Tank };