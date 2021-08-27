const express = require('express');
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const cors = require('cors')
const rateLimit = require("express-rate-limit");
const redisClient = require('./redis')
const app = express();

const cache = require('express-redis-cache')({
    client: redisClient,
});

dotenv.config()
const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_DB || 'mongodb://127.0.0.1/naver', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
app.set('view engine', 'ejs')

app.use('/api', (req, res, next) => {
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

app.use('/static', express.static('static'))

const limiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/playlist', limiter,
    cache.route({
        expire: {
            200: 60 * 60 * 24,
            '4xx': 10,
            '5xx': 10,
            'xxx': 1
        }
        , prefix: 'playlist',
    }), require('./routes/playlist'))


app.get('/chunks/:id/:res/:url/:filename',
    cache.route({
        expire: {
            '200' : 1,
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

app.get('/embed/:id', cors(corsOptions), require('./routes/embed'))

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})