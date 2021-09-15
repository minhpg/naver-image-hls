const { Queue } = require('bullmq')

const queue = new Queue('naver',{connection: require('../queue_connection')})

module.exports = queue