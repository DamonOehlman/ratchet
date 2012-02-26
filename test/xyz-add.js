var expect = require('chai').expect,
    xyz1 = new XYZ('translate', { x: 50, y: 120 });

describe('ratchet xyz addition', function() {
    it('should be able add increase all values by a single numeric value', function() {
        var xyz = xyz1.add(50);
        
        expect(xyz.x == 100).to.be.ok;
        expect(xyz.y == 170).to.be.ok;
        expect(xyz.z == 0).to.be.ok;
        expect(xyz.x.units).to.equal('px');
        expect(xyz.y.units).to.equal('px');
        expect(xyz.z.units).to.equal('px');
    });
    
    it('should be able to increase specified values with a composite value', function() {
        var xyz = xyz1.add({ x: 100, y: 40 });
        
        expect(xyz.x == 150).to.be.ok;
        expect(xyz.y == 160).to.be.ok;
        expect(xyz.z == 0).to.be.ok;
        expect(xyz.x.units).to.equal('px');
        expect(xyz.y.units).to.equal('px');
        expect(xyz.z.units).to.equal('px');
    });
});