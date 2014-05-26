# es6-computed-property-keys

Compiles JavaScript written using ES6 object computed property keys to ES4 syntax.
For example, this:

```js
var a = 'y';
var b = {
  x: 1,
  [a] : 2
};
```

compiles to this:

```js
var a = 'y';
var b = function() {
  var obj = {
    x: 1
  };

  obj[a] = 2;
  return obj;
}();
```

## Install

```
$ npm install es6-computed-property-keys
```

## Browserify

Browserify support is built in.

```
$ npm install es6-computed-property-keys  # install local dependency
$ browserify -t es6-computed-property-keys $file
```

### Setup

First, install the development dependencies:

```
$ npm install
```

Then, try running the tests:

```
$ npm test
```
