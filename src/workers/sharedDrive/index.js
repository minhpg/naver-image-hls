const sharedDriveSchema = require('../../models/sharedDrive')
const sharedDriveQueue = require('../../queues/sharedDrive.queue')

module.exports = async (file_count) => {
    try {
        console.log(file_count)
        var shared_drive = await sharedDriveSchema.findOne({ default: true }).exec()
        await sharedDriveQueue()
        return shared_drive
    }
    catch(err) {
        console.log(err)
        throw err
    }

}

