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
Gate.XQ = new Matrix([
  [new Complex(0.5, 0.5), new Complex(0.5, -0.5)],
  [new Complex(0.5, -0.5), new Complex(0.5, 0.5)]
]);
Gate.XQN = new Matrix([
  [new Complex(0.5, -0.5), new Complex(0.5, 0.5)],
  [new Complex(0.5, 0.5), new Complex(0.5, -0.5)]
]);
Gate.XE = new Matrix([
  [
    new Complex(0.85355339059, 0.35355339059),
    new Complex(0.1464466094, -0.35355339059)
  ],
  [
    new Complex(0.1464466094, -0.35355339059),
    new Complex(0.85355339059, 0.35355339059)
  ]
]);
Gate.XEN = new Matrix([
  [
    new Complex(0.85355339059, -0.35355339059),
    new Complex(0.1464466094, 0.35355339059)
  ],
  [
    new Complex(0.1464466094, 0.35355339059),
    new Complex(0.85355339059, -0.35355339059)
  ]
]);
Gate.YQ = new Matrix([
  [new Complex(0.5, 0.5), new Complex(-0.5, -0.5)],
  [new Complex(0.5, 0.5), new Complex(0.5, 0.5)]
]);
Gate.YQN = new Matrix([
  [new Complex(0.5, -0.5), new Complex(0.5, -0.5)],
  [new Complex(-0.5, 0.5), new Complex(0.5, -0.5)]
]);
Gate.YE = new Matrix([
  [
    new Complex(0.85355339059, 0.35355339059),
    new Complex(-0.35355339059, -0.1464466094)
  ],
  [
    new Complex(0.35355339059, 0.1464466094),
    new Complex(0.85355339059, 0.35355339059)
  ]
]);
Gate.YEN = new Matrix([
  [
    new Complex(0.85355339059, -0.35355339059),
    new Complex(0.35355339059, -0.1464466094)
  ],
  [
    new Complex(-0.35355339059, 0.1464466094),
    new Complex(0.85355339059, -0.35355339059)
  ]
]);
Gate.ZQ = new Matrix([
  [Complex.one, Complex.zero],
  [Complex.zero, Complex.i]
]);
Gate.ZQN = new Matrix([
  [Complex.one, Complex.zero],
  [Complex.zero, Complex.nei]
]);
Gate.ZE = new Matrix([
  [Complex.one, Complex.zero],
  [Complex.zero, new Complex(0.70710678118, 0.70710678118)]
]);
Gate.ZEN = new Matrix([
  [Complex.one, Complex.zero],
  [Complex.zero, new Complex(0.70710678118, -0.70710678118)]
]);
