var ratchet = require('..');
var parsed = ratchet.fromString('translate3d(63.41263132471926px, 360.74743526062434px, 0px) rotate(0deg)');

// parsed.translate.y.value += 10;
console.log(parsed);
console.log(parsed.toString());
