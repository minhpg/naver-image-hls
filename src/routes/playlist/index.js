const express = require('express')
const router = express.Router()

router.use((req, res, next) => {
    res.setHeader('access-control-allow-origin',process.env.CORS_DOMAIN || '*')
    res.setHeader('content-type','text/plain')
    // res.setHeader('content-type','application/vnd.apple.mpegurl')
    next()
  })

router.get('/:id/playlist.m3u8',require('./quality')) 
router.get('/:id/master.m3u8',require('./master'))

module.exports = router
