var esprima = require('esprima');
var recast = require('recast');
var through = require('through');
var b = recast.types.builders;
var n = recast.types.namedTypes;

var ES6ComputedPropertyKeys = recast.Visitor.extend({
  visitObjectExpression: function(expr) {
    var propertiesWithComputedKeys = expr.properties.filter(function(property) {
      return property.computedKey;
    });

    if (propertiesWithComputedKeys.length > 0) {
      var otherProperties = expr.properties.filter(function(property) {
        return !property.computedKey;
      });

      var body = [];

      body.push(b.variableDeclaration(
        'var',
        [b.variableDeclarator(
          b.identifier('obj'),
          b.objectExpression(otherProperties)
        )]
      ));

      propertiesWithComputedKeys.forEach(function(property) {
        body.push(b.expressionStatement(
          b.assignmentExpression(
            '=',
            b.memberExpression(
              b.identifier('obj'),
              property.key,
              true
            ),
            property.value
          )
        ));
      });

      body.push(b.returnStatement(b.identifier('obj')));

      expr = b.callExpression(
        b.functionExpression(
          null,
          [],
          b.blockStatement(body)
        ),
        []
      );
    }

    this.genericVisit(expr);

    return expr;
  }
});

function transform(ast) {
  (new ES6ComputedPropertyKeys()).visit(ast);
  return ast;
}

function compile(code, options) {
  options = options || {};

  var recastOptions = {
    esprima: esprima,
    sourceFileName: options.sourceFileName,
    sourceMapName: options.sourceMapName
  };

  var ast = recast.parse(code, recastOptions);
  return recast.print(transform(ast), recastOptions);
}

module.exports = function () {
  var data = '';

  function write(buf) {
    data += buf;
  }

  function end() {
    this.queue(compile(data).code);
    this.queue(null);
  }

  return through(write, end);
};

module.exports.transform = transform;
module.exports.compile = compile;
