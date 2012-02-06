var ratchet = (function() {
    
    var transformParsers = {
            translate: [
                {
                    regex: /translate\((\-?\d+)(.+)\,\s+(\-?\d+)(.+)\)/,
                    x: 1,
                    y: 3
                },
                
                {
                    regex: /translate(X|Y|Z)\((\-?\d+)(.+)\)/,
                    extract: function(match, data) {
                        data[match[1].toLowerCase()] = parseInt(match[2], 10) || match[2];
                    }
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
                                data[section] = parseInt(value, 10) || value;
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