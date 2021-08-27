const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title : String,
    drive_id : {
        type: String,
        required: true
    },
    processing: {
        type: Boolean,
        required: true
    },
    error: {
        type: Boolean,
        required: true
    },
    error_message : {
        type: String
    },
    files : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'file'
        }
    ]
});

module.exports = mongoose.model('video', videoSchema)