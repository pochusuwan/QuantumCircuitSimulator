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
  console.log(gates);
  var matrix = new Matrix([[Complex.one]]);
  var i, j;
  for (i = 0; i < gates.length; i++) {
    matrix = QuantumCircuit.tensorProduct(
      QuantumCircuit.getGate(gates[i]),
      matrix
    );
  }
  for (i = 0; i < matrix.array.length; i++) {
    for (j = 0; j < matrix.array[i].length; j++) {
      if (matrix.array[i][j] === Complex.controlTaint) {
        matrix.array[i][j] = Complex.one;
      }
    }
  }
  console.log(matrix + "");
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
          ] = QuantumCircuit.controlMult(
            m1.array[i1][j1],
            m2.array[i2][j2],
            i1,
            j1,
            i2,
            j2
          );
        }
      }
    }
  }
  return new Matrix(newArray);
};

QuantumCircuit.controlMult = (c1, c2, i1, j1, i2, j2) => {
  if (c1 === Complex.controlTaint) {
    if (i2 === j2) {
      return Complex.controlTaint;
    } else {
      return Complex.zero;
    }
  } else if (c2 === Complex.controlTaint) {
    if (i1 === j1) {
      return Complex.controlTaint;
    } else {
      return Complex.zero;
    }
  } else {
    return c1.mult(c2);
  }
};

QuantumCircuit.getGate = gateKey => {
  switch (gateKey) {
    case "X":
      return Gate.X;
    case "XQ":
      return Gate.XQ;
    case "XQN":
      return Gate.XQN;
    case "XE":
      return Gate.XE;
    case "XEN":
      return Gate.XEN;
    case "Y":
      return Gate.Y;
    case "YQ":
      return Gate.YQ;
    case "YQN":
      return Gate.YQN;
    case "YE":
      return Gate.YE;
    case "YEN":
      return Gate.YEN;
    case "Z":
      return Gate.Z;
    case "ZQ":
      return Gate.ZQ;
    case "ZQN":
      return Gate.ZQN;
    case "ZE":
      return Gate.ZE;
    case "ZEN":
      return Gate.ZEN;
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
