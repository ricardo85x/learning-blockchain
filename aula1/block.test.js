const Block = require('./block')
const { GENESIS_DATA } = require('./config');
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
        const data = 'mined data';
        const mineBlock = Block.mineBlock( { lastBlock, data});

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

    });
})