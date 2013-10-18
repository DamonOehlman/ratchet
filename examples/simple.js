var ratchet = require('..');
var transform = require('feature/css')('transform');
var box = document.getElementById('box');
var t = transform ? ratchet(transform(box)) : null;

if (t) {
  setInterval(function() {
    t.translate.x.value += 2;
    t.rotate.z.value += 5;

    transform(box, t.toString());
  }, 1000 / 60);
}