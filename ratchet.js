var ratchet = (function() {
    
    function _makeRegex(fnName, params) {
        var regex = fnName + '\\(';
        
        (params || '').split(/\s/).forEach(function(param) {
            regex += matchers[param];
        });
        
        // return the regex
        console.log(regex);
        return new RegExp(regex + '\\)');
    }
    
    var matchers = {
            val: '(\\-?[\\d\\.]+)',
            unit: '(.+)',
            ',': '\\,\\s*'
        },
        transformParsers = {
            translate: [
                // standard 2d translation
                {
                    regex: _makeRegex('translate', 'val unit , val unit'),
                    x: 1,
                    y: 3
                },
                
                // 2d/3d translation on a specific axis
                {
                    regex: _makeRegex('translate(X|Y|Z)', 'val unit'),
                    extract: function(match, data) {
                        data[match[1].toLowerCase()] = parseInt(match[2], 10) || match[2];
                    }
                },
                
                // 3d translation as the specific translate3d prop
                {
                    regex: _makeRegex('translate', 'val unit , val unit , val unit'),
                    x: 1,
                    y: 3,
                    z: 5
                }
            ],
            
            rotate: [
                // standard 2d rotation
                {
                    regex: _makeRegex('rotate', 'val unit'),
                    z: 1
                },
                
                // 3d rotations on a specific axis
                {
                    regex:  _makeRegex('rotate(X|Y|Z)', 'val unit'),
                    extract: function(match, data) {
                        data[match[1].toLowerCase()] = parseInt(match[2], 10) || match[2];
                    }
                }
            ],
            
            scale: [
                // standard 2d scaling (single parameter version)
                {
                    regex: _makeRegex('scale', 'val'),
                    x: 1,
                    y: 1
                },
                
                // standard 2d scaling (two parameter version)
                {
                    regex: _makeRegex('scale', 'val , val'),
                    x: 1,
                    y: 2
                }
            ]
        };

    
    function fromString(inputString) {
        var props = {}, key, match, data, section, value;
        
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
                            if (section !== 'regex') {
                                value = match[rule[section]];
                                data[section] = parseFloat(value) || value;
                            }
                        }
                    }
                    
                    
                    props[key] = data;
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
    
    return _ratchet;
})();