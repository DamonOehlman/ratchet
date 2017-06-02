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
  var ii;

  for (ii = arguments.length; ii--;) {
    match = arguments[ii].units === this.units;
  }

  return match;
};
