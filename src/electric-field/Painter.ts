type Context = CanvasRenderingContext2D;

export default class Painter {
    private canvas: HTMLCanvasElement;
    private canvasWidth: number;
    private canvasHeight: number;

    private ctx: Context;

    private originX: number;
    private originY: number;
    private scale: number;

    constructor(canvas: HTMLCanvasElement, originX: number, originY: number, scale: number) {
        this.canvas = canvas;
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
        this.ctx = this.canvas.getContext("2d")!!;
        this.originX = originX;
        this.originY = originY;
        this.scale = scale;
    }

    fillBackground(color: string) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    drawLine(x: number, y: number, deltaX: number, deltaY: number) {
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + deltaX, y + deltaY);
    }

    fillCircle(x: number, y: number, r: number) {
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    }

    getBoundary() {
        return {
            left: (0 - this.originX) / this.scale,
            right: (this.canvasWidth - this.originX) / this.scale,
            top: this.originY / this.scale,
            bottom: (this.originY - this.canvasHeight) / this.scale,
            width: this.canvasWidth / this.scale,
            height: this.canvasHeight / this.scale,
            canvasWidth: this.canvasWidth,
            canvasHeight: this.canvasHeight,
        };
    }

    beginPath() {
        this.ctx.beginPath();
    }

    stroke(color: string) {
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }

    fill(color: string) {
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }

    pX(x: number) {
        return this.originX + x * this.scale;
    }

    pY(y: number) {
        return this.originY - y * this.scale;
    }

    sc(val: number) {
        return val * this.scale;
    }

    setScale(scale: number) {
        this.scale = scale;
    }
}
