const Block = require('./block')
const { GENESIS_DATA, MINE_RATE } = require('./config');
const cryptoHash = require('./crypto-hash');

describe('Block', () => {
    const timestamp = 2000;
    const lastHash = 'foo-hash';
    const hash = 'bar-hash';
    const data = ['blockchain', 'data'];
    const nonce = 1;
    const difficulty = 1;

    const block = new Block({
        timestamp,
        lastHash,
        hash,
        data,

        nonce,
        difficulty
    });

    it('hash a timestamp, lastHash, hash and data property', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);

        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    })

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();

        // console.log('genesis', genesisBlock);
        it('returns a Block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true)
        })

        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        })
    });

    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'foo';
        const mineBlock = Block.mineBlock( { lastBlock, data});
        const foo_hash = '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae'

        console.log("le hash", mineBlock.hash)
        console.log('le nonce', mineBlock.nonce)
        it('returns a Block instance', () => {
            expect(mineBlock instanceof Block).toBe(true); 
        });

        it('sets the `lastHash` to be the `hash` of the lastBlock ', () => {
            expect(mineBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('set the `data`', () => {
             expect(mineBlock.data).toEqual(data)
        });

        it('set a `timestamp`',  () => {
            expect(mineBlock.timestamp).not.toEqual(undefined);
        } )

        it('create a SHA-256 `hash` basead on the proper input ', () => {
            expect(mineBlock.hash).toEqual(
                cryptoHash(
                    mineBlock.timestamp, 
                    mineBlock.nonce, 
                    mineBlock.difficulty,  
                    lastBlock.hash, 
                    data
                )
            );
        })

        it('sets a `hash` that matches the difficulty criteria', () => {
            expect(mineBlock.hash.substring(0, mineBlock.difficulty))
                .toEqual('0'.repeat(mineBlock.difficulty))
        })

        it('adjust the difficulty', () => {

            const possibleResult = [lastBlock.difficulty + 1, lastBlock.difficulty - 1]
            expect(possibleResult.includes(mineBlock.difficulty)).toBe(true);

        })

    });

    describe('adjustDifficulty()', () => {

        it('raises the difficulty for a quickly mined block', () => {
            expect(Block.adjustDifficulty({ 
                originalBlock: block, 
                timestamp: block.timestamp + MINE_RATE - 100 // forcando o valor a ser inferior ao timestamp + minerate  para rodar este teste
            })).toEqual(block.difficulty + 1)
        })

        it('lowers the difficulty for a slowly mined block', () => {
            expect(Block.adjustDifficulty({ 
                originalBlock: block,
                timestamp: block.timestamp + MINE_RATE + 100
            })).toEqual(block.difficulty - 1)
        })

        it('has a lower limit of 1', () => {
            block.difficulty = -1;

            expect(Block.adjustDifficulty( { originalBlock: block })). toEqual(1);
        })
    });

})