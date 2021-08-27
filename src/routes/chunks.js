const base64 = require('base-64')
const levelClient = require('../level')
const imageProxy = require('../google-drive-api/imageProxyV3')

const decodeUrl = (str) => {
    var newString = ""
    for (var i = str.length - 1; i >= 0; i--) {
        newString += str[i]
    }
    return base64.decode(newString)
}

module.exports = async (req, res) => {
    res.setHeader('access-control-allow-origin', process.env.CORS_DOMAIN || '*')
    res.setHeader('content-type', 'text/plain')
    try {
        try {
            data = await levelClient.get(req.params.url)
            proxy_url = data
            res.setHeader('X-LEVEL-HIT', 'true')
            res.setHeader('max-age', '2629743')
        }
        catch (err) {
            if (err.message.includes('Key not found in database ')) {
                res.setHeader('X-LEVEL-HIT', 'false')
                const url = decodeUrl(req.params.url)
                proxy_url = await imageProxy(url)
                await levelClient.put(req.params.url, proxy_url)
            }
            else {
                throw err
            }
        }
        res.redirect(proxy_url)
        return
    }
    catch (err) {
        res.status(404)
        res.send(err.message)
        // await messageQueue()
        res.end()
        return
    }
}
