var expect = require('chai').expect;

describe('xyz - string conversion', function() {
    it('should be able to convert an x only value to a string', function() {
        var xyz = new XYZ('translate', { x: 50 });
        
        expect(xyz.toString()).to.equal('translateX(50px)');
    });

    it('should be able to convert an y only value to a string', function() {
        var xyz = new XYZ('translate', { y: 50 });
        
        expect(xyz.toString()).to.equal('translateY(50px)');
    });
    
    it('should be able to convert an z only value to a string', function() {
        var xyz = new XYZ('translate', { z: 50 });
        
        expect(xyz.toString()).to.equal('translateZ(50px)');
    });
    
    it('should be able to convert an x and y value to a string', function() {
        var xyz = new XYZ('translate', { x: 50, y: 100 });
        
        expect(xyz.toString()).to.equal('translateX(50px) translateY(100px)');
    });

    it('should be able to convert an y and z value to a string', function() {
        var xyz = new XYZ('translate', { y: 80, z: 30 });
        
        expect(xyz.toString()).to.equal('translateY(80px) translateZ(30px)');
    });
    
    it('should be able to convert an x, y and z value to a string', function() {
        var xyz = new XYZ('translate', { x: 50, y: 100, z: 30 });
        
        expect(xyz.toString()).to.equal('translateX(50px) translateY(100px) translateZ(30px)');
    });
});