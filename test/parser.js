var expect = require('chai').expect,
    transforms = {
        a: 'translate(200px, -50px)',
        b: 'rotate(90deg) translate(200px, -50px)',
        c: 'translateX(200px)',
        d: 'rotate(90deg) translateX(200px)',
        e: 'translateY(-50px)',
        f: 'rotate(90deg) translateY(-50px)'
    };
    
function parse(input, prop, values) {
    return function() {
        var transform = ratchet(input),
            extractedValues = transform[prop];

        expect(extractedValues, 'extracted values').to.exist;
        for (var key in values) {
            expect(extractedValues[key]).to.equal(values[key]);
        }
    };
}

describe('ratchet transform parsing', function() {
    it(
        'should be able to parse an x, y translate', 
        parse(transforms.a, 'translate', { x: 200, y: -50 })
    );
    
    it(
        'should be able to parse on x, y translate with other preceeding properties',
        parse(transforms.b, 'translate', { x: 200, y: -50 })
    );
    
    it(
        'should be able to parse single translateX', 
        parse(transforms.c, 'translate', { x: 200 })
    );
    
    it(
        'should be able to parse single translateX with other preceeding properties',
        parse(transforms.d, 'translate', { x: 200 })
    );
    
    it(
        'should be able to parse a single translateY with negative values',
        parse(transforms.e, 'translate', { y: -50 })
    );
    
    it(
        'should be able to parse a single translateY with negative values (when preceeding properties are present)',
        parse(transforms.f, 'translate', { y: -50 })
    );
});