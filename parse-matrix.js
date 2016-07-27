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
