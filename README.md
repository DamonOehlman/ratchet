# Ratchet - CSS3 Transform Parser & Manipulator

Ratchet assists with the process of dissecting CSS3 transform strings into
javascript objects that you can then do something more intelligent with.

[![NPM](https://nodei.co/npm/ratchet.png)](https://nodei.co/npm/ratchet/)

[![unstable](https://img.shields.io/badge/stability-unstable-yellowgreen.svg)](https://github.com/dominictarr/stability#unstable) [![Build Status](https://api.travis-ci.org/DamonOehlman/ratchet.svg?branch=master)](https://travis-ci.org/DamonOehlman/ratchet)

## Example Usage

Displayed below is a simple example. First a html file with a div element
styled to look like a square box:

```html
<html>
  <body>
    <style type="text/css">
      #box {
        width: 50px;
        height: 50px;
        background: red;
      }
    </style>
    <div id="box"></div>
    <script src="simple-bundle.js"></script>
  </body>
</html>
```

And then some JS that can be used to manipulate the transform of the box (
in partnership with the [feature](https://github.com/DamonOehlman/feature)
module):

```js
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
```

If you want to give this a go you should be able to run the example with
[bde](https://github.com/DamonOehlman/bde) simply type `yarn example`
in the repository once cloned an dependencies have been installed.

Assuming it is working, you will see a square red box, moving
and rotating towards the right of the screen.

## Licence

The MIT License (MIT)

Copyright (c) 2019 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
