export default class Complex {
  constructor(re, im) {
    this.re = re;
    this.im = im;
  }
  mult = c => {
    return new Complex(
      this.re * c.re - this.im * c.im,
      this.re * c.im + this.im * c.re
    );
  };
  add = c => {
    return new Complex(this.re + c.re, this.im + c.im);
  };
  magnitude = () => {
    return Math.sqrt(this.re * this.re + this.im * this.im);
  };
}
Complex.prototype.toString = function() {
  var result = Math.round(this.re * 100) / 100;
  if (this.im >= 0) {
    result += " + " + Math.round(this.im * 100) / 100 + "i";
  } else {
    result += " " + Math.round(this.im * 100) / 100 + "i";
  }
  return result;
};

Complex.controlTaint = new Complex(1.0123, 4.0123);
Complex.one = new Complex(1, 0);
Complex.neone = new Complex(-1, 0);
Complex.i = new Complex(0, 1);
Complex.nei = new Complex(0, -1);
Complex.zero = new Complex(0, 0);
Complex.zero = new Complex(0, 0);
