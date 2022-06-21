const base64 = require('base-64')
const redisClient = require('../redis')
const imageProxy = require('../discord-api/proxy')

const decodeUrl = (str) => {
    var newString = ""
    for (var i = str.length - 1; i >= 0; i--) {
        newString += str[i]
    }
    return base64.decode(newString)
}

module.exports = async (req, res) => {
    res.setHeader('access-control-allow-origin', process.env.CORS_DOMAIN || '*')
    // redisClient.get(req.params.url, async (err, data) => {
    //     try {
    //         if (err) {
    //             res.json({
    //                 status: 'fail',
    //                 message: err.message,
    //             })
    //             return
    //         }
    //         if (!data) {
    //             const url = decodeUrl(req.params.url)
    //             proxy_url = await imageProxy('http://post-phinf.pstatic.net' + url, 'OTE5ODMxODQxMTIzNTAwMDUy.YbbiXw.TUjkhscQIF0s6bIulzcvKYs6QY4', '919832247039848471')



    //             redisClient.setex(req.params.url, 60 * 30, proxy_url, (err) => {
    //                 if (err) throw err
    //                 return
    //             })
    //         }
    //         else {
    //             proxy_url = data
    //         }
    //         res.redirect(proxy_url)
    //         return
    //     }
    //     catch (err) {
    //         console.log(err)
    //         res.status(404)
    //         res.end()
    //         return
    //     }
    // })

    const url = decodeUrl(req.params.url)
    res.redirect(url)
}