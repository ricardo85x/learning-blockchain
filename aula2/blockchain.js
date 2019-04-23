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

    replaceChain( novo_chain){

        // nao faz o replace se o novo for menor ou mesmo tamanho
        if( novo_chain.length <= this.chain.length) {
            console.error('the incomming chain must be longer')
             return
        }

        // nao faz o replace se o novo for invalido
        if(!Blockchain.isValidChain(novo_chain)){
            console.error('the incomming chain must be valid')
            return
        }

        console.log('replacing  chain with', novo_chain)
        // faz o replace tudo numa boa
        this.chain = novo_chain;
    }

    static isValidChain( le_chain ){

        // check valid genesis
        if(  JSON.stringify(le_chain[0]) !== JSON.stringify(Block.genesis()) ){
            return false;
        } 



        for (let i = 1 ; i< le_chain.length; i++ ) {

            // vai criar uma variavel para cada atributo  do bloco
            const { timestamp, lastHash, hash, nonce, difficulty,  data }  = le_chain[i]
            const lastHashAtual = le_chain[i - 1].hash;

            if (lastHashAtual !== lastHash ){

                return false;
            }

            const validatedHash = cryptoHash(timestamp, lastHash, nonce, difficulty, data);

            if (validatedHash !=  hash){
                return false;
            }


        }

        return  true;



    }
}

module.exports = Blockchain;