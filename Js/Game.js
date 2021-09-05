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
    window.leftPressed = false;
    var upPressed = false;
    var downPressed = false;
    var firingdBulled = false;
    var lastTimeEventFire = undefined;
    var bulletStart = null;
    //mouse and touch DownPressed 
    var KeyOrTouch_DownPressed = false;

    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("keydown", keyDownHandler, false);

    window.addEventListener('mouseup', e => {
        if (firingdBulled === true) {
            firingdBulled = false;
            lastTimeEventFire = undefined;
        }
    });

    window.addEventListener('touchend', e => {
        KeyOrTouch_DownPressed = false;
        firingdBulled = false;
        lastTimeEventFire = undefined;
    }, false);

    if (btn_left) {
        btn_left.onmousedown = evt => {
            if (evt.buttons == 1) {
                leftPressed = true;
            }
        }
        btn_left.onmouseup = e => leftPressed = false;

        btn_left.addEventListener('touchstart', e => {
            e.preventDefault();
            KeyOrTouch_DownPressed = true;
            goAsync(goLeft, KeyOrTouch_DownPressed);
        }, false);
    }

    if (btn_up) {
        btn_up.onmousedown = e => {
            if (e.buttons === 1) {
                upPressed = true;
            }
        }
        btn_up.onmouseup = e => upPressed = false;

        btn_up.addEventListener('touchstart', e => {
            e.preventDefault();
            KeyOrTouch_DownPressed = true;
            goAsync(goUp, KeyOrTouch_DownPressed);
        }, false);
    }
    if (btn_right) {
        btn_right.onmousedown = e => {
            rightPressed = true;
        }
        btn_right.onmouseup = () => rightPressed = false;

        btn_right.addEventListener('touchstart', e => {
            e.preventDefault();
            KeyOrTouch_DownPressed = true;
            goAsync(goRight, KeyOrTouch_DownPressed);
        }, false);
    }
    if (btn_down) {
        btn_down.onmousedown = e => {
            downPressed = true;
        }
        btn_down.onmouseup = () => downPressed = false;

        btn_down.addEventListener('touchstart', e => {
            e.preventDefault();
            KeyOrTouch_DownPressed = true;
            goAsync(goDown, KeyOrTouch_DownPressed);
        }, false);
    }

    if (btn_enter) {
        btn_enter.onmousedown = e => {
            firingdBulled = true;
            if (!lastTimeEventFire) {
                lastTimeEventFire = new Date();
            }
        }
        btn_enter.onmouseup = e => {
            firingdBulled = false;
            lastTimeEventFire = undefined;
            fire();//last fire
        }
        btn_enter.addEventListener('touchstart', e => {
            e.preventDefault();
            firingdBulled = true;
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
            firingdBulled = false;
            lastTimeEventFire = undefined;
            fire();//last fire
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
            firingdBulled = true;
            if (!lastTimeEventFire) {
                lastTimeEventFire = new Date();
            }
        }
    }

    function goUp() {
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
        if (tankDirection != TankDirection.RIGHT) {
            tankDirection = TankDirection.RIGHT;
        } else {//Ya está en posición de avanzar
            if (initialPoint.x + move <= canvas.width - (move * 3)) { //Right wall
                initialPoint.x += move;
            }
        }
    }
    function goDown() {
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
        while (leftPressed || rightPressed || upPressed || downPressed || KeyOrTouch_DownPressed) {
            fn();
            await sleep(30);
        }
        return true;
    }

    function goLeft() {
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

    async function fireAsync(fn, sleetTime, singleFire) {

        if (!sleetTime) {
            sleetTime = 50;
        }
        await sleep(sleetTime);
        fn();
        if (!singleFire) {
            await sleep(220);
            while (firingdBulled) {
                fn();
                await sleep(200);
            }
        }
    }

    let lastFireTime = undefined;
    var OneSecond = 1000;
    const speedFire = 6.5;
    let now = new Date();
    var moveFunction = undefined;

    function StartGame() {
        console.log(firingdBulled);
        if (firingdBulled) {
            if (!lastFireTime) {
                lastFireTime = new Date();
            } else {
                now = new Date();
                const diference = Math.abs(now - lastFireTime);
                const differenceEvent = Math.abs(lastTimeEventFire - now) - 10;

                if (diference >= (OneSecond / speedFire)) {//Solo cuando sea mayor a la velocidad configurada, ejecutamos algo
                    lastFireTime = undefined;
                    if (differenceEvent > (OneSecond / speedFire)) {
                        if (firingdBulled) {
                            fire();
                        }
                    }
                }
            }
        }


        if (leftPressed || upPressed || rightPressed || downPressed) {
            if (!moveFunction) {
                moveFunction = 1;
                if (leftPressed) {
                    goAsync(goLeft).then(res => moveFunction = undefined);
                } else if (upPressed) {
                    goAsync(goUp).then(res => moveFunction = undefined);
                } else if (rightPressed) {
                    goAsync(goRight).then(res => moveFunction = undefined);
                } else if (downPressed) {
                    goAsync(goDown).then(res => moveFunction = undefined);;
                }
            }
        }


        ctx.clearRect(0, 0, canvas.width, canvas.height);
        initialPoint.TankDirection = tankDirection;
        playerTank.moveTank(initialPoint);
        hive.startCreation();

        //Draw all bullets
        for (var bullet of playerTank.lstBullets) {
            var limite = bullet.createBlock();
        }

        playerTank.lstBullets = playerTank.lstBullets.filter(b => b.EnLimite === false);

        requestAnimationFrame(StartGame);
    }

    StartGame();

}



