const Blockchain = require('./blockchain');
const Block = require('./block');

describe('Blockchain', () => {
    let blockchain;

    beforeEach(() => {
        blockchain = new Blockchain()
    })


    it('contains a `chain` Array instance',  () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('should start with the `genesis` block' , () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the chain', () => {
        const newData = 'fooBar'
        blockchain.addBlock({ data: newData });

        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData)
    });

    describe('isValidChain()', () => {
        describe('when the chain does not start with the genesis block', () => {
            it('return false', () => {
                    blockchain.chain[0] = { data: 'fake-genesis'}
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
            });
        })

        describe('when the chain starts with the genesis block and has multiple  blocks ', () => {

            beforeEach(() =>{
                blockchain.addBlock({ data: 'Bears '})
                blockchain.addBlock({ data: 'Beats '})
                blockchain.addBlock({ data: 'Battlestar Galactica '})
            })

            describe('and a lashHash reference has changed', () => {
                    it('return false', () => {

                        blockchain.chain[2].lastHash = 'broken-lastHash';
                        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)

                    })
            })

            describe('and the chain contains a block with an invalid field', ()  => {
                    it('returns false', () => {
                      
                        blockchain.chain[2].data = 'data from the hell  fire';

                        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)

                    })
            })

            describe('and the chain does not contains any invalid block', () => {
                it('returns true', () => {

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true)

                })
            })

        });
    })
})