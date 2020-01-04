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

  add = m => {
    var newArray = [];
    var i, j;
    for (i = 0; i < this.array.length; i++) {
      var row = [];
      for (j = 0; j < this.array[i].length; j++) {
        row.push(this.array[i][j].add(m.array[i][j]));
      }
      newArray.push(row);
    }
    return new Matrix(newArray);
  };

  unwrapState = () => {
    var array = [];
    for (var i = 0; i < this.array.length; i++) {
      array.push(this.array[i][0]);
    }
    return array;
  };
}
Matrix.prototype.toString = function() {
  var res = "-------\n";
  for (var i = 0; i < this.array.length; i++) {
    for (var j = 0; j < this.array[i].length; j++) {
      res += this.array[i][j]+" "
    }
    res += "\n"
  }
  return res + "-------";
};
