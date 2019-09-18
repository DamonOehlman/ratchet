/* eslint-env browser */

const ratchet = require('..');
const transform = require('feature/css')('transform');

const box = document.getElementById('box');
const { width: boxWidth } = box.getBoundingClientRect();
const t = transform && ratchet(transform(box));

if (t) {
  let forwards = true;

  // this is all a bit hacky, but you get the idea
  const animate = () => {
    if (forwards) {
      t.translate.x.value += 2;
      t.rotate.z.value += 5;
      forwards = forwards && t.translate.x.value + boxWidth < window.innerWidth;
    } else {
      t.translate.x.value -= 2;
      t.rotate.z.value -= 5;
      forwards = t.translate.x.value < 0;
    }

    transform(box, t.toString());
    window.requestAnimationFrame(animate);
  };

  animate();
}
