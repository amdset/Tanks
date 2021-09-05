import { TankDirection } from "./Utils.js";
import { sleep } from "./Utils.js";

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

    /**
     * Se mueve el bloque hasta llegar a alguno de los limites del canvas
     * @param {*} tankDirection Dirección del disparo
     * @param {*} pxMove Pixeles que irá avanzando el disparo cada x tiempo
     * @returns 
     */
    async moveBlock(tankDirection, pxMove) {
        let cont = 0;
        while (this.EnLimite === false) {
            if (cont > 0) {
                await sleep(60);//Esperamos x ms antes de cada avance
            }
            if (tankDirection == TankDirection.UP) {
                if (this.y - pxMove < 0) {//Top wall
                    this.EnLimite = true;
                } else {
                    this.y -= pxMove;
                }
            } else if (tankDirection == TankDirection.RIGHT) {
                if (this.x + pxMove > this.ctx.canvas.clientWidth) {
                    this.EnLimite = true;
                } else {
                    this.x += pxMove;
                }
            } else if (tankDirection == TankDirection.DOWN) {
                if (this.y + pxMove > this.ctx.canvas.clientHeight) {
                    this.EnLimite = true;
                } else {
                    this.y += pxMove;
                }
            } else if (tankDirection == TankDirection.LEFT) {
                if (this.x - pxMove < 0) {
                    this.EnLimite = true;
                } else {
                    this.x -= pxMove;
                }
            }
            cont += 1;
        }
    }

}

export {Block};