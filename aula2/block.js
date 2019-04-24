const { GENESIS_DATA, MINE_RATE } = require('./config');
const cryptoHash = require('./crypto-hash');

class Block {
 constructor( { timestamp, lastHash, hash, data, nonce, difficulty } ) {
   this.timestamp = timestamp
   this.lastHash = lastHash
   this.hash = hash
   this.data = data
   this.nonce = nonce,
   this.difficulty = difficulty
 }
   static genesis() {
    return new this(GENESIS_DATA);     
  }


  static adjustDifficulty ({ originalBlock, timestamp}) {

      if(originalBlock.difficulty < 1) return 1;

      const { difficulty } = originalBlock;

      if (  (timestamp - originalBlock.timestamp) > MINE_RATE ) return difficulty - 1;

      return difficulty + 1;

  }
  static mineBlock({ lastBlock, data}) {

    let hash, timestamp;
    // const timestamp = Date.now()
    const lastHash = lastBlock.hash

    let { difficulty } = lastBlock;
    let nonce = 0;

    // prrof of workk
    do {
      nonce++;
      timestamp = Date.now();

       difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp })

      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
    } while ( hash.substring(0, difficulty) !== '0'.repeat(difficulty)  ); 

    

    return new this({
      timestamp,
      data,
      difficulty,
      nonce,
      lastHash,
      hash
    })
  }

}


// teste 2 a volta

module.exports = Block;