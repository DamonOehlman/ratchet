function Scaler(opts) {
    opts = opts || {};
    
    this.x = new TransformValue(typeof opts.x != 'undefined' ? opts.x : 1);
    this.y = new TransformValue(typeof opts.y != 'undefined' ? opts.y : 1);
}