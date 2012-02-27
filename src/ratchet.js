var ratchet = (function() {
    
    //= types/value
    //= types/xyz
    //= types/transform

    //= matchers
    
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