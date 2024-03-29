import React from "react";
import "./App.css";
import Gate_control from "./res/Gate-control.png";
import Gate_I from "./res/Gate-I.png";
import Gate_X from "./res/Gate-X.png";
import Gate_Y from "./res/Gate-Y.png";
import Gate_Z from "./res/Gate-Z.png";
import Gate_H from "./res/Gate-H.png";
import Gate_X_quarter from "./res/Gate-X-quarter.png";
import Gate_Y_quarter from "./res/Gate-Y-quarter.png";
import Gate_Z_quarter from "./res/Gate-Z-quarter.png";
import Gate_X_quarter_n from "./res/Gate-X-quarter-negative.png";
import Gate_Y_quarter_n from "./res/Gate-Y-quarter-negative.png";
import Gate_Z_quarter_n from "./res/Gate-Z-quarter-negative.png";
import Gate_X_eighth from "./res/Gate-X-eighth.png";
import Gate_Y_eighth from "./res/Gate-Y-eighth.png";
import Gate_Z_eighth from "./res/Gate-Z-eighth.png";
import Gate_X_eighth_n from "./res/Gate-X-eighth-negative.png";
import Gate_Y_eighth_n from "./res/Gate-Y-eighth-negative.png";
import Gate_Z_eighth_n from "./res/Gate-Z-eighth-negative.png";
import Measure_Eye from "./res/Measure-eye.png";
import Switch from "./res/Switch.png";
import Eye from "./res/eye.png";
import QuantumCircuit from "./QuantumCircuit.js";

const gateTypeToImg = (gateType) => {
  switch (gateType) {
    case "I":
      return Gate_I;
    case "X":
      return Gate_X;
    case "Y":
      return Gate_Y;
    case "Z":
      return Gate_Z;
    case "H":
      return Gate_H;
    case "XQ":
      return Gate_X_quarter;
    case "XQN":
      return Gate_X_quarter_n;
    case "YQ":
      return Gate_Y_quarter;
    case "YQN":
      return Gate_Y_quarter_n;
    case "ZQ":
      return Gate_Z_quarter;
    case "ZQN":
      return Gate_Z_quarter_n;
    case "XE":
      return Gate_X_eighth;
    case "XEN":
      return Gate_X_eighth_n;
    case "YE":
      return Gate_Y_eighth;
    case "YEN":
      return Gate_Y_eighth_n;
    case "ZE":
      return Gate_Z_eighth;
    case "ZEN":
      return Gate_Z_eighth_n;
    case "C":
      return Gate_control;
    case "E":
      return Measure_Eye;
    default:
      return null;
  }
};

class QubitLine extends React.Component {
  render() {
    return (
      <div className="Line-container">
        {this.props.dash ? (
          <div
            style={{
              width: 20,
              height: 20,
              marginRight: 10,
              alignSelf: "center",
            }}
          />
        ) : (
          <img
            src={Switch}
            style={{
              width: 20,
              height: 20,
              marginRight: 10,
              alignSelf: "center",
            }}
            onClick={() => this.props.onSwap(this.props.row)}
            alt={"flip"}
          />
        )}

        <div className="Qubit-initial">
          {this.props.state === 1 ? "|1>" : "|0>"}
        </div>
        <div
          className="Line"
          style={{
            borderStyle: this.props.dash ? "dashed" : "solid",
            borderWidth: 1,
            borderBottomWidth: 0,
            borderRadius: 1,
          }}
        ></div>
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
        style={{
          cursor: this.props.grabbedGate != null ? "move" : "grab",
          marginLeft: this.props.rowIndex == null ? 0 : 10,
          marginRight: this.props.rowIndex == null ? 0 : 10,
          marginTop: this.props.rowIndex == null ? 0 : 5,
          marginBottom: this.props.rowIndex == null ? 0 : 5,
        }}
        onMouseDown={(event) => {
          this.props.onMouseDown(
            event.pageX,
            event.pageY,
            this.props.gateType,
            this.props.rowIndex,
            this.props.colIndex
          );
        }}
      />
    );
  }
}

