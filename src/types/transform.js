var scaleOps = {
    add: 'mul',
    sub: 'div'
};

function RatchetTransform(opts) {
    opts = opts || {};
    
    // ensure the scale units are set to an empty string
    opts.scale = opts.scale || {};
    opts.scale.units = '';
    
    // set the rotation units
    opts.rotate = opts.rotate || {};
    opts.rotate.units = 'deg';
    
    // create new translation rotation and scale values, duplicating the value provided 
    this.translate = new XYZ('translate', opts.translate);
    this.rotate = new XYZ('rotate', opts.rotate);
    this.scale = new XYZ('scale', opts.scale);
}

RatchetTransform.prototype = {
    clone: function() {
        return new RatchetTransform({
            translate: this.translate,
            scale: this.scale,
            rotate: this.rotate
        });
    },
    
    toString: function(opts) {
        var output = this.translate.toString(opts),
            rotate = this.rotate.toString(opts),
            scale = this.scale.toString(opts);
            
        if (rotate) {
            output += (output ? ' ' : '') + rotate;
        }
        
        if (scale) {
            output += (output ? ' ' : '') + scale;
        }
        
        return output;
    }
};

['add', 'sub'].forEach(function(op) {
    RatchetTransform.prototype[op] = function() {
        // create new values to receive target values
        var newTransform = new RatchetTransform();
        
        // calculate the translation change
        newTransform.translate = XYZ.prototype[op].apply(
            this.translate,
            Array.prototype.map.call(arguments, function(item) { return item.translate; })
        );
        
        // calculate the scale change (mapping add to mul)
        newTransform.scale = XYZ.prototype[scaleOps[op]].apply(
            this.scale,
            Array.prototype.map.call(arguments, function(item) { return item.scale; })
        );
        
        // calculate the rotation update
        newTransform.rotate = XYZ.prototype[op].apply(
            this.rotate,
            Array.prototype.map.call(arguments, function(item) { return item.rotate; })
        );
        
        return newTransform;
    };
});