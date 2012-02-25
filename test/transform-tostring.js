var expect = require('chai').expect;

describe('transform - string conversion', function() {
    it('can convert a simple x translate', function() {
        var transform = new RatchetTransform({ translate: { x: 50 }});
        
        expect(transform.toString()).to.equal('translateX(50px)');
    });
    
    it('can convert a simple x,y translate', function() {
        var transform = new RatchetTransform({ translate: { x: 50, y: 80 }});
        
        expect(transform.toString()).to.equal('translateX(50px) translateY(80px)');
    });
    
    it('can convert a simple x rotate', function() {
        var transform = new RatchetTransform({ rotate: { x: 90 }});
        
        expect(transform.toString()).to.equal('rotateX(90deg)');
    });
    
    it('can convert a simple x scale', function() {
        var transform = new RatchetTransform({ scale: { x: 2 }});
        
        expect(transform.toString()).to.equal('scaleX(2)');
    });
    
    it('can convert a translate and rotate transform', function() {
        var transform = new RatchetTransform({ translate: { x: 50 }, rotate: { x: 90 }});
        
        expect(transform.toString()).to.equal('translateX(50px) rotateX(90deg)');
    });
    
    it('can convert a translate and scale transform', function() {
        var transform = new RatchetTransform({ translate: { x: 50 }, scale: { y: 3.2 }});
        
        expect(transform.toString()).to.equal('translateX(50px) scaleY(3.2)');
    });
    
    it('can convert a rotate and scale transform', function() {
        var transform = new RatchetTransform({ rotate: { x: 80 }, scale: { y: 2.2 }});
        
        expect(transform.toString()).to.equal('rotateX(80deg) scaleY(2.2)');
    });
});