const { Queue } = require('bullmq')
const redis = require('../redis')

const queue = new Queue('naver',{connection: redis})

module.exports = queue