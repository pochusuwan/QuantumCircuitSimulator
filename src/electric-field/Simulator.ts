import Painter from "./Painter";

type PositionHistory = {
    x: number;
    y: number;
    time: number;
};

class Particle {
    public x; // light second
    public y; // light second
    public charge = 1;
    public positionFunction = "Sine";

    public positionHistory: PositionHistory[] = [];

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    recordPostion(time: number) {
        this.setPosition(time);
        this.positionHistory.push({
            time,
            x: this.x,
            y: this.y,
        });
    }

    private setPosition(time: number) {
        if (this.positionFunction === "Sine") {
            /**
             * Sine
             * velocity = amplitude * frequency * 2 * pi * cos(time);
             */
            const amplitude = 1;
            const frequency = 1 / amplitude / 2 / Math.PI;
            this.y = amplitude * Math.sin(frequency * time * 2 * Math.PI);
        } else if (this.positionFunction === "Triangle") {
            /**
             * Linear
             * velocity = 2 * frequency * amplitude
             */
            const amplitude = 1;
            const frequency = 0.5;
            let y = frequency * 2 * time;
            if (y > 2) {
                y = y % 2;
            }
            if (y > 1) {
                y = 2 - y;
            }
            this.y = y * amplitude;
        }
    }

    setPositionFunction(name: string) {
        this.positionFunction = name;
    }
}

const LIGHT_SPEED = 1; // Light second / second
const FIELD_CONSTANT = 1;

class FieldPoint {
    public x; // light second
    public y; // light second
    public particleTimeIndex: number[]; // For each particle, what is the index of most recent particle position which traveled to affect this point

    public fX: number = 0;
    public fY: number = 0;
    public dfX: number = 0;
    public dfY: number = 0;
    public lastTime: number = 0;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.particleTimeIndex = [];
    }

    calculateField(time: number, particles: Particle[]) {
        while (this.particleTimeIndex.length < particles.length) {
            this.particleTimeIndex.push(-1);
        }

        let newfX = 0;
        let newfY = 0;
        for (let index = 0; index < particles.length; index++) {
            const particle = particles[index];
            const result = this.getLatestPostionForParticle(time, index, particle);
            if (result) {
                const { position, distanceSquared } = result;
                const F = (particle.charge * FIELD_CONSTANT) / distanceSquared;
                const distance = Math.sqrt(distanceSquared);
                newfX += F * ((this.x - position.x) / distance);
                newfY += F * ((this.y - position.y) / distance);
            }
        }
        this.dfX = (newfX - this.fX) / (time - this.lastTime);
        this.dfY = (newfY - this.fY) / (time - this.lastTime);
        this.fX = newfX;
        this.fY = newfY;
        this.lastTime = time;
    }

    private getLatestPostionForParticle(time: number, particleIndex: number, particle: Particle): { position: PositionHistory; distanceSquared: number } | undefined {
        const positions = particle.positionHistory;

        let currentIndex = this.particleTimeIndex[particleIndex];
        let currentDistanceSquared = 0;
        if (particle.positionHistory[currentIndex]) {
            const position = particle.positionHistory[currentIndex];
            currentDistanceSquared = Math.pow(position.x - this.x, 2) + Math.pow(position.y - this.y, 2);
        }

        let nextIndex = currentIndex + 1;
        while (nextIndex < positions.length) {
            const currentPosition = positions[nextIndex];
            const distanceSquared = Math.pow(currentPosition.x - this.x, 2) + Math.pow(currentPosition.y - this.y, 2);

            const distanceTraveledSquared = Math.pow((time - currentPosition.time) * LIGHT_SPEED, 2);
            if (distanceTraveledSquared < distanceSquared) {
                break;
            }

            currentDistanceSquared = distanceSquared;
            currentIndex = nextIndex;
            nextIndex += 1;
        }

        if (particle.positionHistory[currentIndex]) {
            this.particleTimeIndex[particleIndex] = currentIndex;
            return {
                position: particle.positionHistory[currentIndex],
                distanceSquared: currentDistanceSquared,
            };
        }
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
