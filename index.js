const RatchetTransform = require('./types/transform');
const XYZ = require('./types/xyz');
const matchers = require('./matchers');

const unitTypes = {
  translate: 'px',
  rotate: 'deg',
  scale: ''
};

const ratchet = function(input) {
  if (typeof input == 'string' || (input instanceof String)) {
    return fromString(input);
  }

  return undefined;
};

// bind the internal helpers so we can test
ratchet.fromString = fromString;
ratchet.Transform = RatchetTransform;
ratchet.XYZ = XYZ;

module.exports = ratchet;

function fromString(inputString) {
  var props = new RatchetTransform();

  // iterate through the parsers
  Object.keys(matchers).forEach(function(ruleType) {
    matchers[ruleType].forEach(function(rule) {
      var data = checkMatch(inputString, rule, ruleType);
      if (data) {
        props[ruleType] = data;
      }
    });
  });

  return props;
}

function checkMatch(inputString, rule, ruleType) {
  // reset the test string to the input string
  var testString = inputString;
  var data;

  // get the initial match
  var match = rule.regex.exec(testString);

  while (match) {
    data = data || {};

    if (typeof rule.extract == 'function') {
      rule.extract(match, data);
    } else {
      Object.keys(rule).forEach(function(section) {
        if (section !== 'regex' && typeof rule[section] == 'function') {
          data[section] = rule[section](match);
        }
      });
    }

    // update the data units
    data.units = unitTypes[ruleType];

    // remove the match component from the input string
    testString = testString.slice(0, match.index) +
      testString.slice(match.index + match[0].length);

    // if this is a multimatch rule, then run the regex again
    if (rule.multi) {
      match = rule.regex.exec(testString);
    } else {
      match = null;
    }
  }

  return data && new XYZ(ruleType, data);
}
