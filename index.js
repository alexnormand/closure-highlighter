var fs = require('fs');
// var esprima = require('esprima');
// var estraverse = require('estraverse');
var uglify = require('uglify-js');


var getVariables = function(node) {
  var res = {};

  for (var v in node.variables._values) {
    var variable = node.variables._values[v];

    res[variable.name] = {};

    if (variable.init && variable.init.TYPE === 'Function') {
      res[variable.name] = getVariables(variable.init, variable.name);
    }
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




