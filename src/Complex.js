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
}
Complex.prototype.toString = function() {
  return this.re + " + " + this.im + "i";
};

Complex.controlTaint = new Complex(100, 100);
