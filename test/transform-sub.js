var expect = require('chai').expect,
    tx1, tx2;

describe('ratchet transform subtraction', function() {
    it('should be able to parse an initial translation', function() {
        tx1 = ratchet('translate(50px, 120px) scale(2.0, 1.0)');
        
        expect(tx1.translate).to.exist;
        expect(tx1.translate.x == 50).to.be.ok;
        expect(tx1.translate.y == 120).to.be.ok;
        expect(tx1.scale.x == 2).to.be.ok;
        expect(tx1.scale.y == 1).to.be.ok;
    });
    
    it('should be able to parse a second translation', function() {
        tx2 = ratchet('translate(90px, 80px) scale(0.5, 0.5)');
        
        expect(tx2.translate).to.exist;
        expect(tx2.translate.x == 90).to.be.ok;
        expect(tx2.translate.y == 80).to.be.ok;
        expect(tx2.translate.x.units).to.equal('px');
        expect(tx2.translate.y.units).to.equal('px');
        expect(tx2.scale.x == 0.5).to.be.ok;
        expect(tx2.scale.y == 0.5).to.be.ok;
    });
    
    it('should be able to subtract the two transforms', function() {
        var tx = tx1.sub(tx2);
        
        expect(tx.translate).to.exist;
        expect(tx.translate.x == -40).to.be.ok;
        expect(tx.translate.y == 40).to.be.ok;
        expect(tx.translate.x.units).to.equal('px');
        expect(tx.translate.y.units).to.equal('px');
        expect(tx.scale.x == 4).to.be.ok;
        expect(tx.scale.y == 2).to.be.ok;
    });
    
    it('should be able to subtract two transforms for the original transform', function() {
        var tx = tx1.sub(tx2, tx2);
        
        expect(tx.translate).to.exist;
        expect(tx.translate.x == -130).to.be.ok;
        expect(tx.translate.y == -40).to.be.ok;
        expect(tx.translate.x.units).to.equal('px');
        expect(tx.translate.y.units).to.equal('px');
        expect(tx.scale.x == 8).to.be.ok;
        expect(tx.scale.y == 4).to.be.ok;
    });
});