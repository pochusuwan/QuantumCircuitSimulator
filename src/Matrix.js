export default class Matrix {
  constructor(array) {
    this.array = array;
  }
  mult = m => {
    var newArray = [];
    var i, j, k;
    for (i = 0; i < this.array.length; i++) {
      var row = [];
      for (j = 0; j < m.array[0].length; j++) {
        var num = null;
        for (k = 0; k < this.array[0].length; k++) {
          if (num == null) {
            num = this.array[i][k].mult(m.array[k][j]);
          } else {
            num = num.add(this.array[i][k].mult(m.array[k][j]));
          }
        }
        row.push(num);
      }
      newArray.push(row);
    }
    return new Matrix(newArray);
  };
}
Matrix.prototype.toString = function() {
  return this.array + "";
};
