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
        onMouseDown={event => {
          this.props.onMouseDown(
            event.pageX,
            event.pageY,
            this.props.gateType,
            this.props.wireIndex,
            this.props.gateIndex
          );
        }}
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
      mouseY: 0,
      grabX: 0,
      grabY: 0
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
    this.circuit[1].push("S");
    this.circuit[1].push("S");
  }

  getWireYPos = wireIndex => {
    var rect = this.circuitRef.current.children[
      wireIndex
    ].getBoundingClientRect();
    return rect.y + rect.height / 2;
  };

  getGateSlotXPos = gateSlotIndex => {
    return gateSlotIndex * 30 + 60 + 20;
  };

  getClosestWireGate = (mouseX, mouseY) => {
    var closestWireIndex = null;
    var vDistMin = 500;
    for (var i = 0; i < this.circuitRef.current.children.length; i++) {
      var vDist = Math.abs(mouseY - this.getWireYPos(i));
      if (vDistMin > vDist && vDist < 40) {
        vDistMin = vDist;
        closestWireIndex = i;
      }
    }

    if (closestWireIndex != null) {
      var wireXStart =
        this.circuitRef.current.children[
          closestWireIndex
        ].getBoundingClientRect().x + 60;
      var closestGateSlotIndex = Math.max(
        Math.round((mouseX - wireXStart) / 30),
        0
      );
      var gateIndex = Math.floor((closestGateSlotIndex - 1) / 2);
      if (
        closestGateSlotIndex % 2 == 1 &&
        gateIndex < this.circuit[closestWireIndex].length &&
        this.circuit[closestWireIndex][gateIndex] != undefined &&
        this.circuit[closestWireIndex][gateIndex] != "S"
      ) {
        var occupiedSlotX = this.getGateSlotXPos(closestGateSlotIndex);
        if (occupiedSlotX > mouseX) {
          return [closestWireIndex, closestGateSlotIndex - 1];
        } else {
          return [closestWireIndex, closestGateSlotIndex + 1];
        }
      } else {
        return [closestWireIndex, closestGateSlotIndex];
      }
    } else {
      return [null, null];
    }
  };

  setGrabPosition = (mouseX, mouseY) => {
    var indexes = this.getClosestWireGate(mouseX, mouseY);
    if (indexes[0] != null && indexes[1] != null) {
      this.setState({ grabX: this.getGateSlotXPos(indexes[1]) - 20 });
      this.setState({ grabY: this.getWireYPos(indexes[0]) - 20 });
    } else {
      this.setState({ grabX: mouseX - 20 });
      this.setState({ grabY: mouseY - 20 });
    }
  };

  onMouseUp = event => {
    var indexes = this.getClosestWireGate(event.pageX, event.pageY);
    console.log(indexes);
    if (
      indexes[0] != null &&
      indexes[1] != null &&
      indexes[0] < this.circuit.length
    ) {
      var gateIndex = Math.floor(indexes[1] / 2);
      while (this.circuit[indexes[0]].length <= gateIndex) {
        this.circuit[indexes[0]].push("S");
      }
      if (this.circuit[indexes[0]][gateIndex] == "S") {
        this.circuit[indexes[0]][gateIndex] = this.state.grabbedGate;
      } else {
        this.circuit[indexes[0]].splice(gateIndex, 0, this.state.grabbedGate);
      }
    }

    var newCircuit = [];
    var maxLength = 0;
    for (var i = 0; i < this.circuit.length; i++) {
      newCircuit.push([]);
      if (maxLength < this.circuit[i].length) {
        maxLength = this.circuit[i].length;
      }
    }
    for (var i = 0; i < maxLength; i++) {
      var allSpace = true;
      for (var j = 0; j < this.circuit.length; j++) {
        if (i < this.circuit[j].length && this.circuit[j][i] != "S") {
          allSpace = false;
          break;
        }
      }
      if (!allSpace) {
        for (var j = 0; j < this.circuit.length; j++) {
          if (i < this.circuit[j].length) {
            newCircuit[j].push(this.circuit[j][i]);
          }
        }
      }
    }
    this.circuit = newCircuit;
    this.setState({ grabbedGate: null });
  };

  onMouseMove = event => {
    this.setState({ mouseX: event.pageX });
    this.setState({ mouseY: event.pageY });
    if (this.state.grabbedGate != null) {
      this.setGrabPosition(event.pageX, event.pageY);
    }
  };

  gateOnMouseDown = (mouseX, mouseY, gateType, wireIndex, gateIndex) => {
    this.setState({ grabbedGate: gateType });
    if (
      wireIndex < this.circuit.length &&
      gateIndex < this.circuit[wireIndex].length
    ) {
      this.circuit[wireIndex][gateIndex] = "S";
    }
    this.setGrabPosition(mouseX, mouseY);
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
              top: this.state.grabY,
              left: this.state.grabX
            }}
          />
        ) : null}
        <div>{this.state.mouseX + " " + this.state.mouseY}</div>
      </div>
    );
  }
}
