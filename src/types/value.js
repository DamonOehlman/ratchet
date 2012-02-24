function TransformValue(value, units) {
    this.value = parseFloat(value) || value;
    this.units = typeof units != 'undefined' ? units : 'px';
}

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