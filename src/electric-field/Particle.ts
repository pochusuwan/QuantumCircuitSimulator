export type PositionHistory = {
    x: number;
    y: number;
    time: number;
};

export class Particle {
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
