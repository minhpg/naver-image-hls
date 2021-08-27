const { Queue } = require('bullmq')
const redis = require('../redis')

const queue = new Queue('naver',{connection: {
    port: 6379,
    host: process.env.REDIS_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD || ''
}})

module.exports = queue