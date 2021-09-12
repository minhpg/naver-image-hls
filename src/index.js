const express = require('express');
require('dotenv').config()
const mongoose = require('mongoose');
const cors = require('cors')
const rateLimit = require("express-rate-limit");
const app = express();
const publicIp = require('public-ip');

const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_DB || 'mongodb://127.0.0.1/naver', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
app.set('view engine', 'ejs')

app.use('/api/private', async (req, res, next) => {
    server_ip = await publicIp.v4()
    trusted = await checkKey(server_ip)
    if (!trusted) {
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

app.get('/api/private/drive/delete/:id', require('./routes/drive/deleteVideo'))
app.get('/api/private/drive/retry', require('./routes/drive/retryVideos'))
app.get('/api/private/drive/retry/:id', require('./routes/drive/retryVideo'))
app.get('/api/private/drive/create/:id', require('./routes/drive/createVideo'))
app.get('/api/private/drive/get/:id', require('./routes/drive/getVideo'))
app.use('/api/private/stat', require('./routes/stat'))

app.use('/dist', express.static('static'))

const limiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/m3u8', limiter, require('./routes/playlist'))


app.get('/api/hls/:url',
    require('./routes/chunks'))

const origins = [
]

const corsOptions = {
    origin: origins,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.get('/api/iframe/:id', cors(corsOptions), require('./routes/embed'))

app.listen(PORT, async () => {
    console.log(`listening on port ${PORT}`)
})