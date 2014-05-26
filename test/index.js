var expect = require('chai').expect;
var compile = require('..').compile;

describe('ES6ComputedPropertyKeys', function() {
  function transform(code) {
    return compile(code).code;
  }

  function expectTransform(code, result) {
    expect(transform(code)).to.eql(result);
  }

  it('should fix computed property keys', function() {
    var code = [
      'z = {',
      '  foo: 1,',
      '  [this.x]: 2,',
      '  [++this.y]: 3',
      '};'
    ].join('\n');

    var result = [
      'z = function() {',
      '  var obj = {',
      '    foo: 1',
      '  };',
      '',
      '  obj[this.x] = 2;',
      '  obj[++this.y] = 3;',
      '  return obj;',
      '}.bind(this)();'
    ].join('\n');

    expectTransform(code, result);

    this.x = "bar";
    this.y = 1;
    var z;
    eval(result);
    expect(z.foo).to.eql(1);
    expect(z.bar).to.eql(2);
    expect(z[2]).to.eql(3);
  });
});
