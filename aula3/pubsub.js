const redis = require('redis');

const CHANNELS = {
    TEST: "TEST",
    BLOCKCHAIN: "BLOCKCHAIN"
};
class PubSub {
    constructor( { blockchain }) {

        this.blockchain = blockchain;

        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscriber.subscribe(CHANNELS.TEST);
        this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);

        this.subscribeToChannel();

        this.subscriber.on('message', (channel, message ) => {
            this.handleMessage(channel, message)
        })
    }

    subscribeToChannel() {
        Object.values(CHANNELS).forEach((channel ) => {
            this.subscriber.subscribe(channel)
        })

    }

    publish( { channel, message}) {
        this.publisher.publish(channel, message)
    }

    handleMessage(channel, message)  {
        console.log(`Message received. Channel: ${channel}. Message: ${message}`);


        if (channel == CHANNELS.BLOCKCHAIN) {
            const parsedMessage = JSON.parse(message)
            this.blockchain.replaceChain(parsedMessage);

        }
    }

    broadcastChain() {
        this.publish( {
            channel: CHANNELS.BLOCKCHAIN,
            message:  JSON.stringify(this.blockchain.chain)
        })
    }
}

module.exports = PubSub;
