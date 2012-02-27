var ratchet = (function() {
    
    function TransformValue(value, units) {
        var parsedVal = parseFloat(value);
        
        this.value = isNaN(parsedVal) ? value : parsedVal;
        this.units = units || '';
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
        var defaultUnits;
        
        opts = opts || {};
        
        this.type = type;
        this.defaultValue = opts.defaultValue || 0;
        
        // look for the default units
        defaultUnits = (opts.x || {}).units || (opts.y || {}).units || (opts.z || {}).units || opts.units;
        
        // initialise the units
        this.units = typeof defaultUnits != 'undefined' ? defaultUnits : 'px';
        
        this.x = new TransformValue(typeof opts.x != 'undefined' ? opts.x : this.defaultValue, this.units);
        this.y = new TransformValue(typeof opts.y != 'undefined' ? opts.y : this.defaultValue, this.units);
        this.z = new TransformValue(typeof opts.z != 'undefined' ? opts.z : this.defaultValue, this.units);
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
        
        return new XYZ(this.type, { x: x, y: y, z: z, units: this.units });
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
        
        return new XYZ(this.type, { x: x, y: y, z: z, units: this.units });
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

    var scaleOps = {
        add: 'mul',
        sub: 'div'
    };
    
    function RatchetTransform(opts) {
        opts = opts || {};
        
        // ensure the scale units are set to an empty string
        opts.scale = opts.scale || {};
        opts.scale.units = '';
        opts.scale.defaultValue = 1;
        
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


    function _extractVal(index, expectUnits) {
        return function(match) {
            var units = '', value;
            if (typeof expectUnits == 'undefined' || expectUnits) {
                // get the units
                // default to undefined if an empty string which means the 
                // default units for the XYZ value type will be used
                units = match[index + 1] || undefined;
            }
    
            // create the transform value
            return new TransformValue(match[index], units);
        };
    } // _extractVal
    
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
            unit: '([^\\s]*)',
            ',': '\\,\\s*'
        },
        
        unitTypes = {
            translate: 'px',
            rotate: 'deg',
            scale: ''
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
                    },
                    multi: true
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
                    },
                    multi: true
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
                },
                
                // 2d/3d translation on a specific axis
                {
                    regex: _makeRegex('scale(X|Y|Z)', 'val'),
                    extract: function(match, data) {
                        data[match[1].toLowerCase()] = _extractVal(2, false)(match);
                    },
                    multi: true
                }
            ]
        };

    
    function fromString(inputString) {
        var props = new RatchetTransform(), key, match, data, section, value, testString;
        
        // iterate through the parsers
        for (key in transformParsers) {
            transformParsers[key].forEach(function(rule) {
                // reset the test string to the input string
                testString = inputString;
                
                match = rule.regex.exec(testString);
                
                while (match) {
                    // ensure data has been initialized
                    data = data || {};
                    
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
                    
                    // remove the match component from the input string
                    testString = testString.slice(0, match.index) + testString.slice(match.index + match[0].length);
                    
                    // if this is a multimatch rule, then run the regex again
                    if (rule.multi) {
                        match = rule.regex.exec(testString);
                    }
                    // otherwise, clear the match to break the loop
                    else {
                        match = null;
                    }
                }
                
                // initialise the properties (if we have data)
                if (data) {
                    data.units = unitTypes[key];
                    props[key] = new XYZ(key, data);
                }
            });
        }
        
        return props;
    } // fromString
    
    function _ratchet(input) {
        if (typeof input == 'string' || (input instanceof String)) {
            return fromString(input);
        }
    }
    
    // bind the internal helpers so we can test 
    _ratchet.fromString = fromString;
    _ratchet.Transform = RatchetTransform;
    
    return _ratchet;
})();