class Measurement extends React.Component {
  toBinary = (num) => {
    var div = Math.floor(this.props.measurement.length / 2);
    var res = "";
    while (div > 0) {
      res += Math.floor(num / div);
      num = num % div;
      div = Math.floor(div / 2);
    }
    return res;
  };
  render() {
    return (
      <div
        className="Measurement-container"
        style={{
          borderStyle: "solid",
          borderWidth: 1,
          borderRadius: 1,
        }}
      >
        {this.props.measurement.map((num, index) => {
          var mag = num.magnitude();
          var prob = mag * mag;
          return (
            <div className="Measurement-column" key={index}>
              <div
                style={{
                  borderColor: "#000",
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderBottom: 0,
                  borderLeft: 0,
                  borderRight: 2,
                  borderRadius: 1,
                  fontSize: 12,
                }}
              >
                {this.toBinary(index)}
              </div>
              <div
                style={{
                  fontSize: 12,
                }}
              >
                {num + ""}
              </div>
              <div
                style={{
                  fontSize: 12,
                }}
              >
                {Math.round(prob * 100)}%
              </div>
              <div
                className="Measurement-bar"
                style={{ height: prob * 40, fontSize: 12 }}
              ></div>
            </div>
          );
        })}
      </div>
    );
  }
}

class GateMatrixDisplay extends React.Component {
  render() {
    var gateMatrix = this.props.gateMatrix;
    var matrixString = null;
    if (gateMatrix != null) {
      var array = gateMatrix.array;
      matrixString = [];
      var i, j;
      var width = array.length;
      var row;
      var maxLen;
      var padding = "              ";
      for (i = 0; i < width; i++) {
        row = [];
        for (j = 0; j < width; j++) {
          row.push(array[i][j] + "");
        }
        matrixString.push(row);
      }
      for (i = 0; i < width; i++) {
        maxLen = 0;
        for (j = 0; j < width; j++) {
          maxLen = Math.max(maxLen, matrixString[j][i].length);
        }
        for (j = 0; j < width; j++) {
          matrixString[j][i] = (padding + matrixString[j][i]).slice(-maxLen);
        }
      }
    } else {
      return null;
    }
    return (
      <div className="Focused-column-container">
        {matrixString != null
          ? matrixString.map((row, index) => {
              var text = "";
              for (var i = 0; i < row.length; i++) {
                text += row[i];
                if (i < row.length - 1) {
                  text += "  ";
                }
              }
              return (
                <div style={{ whiteSpace: "pre" }} key={index}>
                  |{text + ""}|
                </div>
              );
            })
          : null}
      </div>
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grabbedGate: null,
      grabX: 0,
      grabY: 0,
      circuit: [["S"]],
      initialState: [0],
      measurements: [],
      eyeArray: [],
      focusedColumn: 0,
      focusedColumnMatrix: null,
    };
    this.circuitRef = React.createRef();
    this.eyeLineRef = React.createRef();
  }

  getEyeWireYPos = () => {
    var rect = this.eyeLineRef.current.children[0].getBoundingClientRect();
    return rect.y + rect.height / 2;
  };

  getEyeWireXPos = (gateSlotIndex) => {
    return gateSlotIndex * 60 + 80 + 20;
  };

  getWireYPos = (wireIndex) => {
    var rect = this.circuitRef.current.children[
      wireIndex
    ].getBoundingClientRect();
    return rect.y + rect.height / 2;
  };

  getGateSlotXPos = (gateSlotIndex) => {
    return gateSlotIndex * 30 + 80 + 20;
  };

