import { useState } from "react";
import classes from "./App.module.css";
import { default as QuantumCircuitSimApp } from "./quantum-circuit-sim/App";
import { default as ElectricFieldApp } from "./electric-field/App";

export default function App() {
    const [app, setApp] = useState(0);

    let content = null;
    if (app === 0) {
        content = <QuantumCircuitSimApp />;
    } else if (app === 1) {
        content = <ElectricFieldApp />;
    }
    return (
        <div className={classes.AppContainer}>
            <div className={classes.Header}>
                <button onClick={() => setApp(0)}>Quantum Circuit Simulator</button>
                <button onClick={() => setApp(1)}>Electric Field Simulator</button>
            </div>
            {content}
        </div>
    );
}
