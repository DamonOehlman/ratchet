var expect = require('chai').expect,
    tx1, tx2, tx3;

describe('ratchet transform addition', function() {
    it('should be able to parse an initial translation', function() {
        tx1 = ratchet('translate(50px, 120px)');
        
        expect(tx1.translate).to.exist;
        expect(tx1.translate.x == 50).to.be.ok;
        expect(tx1.translate.y == 120).to.be.ok;
        expect(tx1.translate.z).to.not.exist;
    });
    
    it('should be able to parse a second translation', function() {
        tx2 = ratchet('translate(90px, 80px)');
        
        expect(tx2.translate).to.exist;
        expect(tx2.translate.x == 90).to.be.ok;
        expect(tx2.translate.y == 80).to.be.ok;
        expect(tx2.translate.x.units).to.equal('px');
        expect(tx2.translate.y.units).to.equal('px');
        expect(tx2.translate.z).to.not.exist;
    });
    
    it('should be able to add the two transforms', function() {
        tx3 = tx1.add(tx2);
        
        expect(tx3.translate).to.exist;
        expect(tx3.translate.x == 140).to.be.ok;
        expect(tx3.translate.y == 200).to.be.ok;
        expect(tx3.translate.x.units).to.equal('px');
        expect(tx3.translate.y.units).to.equal('px');
        expect(tx3.translate.z).to.not.exist;
    });
    
    it('should be able to add all the transforms', function() {
        var tx = tx1.add(tx2, tx3);
        
        expect(tx.translate).to.exist;
        expect(tx.translate.x == 280).to.be.ok;
        expect(tx.translate.y == 400).to.be.ok;
        expect(tx.translate.x.units).to.equal('px');
        expect(tx.translate.y.units).to.equal('px');
        expect(tx.translate.z).to.not.exist;
    });
});