  getClosestWireGate = (mouseX, mouseY, gateType) => {
    if (gateType === "E") {
      var lineYPos = this.getEyeWireYPos();
      if (Math.abs(mouseY - lineYPos) < 40) {
        var eyeWireXStart =
          this.eyeLineRef.current.children[0].getBoundingClientRect().x + 70;
        var closestEyeSlotIndex = Math.max(
          Math.round((mouseX - eyeWireXStart) / 60),
          0
        );
        return [0, closestEyeSlotIndex];
      } else {
        return [null, null];
      }
    } else {
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
          closestGateSlotIndex % 2 === 1 &&
          gateIndex < this.state.circuit.length &&
          closestWireIndex < this.state.circuit[gateIndex].length &&
          this.state.circuit[gateIndex][closestWireIndex] !== "S"
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
    }
  };

  setGrabPosition = (mouseX, mouseY, gateType) => {
    var indexes = this.getClosestWireGate(mouseX, mouseY, gateType);
    if (indexes[0] != null && indexes[1] != null) {
      if (gateType === "E") {
        this.setState({ grabX: this.getEyeWireXPos(indexes[1]) - 20 });
        this.setState({ grabY: this.getEyeWireYPos() - 20 });
      } else {
        this.setState({ grabX: this.getGateSlotXPos(indexes[1]) - 20 });
        this.setState({ grabY: this.getWireYPos(indexes[0]) - 20 });
      }
    } else {
      this.setState({ grabX: mouseX - 20 });
      this.setState({ grabY: mouseY - 20 });
    }
  };

  newGateColumn = (length) => {
    var col = [];
    for (var i = 0; i < length; i++) col.push("S");
    return col;
  };

  placeGate = (event) => {
    var indexes = this.getClosestWireGate(
      event.pageX,
      event.pageY,
      this.state.grabbedGate
    );
    var circuit = this.state.circuit;
    var i, j, allSpace;
    var focusedColumn = this.state.focusedColumn;
    if (
      this.state.grabbedGate != null &&
      indexes[0] != null &&
      indexes[1] != null
    ) {
      var rowIndex = indexes[0];
      var colIndex = Math.floor(indexes[1] / 2);
      if (rowIndex >= circuit[0].length) {
        for (i = 0; i < circuit.length; i++) {
          circuit[i].push("S");
        }
        rowIndex = circuit[0].length - 1;
      }

      if (colIndex >= circuit.length) {
        circuit.push(this.newGateColumn(circuit[0].length));
        colIndex = circuit.length - 1;
      } else if (indexes[1] % 2 === 0) {
        circuit.splice(colIndex, 0, this.newGateColumn(circuit[0].length));
      }
      circuit[colIndex][rowIndex] = this.state.grabbedGate;
      focusedColumn = colIndex;
    }

    var circuitTrimmed = [];
    for (i = 0; i < circuit.length; i++) {
      allSpace = true;
      for (j = 0; j < circuit[i].length; j++) {
        if (circuit[i][j] !== "S") {
          allSpace = false;
          break;
        }
      }
      if (!allSpace) {
        circuitTrimmed.push(circuit[i]);
      }
    }
    if (circuitTrimmed.length > 0 && circuitTrimmed[0].length > 1) {
      for (i = 0; i < circuitTrimmed[0].length; ) {
        allSpace = true;
        for (j = 0; j < circuitTrimmed.length; j++) {
          if (circuitTrimmed[j][i] !== "S") {
            allSpace = false;
            break;
          }
        }
        if (allSpace) {
          for (j = 0; j < circuitTrimmed.length; j++) {
            circuitTrimmed[j].splice(i, 1);
          }
        } else {
          i++;
        }
      }
    }

    if (circuitTrimmed.length === 0 || circuitTrimmed[0].length === 0) {
      circuitTrimmed = [this.newGateColumn(1)];
    }
    return [
      Math.min(Math.max(focusedColumn, 0), circuitTrimmed.length - 1),
      circuitTrimmed,
    ];
  };

  placeEye = (event) => {
    var indexes = this.getClosestWireGate(
      event.pageX,
      event.pageY,
      this.state.grabbedGate
    );
    if (
      this.state.grabbedGate != null &&
      indexes[0] != null &&
      indexes[1] != null
    ) {
      var eyeArray = this.state.eyeArray;
      while (eyeArray.length <= indexes[1]) {
        eyeArray.push("S");
      }
      eyeArray[indexes[1]] = this.state.grabbedGate;
      this.setState({ eyeArray: eyeArray });
    }
  };

