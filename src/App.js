import React from "react";
import "./App.css";
import Gate_control from "./Gate-control.png";
import Gate_X from "./Gate-X.png";
import Gate_Y from "./Gate-Y.png";
import Gate_Z from "./Gate-Z.png";

const gateTypeToImg = gateType => {
  switch (gateType) {
    case "X":
      return Gate_X;
    case "Y":
      return Gate_Y;
    case "Z":
      return Gate_Z;
    case "C":
      return Gate_control;
    default:
      return null;
  }
};

class QubitLine extends React.Component {
  render() {
    return (
      <div className="Line-container">
        <div className="Qubit-initial">|0></div>
        <div className="Line" />
      </div>
    );
  }
}

class Gate extends React.Component {
  render() {
    var imageSrc = gateTypeToImg(this.props.gateType);
    return imageSrc == null ? (
      <div className="GateSpacer" />
    ) : (
      <img
        src={imageSrc}
        className="Gate"
        draggable="false"
        alt={this.props.gateType}
        style={{ cursor: this.props.grabbedGate != null ? "move" : "grab" }}
        onMouseDown={() =>
          this.props.onMouseDown(
            this.props.gateType,
            this.props.wireIndex,
            this.props.gateIndex
          )
        }
      />
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grabbedGate: null,
      mouseX: 0,
      mouseY: 0
    };
    this.circuitRef = React.createRef();
    this.circuit = [];
    this.circuit.push([]);
    this.circuit[0].push("X");
    this.circuit[0].push("Y");
    this.circuit[0].push("S");
    this.circuit[0].push("Z");
    this.circuit.push([]);
    this.circuit[1].push("X");
    this.circuit[1].push("Y");
    this.circuit[1].push("Z");
  }

  onMouseUp = event => {
    this.setState({ grabbedGate: null });
  };

  onMouseMove = event => {
    this.setState({ mouseX: event.pageX });
    this.setState({ mouseY: event.pageY });
  };

  gateOnMouseDown = (gateType, wireIndex, gateIndex) => {
    console.log(gateType + " " + wireIndex + " " + gateIndex);
    this.setState({ grabbedGate: gateType });
    if (wireIndex < this.circuit.length && gateIndex < this.circuit[wireIndex].length) {
      this.circuit[wireIndex][gateIndex] = "S";
    }
  };

  render() {
    return (
      <div
        className="App"
        style={{ cursor: this.state.grabbedGate != null ? "move" : "auto" }}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        draggable="false"
      >
        <div className="ButtonBar">
          <button>Clear</button>
          <button>asd</button>
        </div>
        <div className="Toolbar">
          <div className="Toolbar-section">
            <div>Control</div>
            <Gate onMouseDown={this.gateOnMouseDown} gateType="C"></Gate>
          </div>
          <div className="Toolbar-section">
            <div>Half Turns</div>
            <Gate onMouseDown={this.gateOnMouseDown} gateType="X"></Gate>
            <Gate onMouseDown={this.gateOnMouseDown} gateType="Y"></Gate>
            <Gate onMouseDown={this.gateOnMouseDown} gateType="Z"></Gate>
          </div>
          <div className="Toolbar-section">
            <div>Quarter Turns</div>
            <Gate onMouseDown={this.gateOnMouseDown} gateType="X"></Gate>
            <Gate onMouseDown={this.gateOnMouseDown} gateType="X"></Gate>
          </div>
          <div className="Toolbar-section">
            <div>Eighth Turns</div>
            <Gate onMouseDown={this.gateOnMouseDown} gateType="X"></Gate>
            <Gate onMouseDown={this.gateOnMouseDown} gateType="X"></Gate>
          </div>
        </div>
        <div className="Circuit" ref={this.circuitRef}>
          {this.circuit.map((gates, wireIndex) => {
            return (
              <div className="Wire-container" key={wireIndex}>
                <QubitLine />
                <div className="Wire">
                  {gates.map((gateType, gateIndex) => {
                    return (
                      <Gate
                        onMouseDown={this.gateOnMouseDown}
                        gateType={gateType}
                        key={gateIndex}
                        wireIndex={wireIndex}
                        gateIndex={gateIndex}
                        grabbedGate={this.state.grabbedGate}
                      ></Gate>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {this.state.grabbedGate != null ? (
          <img
            draggable="false"
            src={gateTypeToImg(this.state.grabbedGate)}
            className="Gate-grabbed"
            style={{
              top: this.state.mouseY - 20,
              left: this.state.mouseX - 20
            }}
          />
        ) : null}
        <div>{this.state.mouseX + " " + this.state.mouseY}</div>
      </div>
    );
  }
}
