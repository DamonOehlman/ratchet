var expect = require('chai').expect,
    ratchet = require('../pkg/cjs/ratchet'),
    tx1;

describe('ratchet transform cloning', function() {
    it('should be able to parse an initial translation', function() {
        tx1 = ratchet('translate(50px, 120px) scale(2.0, 1.0)');
        
        expect(tx1.translate).to.exist;
        expect(tx1.translate.x == 50).to.be.ok;
        expect(tx1.translate.y == 120).to.be.ok;
        expect(tx1.translate.z == 0).to.be.ok;
        expect(tx1.scale.x == 2).to.be.ok;
        expect(tx1.scale.y == 1).to.be.ok;
    });
    
    it('should be able to clone the transform', function() {
        var tx = tx1.clone();
        
        expect(tx.translate.x == 50).to.be.ok;
        expect(tx.translate.y == 120).to.be.ok;
        expect(tx.translate.z == 0).to.be.ok;
        expect(tx.scale.x == 2).to.be.ok;
        expect(tx.scale.y == 1).to.be.ok;
        
        // expect(tx === tx1).to.not.be.ok;
    });
});