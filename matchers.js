function extractVal(index, expectUnits) {
  return function(match) {
    var units = '', value;
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
  
  (params || '').split(/\s/).forEach(function(param) {
    regex += matchers[param];
  });
  
  // return the regex
  return new RegExp(regex + '\\)');
}

var matchers = exports.matchers = {
  val: '(\\-?[\\d\\.]+)',
  unit: '([^\\s]*)',
  ',': '\\,\\s*'
};

var unitTypes = exports.unitTypes = {
  translate: 'px',
  rotate: 'deg',
  scale: ''
};

exports.translate = [
  // standard 2d translation
  {
    regex: _makeRegex('translate', 'val unit , val unit'),
    x: _extractVal(1),
    y: _extractVal(3)
  },

  // 2d/3d translation on a specific axis
  {
    regex: _makeRegex('translate(X|Y|Z)', 'val unit'),
    extract: function(match, data) {
      data[match[1].toLowerCase()] = _extractVal(2)(match);
    },
    multi: true
  },

  // 3d translation as the specific translate3d prop
  {
    regex: _makeRegex('translate', 'val unit , val unit , val unit'),
    x: _extractVal(1),
    y: _extractVal(3),
    z: _extractVal(5)
  }
];

exports.rotate = [
  // standard 2d rotation
  {
    regex: _makeRegex('rotate', 'val unit'),
    z: _extractVal(1)
  },

  // 3d rotations on a specific axis
  {
    regex:  _makeRegex('rotate(X|Y|Z)', 'val unit'),
    extract: function(match, data) {
      data[match[1].toLowerCase()] = _extractVal(2)(match);
    },
    multi: true
  }
];

exports.scale = [
  // standard 2d scaling (single parameter version)
  {
    regex: _makeRegex('scale', 'val'),
    x: _extractVal(1, false),
    y: _extractVal(1, false)
  },

  // standard 2d scaling (two parameter version)
  {
    regex: _makeRegex('scale', 'val , val'),
    x: _extractVal(1, false),
    y: _extractVal(2, false)
  },

  // 2d/3d translation on a specific axis
  {
    regex: _makeRegex('scale(X|Y|Z)', 'val'),
    extract: function(match, data) {
      data[match[1].toLowerCase()] = _extractVal(2, false)(match);
    },
    multi: true
  }
];