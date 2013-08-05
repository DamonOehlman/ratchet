var RatchetTransform = require('./types/transform');

//= types/value
//= types/xyz
//= types/transform

var matchers = require('./matchers');

function fromString(inputString) {
    var props = new RatchetTransform();
    var key;
    var match;
    var data;
    var section;
    var value;
    var testString;
    
    // iterate through the parsers
    for (key in transformParsers) {
        transformParsers[key].forEach(function(rule) {
            // reset the test string to the input string
            testString = inputString;
            
            // get the initial match
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
                
                // update the data units
                data.units = unitTypes[key];
                
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
                props[key] = new XYZ(key, data);
                
                // reset the data
                data = undefined;
            }
        });
    }
    
    return props;
} // fromString

function ratchet(input) {
    if (typeof input == 'string' || (input instanceof String)) {
        return fromString(input);
    }
}

// bind the internal helpers so we can test 
ratchet.fromString = fromString;
ratchet.Transform = RatchetTransform;
ratchet.XYZ = XYZ;