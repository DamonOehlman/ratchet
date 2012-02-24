function RatchetTransform(opts) {
    opts = opts || {};
    
    // create new translation rotation and scale values, duplicating the value provided 
    this.translate = new XYZ(opts.translate);
    this.rotate = new XYZ(opts.rotate);
    this.scale = new XYZ(opts.scale);
}

RatchetTransform.prototype = {};

['add', 'sub'].forEach(function(op) {
    RatchetTransform.prototype[op] = function() {
        // create new values to receive target values
        var newTransform = new RatchetTransform();

        // calculate the translation change
        newTransform.translate = XYZ.prototype[op].apply(
            this.translate,
            Array.prototype.map.call(arguments, function(item) { return item.translate; })
        );
        
        return newTransform;
    };
});