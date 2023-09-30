import { FieldPoint } from "./FieldPoint";
import Painter from "./Painter";
import { Particle } from "./Particle";

class Simulator {
    private painter: Painter | null = null;
    private canvasWidth = 0;
    private canvasHeight = 0;
    private originX = 0;
    private originY = 0;

    private intervalId: ReturnType<typeof setInterval> | null = null;
    private time = 0;

    private framePerSecond = 50;
    private scale = 50; // pixel per light second
    private axisTickDensity = 1; // light second
    private fieldPointDensity = 0.5; // light second

    private particles: Particle[] = [];
    private fieldPoints: FieldPoint[] = [];

    private draw() {
        const painter = this.painter;
        if (!painter) return;

        painter.fillBackground("#000000");

        this.drawAxis(painter);
        this.drawField(painter);
        this.drawParticles(painter);
    }

    private drawParticles(pnt: Painter) {
        for (const particle of this.particles) {
            pnt.beginPath();
            pnt.fillCircle(pnt.pX(particle.x), pnt.pY(particle.y), 10);
            pnt.fill("#FFFFFF");
        }
    }

    private drawAxis(pnt: Painter) {
        const { left, right, top, bottom, canvasWidth, canvasHeight } = pnt.getBoundary();

        pnt.beginPath();
        pnt.drawLine(pnt.pX(left), pnt.pY(0), canvasWidth, 0);
        pnt.drawLine(pnt.pX(0), pnt.pY(top), 0, canvasHeight);

        const tickWidth = 6;
        const halfTickWidth = tickWidth / 2;
        for (let x = Math.floor(left); x < right; x += this.axisTickDensity) {
            pnt.drawLine(pnt.pX(x), pnt.pY(0) - halfTickWidth, 0, tickWidth);
        }

        for (let y = Math.floor(bottom); y < top; y += this.axisTickDensity) {
            pnt.drawLine(pnt.pX(0) - halfTickWidth, pnt.pY(y), tickWidth, 0);
        }

        pnt.stroke("#FFFFFF");
    }

    private scaleFieldLine(x: number, y: number, max: number, min: number) {
        const x2 = x * max;
        const y2 = y * max;
        const longer = Math.max(Math.abs(x2), Math.abs(y2));
        let scale = 1;
        if (longer > max) {
            scale = max / longer;
        } else if (longer < min) {
            scale = min / longer;
        }
        return {
            x: x2 * scale,
            y: y2 * scale,
        };
    }

    private drawField(pnt: Painter) {
        for (const point of this.fieldPoints) {
            point.calculateField(this.time, this.particles);

            const staticField = this.scaleFieldLine(point.fX, -point.fY, 40, 10);
            //const deltaField = this.scaleFieldLine(point.dfX, -point.dfY, 40, 20)

            pnt.beginPath();
            pnt.drawLine(pnt.pX(point.x), pnt.pY(point.y), staticField.x, staticField.y);
            pnt.stroke("#FFFFFF");
            //pnt.beginPath();
            //pnt.drawLine(pnt.pX(point.x), pnt.pY(point.y), point.dfX * 4000 * (Math.pow(point.x, 2) + Math.pow(point.y, 2)), -point.dfY * 4000 * (Math.pow(point.x, 2) + Math.pow(point.y, 2)));
            //pnt.drawLine(pnt.pX(point.x), pnt.pY(point.y), deltaField.x, deltaField.y);
            //pnt.stroke("#FF0000");

            pnt.beginPath();
            pnt.fillCircle(pnt.pX(point.x), pnt.pY(point.y), 1);
            pnt.fill("#FFFFFF");
        }
    }

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
        this.originX = Math.floor(this.canvasWidth / 2) + 0.5;
        this.originY = Math.floor(this.canvasHeight / 2) + 0.5;
        this.painter = new Painter(canvas, this.originX, this.originY, this.scale);

        const { left, right, top, bottom } = this.painter.getBoundary();
        for (let x = Math.floor(left); x < right; x += this.fieldPointDensity) {
            for (let y = Math.floor(bottom); y < top; y += this.fieldPointDensity) {
                this.fieldPoints.push(new FieldPoint(x, y));
            }
        }
        this.particles.push(new Particle(0, 0));

        const secPerFrame = 1 / this.framePerSecond;
        this.intervalId = setInterval(() => {
            this.time += secPerFrame;
            for (const particle of this.particles) {
                particle.recordPostion(this.time);
            }
            this.draw();
        }, secPerFrame * 1000);
    }

    setParticlePositionFunction(name: string) {
        for (const particle of this.particles) {
            particle.setPositionFunction(name);
        }
    }

    clearCanvas() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}
export const simulator = new Simulator();
