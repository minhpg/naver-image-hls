const videoSchema = require('../../models/video')
const videoQueue = require('../../queues/video.queue')

module.exports = async (req,res) => {
    const fileId = req.params.id
    const video_in_db = await videoSchema.findOne({drive_id : fileId}).exec()
    console.log(video_in_db)
    if(video_in_db){
        res.json({
            status: 'failed',
            message: 'video existed',
            drive_id : video_in_db.drive_id
        })
        res.end()
    }
    else {
        const video = new videoSchema({
            drive_id : fileId,
            processing: true,
            error: false
        })
        await video.save()
        videoQueue.add(fileId, { drive_id: fileId })
        res.json({
            status: 'ok',
            message: 'video created',
            drive_id : fileId
        })
        res.end()
    }
}