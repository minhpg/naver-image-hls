const Queue = require('bee-queue');
const fileSchema = require('../../models/file')
const imageProxy = require('../../google-drive-api/imageProxy')
const redisClient = require('../../redis')

const options = {
    removeOnSuccess: true,
}

const playlistQueue = new Queue('playlist', options)

const playlistRequest = (order) => {
    return playlistQueue.createJob(order).save();
};

playlistQueue.process((job, done) => {

    redisClient.get(job.data.id, async (err, data) => {
        if (err) {
            done(err.message)
        }
        if (data) {
            done(data)
        }
        const file = await fileSchema.findOne({ _id: job.data.id }).exec()
        if (!file) {
            done(JSON.stringify({ message: 'fail', message: 'file not found' }))
        }
        var playlist = [
            `#EXTM3U`,
            `#EXT-X-VERSION:${file.version}`,
            `#EXT-X-TARGETDURATION:${file.targetDuration}`,
            `#EXT-X-MEDIA-SEQUENCE:0`,
        ]
        const promises = file.segments.map((segment) => {
            return imageProxy(segment.drive)
        })
        await Promise.all(promises).then(segments => {
            index = 0
            for (const segment of segments) {
                playlist.push(`#EXTINF:${file.segments[index].duration},`)
                playlist.push(segment)
                index += 1
            }
            playlist.push('#EXT-X-ENDLIST')
        }).then(() => {
            const body = playlist.join('\n')
            redisClient.setex(job.data.id, 14000, body, (err) => {
                if (err) {
                    done(err.message)
                }
                done(body);
            })
        })
    })
})

module.exports = playlistRequest


