function XYZ(opts) {
    opts = opts || {};
    
    this.x = new TransformValue(typeof opts.x != 'undefined' ? opts.x : 0);
    this.y = new TransformValue(typeof opts.y != 'undefined' ? opts.y : 0);
    this.z = new TransformValue(typeof opts.z != 'undefined' ? opts.z : 0);
}

XYZ.prototype.add = function() {
    var x = this.x.valueOf(), 
        y = this.y.valueOf(),
        z = this.z.valueOf();
    
    for (var ii = arguments.length; ii--; ) {
        x += arguments[ii].x;
        y += arguments[ii].y;
        z += arguments[ii].z;
    }
    
    return new XYZ({ x: x, y: y, z: z });
};