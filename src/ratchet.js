var ratchet = (function() {
    
    //= types/value
    //= types/xyz
    //= types/scaler
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
                    
                    props[key] = new (key == 'scale' ? Scaler : XYZ)(data);
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