var expect = require('chai').expect;

describe('transform - string conversion', function() {
    it('can convert a simple x translate to a string', function() {
        var transform = new RatchetTransform({ translate: { x: 50 }});
        
        expect(transform.toString()).to.equal('translateX(50px)');
    });
    
    it('can convert a simple x,y translate to a string', function() {
        var transform = new RatchetTransform({ translate: { x: 50, y: 80 }});
        
        expect(transform.toString()).to.equal('translateX(50px) translateY(80px)');
    });
    
    it('can convert a simple x rotate to a string', function() {
        var transform = new RatchetTransform({ rotate: { x: 90 }});
        
        expect(transform.toString()).to.equal('rotateX(90deg)');
    });
});