var ratchet = (function() {
    
    function TransformValue(value, units) {
        this.value = parseFloat(value) || value;
        this.units = units || 'px';
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
    
    XYZ.prototype.invert = function() {
        return new XYZ(this.type, { x: -x, y: -y, z: -z });
    };
    
    XYZ.prototype.toString = function(opts) {
        return this.type + '(' + [this.x, this.y].join(', ') + ')';
    };

    function RatchetTransform(opts) {
        opts = opts || {};
        
        // create new translation rotation and scale values, duplicating the value provided 
        this.translate = new XYZ(opts.translate);
        this.rotate = new XYZ(opts.rotate);
        this.scale = new XYZ(opts.scale);
    }
    
    RatchetTransform.prototype = {
        add: function(value) {
            // create new values to receive target values
            var newTransform = new RatchetTransform();
    
            // if a numeric value has been passed, then process
            if (typeof value == 'number') {
                newTransform.translate = this.translate.add(value);
            }
            // otherwise process individually
            else {
                // calculate the translation change
                newTransform.translate = XYZ.prototype.add.apply(
                    this.translate,
                    Array.prototype.map.call(arguments, function(item) { return item.translate; })
                );
            }
            
            return newTransform;
        },
        
        sub: function() {
            var args = [];
            for (var ii = arguments.length; ii--; ) {
                if (typeof arguments[ii] == 'number') {
                    args[ii] = -arguments[ii];
                }
                else {
                    args[ii] = arguments[ii].invert();
                }
            }
            
            // run the add function
            this.add.apply(this, args);
        }
    };


    function _makeRegex(fnName, params) {
        var regex = fnName + '\\(';
        
        (params || '').split(/\s/).forEach(function(param) {
            regex += matchers[param];
        });
        
        // return the regex
        return new RegExp(regex + '\\)');
    }
    
    var matchers = {
            val: '(\\-?[\\d\\.]+)',
            unit: '([^\s]+)',
            ',': '\\,\\s*'
        },
        transformParsers = {
            translate: [
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
                    }
                },
                
                // 3d translation as the specific translate3d prop
                {
                    regex: _makeRegex('translate', 'val unit , val unit , val unit'),
                    x: _extractVal(1),
                    y: _extractVal(3),
                    z: _extractVal(5)
                }
            ],
            
            rotate: [
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
                    }
                }
            ],
            
            scale: [
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
                }
            ]
        };

    
    function fromString(inputString) {
        var props = new RatchetTransform(), key, match, data, section, value;
        
        // iterate through the parsers
        for (key in transformParsers) {
            transformParsers[key].forEach(function(rule) {
                match = rule.regex.exec(inputString);
                data = {};
                    
                if (match) {
                    if (typeof rule.extract == 'function') {
                        rule.extract(match, data);
                    }
                    else {
                        for (section in rule) {
                            if (section !== 'regex' && typeof rule[section] == 'function') {
                                data[section] = rule[section](match);
                            }
                        }
                    }
                    
                    props[key] = new XYZ(key, data);
                }
            });
        }
        
        return props;
    } // fromString
    
    function _extractVal(index, expectUnits) {
        return function(match) {
            var units, value;
            if (typeof expectUnits == 'undefined' || expectUnits) {
                units = match[index + 1];
            }

            // create the transform value
            return new TransformValue(match[index], units);
        };
    } // _extractVal
    
    function _ratchet(input) {
        if (typeof input == 'string' || (input instanceof String)) {
            return fromString(input);
        }
    }
    
    // bind the internal helpers so we can test 
    _ratchet.fromString = fromString;
    
    return _ratchet;
})();