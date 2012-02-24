function XYZ(type, opts) {
    opts = opts || {};
    
    this.type = type;
    this.x = new TransformValue(typeof opts.x != 'undefined' ? opts.x : 0);
    this.y = new TransformValue(typeof opts.y != 'undefined' ? opts.y : 0);
    
    if (opts.z) {
        this.z = new TransformValue(opts.z);
    }
}

XYZ.prototype.add = function(value) {
    var x = this.x.valueOf(), 
        y = this.y.valueOf(),
        z = this.z ? this.z.valueOf() : 0;
    
    if (typeof value == 'number') {
        x += value;
        y += value;
        z = typeof this.z != 'undefined' ? z + value : 0;
    }
    else {
        for (var ii = arguments.length; ii--; ) {
            x += arguments[ii].x;
            y += arguments[ii].y;
            z += arguments[ii].z;
        }
    }
    
    return new XYZ(this.type, { x: x, y: y, z: z });
};

XYZ.prototype.sub = function(value) {
    if (typeof value == 'number') {
        return this.add(-value);
    }
    else {
        return this.add.apply(this, Array.prototype.map.call(function(item) {
            return item.invert();
        }));
    }
};

XYZ.prototype.invert = function() {
    return new XYZ(this.type, { x: -x, y: -y, z: -z });
};

XYZ.prototype.toString = function(opts) {
    return this.type + '(' + [this.x, this.y].join(', ') + ')';
};