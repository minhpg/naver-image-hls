const { Worker } = require('bullmq')
const rimraf = require("rimraf");
const fs = require('fs');
const transcode = require('./transcode')
const download = require('../google-drive-api/download')
const upload = require('../naver-api/upload')
const fileSchema = require('../models/file')
const videoSchema = require('../models/video')
const Bottleneck = require('bottleneck')
const mongoose = require('mongoose');
const cookieSchema = require('../models/naverCookies')
const {sendMessage,report} = require('../telegram-api/sendMessage')
const publicIp = require('public-ip');
const got = require('got');
const serviceAccountAuth = require('../google-drive-api/serviceAccountAuth');
const proxy = require('../discord-api/proxy');

require('dotenv').config();
mongoose.connect(process.env.MONGO_DB || 'mongodb://127.0.0.1/naver', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });


const getCookie = async () => {
    const count = await cookieSchema.countDocuments({ disabled: false }).exec()
    var random = Math.floor(Math.random() * count)
    const account = await cookieSchema.findOne({ disabled: false }).skip(random).exec()
    return account
}



const workerProcess = async (fileid) => {
    return new Promise(async (resolve, reject) => {
        try {
            // const response = await getVideoInfo(fileid)
            // const cookie = response.headers['set-cookie']
            // cookie.push(process.env.COOKIE)
            // const parsed_stream = parseStream(response.body, cookie, fileid)
            // const file = parsed_stream.streams[0]
            // const video = await download(file)
            const auth = await serviceAccountAuth()
            const video = await download(auth, fileid, fileid+'.mp4')
            transcode(video)
                .then(playlist => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const cookie = await getCookie()
                            const limiter = new Bottleneck({
                                maxConcurrent: 5
                            });
                            const discordAccounts = require('../../discord.json')
                            const { token, channel_id } = discordAccounts[Math.floor(Math.random() * discordAccounts.length)]
                            var new_playlist = []
                            if (playlist.segments) {
                                const folder = playlist.segments[0].uri.split('/')[0]
                                for (const segment of playlist.segments) {
                                    const image_url = await limiter.schedule(() =>
                                        upload(segment.uri,cookie)
                                    )
                                    const proxy_url = await proxy('http://post-phinf.pstatic.net' + image_url, token, channel_id)
                                    new_playlist.push({
                                        original: image_url,
                                        proxy: proxy_url,
                                        duration: segment.duration,
                                        filename: segment.filename
                                    })
                                }
                                playlist.segments = new_playlist
                                rimraf.sync(folder);
                                resolve(playlist)
                            }
                            reject(new Error('no segments found'))
                        }
                        catch (err) {
                            console.error(err.message)
                            if (fs.existsSync(video)) {
                                rimraf.sync(video);
                            }
                            const path = video.replace('.mp4', '')
                            if (fs.existsSync(path)) {
                                rimraf.sync(path);
                            }
                            reject(err)
                        }
                    })
                })
                .then(playlist => {
                    resolve({
                        title: fileid,
                        res: 'original',
                        playlist: playlist
                    })
                })
                .catch(err => reject(err))
        }
        catch (err) {
            reject(err)
        }
    })
};


const worker = new Worker('naver', async job => {
    const fileid = job.data.drive_id
    console.log('starting job for video ' + fileid)
    await sendMessage(`*Start process\nFileId: https://drive.google.com/file/d/${fileid}/view\nWorker IP: ${await publicIp.v4()}`)
    try {
        const data = await workerProcess(fileid)
        const playlist = data.playlist
        const file = new fileSchema({
            res: data.res,
            allowCache: playlist.allowCache,
            discontinuityStarts: playlist.discontinuitySequence,
            segments: playlist.segments,
            version: playlist.version,
            targetDuration: playlist.targetDuration,
            mediaSequence: playlist.mediaSequence,
            discontinuitySequence: playlist.discontinuitySequence,
            endList: playlist.endList,
        })
        await file.save()
        await videoSchema.updateOne({ drive_id: fileid }, {
            processing: false,
            error: false,
            title: data.title,
            files: [file],
            error_message: null
        }).exec()
        await sendMessage(`*Success\nTitle: ${data.title}\nFileId: https://drive.google.com/file/d/${fileid}/view\nQuality: ${file.res}\nWorker IP: ${await publicIp.v4()}`)
    }
    catch (err) {
        console.error(err.message)
        await sendMessage(`*Error\nFileId: https://drive.google.com/file/d/${fileid}/view\nError Message: ${err.message}\nWorker IP: ${await publicIp.v4()}`)
        await videoSchema.updateOne({ drive_id: fileid }, {
            processing: false,
            error: true,
            error_message: err.message
        }).exec()
    }
    return
}, { concurrency: 2, connection:require('../queue_connection') });

worker.on('completed', (job) => {
    console.log(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
    console.log(err)
    console.log(`${job.id} has failed with ${err.message}`);
});
