import Complex from "./Complex.js";
import Matrix from "./Matrix.js";
export default class Gate {}
Gate.X = new Matrix([
  [Complex.zero, Complex.one],
  [Complex.one, Complex.zero]
]);
Gate.Y = new Matrix([
  [Complex.zero, Complex.nei],
  [Complex.i, Complex.zero]
]);
Gate.Z = new Matrix([
  [Complex.one, Complex.zero],
  [Complex.zero, Complex.neone]
]);
Gate.H = new Matrix([
  [new Complex(0.70710678, 0), new Complex(0.70710678, 0)],
  [new Complex(0.70710678, 0), new Complex(-0.70710678, 0)]
]);
Gate.I = new Matrix([
  [Complex.one, Complex.zero],
  [Complex.zero, Complex.one]
]);
Gate.C = new Matrix([
  [Complex.controlTaint, Complex.zero],
  [Complex.zero, Complex.one]
]);
