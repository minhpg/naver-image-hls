const videoSchema = require('../../models/video')


module.exports = async (req,res) => {
    const fileId = req.params.id
    const video = await videoSchema.findOne({drive_id: fileId}).exec()
    if (video) {
        var data = {
            title: video.title,
            processing: video.processing,
            error: video.error,
            error_message: video.error_message,
            embed: `${process.env.HOST}/api/iframe/${video._id}`,
            playlist: `${process.env.HOST}/api/m3u8/${video._id}/master.m3u8`
        }

        res.json({
            status: 'ok',
            data: data
        })
    }
    else {
        res.json({
            status: 'error',
            message: 'video does not exist'
        })
    }
    res.end()
}