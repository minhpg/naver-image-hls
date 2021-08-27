const Queue = require('bee-queue');
const Bottleneck = require('bottleneck')
const sendMessage = require('../telegram-api/sendMessage')


const limiter = new Bottleneck({
    id: 'message_global_limiter',
    datastore: 'redis',
    maxConcurrent: 1,
});

const options = {
    removeOnSuccess: true,
}

const queue = new Queue('*Error - proxy error message', options)

const messageProxy = () => {
    return queue.createJob().save();
};

queue.on('ready', async () => {
     await limiter.schedule(async () => {
        queue.process(async (job,done) => { 
            await sendMessage('*Error - Image proxy cookie died! Please change cookie')
            done()
        })
     })
})

module.exports = messageProxy


