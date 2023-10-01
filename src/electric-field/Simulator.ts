import { FieldPoint } from "./FieldPoint";
import Painter from "./Painter";
import { Particle } from "./Particle";

export enum FieldRenderOption {
    Hide = "Hide",
    ConstantScalar = "Constant",
    ConstantScalarMinMax = "Constant with MinMax",
    ScaleWithDistance = "Scale with Distance",
    ScaleWithDistanceSquared = "Scale with Distance Squared"
}

function scaleFieldVector(x: number, y: number, px: number, py: number, option: FieldRenderOption) {
    if (option === FieldRenderOption.Hide) {
        return undefined;
    }
    if (option === FieldRenderOption.ConstantScalar) {
        return {
            x: x * 40,
            y: y * 40,
        };
    }
    if (option === FieldRenderOption.ConstantScalarMinMax) {
        const min = 10;
        const max = 40;
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
    if (option === FieldRenderOption.ScaleWithDistance || option === FieldRenderOption.ScaleWithDistanceSquared) {
        let d = Math.pow(px, 2) + Math.pow(py, 2);
        if (option === FieldRenderOption.ScaleWithDistance) {
            d = Math.sqrt(d);
        }
        return {
            x: x * d * 160,
            y: y * d * 160,
        };
    }
}

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
    private staticFieldRenderOption: FieldRenderOption = FieldRenderOption.ConstantScalarMinMax;
    private deltaFieldRenderOption: FieldRenderOption = FieldRenderOption.ConstantScalarMinMax;

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

    private drawField(pnt: Painter) {
        for (const point of this.fieldPoints) {
            point.calculateField(this.time, this.particles);

            const staticField = scaleFieldVector(point.fX, -point.fY, point.x, point.y, this.staticFieldRenderOption);
            if (staticField) {
                pnt.beginPath();
                pnt.drawLine(pnt.pX(point.x), pnt.pY(point.y), staticField.x, staticField.y);
                pnt.stroke("#FFFFFF");
            }
            const deltaField = scaleFieldVector(point.dfX, -point.dfY, point.x, point.y, this.deltaFieldRenderOption);
            if (deltaField) {
                pnt.beginPath();
                pnt.drawLine(pnt.pX(point.x), pnt.pY(point.y), deltaField.x, deltaField.y);
                pnt.stroke("#FF0000");
            }
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

    setStaticFieldRenderOption(option: FieldRenderOption) {
        this.staticFieldRenderOption = option;
    }

    setDeltaFieldRenderOption(option: FieldRenderOption) {
        this.deltaFieldRenderOption = option;
    }

    clearCanvas() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}
export const simulator = new Simulator();