  onMouseUp = (event) => {
    var newState = this.state.initialState;
    var circuit = null;
    var focusedColumn = this.state.focusedColumn;
    var res;
    if (this.state.grabbedGate != null) {
      if (this.state.grabbedGate !== "E") {
        res = this.placeGate(event);
        focusedColumn = res[0];
        circuit = res[1];

        var initialState = this.state.initialState;
        newState = [];
        for (var i = 0; i < circuit[0].length; i++) {
          if (i < initialState.length) {
            newState.push(initialState[i]);
          } else {
            newState.push(0);
          }
        }
        this.setState({ initialState: newState });
      } else {
        this.placeEye(event);
      }
    }
    res = QuantumCircuit.simulate(
      circuit != null ? circuit : this.state.circuit,
      this.state.eyeArray,
      focusedColumn,
      newState
    );
    this.setState({ grabbedGate: null });
    this.setState({ measurements: res[0] });
    this.setState({ focusedColumnMatrix: res[1] });
    if (circuit != null) {
      this.setState({ circuit: circuit });
    }
    this.setState({ focusedColumn: focusedColumn });
  };

  onMouseMove = (event) => {
    if (this.state.grabbedGate != null) {
      this.setGrabPosition(event.pageX, event.pageY, this.state.grabbedGate);
    }
  };

  gateOnMouseDown = (mouseX, mouseY, gateType, rowIndex, colIndex) => {
    this.setState({ grabbedGate: gateType });
    if (gateType === "E") {
      if (colIndex < this.state.eyeArray.length) {
        var eyeArray = this.state.eyeArray;
        eyeArray[colIndex] = "S";
        this.setState({ eyeArray: eyeArray });
      }
    } else {
      if (
        colIndex < this.state.circuit.length &&
        rowIndex < this.state.circuit[colIndex].length
      ) {
        var circuit = this.state.circuit;
        circuit[colIndex][rowIndex] = "S";
        this.setState({ circuit: circuit });
        this.setState({ focusedColumn: colIndex });
      }
    }
    this.setGrabPosition(mouseX, mouseY, gateType);
  };

  clearCircuit = () => {
    this.setState({
      circuit: [["S"]],
      eyeArray: [],
      measurements: [],
      initialState: [0],
      focusedColumnMatrix: null,
      focusedColumn: 0,
    });
  };

