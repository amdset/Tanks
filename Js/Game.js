import { TankDirection, Point, sleep } from './Utils.js';
import { Tank } from './Tank.js';
import { Hive } from './Hive.js';

var canvas = document.getElementById("TanksCanvas");
var btn_left = document.getElementById("btn-left");
var btn_up = document.getElementById("btn-up");
var btn_right = document.getElementById("btn-right");
var btn_down = document.getElementById("btn-down");
var btn_enter = document.getElementById("btn-enter");

if (canvas) {
    var ctx = canvas.getContext("2d");
    var x = canvas.width / 2;
    var y = (canvas.height / 3) * 2;
    var move = 10;
    var timeTank = new Date();
    var tankDirection = TankDirection.UP;
    var initialPoint = new Point(x, y, tankDirection);
    var playerTank = new Tank(ctx, true, initialPoint);
    const NoEnemies = 10;
    var hive = new Hive(NoEnemies, ctx);

    var rightPressed = false;
    var leftPressed = false;
    var upPressed = false;
    var downPressed = false;
    var firedBulled = false;
    var bulletStart = null;
    //mouse and touch DownPressed 
    var mouseDownPressed = false;


    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("keydown", keyDownHandler, false);

    window.addEventListener('mouseup', e => {
        if (mouseDownPressed === true) {
            mouseDownPressed = false;
        }
        if (firedBulled === true) {
            firedBulled = false;
        }
    });

    window.addEventListener('touchend', e => { mouseDownPressed = false; firedBulled = false; }, false);

    if (btn_left) {
        btn_left.onmousedown = evt => {
            if (evt.buttons == 1) {
                mouseDownPressed = true;
                goAsync(goLeft);
            }
        };
        btn_left.addEventListener('touchstart', e => {
            e.preventDefault();
            mouseDownPressed = true;
            goAsync(goLeft);
        }, false);
    }

    if (btn_up) {
        btn_up.onmousedown = e => {
            if (e.buttons === 1) {
                mouseDownPressed = true;
                goAsync(goUp);
            }
        };
        btn_up.addEventListener('touchstart', e => {
            e.preventDefault();
            mouseDownPressed = true;
            goAsync(goUp);
        }, false);
    }
    if (btn_right) {
        btn_right.onmousedown = e => {
            mouseDownPressed = true;
            goAsync(goRight);
        };
        btn_right.addEventListener('touchstart', e => {
            e.preventDefault();
            mouseDownPressed = true;
            goAsync(goRight);
        }, false);
    }
    if (btn_down) {
        btn_down.onmousedown = e => {
            mouseDownPressed = true;
            goAsync(goDown);
        };
        btn_down.addEventListener('touchstart', e => {
            e.preventDefault();
            mouseDownPressed = true;
            goAsync(goDown);
        }, false);
    }

    if (btn_enter) {
        btn_enter.onmousedown = e => {
            firedBulled = true;
            fireAsync(fire);
        };
        btn_enter.addEventListener('touchstart', e => {
            e.preventDefault();
            firedBulled = true;
            fireAsync(fire);
        }, false);
    }

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
            goUp();
        }
        else if (e.key == "Right" || e.key == "ArrowRight") {
            goRight();
        } else if (e.key == "Down" || e.key == "ArrowDown") {
            goDown();
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
            goLeft();
        } else if (e.key == " " || e.code == "Space") {
            fire();
        }
    }

    function goUp() {
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
    function goRight() {
        rightPressed = true;
        if (tankDirection != TankDirection.RIGHT) {
            tankDirection = TankDirection.RIGHT;
        } else {//Ya está en posición de avanzar
            if (initialPoint.x + move <= canvas.width - (move * 3)) { //Right wall
                initialPoint.x += move;
            }
        }
    }
    function goDown() {
        downPressed = true;
        if (tankDirection != TankDirection.DOWN) {
            tankDirection = TankDirection.DOWN;
        } else {
            if (initialPoint.y + move <= canvas.height - (move * 3)) {// down wall
                initialPoint.y += move;
            }
        }
    }

    /**
     * Tomar función como base
     * @param {*} fn 
     */
    async function goAsync(fn) {
        fn();
        await sleep(220);
        while (mouseDownPressed) {
            fn();
            await sleep(45);
        }
    }

    function goLeft() {
        leftPressed = true;
        if (tankDirection != TankDirection.LEFT) {
            tankDirection = TankDirection.LEFT;
        } else {
            if (initialPoint.x - move >= 0) {//left wall
                initialPoint.x -= move;
            }
        }
    }

    function fire() {
        if (playerTank) {
            playerTank.CreateFire();
        }
    }

    async function fireAsync(fn) {
        await sleep(50);
        fn();
        await sleep(220);
        while (firedBulled) {
            fn();
            await sleep(200);
        }
    }

    let lastRenderTime = 0;
    const speed = 2;


    function StartGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        initialPoint.TankDirection = tankDirection;
        playerTank.moveTank(initialPoint);
        hive.startCreation();

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

}



