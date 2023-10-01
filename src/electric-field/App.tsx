import { useEffect, useRef, useState } from "react";
import classes from "./App.module.css";
import { FieldRenderOption, simulator } from "./Simulator";

export default function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasStyle = useSetCanvasSize(canvasRef, containerRef);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            simulator.setCanvas(canvas);
        }
        return () => {
            simulator.clearCanvas();
        };
    }, []);

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
                </div>

                <div className={classes.ControlsRow}>
                    <div>Delta field render option: </div>
                    <button onClick={() => simulator.setDeltaFieldRenderOption(FieldRenderOption.ConstantScalarMinMax)}>Scalar with MinMax</button>
                    <button onClick={() => simulator.setDeltaFieldRenderOption(FieldRenderOption.ConstantScalar)}>Scalar</button>
                    <button onClick={() => simulator.setDeltaFieldRenderOption(FieldRenderOption.ScaleWithDistance)}>Scale with distance from origin</button>
                    <button onClick={() => simulator.setDeltaFieldRenderOption(FieldRenderOption.ScaleWithDistanceSquared)}>Scale with distance from origin squared</button>
                    <button onClick={() => simulator.setDeltaFieldRenderOption(FieldRenderOption.Hide)}>Hide</button>
                </div>
                <div>Distance Scale</div>
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
