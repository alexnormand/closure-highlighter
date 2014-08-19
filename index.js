var fs = require('fs');
// var esprima = require('esprima');
// var estraverse = require('estraverse');
var uglify = require('uglify-js');


var getAnonymousIndex = (function() {
  var anonymousFnIndex = 1;

  return function() {
    return 'anonymous-' + anonymousFnIndex++;
  };
}());


var getVariables = function(node) {
  var res = {};

  for (var v in node.variables._values) {
    var variable = node.variables._values[v];

    res[variable.name] = {};

    if (variable.init) {
      if (variable.init.TYPE === 'Function') {
        res[variable.name] = getVariables(variable.init);
      }

      for (var i = 0; variable.init.body && i < variable.init.body.length; i++) {
        var b = variable.init.body[i];
        if (b.TYPE === 'Return' && b.value.TYPE === 'Function') {
          res[variable.name][getAnonymousIndex()] = getVariables(b.value);
        }
      }
    }

    res[variable.name] = Object.keys(res[variable.name]).length === 0 ? 'variable' : res[variable.name];
  }

  return res;
};



var code = fs.readFileSync('./code.js', { encoding: 'utf-8' });
var toplevel = uglify.parse(code);
toplevel.figure_out_scope();
toplevel;

var ws = fs.createWriteStream('output.json', { encoding: 'utf-8' });
// fs.writeFileSync('output.json', JSON.stringify(toplevela));


console.log(JSON.stringify(getVariables(toplevel), null, 2));




