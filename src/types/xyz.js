function XYZ(type, opts) {
    opts = opts || {};
    
    this.type = type;
    this.defaultValue = opts.defaultValue || 0;
    this.x = new TransformValue(typeof opts.x != 'undefined' ? opts.x : this.defaultValue, opts.units);
    this.y = new TransformValue(typeof opts.y != 'undefined' ? opts.y : this.defaultValue, opts.units);
    this.z = new TransformValue(typeof opts.z != 'undefined' ? opts.z : this.defaultValue, opts.units);
}

XYZ.prototype.add = function(value) {
    var x = this.x.valueOf(), 
        y = this.y.valueOf(),
        z = this.z.valueOf();
    
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
    
    return new XYZ(this.type, { x: x, y: y, z: z });
};

XYZ.prototype.mul = function(value) {
    var x = this.x.valueOf(), 
        y = this.y.valueOf(),
        z = this.z ? this.z.valueOf() : 0;
    
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
    
    return new XYZ(this.type, { x: x, y: y, z: z });
};

['sub', 'div'].forEach(function(op) {
    var isSub = op === 'sub',
        mappedKey = isSub ? 'add' : 'mul';
    
    XYZ.prototype[op] = function(value) {
        if (typeof value == 'number') {
            return this[mappedKey](isSub ? -value : 1 / value);
        }
        else {
            var args = Array.prototype.map.call(arguments, function(item) {
                var inverted = new XYZ(this.type, item);
                
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
        output[output.length] = this.type + 'X(' + this.x.value + this.x.units + ')';
    }
    
    if (opts.all || (this.y.value != this.defaultValue)) {
        output[output.length] = this.type + 'Y(' + this.y.value + this.y.units + ')';
    }
    
    if (opts.all || (this.z.value != this.defaultValue)) {
        output[output.length] = this.type + 'Z(' + this.z.value + this.z.units + ')';
    }
    
    return output.join(' ');
};