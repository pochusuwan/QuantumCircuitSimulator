import { useEffect, useRef, useState } from "react";
import classes from "./App.module.css";
import Simulator, { FieldRenderOption } from "./Simulator";

const INITIAL_PIXEL_PER_LIGHT_SECOND = 400;
const INITIAL_LIGHT_SECOND_PER_FIELD_POINT = 20;
const INITIAL_STATIC_FIELD_SCALE = 10;
const INITIAL_DELTA_FIELD_SCALE = 10;

export default function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasStyle = useSetCanvasSize(canvasRef, containerRef);

    const [pixelPerLightSecond, setPixelPerLightSecond] = useState<string>(INITIAL_PIXEL_PER_LIGHT_SECOND.toString());
    const [originPixelX, setOriginPixelX] = useState<string>("");
    const [originPixelY, setOriginPixelY] = useState<string>("");

    const [fieldPointPerLightSecond, setFieldPointPerLightSecond] = useState<string>(INITIAL_LIGHT_SECOND_PER_FIELD_POINT.toString());
    const [staticFieldScale, setStaticFieldScale] = useState<string>(INITIAL_STATIC_FIELD_SCALE.toString());
    const [deltaFieldScale, setDeltaFieldScale] = useState<string>(INITIAL_DELTA_FIELD_SCALE.toString());

    const updateTimeoutId = useRef<ReturnType<typeof setInterval> | null>(null);
    const simulatorRef = useRef<Simulator | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const originX = 0.1 * canvas.width;
            const originY = 0.9 * canvas.height;
            simulatorRef.current = new Simulator(canvas, originX, originY, INITIAL_PIXEL_PER_LIGHT_SECOND, INITIAL_LIGHT_SECOND_PER_FIELD_POINT, INITIAL_STATIC_FIELD_SCALE, INITIAL_DELTA_FIELD_SCALE);
            setOriginPixelX(originX.toString());
            setOriginPixelY(originY.toString());
        }
        return () => {
            simulatorRef.current?.clearCanvas();
        };
    }, []);

    if (updateTimeoutId.current !== null) {
        clearTimeout(updateTimeoutId.current);
    }
    updateTimeoutId.current = setTimeout(() => {
        simulatorRef.current?.setRenderOption(
            parseFloat(originPixelX),
            parseFloat(originPixelY),
            parseFloat(pixelPerLightSecond),
            parseFloat(fieldPointPerLightSecond),
            parseFloat(staticFieldScale),
            parseFloat(deltaFieldScale)
        );
    }, 1000);

    return (
        <div className={classes.AppContainer}>
            <div className={classes.CanvasContainer} ref={containerRef}>
                <canvas ref={canvasRef} className={classes.Canvas} style={canvasStyle} onClick={(event) => console.log(event)} />
            </div>
            <div className={classes.Controls}>
                <div className={classes.ControlsRow}>
                    <div>Render Options: </div>
                </div>
                <div className={classes.ControlsRow}>
                    <div>Origin pixel: </div>
                    <input onChange={(event) => setOriginPixelX(event.target.value)} value={originPixelX} />
                    <input onChange={(event) => setOriginPixelY(event.target.value)} value={originPixelY} />
                    <div>Pixel per light second:</div>
                    <input onChange={(event) => setPixelPerLightSecond(event.target.value)} value={pixelPerLightSecond} />
                </div>
                <div className={classes.ControlsRow}></div>

                <div className={classes.ControlsRow}>Field Render Options:</div>
                <div className={classes.ControlsRow}>
                    <div>Field point per light second:</div>
                    <input onChange={(event) => setFieldPointPerLightSecond(event.target.value)} value={fieldPointPerLightSecond} />
                </div>

                <div className={classes.ControlsRow}>
                    <div>Static field scale: </div>
                    <button onClick={() => simulatorRef.current?.setStaticFieldRenderOption(FieldRenderOption.ConstantScalarMinMax)}>Scalar with min/max</button>
                    <button onClick={() => simulatorRef.current?.setStaticFieldRenderOption(FieldRenderOption.ConstantScalar)}>Scalar</button>
                    <button onClick={() => simulatorRef.current?.setStaticFieldRenderOption(FieldRenderOption.ScaleWithDistance)}>Scale with distance from origin</button>
                    <button onClick={() => simulatorRef.current?.setStaticFieldRenderOption(FieldRenderOption.ScaleWithDistanceSquared)}>Scale with distance from origin squared</button>
                    <button onClick={() => simulatorRef.current?.setStaticFieldRenderOption(FieldRenderOption.Hide)}>Hide</button>
                    <input onChange={(event) => setStaticFieldScale(event.target.value)} value={staticFieldScale} />
                </div>

                <div className={classes.ControlsRow}>
                    <div>Delta field scale: </div>
                    <button onClick={() => simulatorRef.current?.setDeltaFieldRenderOption(FieldRenderOption.ConstantScalarMinMax)}>Scalar with MinMax</button>
                    <button onClick={() => simulatorRef.current?.setDeltaFieldRenderOption(FieldRenderOption.ConstantScalar)}>Scalar</button>
                    <button onClick={() => simulatorRef.current?.setDeltaFieldRenderOption(FieldRenderOption.ScaleWithDistance)}>Scale with distance from origin</button>
                    <button onClick={() => simulatorRef.current?.setDeltaFieldRenderOption(FieldRenderOption.ScaleWithDistanceSquared)}>Scale with distance from origin squared</button>
                    <button onClick={() => simulatorRef.current?.setDeltaFieldRenderOption(FieldRenderOption.Hide)}>Hide</button>
                    <input onChange={(event) => setDeltaFieldScale(event.target.value)} value={deltaFieldScale} />
                </div>
                <div className={classes.ControlsRow}></div>

                <div className={classes.ControlsRow}>
                    <button onClick={() => simulatorRef.current?.setParticlePositionFunction("Sine")}>Sine</button>
                    <button onClick={() => simulatorRef.current?.setParticlePositionFunction("Triangle")}>Triangle</button>
                </div>
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
