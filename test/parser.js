var expect = require('chai').expect,
    transforms = {
        translate: 'translate(200px,-50px)',
        translateNoUnits: 'translate(200, -50)',
        translate3d: 'translate(300px, 100px, 10px)',
        translateWithRotate: 'rotate(90deg) translate(200px, -50px)',
        translateX: 'translateX(200px)',
        translateXWithRotate: 'rotate(90deg) translateX(200px)',
        translateY: 'translateY(-50px)',
        translateYWithRotate: 'rotate(90deg) translateY(-50px)',
        rotate: 'rotate(175deg)',
        rotateNoUnits: 'rotate(190)',
        scaleSimple: 'scale(0.5)',
        scaleXY: 'scale(0.5, 2)',
        sepTransforms: 'translateX(100.2px) translateY(20px) translateZ(30px) rotateX(-105deg) rotateY(-30deg) rotateZ(180deg) scaleX(1.2) scaleY(0.8) scaleZ(0.4)',
        rotateNoUnitsWithTranslate: 'translateX(3px) rotate(5.72)'
    };
    
function parse(input, prop, values) {
    return function() {
        var transform = ratchet(input),
            extractedValues = transform[prop];

        expect(extractedValues, 'extracted values').to.exist;
        for (var key in values) {
            expect(extractedValues[key] == values[key], prop + '-' + key + ': ' + extractedValues[key] + ' != ' + values[key]).to.be.ok;
        }
    };
}

describe('ratchet transform parsing', function() {
    it(
        'should be able to parse an x, y translate', 
        parse(transforms.translate, 'translate', { x: 200, y: -50 })
    );
    
    it(
        'should be able to parse a 3d transform',
        parse(transforms.translate3d, 'translate', { x: 300, y: 100, z: 10 })
    );
    
    it(
        'should be able to parse on x, y translate with other preceeding properties',
        parse(transforms.translateWithRotate, 'translate', { x: 200, y: -50 })
    );
    
    it(
        'should be able to parse single translateX', 
        parse(transforms.translateX, 'translate', { x: 200 })
    );
    
    it(
        'should be able to parse single translateX with other preceeding properties',
        parse(transforms.translateXWithRotate, 'translate', { x: 200 })
    );
    
    it(
        'should be able to parse a single translateY with negative values',
        parse(transforms.translateY, 'translate', { y: -50 })
    );
    
    it(
        'should be able to parse a single translateY with negative values (when preceeding properties are present)',
        parse(transforms.translateYWithRotate, 'translate', { y: -50 })
    );
    
    it(
        'should be able to parse simple rotation', 
        parse(transforms.rotate, 'rotate', { z: 175 })
    );
    
    it(
        'should be able to parse single parameter scaling',
        parse(transforms.scaleSimple, 'scale', { x: 0.5, y: 0.5 })
    );
    
    it(
        'should be able to parse double parameter scaling',
        parse(transforms.scaleXY, 'scale', { x: 0.5, y: 2 })
    );
    
    it(
        'should be able to parse a complex separated transform (translate)', 
        parse(transforms.sepTransforms, 'translate', { x: 100.2, y: 20, z: 30 })
    );

    it(
        'should be able to parse a complex separated transform (rotate)', 
        parse(transforms.sepTransforms, 'rotate', { x: -105, y: -30, z: 180 })
    );
    
    it(
        'should be able to parse a complex separated transform (scale)', 
        parse(transforms.sepTransforms, 'scale', { x: 1.2, y: 0.8, z: 0.4 })
    );
    
    it('should be able to parse the appropriate units', function() {
        var transform = ratchet(transforms.sepTransforms);
        
        expect(transform).to.exist;
        expect(transform.translate.x.units).to.equal('px');
        expect(transform.rotate.z.units).to.equal('deg');
        expect(transform.scale.x.units).to.equal('');
    });
    
    it('should be able to add the appropriate units when they are not specified', function() {
        var transform = ratchet(transforms.translateNoUnits);
        
        expect(transform).to.exist;
        expect(transform.translate.x.value).to.equal(200);
        expect(transform.translate.x.units).to.equal('px');
        expect(transform.translate.y.value).to.equal(-50);
        expect(transform.translate.y.units).to.equal('px');
    });
    
    it('should be able to add the appropriate units when they are not specified', function() {
        var transform = ratchet(transforms.rotateNoUnits);
        
        expect(transform).to.exist;
        expect(transform.rotate.z.value).to.equal(190);
        expect(transform.rotate.z.units).to.equal('deg');
    });
    
    it('should be able to add the appropriate units when they are not specified', function() {
        var transform = ratchet(transforms.rotateNoUnitsWithTranslate);
        
        expect(transform).to.exist;
        expect(transform.rotate.z.value).to.equal(5.72);
        expect(transform.rotate.z.units).to.equal('deg');
    });
});