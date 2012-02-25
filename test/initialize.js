var expect = require('chai').expect;

describe('initialization', function() {
    it('it should be able to create XYZ values', function() {
        var xyz = new XYZ('test');
        
        expect(xyz).to.exist;
        expect(xyz.type).to.equal('test');
        expect(xyz.x == 0).to.be.ok;
        expect(xyz.x.units).to.equal('px');
        expect(xyz.y == 0).to.be.ok;
        expect(xyz.y.units).to.equal('px');
        expect(xyz.z).to.not.exist;
    });
    
    it('it should be able to create XYZ values, specifying no units', function() {
        var xyz = new XYZ('test', { units: '' });
        
        expect(xyz).to.exist;
        expect(xyz.type).to.equal('test');
        expect(xyz.x == 0).to.be.ok;
        expect(xyz.x.units).to.equal('');
        expect(xyz.y == 0).to.be.ok;
        expect(xyz.y.units).to.equal('');
        expect(xyz.z).to.not.exist;
    });
    
    it('it should be able to create XYZ values, specifying em units', function() {
        var xyz = new XYZ('test', { units: 'em' });
        
        expect(xyz).to.exist;
        expect(xyz.type).to.equal('test');
        expect(xyz.x == 0).to.be.ok;
        expect(xyz.x.units).to.equal('em');
        expect(xyz.y == 0).to.be.ok;
        expect(xyz.y.units).to.equal('em');
        expect(xyz.z).to.not.exist;
    });
    
    it('it should be able to a transform', function() {
        var transform = new RatchetTransform();
        
        expect(transform).to.exist;
        expect(transform.translate instanceof XYZ).to.be.ok;
        expect(transform.translate.type).to.equal('translate');
        expect(transform.scale instanceof XYZ).to.be.ok;
        expect(transform.scale.type).to.equal('scale');
        expect(transform.rotate instanceof XYZ).to.be.ok;
        expect(transform.rotate.type).to.equal('rotate');
    });
    
    it('should initialise the translate values with px units', function() {
        var transform = new RatchetTransform();
        
        expect(transform.translate.x.units).to.equal('px');
        expect(transform.translate.y.units).to.equal('px');
    });

    it('should initialise the rotate values with deg units', function() {
        var transform = new RatchetTransform();
        
        expect(transform.rotate.x.units).to.equal('deg');
        expect(transform.rotate.y.units).to.equal('deg');
    });
    
    it('should initialise the scale values with empty units', function() {
        var transform = new RatchetTransform();
        
        expect(transform.scale.x.units).to.equal('');
        expect(transform.scale.y.units).to.equal('');
    });
});