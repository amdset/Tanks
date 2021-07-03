const TankDirection = {
    /** 1 */
    UP: 1,
    /**2 */
    DOWN: 2,
    /**3 */
    LEFT: 3,
    /**4 */
    RIGHT: 4
};

let Point = class {
    constructor(x, y, TankDirection) {
        this.x = x;
        this.y = y;
        this.TankDirection = TankDirection;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export { TankDirection, Point, sleep };