var canvas = document.getElementById("TanksCanvas");
var Block = class {
    constructor(context, x, y, wh) {
        this.ctx = context;
        this.x = x;
        this.y = y;
        this.width = wh; //Default width of one part of the Tank
        this.height = wh;
        this.EnLimite = false;
    }

    createBlock() {
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.width, this.height);
        this.ctx.fillStyle = "black";
        this.ctx.fill();
        this.ctx.closePath();

        //Internal scuare
        this.ctx.beginPath();
        this.ctx.rect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);
        this.ctx.strokeStyle = "white";
        this.ctx.stroke();
        this.ctx.closePath();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Se mueve el bloque hasta llegar a alguno de los limites del canvas
     * @param {*} tankDirection Dirección del disparo
     * @param {*} pxMove Pixeles que irá avanzando el disparo cada x tiempo
     * @returns 
     */
    async moveBlock(tankDirection, pxMove) {
        while (this.EnLimite === false) {
            await this.sleep(100);//Esperamos 200 ms antes de cada avance
            if (tankDirection == TankDirection.UP) {
                if (this.y - pxMove < 0) {//Top wall
                    this.EnLimite = true;
                    console.log("limite alcanzado top");
                } else {
                    this.y -= pxMove;
                }
            } else if (tankDirection == TankDirection.RIGHT) {
                if (this.x + pxMove > canvas.width) {
                    this.EnLimite = true;
                    console.log("limite alcanzado Right");
                } else {
                    this.x += pxMove;
                }
            } else if (tankDirection == TankDirection.DOWN) {
                if (this.y + pxMove > canvas.height) {
                    this.EnLimite = true;
                    console.log("limite alcanzado Down");
                } else {
                    this.y += pxMove;
                }
            } else if (tankDirection == TankDirection.LEFT) {
                if (this.x - pxMove < 0) {
                    this.EnLimite = true;
                    console.log("limite alcanzado Left");
                } else {
                    this.x -= pxMove;
                }
            }
        }
    }

}

const TankDirection = {
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};

var Point = class {
    constructor(x, y, TankDirection) {
        this.x = x;
        this.y = y;
        this.TankDirection = TankDirection;
    }
}

var Tank = class {
    constructor(context, isPlayer, point) {
        this.ctx = context;
        this.isPlayer = isPlayer;
        this.point = point;
        this.width = 3; //Default size of tank
        this.height = 3;//Default size of tank
        this.lstTankBlocks = this.createTankBlocks();
        this.lstBullets = [];
    }

    //DrawBlock()

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
        var newBullet = new Block(this.ctx, bp.x, bp.y, move);
        this.lstBullets.push(newBullet);

        newBullet.moveBlock(this.point.TankDirection, move)
            .then(result => console.log(result))
            .catch(error => console.error(error));;
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

if (canvas) {
    var ctx = canvas.getContext("2d");
    var x = canvas.width / 2;
    var y = (canvas.height / 3) * 2;
    var move = 10;
    var timeTank = new Date();
    var tankDirection = TankDirection.UP;
    var initialPoint = new Point(x, y, tankDirection);
    var playerTank = new Tank(ctx, true, initialPoint);

    var rightPressed = false;
    var leftPressed = false;
    var upPressed = false;
    var downPressed = false;
    var firedBulled = false;
    var bulletStart = null;

    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("keydown", keyDownHandler, false);

    function keyUpHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = false;
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = false;
        } else if (e.key == "Up" || e.key == "ArrowUp") {
            upPressed = false;
        } else if (e.key == "Down" || e.key == "ArrowDown") {
            downPressed = false;
        } else if (e.key == " " || e.code == "Space") {
            firedBulled = false;
        }
    }

    function keyDownHandler(e) {
        if (e.key == "Up" || e.key == "ArrowUp") {
            upPressed = true;
            if (tankDirection != TankDirection.UP) {
                tankDirection = TankDirection.UP;
            } else {
                if (initialPoint.y - move < 0) {//Top wall
                    initialPoint.y = 0;
                } else {
                    initialPoint.y -= move;
                }
            }
        }
        else if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = true;
            if (tankDirection != TankDirection.RIGHT) {
                tankDirection = TankDirection.RIGHT;
            } else {//Ya está en posición de avanzar
                if (initialPoint.x + move <= canvas.width - (move * 3)) { //Right wall
                    initialPoint.x += move;
                }
            }
        } else if (e.key == "Down" || e.key == "ArrowDown") {
            downPressed = true;
            if (tankDirection != TankDirection.DOWN) {
                tankDirection = TankDirection.DOWN;
            } else {
                if (initialPoint.y + move <= canvas.height - (move * 3)) {// down wall
                    initialPoint.y += move;
                }
            }
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = true;
            if (tankDirection != TankDirection.LEFT) {
                tankDirection = TankDirection.LEFT;
            } else {
                if (initialPoint.x - move >= 0) {//left wall
                    initialPoint.x -= move;
                }
            }
        } else if (e.key == " " || e.code == "Space") {
            firedBulled = true;
            if (playerTank) {
                playerTank.CreateFire();
                /* for (var bullet of playerTank.lstBullets) {
                     var limite = bullet.moveBlock(tankDirection, 5);
                 }*/
            }
        }
    }
}


function StartGame() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    initialPoint.TankDirection = tankDirection;
    playerTank.moveTank(initialPoint);

    //Draw all bullets
    for (var bullet of playerTank.lstBullets) {
        var limite = bullet.createBlock();
    }

    playerTank.lstBullets = playerTank.lstBullets.filter(b => b.EnLimite === false);


    if (upPressed) {

    } else if (rightPressed) {

    } else if (downPressed) {

    } else if (leftPressed) {

    }

    requestAnimationFrame(StartGame);
}

StartGame();

