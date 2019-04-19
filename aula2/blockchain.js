const Block = require('./block');
const cryptoHash = require('./crypto-hash');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()]
    }

    addBlock( { data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length -1],
            data
        })
        this.chain.push(newBlock)
    }

    static isValidChain( le_chain ){


        // check valid genesis
        if(  JSON.stringify(le_chain[0]) !== JSON.stringify(Block.genesis()) ){
            return false;
        } 

        for (let i = 1 ; i< le_chain.length; i++ ) {

            // vai criar uma variavel para cada atributo  do bloco
            const { timestamp, lastHash, hash, data }  = le_chain[i]
            const lastHashAtual = le_chain[i - 1].hash;

            if (lastHashAtual !== lastHash ){
                return false;
            }

            const validatedHash = cryptoHash(timestamp, lastHash, data);

            if (validatedHash !=  hash){
                return false;
            }


        }

        return  true;



    }
}

module.exports = Blockchain;