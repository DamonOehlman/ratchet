(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ratchet = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* jshint node: true */
'use strict';

/**
  # Ratchet - CSS3 Transform Parser

  Ratchet assists with the process of dissecting CSS3 transform strings into
  javascript objects that you can then do something more intelligent with.

  ## Example Usage

  Displayed below is a simple example.  First a html file with a div element
  styled to look like a square box:

  <<< examples/simple.html

  And then some JS that can be used to manipulate the transform of the box (
  in partnership with the [feature](https://github.com/DamonOehlman/feature)
  module):

  <<< examples/simple.js

  If you want to give this a go you should be able to run the example with
  [bde](https://github.com/DamonOehlman/bde) or
  [beefy](https://github.com/chrisdickinson/beefy) with some simple
  modification.  If it works, you will see a square red box, moving
  and rotating towards the right of the screen.

  ## Reference

  To be completed.

**/

var RatchetTransform = require('./types/transform');
var XYZ = require('./types/xyz');
var matchers = require('./matchers')
var parseMatrix = require('./parse-matrix');

var unitTypes = {
  translate: 'px',
  rotate: 'deg',
  scale: ''
};

function fromString(inputString) {
  var props;
  var data;

  function checkMatch(rule) {
    // reset the test string to the input string
    var testString = inputString;

    // get the initial match
    var match = rule.regex.exec(testString);

    while (match) {
      // ensure data has been initialized
      data = data || {};

      if (typeof rule.extract == 'function') {
        rule.extract(match, data);
      }
      else {
        for (var section in rule) {
          if (section !== 'regex' && typeof rule[section] == 'function') {
            data[section] = rule[section](match);
          }
        }
      }

      // update the data units
      data.units = unitTypes[key];

      // remove the match component from the input string
      testString = testString.slice(0, match.index) +
        testString.slice(match.index + match[0].length);

      // if this is a multimatch rule, then run the regex again
      if (rule.multi) {
        match = rule.regex.exec(testString);
      }
      // otherwise, clear the match to break the loop
      else {
        match = null;
      }
    }

    // initialise the properties (if we have data)
    if (data) {
      props[key] = new XYZ(key, data);

      // reset the data
      data = undefined;
    }
  }

  // attempt to create props from a parsing a matrix or matrix3d
  props = parseMatrix(inputString);

  // if that fails, then use the standard parsing techniques
  if (! props) {
    props = new RatchetTransform();
    for (var key in matchers) {
      matchers[key].forEach(checkMatch);
    }
  }

  return props;
}

var ratchet = module.exports = function(input) {
  if (typeof input == 'string' || (input instanceof String)) {
    return fromString(input);
  }
};

// bind the internal helpers so we can test
ratchet.fromString = fromString;
ratchet.Transform = RatchetTransform;
ratchet.XYZ = XYZ;

},{"./matchers":2,"./parse-matrix":3,"./types/transform":4,"./types/xyz":6}],2:[function(require,module,exports){
/* jshint node: true */
'use strict';

var TransformValue = require('./types/value');

function extractVal(index, expectUnits) {
  return function (match) {
    var units = '';

    if (typeof expectUnits == 'undefined' || expectUnits) {
      // get the units
      // default to undefined if an empty string which means the 
      // default units for the XYZ value type will be used
      units = match[index + 1] || undefined;
    }

    // create the transform value
    return new TransformValue(match[index], units);
  };
}

function makeRegex(fnName, params) {
  var regex = fnName + '\\(';

  (params || '').split(/\s/).forEach(function (param) {
    regex += matchers[param];
  });

  // return the regex
  return new RegExp(regex + '\\)');
}

var matchers = {
  val: '(\\-?[\\d\\.]+)',
  unit: '([^\\s]*)',
  ',': '\\,\\s*'
};

exports.translate = [
  // standard 2d translation
  {
    regex: makeRegex('translate', 'val unit , val unit'),
    x: extractVal(1),
    y: extractVal(3)
  },

  // 2d/3d translation on a specific axis
  {
    regex: makeRegex('translate(X|Y|Z)', 'val unit'),
    extract: function (match, data) {
      data[match[1].toLowerCase()] = extractVal(2)(match);
    },
    multi: true
  },

  // 3d translation as the specific translate3d prop
  {
    regex: makeRegex('translate3d', 'val unit , val unit , val unit'),
    x: extractVal(1),
    y: extractVal(3),
    z: extractVal(5)
  }
];

exports.rotate = [
  // standard 2d rotation
  {
    regex: makeRegex('rotate', 'val unit'),
    z: extractVal(1)
  },

  // 3d rotations on a specific axis
  {
    regex: makeRegex('rotate(X|Y|Z)', 'val unit'),
    extract: function (match, data) {
      data[match[1].toLowerCase()] = extractVal(2)(match);
    },
    multi: true
  }
];

exports.scale = [
  // standard 2d scaling (single parameter version)
  {
    regex: makeRegex('scale', 'val'),
    x: extractVal(1, false),
    y: extractVal(1, false)
  },

  // standard 2d scaling (two parameter version)
  {
    regex: makeRegex('scale', 'val , val'),
    x: extractVal(1, false),
    y: extractVal(2, false)
  },

  // 2d/3d translation on a specific axis
  {
    regex: makeRegex('scale(X|Y|Z)', 'val'),
    extract: function (match, data) {
      data[match[1].toLowerCase()] = extractVal(2, false)(match);
    },
    multi: true
  }
];

},{"./types/value":5}],3:[function(require,module,exports){
var RatchetTransform = require('./types/transform');
var XYZ = require('./types/xyz');

// modified from:
// http://keithclark.co.uk/articles/calculating-element-vertex-data-from-css-transforms/
module.exports = function(inputString) {
  var c = inputString.split(/\s*[(),]\s*/).slice(1,-1);
  var matrix;
  var props;

  if (c.length === 6) {
    // 'matrix()' (3x2)
    matrix = {
      m11: +c[0], m21: +c[2], m31: 0, m41: +c[4],
      m12: +c[1], m22: +c[3], m32: 0, m42: +c[5],
      m13: 0,     m23: 0,     m33: 1, m43: 0,
      m14: 0,     m24: 0,     m34: 0, m44: 1
    };
  } else if (c.length === 16) {
    // matrix3d() (4x4)
    matrix = {
      m11: +c[0], m21: +c[4], m31: +c[8], m41: +c[12],
      m12: +c[1], m22: +c[5], m32: +c[9], m42: +c[13],
      m13: +c[2], m23: +c[6], m33: +c[10], m43: +c[14],
      m14: +c[3], m24: +c[7], m34: +c[11], m44: +c[15]
    };
  }

  if (!matrix) {
    return false;
  }

  // extract the translation
  var translate = new XYZ('translate', {
    x: matrix.m41,
    y: matrix.m42,
    z: matrix.m43,
    units: 'px'
  });

  console.log('matrix: ', matrix);
  console.log('translate: ', translate);

  // zero out the last col, first three rows
  matrix.m41 = matrix.m42 = matrix.m43 = 0;

  var scaleX = vectorLength(matrix.m11, matrix.m12, matrix.m13);
  var scaleY = vectorLength(matrix.m21, matrix.m22, matrix.m23);
  var scaleZ = vectorLength(matrix.m31, matrix.m32, matrix.m33);
  var scale = new XYZ('scale', {
    x: scaleX,
    y: scaleY,
    z: scaleZ,
    units: ''
  });

  var rotationMatrix = {
    m11: matrix.m11 / scaleX, m21: matrix.m21 / scaleY, m31: matrix.m31 / scaleZ, m41: 0,
    m12: matrix.m12 / scaleX, m22: matrix.m22 / scaleY, m32: matrix.m32 / scaleZ, m42: 0,
    m13: matrix.m13 / scaleX, m23: matrix.m23 / scaleY, m33: matrix.m33 / scaleZ, m43: 0,
    m14: 0,                   m24: 0,                   m34: 0,                   m44: 1
  };

  return new RatchetTransform({
    translate: translate,
    scale: scale
  });
};

function vectorLength(x, y, z) {
  return Math.sqrt(x * x + y * y + z * z);
}

},{"./types/transform":4,"./types/xyz":6}],4:[function(require,module,exports){
/* jshint node: true */
'use strict';

var XYZ = require('./xyz');

var scaleOps = {
  add: 'mul',
  sub: 'div'
};

function RatchetTransform(opts) {
  if (! (this instanceof RatchetTransform)) {
    return new RatchetTransform(opts);
  }

  opts = opts || {};

  // ensure the scale units are set to an empty string
  opts.scale = opts.scale || {};
  opts.scale.units = '';
  opts.scale.defaultValue = 1;

  // set the rotation units
  opts.rotate = opts.rotate || {};
  opts.rotate.units = 'deg';

  // create new translation rotation and scale values,
  // duplicating the value provided
  this.translate = new XYZ('translate', opts.translate);
  this.rotate = new XYZ('rotate', opts.rotate);
  this.scale = new XYZ('scale', opts.scale);
}

module.exports = RatchetTransform;

RatchetTransform.prototype.clone = function() {
  return new RatchetTransform({
    translate: this.translate,
    scale: this.scale,
    rotate: this.rotate
  });
};

RatchetTransform.prototype.toString = function(opts) {
  var output = this.translate.toString(opts);
  var rotate = this.rotate.toString(opts);
  var scale = this.scale.toString(opts);

  if (rotate) {
    output += (output ? ' ' : '') + rotate;
  }

  if (scale) {
    output += (output ? ' ' : '') + scale;
  }

  return output;
};


['add', 'sub'].forEach(function(op) {
  RatchetTransform.prototype[op] = function() {
    // create new values to receive target values
    var newTransform = new RatchetTransform();

    // calculate the translation change
    newTransform.translate = XYZ.prototype[op].apply(
      this.translate,
      Array.prototype.map.call(
        arguments,
        function(item) { return item.translate; }
      )
    );

    // calculate the scale change (mapping add to mul)
    newTransform.scale = XYZ.prototype[scaleOps[op]].apply(
      this.scale,
      Array.prototype.map.call(
        arguments,
        function(item) { return item.scale; }
      )
    );

    // calculate the rotation update
    newTransform.rotate = XYZ.prototype[op].apply(
      this.rotate,
      Array.prototype.map.call(
        arguments,
        function(item) { return item.rotate; }
      )
    );

    return newTransform;
  };
});
},{"./xyz":6}],5:[function(require,module,exports){
/* jshint node: true */
'use strict';

function TransformValue(value, units) {
  var parsedVal = parseFloat(value);

  this.value = isNaN(parsedVal) ? value : parsedVal;
  this.units = units || '';
}

module.exports = TransformValue;

TransformValue.prototype.valueOf = function() {
  return this.value;
};

TransformValue.prototype.toString = function() {
  return this.value + this.units;
};

TransformValue.prototype.matchingUnits = function() {
  var match = true;
  for (var ii = arguments.length; ii--; ) {
    match = arguments[ii].units === this.units;
  }

  return match;
};

},{}],6:[function(require,module,exports){
/* jshint node: true */
'use strict';

var TransformValue = require('./value');

function XYZ(type, opts) {
  var defaultUnits;

  if (! (this instanceof XYZ)) {
    return new XYZ(type, opts);
  }

  opts = opts || {};

  this.type = type;
  this.defaultValue = opts.defaultValue || 0;

  // look for the default units
  defaultUnits = (opts.x || {}).units ||
    (opts.y || {}).units ||
    (opts.z || {}).units ||
    opts.units;

  // initialise the units
  this.units = typeof defaultUnits != 'undefined' ? defaultUnits : 'px';

  this.x = new TransformValue(typeof opts.x != 'undefined' ?
    opts.x : this.defaultValue, this.units);

  this.y = new TransformValue(typeof opts.y != 'undefined' ?
    opts.y : this.defaultValue, this.units);

  this.z = new TransformValue(typeof opts.z != 'undefined' ?
    opts.z : this.defaultValue, this.units);
}

module.exports = XYZ;

XYZ.prototype.add = function(value) {
  var x = this.x.valueOf();
  var y = this.y.valueOf();
  var z = this.z.valueOf();

  if (typeof value == 'number') {
    x += value;
    y += value;
    z = z ? z + value : 0;
  }
  else {
    for (var ii = arguments.length; ii--; ) {
      x += arguments[ii].x || 0;
      y += arguments[ii].y || 0;
      z = (z || arguments[ii].z) ? z + (arguments[ii].z || 0) : 0;
    }
  }

  return new XYZ(this.type, { x: x, y: y, z: z, units: this.units });
};

XYZ.prototype.mul = function(value) {
  var x = this.x.valueOf();
  var y = this.y.valueOf();
  var z = this.z ? this.z.valueOf() : 0;

  if (typeof value == 'number') {
    x *= value;
    y *= value;
    z = typeof this.z != 'undefined' ? z * value : 0;
  }
  else {
    for (var ii = arguments.length; ii--; ) {
      x *= arguments[ii].x;
      y *= arguments[ii].y;
      z *= arguments[ii].z;
    }
  }

  return new XYZ(this.type, { x: x, y: y, z: z, units: this.units });
};

['sub', 'div'].forEach(function(op) {
  var isSub = op === 'sub';
  var mappedKey = isSub ? 'add' : 'mul';

  XYZ.prototype[op] = function(value) {
    if (typeof value == 'number') {
      return this[mappedKey](isSub ? -value : 1 / value);
    }
    else {
      var xyz = this;
      var args = Array.prototype.map.call(arguments, function(item) {
        var inverted = new XYZ(xyz.type, item);

        if (isSub) {
          inverted.x = -inverted.x;
          inverted.y = -inverted.y;
          inverted.z = -inverted.z;
        }
        else {
          inverted.x = 1 / inverted.x;
          inverted.y = 1 / inverted.y;
          inverted.z = inverted.z ? 1 / inverted.z : 0;
        }

        return inverted;
      });

      return this[mappedKey].apply(this, args);
    }
  };
});

XYZ.prototype.toString = function(opts) {
  var output = [];

  // ensure options are defined
  opts = opts || {};

  if (opts.all || (this.x.value != this.defaultValue)) {
    output[output.length] = this.type + 'X(' + this.x.value +
      this.x.units + ')';
  }

  if (opts.all || (this.y.value != this.defaultValue)) {
    output[output.length] = this.type + 'Y(' + this.y.value +
      this.y.units + ')';
  }

  if (opts.all || (this.z.value != this.defaultValue)) {
    output[output.length] = this.type + 'Z(' + this.z.value +
      this.z.units + ')';
  }

  return output.join(' ');
};
},{"./value":5}]},{},[1])(1)
});