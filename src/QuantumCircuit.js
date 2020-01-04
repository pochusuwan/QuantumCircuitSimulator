import Complex from "./Complex.js";
import Matrix from "./Matrix.js";
import Gate from "./Gate.js";

export default class QuantumCircuit {}

QuantumCircuit.controlTaint = () => {
  return "asd";
};

QuantumCircuit.simulate = (circuit, mArray) => {
  var n = circuit[0].length;
  var stateArray = [[Complex.one]];
  var i;
  var gateMatrix;

  var measurements = [];

  for (i = 0; i < Math.pow(2, n) - 1; i++) stateArray.push([Complex.zero]);
  var state = new Matrix(stateArray);

  for (i = 0; i < circuit.length; i++) {
    gateMatrix = QuantumCircuit.getGateColumn(circuit[i]);
    if (i < mArray.length && mArray[i] == "E") {
      measurements.push(state.unwrapState());
    }
    state = gateMatrix.mult(state);
  }
  while (i < mArray.length) {
    if (mArray[i] == "E") {
      measurements.push(state.unwrapState());
    }
    i++;
  }
  return measurements;
};

QuantumCircuit.getGateColumn = gates => {
  var matrix = null;
  for (var i = 0; i < gates.length; i++) {
    if (matrix == null) {
      matrix = QuantumCircuit.getGate(gates[i]);
    } else {
      matrix = QuantumCircuit.tensorProduct(
        matrix,
        QuantumCircuit.getGate(gates[i])
      );
    }
  }
  return matrix;
};

QuantumCircuit.tensorProduct = (m1, m2) => {
  var newArray = [];
  var row = null;
  var i1, j1, i2, j2;
  for (i1 = 0; i1 < m1.array.length * m2.array.length; i1++) {
    var row = [];
    for (j1 = 0; j1 < m1.array[0].length * m2.array[0].length; j1++) {
      row.push(0);
    }
    newArray.push(row);
  }
  for (i1 = 0; i1 < m1.array.length; i1++) {
    for (j1 = 0; j1 < m1.array[i1].length; j1++) {
      for (i2 = 0; i2 < m2.array.length; i2++) {
        for (j2 = 0; j2 < m2.array[i2].length; j2++) {
          newArray[i1 * m2.array.length + i2][
            j1 * m2.array[i2].length + j2
          ] = m1.array[i1][j1].mult(m2.array[i2][j2]);
        }
      }
    }
  }

  return new Matrix(newArray);
};

QuantumCircuit.getGate = gateKey => {
  switch (gateKey) {
    case "X":
      return Gate.X;
    case "Y":
      return Gate.Y;
    case "Z":
      return Gate.Z;
    case "H":
      return Gate.H;
    case "I":
      return Gate.I;
    case "C":
      return Gate.C;
    default:
      return Gate.I;
  }
};
