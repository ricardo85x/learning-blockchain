const Block = require('./block')
const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');

describe('Block', () => {
    const timestamp = 'a-data';
    const lastHash = 'foo-hash';
    const hash = 'bar-hash';
    const data = ['blockchain', 'data'];
    const block = new Block({
        timestamp,
        lastHash,
        hash,
        data
    });

    it('hash a timestamp, lastHash, hash and data property', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
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

        // it('set a `hash` ', () => {
        //     expect(mineBlock.hash).not.toEqual(undefined);
        // })

        it('create a SHA-256 `hash` basead on the proper input ', () => {
            expect(mineBlock.hash).toEqual(cryptoHash(mineBlock.timestamp, lastBlock.hash, data))
        })

    });
})