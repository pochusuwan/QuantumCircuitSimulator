import { useEffect, useRef, useState } from "react";
import classes from "./App.module.css";
import { FieldRenderOption, simulator } from "./Simulator";

export default function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasStyle = useSetCanvasSize(canvasRef, containerRef);
    const [pixelPerLightSecond, setPixelPerLightSecond] = useState("50");
    const [lightSecondPerFieldPoint, setLightSecondPerFieldPoint] = useState("1");
    const [staticFieldScale, setStaticFieldScale] = useState("40");
    const [deltaFieldScale, setDeltaFieldScale] = useState("40");
    const updateTimeoutId = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            simulator.setRenderOption(
                parseFloat(pixelPerLightSecond), 
                parseFloat(lightSecondPerFieldPoint),
                parseFloat(staticFieldScale), 
                parseFloat(deltaFieldScale)
            )
            simulator.setCanvas(canvas);
        }
        return () => {
            simulator.clearCanvas();
        };
    }, []);

    if (updateTimeoutId.current !== null) {
        clearTimeout(updateTimeoutId.current)
    }
    updateTimeoutId.current = setTimeout(() => {
        simulator.setRenderOption(
            parseFloat(pixelPerLightSecond), 
            parseFloat(lightSecondPerFieldPoint),
            parseFloat(staticFieldScale), 
            parseFloat(deltaFieldScale)
        )
    }, 1000)

    return (
        <div className={classes.AppContainer}>
            <div className={classes.CanvasContainer} ref={containerRef}>
                <canvas ref={canvasRef} className={classes.Canvas} style={canvasStyle} onClick={(event) => console.log(event)} />
            </div>
            <div className={classes.Controls}>
                <div className={classes.ControlsRow}>
                    <button onClick={() => simulator.setParticlePositionFunction("Sine")}>Sine</button>
                    <button onClick={() => simulator.setParticlePositionFunction("Triangle")}>Triangle</button>
                </div>

                <div className={classes.ControlsRow}>
                    <div>Static field render option: </div>
                    <button onClick={() => simulator.setStaticFieldRenderOption(FieldRenderOption.ConstantScalarMinMax)}>Scalar with min/max</button>
                    <button onClick={() => simulator.setStaticFieldRenderOption(FieldRenderOption.ConstantScalar)}>Scalar</button>
                    <button onClick={() => simulator.setStaticFieldRenderOption(FieldRenderOption.ScaleWithDistance)}>Scale with distance from origin</button>
                    <button onClick={() => simulator.setStaticFieldRenderOption(FieldRenderOption.ScaleWithDistanceSquared)}>Scale with distance from origin squared</button>
                    <button onClick={() => simulator.setStaticFieldRenderOption(FieldRenderOption.Hide)}>Hide</button>
                    <input onChange={(event) => setStaticFieldScale(event.target.value)} value={staticFieldScale} />
                </div>

                <div className={classes.ControlsRow}>
                    <div>Delta field render option: </div>
                    <button onClick={() => simulator.setDeltaFieldRenderOption(FieldRenderOption.ConstantScalarMinMax)}>Scalar with MinMax</button>
                    <button onClick={() => simulator.setDeltaFieldRenderOption(FieldRenderOption.ConstantScalar)}>Scalar</button>
                    <button onClick={() => simulator.setDeltaFieldRenderOption(FieldRenderOption.ScaleWithDistance)}>Scale with distance from origin</button>
                    <button onClick={() => simulator.setDeltaFieldRenderOption(FieldRenderOption.ScaleWithDistanceSquared)}>Scale with distance from origin squared</button>
                    <button onClick={() => simulator.setDeltaFieldRenderOption(FieldRenderOption.Hide)}>Hide</button>
                    <input onChange={(event) => setDeltaFieldScale(event.target.value)} value={deltaFieldScale} />
                </div>

                <div className={classes.ControlsRow}>
                    <div>Pixel per light second:</div>
                    <input onChange={(event) => setPixelPerLightSecond(event.target.value)} value={pixelPerLightSecond} />
                </div>
                <div className={classes.ControlsRow}>
                    <div>Light second per field point:</div>
                    <input onChange={(event) => setLightSecondPerFieldPoint(event.target.value)} value={lightSecondPerFieldPoint} />
                </div>
                <div>Point density</div>
                <div>Vector Scale</div>
                <div>Refresh Rate</div>
                <div>Static vs Change</div>
                <div>Create charge button</div>
            </div>
        </div>
    );
}

function useSetCanvasSize(canvasRef: React.RefObject<HTMLCanvasElement>, containerRef: React.RefObject<HTMLDivElement>): { width: number; height: number } | undefined {
    const [style, setStyle] = useState<{ width: number; height: number } | undefined>(undefined);
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (canvas && container) {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            setStyle({
                width: container.clientWidth,
                height: container.clientHeight,
            });
        }
    }, [canvasRef, containerRef]);
    return style;
}
