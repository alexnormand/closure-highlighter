var fn = function(a) {
  var hello = 'blabla';

  return function(b) {

    var f = function(c) {
      return function(d) {
        var aaa = 45;

        return a + b + c + d;
      }
    };

    return a + b;
  }
};
