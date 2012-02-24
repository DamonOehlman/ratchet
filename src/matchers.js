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