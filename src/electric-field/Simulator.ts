import { FieldPoint } from "./FieldPoint";
import Painter from "./Painter";
import { Particle } from "./Particle";

export enum FieldRenderOption {
    Hide = "Hide",
    ConstantScalar = "Constant",
    ConstantScalarMinMax = "Constant with MinMax",
    ScaleWithDistance = "Scale with Distance",
    ScaleWithDistanceSquared = "Scale with Distance Squared",
}

function scaleFieldVector(x: number, y: number, px: number, py: number, option: FieldRenderOption, scale: number) {
    if (option === FieldRenderOption.Hide) {
        return undefined;
    }
    if (option === FieldRenderOption.ConstantScalar) {
        return {
            x: x * scale,
            y: y * scale,
        };
    }
    if (option === FieldRenderOption.ConstantScalarMinMax) {
        const min = scale / 2;
        const max = scale;
        const x2 = x * max;
        const y2 = y * max;
        const longer = Math.max(Math.abs(x2), Math.abs(y2));
        let mult = 1;
        if (longer > max) {
            mult = max / longer;
        } else if (longer < min) {
            mult = min / longer;
        }
        return {
            x: x2 * mult,
            y: y2 * mult,
        };
    }
    if (option === FieldRenderOption.ScaleWithDistance || option === FieldRenderOption.ScaleWithDistanceSquared) {
        let d = Math.pow(px, 2) + Math.pow(py, 2);
        if (option === FieldRenderOption.ScaleWithDistance) {
            d = Math.sqrt(d);
        }
        return {
            x: x * d * scale,
            y: y * d * scale,
        };
    }
}

export default class Simulator {
    private painter: Painter | null = null;

    private intervalId: ReturnType<typeof setInterval> | null = null;
    private time = 0;
    private framePerSecond = 50;

    private pixelPerLightSecond: number;

    private axisTickDensity = 1; // light second

    private fieldPointPerLightSecond: number;
    private staticFieldRenderOption: FieldRenderOption = FieldRenderOption.ConstantScalarMinMax;
    private deltaFieldRenderOption: FieldRenderOption = FieldRenderOption.ConstantScalarMinMax;

    private staticFieldScale: number;
    private deltaFieldScale: number;
    private measuredFPS = 0;

    private particles: Particle[] = [];
    private fieldPoints: FieldPoint[] = [];

    private draw() {
        const painter = this.painter;
        if (!painter) return;

        painter.fillBackground("#000000");

        // this.drawAxis(painter);
        this.drawField(painter);
        this.drawParticles(painter);
        painter.drawText(`FPS: ${Math.round(this.measuredFPS * 100) / 100}`, 10, 20);
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

            const staticField = scaleFieldVector(point.fX, -point.fY, point.x, point.y, this.staticFieldRenderOption, this.staticFieldScale);
            if (staticField) {
                pnt.beginPath();
                pnt.drawLine(pnt.pX(point.x), pnt.pY(point.y), staticField.x, staticField.y);
                pnt.stroke("#FFFFFF");
            }
            const deltaField = scaleFieldVector(point.dfX, -point.dfY, point.x, point.y, this.deltaFieldRenderOption, this.deltaFieldScale);
            if (deltaField) {
                pnt.beginPath();
                pnt.drawLine(pnt.pX(point.x), pnt.pY(point.y), deltaField.x, deltaField.y);
                pnt.stroke("#FF0000");
            }

            pnt.beginPath();
            pnt.fillCircle(pnt.pX(point.x), pnt.pY(point.y), 1);
            pnt.fill("#FFFFFF");
        }
    }

    private setFieldPoint() {
        const painter = this.painter;
        if (!painter) return;

        this.fieldPoints = [];

        const { left, right, top, bottom } = painter.getBoundary();
        const lightSecondPerFieldPoint = 1 / this.fieldPointPerLightSecond;
        for (let x = Math.ceil(left/lightSecondPerFieldPoint) * lightSecondPerFieldPoint; x < right; x += lightSecondPerFieldPoint) {
            for (let y = Math.ceil(bottom/lightSecondPerFieldPoint) * lightSecondPerFieldPoint; y < top; y += lightSecondPerFieldPoint) {
                this.fieldPoints.push(new FieldPoint(x, y));
            }
        }
    }

    constructor(
        canvas: HTMLCanvasElement, 
        originPixelX: number,
        originPixelY: number,
        pixelPerLightSecond: number, 
        fieldPointPerLightSecond: number, 
        staticFieldScale: number, 
        deltaFieldScale: number
    ) {
        this.pixelPerLightSecond = pixelPerLightSecond;
        this.fieldPointPerLightSecond = fieldPointPerLightSecond;
        this.staticFieldScale = staticFieldScale;
        this.deltaFieldScale = deltaFieldScale;

        this.painter = new Painter(canvas, originPixelX, originPixelY, this.pixelPerLightSecond);

        this.setFieldPoint();
        this.particles.push(new Particle(0, 0));

        let lastTime = Date.now();

        const secPerFrame = 1 / this.framePerSecond;
        this.intervalId = setInterval(() => {
            this.time += secPerFrame;
            for (const particle of this.particles) {
                particle.recordPostion(this.time);
            }
            this.draw();

            const now = Date.now();
            this.measuredFPS = 1000 / (now - lastTime);
            lastTime = now;
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

    setRenderOption(
        originPixelX: number,
        originPixelY: number,
        pixelPerLightSecond: number, 
        fieldPointPerLightSecond: number, 
        staticFieldScale: number, 
        deltaFieldScale: number
    ) {
        this.pixelPerLightSecond = pixelPerLightSecond;
        this.fieldPointPerLightSecond = fieldPointPerLightSecond;
        this.staticFieldScale = staticFieldScale;
        this.deltaFieldScale = deltaFieldScale;
        this.painter?.setOrigin(originPixelX, originPixelY);
        this.painter?.setScale(this.pixelPerLightSecond);
        this.setFieldPoint();
    }

    clearCanvas() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}
