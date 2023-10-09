import { Particle, PositionHistory } from "./Particle";
import { FIELD_CONSTANT, LIGHT_SPEED } from "./constant";

export class FieldPoint {
    public x; // light second
    public y; // light second
    public particleTimeIndex: number[]; // For each particle, what is the index of most recent particle position which traveled to affect this point

    public fX: number = 0;
    public fY: number = 0;
    public dfX: number = 0;
    public dfY: number = 0;
    public lastTime: number = 0;
    public isDebug = false;
    constructor(x: number, y: number, isDebug: boolean = false) {
        this.x = x;
        this.y = y;
        this.particleTimeIndex = [];
        this.isDebug = isDebug;
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
        if (this.isDebug) {
            console.log(`P: ${this.round(this.x)}\t${this.round(this.y)}\tX: ${this.round(this.fX)}\t${this.round(newfX)}\t${this.round(this.dfX)}\tY: ${this.round(this.fY)}\t${this.round(newfY)}\t${this.round(this.dfY)}`);
        }
        this.fX = newfX;
        this.fY = newfY;
        this.lastTime = time;
    }

    private round(v: number) {
        return Math.round(v * 1000) / 1000;
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