  onStateClick = (row) => {
    var initialState = this.state.initialState;
    if (row < initialState.length) {
      initialState[row] = 1 - initialState[row];
    }
    this.setState({ initialState: initialState });
    var res = QuantumCircuit.simulate(
      this.state.circuit,
      this.state.eyeArray,
      this.state.focusedColumn,
      this.state.initialState
    );
    this.setState({ measurements: res[0] });
    this.setState({ focusedColumnMatrix: res[1] });
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
        <div className="Hint">
          Drag and drop gates to build circuit. Place measurements to view
          quantum state at desired stage.
        </div>
        <div className="ButtonBar">
          <button onClick={this.clearCircuit}>Clear</button>
        </div>
        <div className="Toolbar">
          <div className="Toolbar-section">
            <div>Measurement</div>
            <Gate onMouseDown={this.gateOnMouseDown} gateType="E" />
          </div>
          <div className="Toolbar-section">
            <div>Control</div>
            <Gate onMouseDown={this.gateOnMouseDown} gateType="C" />
          </div>
          <div className="Toolbar-section">
            <div>Identity</div>
            <div className="Toolbar-gate-container">
              <Gate onMouseDown={this.gateOnMouseDown} gateType="I" />
            </div>
          </div>
          <div className="Toolbar-section">
            <div>Half Turns</div>
            <div className="Toolbar-gate-container">
              <Gate onMouseDown={this.gateOnMouseDown} gateType="X" />
              <Gate onMouseDown={this.gateOnMouseDown} gateType="Y" />
              <Gate onMouseDown={this.gateOnMouseDown} gateType="Z" />
              <Gate onMouseDown={this.gateOnMouseDown} gateType="H" />
            </div>
          </div>
          <div className="Toolbar-section">
            <div>Quarter Turns</div>
            <div className="Toolbar-gate-container">
              <Gate onMouseDown={this.gateOnMouseDown} gateType="XQ" />
              <Gate onMouseDown={this.gateOnMouseDown} gateType="YQ" />
              <Gate onMouseDown={this.gateOnMouseDown} gateType="ZQ" />
              <Gate onMouseDown={this.gateOnMouseDown} gateType="XQN" />
              <Gate onMouseDown={this.gateOnMouseDown} gateType="YQN" />
              <Gate onMouseDown={this.gateOnMouseDown} gateType="ZQN" />
            </div>
          </div>
          <div className="Toolbar-section">
            <div>Eighth Turns</div>
            <div className="Toolbar-gate-container">
              <Gate onMouseDown={this.gateOnMouseDown} gateType="XE" />
              <Gate onMouseDown={this.gateOnMouseDown} gateType="YE" />
              <Gate onMouseDown={this.gateOnMouseDown} gateType="ZE" />
              <Gate onMouseDown={this.gateOnMouseDown} gateType="XEN" />
              <Gate onMouseDown={this.gateOnMouseDown} gateType="YEN" />
              <Gate onMouseDown={this.gateOnMouseDown} gateType="ZEN" />
            </div>
          </div>
        </div>
        <div className="Circuit-container">
          <div className="QubitLine-container" ref={this.eyeLineRef}>
            <div className="Eye-line-container">
              <img draggable="false" src={Eye} className="Eye" alt="eye" />
              <div
                className="Eye-Line"
                style={{
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderBottomWidth: 0,
                  borderRadius: 1,
                }}
              ></div>
            </div>
          </div>
          <div className="Eyes-container">
            {this.state.eyeArray.map((gate, colIndex) => {
              return (
                <div className="Gates-column-container" key={colIndex}>
                  <Gate
                    onMouseDown={this.gateOnMouseDown}
                    gateType={gate}
                    rowIndex={0}
                    colIndex={colIndex}
                    grabbedGate={false}
                  />
                </div>
              );
            })}
          </div>
          <div className="QubitLine-container" ref={this.circuitRef}>
            {this.state.initialState.map((state, index) => {
              return (
                <QubitLine
                  key={index}
                  row={index}
                  onSwap={this.onStateClick}
                  state={state}
                />
              );
            })}
            {this.state.circuit[0].length < 8 ? (
              <QubitLine dash={true} />
            ) : null}
          </div>
          <div className="Gates-container">
            {this.state.circuit.map((column, colIndex) => {
              var focused =
                !(column.length === 1 && column[0] === "S") &&
                this.state.focusedColumn === colIndex;
              return (
                <div
                  className="Gates-column-container"
                  key={colIndex}
                  style={{ backgroundColor: focused ? "#ffbb96" : null }}
                >
                  {column.map((gate, rowIndex) => {
                    return (
                      <Gate
                        onMouseDown={this.gateOnMouseDown}
                        gateType={gate}
                        key={rowIndex}
                        rowIndex={rowIndex}
                        colIndex={colIndex}
                        grabbedGate={false}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        {this.state.measurements.map((states, index) => {
          return <Measurement measurement={states} key={index} />;
        })}
        <GateMatrixDisplay gateMatrix={this.state.focusedColumnMatrix} />
        {this.state.grabbedGate != null ? (
          <img
            draggable="false"
            src={gateTypeToImg(this.state.grabbedGate)}
            className="Gate-grabbed"
            style={{
              top: this.state.grabY,
              left: this.state.grabX,
            }}
            alt="gate"
          />
        ) : null}
      </div>
    );
  }
}
