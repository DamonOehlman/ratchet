var ratchet = (function() {
    
    //= types/value
    //= types/xyz
    //= types/transform

    //= matchers
    
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
    
    function _ratchet(input) {
        if (typeof input == 'string' || (input instanceof String)) {
            return fromString(input);
        }
    }
    
    // bind the internal helpers so we can test 
    _ratchet.fromString = fromString;
    
    return _ratchet;
})();