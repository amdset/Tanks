var canvas = document.getElementById("TanksCanvas");
var Block = class {
    constructor(context, x, y, wh) {
        this.ctx = context;
        this.x = x;
        this.y = y;
        this.width = wh; //Default width of one part of the Tank
        this.height = wh;
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
                break;

            case TankDirection.DOWN:
                remove = (col == 0 && row == 2) || (col == 2 && row == 2);
                break;

            case TankDirection.LEFT:
                remove = (col == 0 && row == 0) || (col == 0 && row == 2);
                break;

            case TankDirection.RIGHT:
                remove = (col == 2 && row == 0) || (col == 2 && row == 2);
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

}

if (canvas) {
    var ctx = canvas.getContext("2d");
    var x = canvas.width / 2;
    var y = (canvas.height / 3) * 2;
    var move = 10;
    var timeTank = new Date();
    var tankDirection = TankDirection.UP;
    var initialPoint = new Point(x, y, tankDirection);
    var playerTank = new Tank(ctx, false, initialPoint);

    var rightPressed = false;
    var leftPressed = false;
    var upPressed = false;
    var downPressed = false;

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
                if (initialPoint.y + move <= canvas.height-(move * 3)) {// down wall
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
        }
    }
}


function StartGame() {//Agregar timer para saber si ya pasó un tiempo dado y entonces cambiar de posición
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    initialPoint.TankDirection = tankDirection;
    playerTank.moveTank(initialPoint);

    if (upPressed) {

    } else if (rightPressed) {

    } else if (downPressed) {

    } else if (leftPressed) {

    }

    requestAnimationFrame(StartGame);
}

StartGame();

