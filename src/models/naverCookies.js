const mongoose = require('mongoose');

const CookieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cookie: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password :{
        type: String,
        required: true
    },
    disabled: {
        type: Boolean,
        required: true
    }
});
module.exports = mongoose.model('naver-cookies', CookieSchema)