var path = require('path'),
    fs = require('fs'),
    interleave = require('interleave');

task('default', function() {
    interleave('src/ratchet.js', {
        data: JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8')),
        path: '.',
        after: ['uglify']
    });
});