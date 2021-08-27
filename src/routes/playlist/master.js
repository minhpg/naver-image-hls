const videoSchema = require('../../models/video')
const fileSchema = require('../../models/file')
const bandwidths = {
    '360': 1000000,
    '480': 1500000,
    '720': 2000000,
    '1080': 8000000
}

const resolutions = {
    '360': "540x360",
    '480': "720x480",
    '720': "1280x720",
    '1080': "1920x1080"
}

module.exports = async (req, res) => {
    try {
        const video = await videoSchema.findOne({ _id: req.params.id }).exec()
        if (!video) {
            res.status(404)
            res.json({ message: 'fail', message: 'video not found' })
            return
        }
        var playlist = ['#EXTM3U']
        for(const file in video.files){
            const video_file = await fileSchema.findOne({_id:file}).exec()
            playlist.push(`#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=${bandwidths[video_file.res]},RESOLUTION=${resolutions[video_file.res]}`)
            playlist.push(`/playlist/${video_file._id}/playlist.m3u8`)
        }
        res.send(playlist.join('\n'))
        return
    }
    catch (err) {
        res.json({
            status: 'fail',
            message: err.message
        })
        return
    }

}