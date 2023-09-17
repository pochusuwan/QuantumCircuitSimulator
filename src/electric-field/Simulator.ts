class Particle {
    public x = 0; // light second
    public y = 0; // light second
}

type Context = CanvasRenderingContext2D;

function fillCircle(ctx: Context, x: number, y: number, r: number) {
    ctx.arc(x, y, r, 0, 2 * Math.PI);
}

function drawLine(ctx: Context, x: number, y: number, deltaX: number, deltaY: number) {
    ctx.moveTo(x, y);
    ctx.lineTo(x + deltaX, y + deltaY);
}

class Simulator {
    private canvas: HTMLCanvasElement | null = null;
    private canvasWidth = 0;
    private canvasHeight = 0;
    private originX = 0;
    private originY = 0;

    private intervalId: ReturnType<typeof setInterval> | null = null;
    private time = 0;

    private scale = 100; // pixel per light second;
    private axisTickDensity = 1; // light second

    private particles = [new Particle()];

    private draw() {
        const ctx = this.canvas?.getContext("2d");
        if (!ctx) return;

        this.drawBackground(ctx);
        this.drawAxis(ctx);
        this.drawField(ctx);
        this.drawParticles(ctx);
    }

    private drawParticles(ctx: Context) {
        ctx.beginPath();
        for (const particle of this.particles) {
            fillCircle(ctx, this.originX + particle.x * this.scale, this.originY + particle.y * this.scale, 10);
        }
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
    }

    private drawAxis(ctx: Context) {
        ctx.beginPath();
        drawLine(ctx, 0, this.originY, this.canvasWidth, 0);
        drawLine(ctx, this.originX, 0, 0, this.canvasHeight);

        const pixelPerTick = this.axisTickDensity * this.scale; // light second * (pixel / light second)

        const tickWidth = 6;
        const tickWidthHalf = 3;
        let x = this.originX;
        while (x < this.canvasWidth) {
            drawLine(ctx, Math.floor(x) + 0.5, this.originY - tickWidthHalf, 0, tickWidth);
            x += pixelPerTick;
        }

        x = this.originX;
        while (x >= 0) {
            drawLine(ctx, Math.floor(x) + 0.5, this.originY - tickWidthHalf, 0, tickWidth);
            x -= pixelPerTick;
        }

        let y = this.originY;
        while (y < this.canvasHeight) {
            drawLine(ctx, this.originX - tickWidthHalf, Math.floor(y) + 0.5, tickWidth, 0);
            y += pixelPerTick;
        }

        y = this.originY;
        while (y >= 0) {
            drawLine(ctx, this.originX - tickWidthHalf, Math.floor(y) + 0.5, tickWidth, 0);
            y -= pixelPerTick;
        }

        ctx.lineWidth = 1;
        ctx.strokeStyle = "#FFFFFF";
        ctx.stroke();
    }

    private drawField(ctx: Context) {}

    private drawBackground(ctx: Context) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
        this.originX = Math.floor(this.canvasWidth / 2) + 0.5;
        this.originY = Math.floor(this.canvasHeight / 2) + 0.5;

        this.intervalId = setInterval(() => {
            this.draw();
            this.time += 100;
        }, 100);
    }

    clearCanvas() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}
export const simulator = new Simulator();
