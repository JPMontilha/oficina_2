const chaiPromise = import('chai');

describe('Testes Essenciais', function() {
    let chai;
    
    before(async function() {
        chai = await chaiPromise;
    });

    it('Verifica igualdade', function() {
        chai.assert.equal('valor', 'valor');
    });

    it('Verifica tipo', function() {
        chai.assert.typeOf(42, 'number');
    });

    it('Verifica comparação numérica', function() {
        chai.assert.isBelow(3, 10);
    });

    it('Verifica array', function() {
        const arr = [1, 2, 3];
        chai.assert.lengthOf(arr, 3);
    });

    it('Verifica objeto', function() {
        const obj = { chave: 'valor' };
        chai.assert.property(obj, 'chave');
    });

    it('Verifica condições booleanas', function() {
        chai.assert.isTrue(true);
    });

    it('Verifica valores nulos', function() {
        chai.assert.isNull(null);
    });
});